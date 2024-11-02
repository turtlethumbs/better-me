import asyncio
import httpx
import json
import os
import sched
import time
import threading
from urllib.parse import urljoin
from dotenv import load_dotenv

load_dotenv()

def job(loop, tasks):
    context = "You will play the role as an accountability coach"
    for task in tasks:
        if not task['completed'] and not task['notified']:
            task_title = task['title']
            task['notified'] = True
            asyncio.run_coroutine_threadsafe(
                send_input_to_ollama(f"{context} and I did not complete task: {task_title}"),
                loop
            )
            break

def run_periodically(interval, scheduler, loop):
    scheduler.enter(interval, 1, run_periodically, (interval, scheduler, loop))
    with open("../api/data/tasks.json", 'r') as json_file:
        tasks = json.load(json_file)
    job(loop, tasks)

def start_heartbeat_service():
    interval = 10
    scheduler = sched.scheduler(time.time, time.sleep)
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    scheduler.enter(interval, 1, run_periodically, (interval, scheduler, loop))
    threading.Thread(target=loop.run_forever, daemon=True).start()
    threading.Thread(target=scheduler.run, daemon=True).start()

async def send_input_to_ollama(prompt: str) -> str:
    url = urljoin(os.getenv("OLLAMA_API_URL"), "generate")
    payload = {
        "prompt": prompt,
        "model": "llama3.2"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        if response.status_code == 200:
            output = ""
            lines = response.text.split("\n")
            for line in lines:
                json_obj = json.loads(line or '{}')
                output += json_obj.get('response', "")
            print(output)
            return output
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return ""

if __name__ == "__main__":
    print("Starting heartbeat service...")
    start_heartbeat_service()
    while True:
        time.sleep(1)
