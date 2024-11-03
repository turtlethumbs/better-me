import asyncio
import httpx
import json
import os
from urllib.parse import urljoin
from dotenv import load_dotenv
from typing import List
from redis_client import RedisClient
from pydantic import BaseModel

load_dotenv()

class Task(BaseModel):
    id: int
    title: str
    completed: bool    

redis_client = RedisClient(
    url=os.getenv("REDIS_URL"),
    token=os.getenv("REDIS_TOKEN")
)

async def start_in_ctx():
    context = "You will play the role as an accountability coach, say OK only"
    output = await send_input_to_ollama(f"{context}")
    print(output)

async def analyze_data(data):
    instruction = "Scold me for not completing these tasks:"
    output = await send_input_to_ollama(f"{instruction}\n\n{data}")
    print(output)

def fetch_all_tasks() -> List[Task]:
    task_keys = redis_client.get_all_task_keys()
    if not task_keys:
        return []
    task_data_list = redis_client.get_all_data_for_keys(task_keys)
    tasks: List[Task] = []
    for task_data in task_data_list:
        task_data_json = json.loads(task_data)
        tasks.append(
            Task(
                id        = task_data_json.get('id'),
                title     = task_data_json.get('title') or "",
                completed = task_data_json.get('completed') or False
            )
        )
    return tasks

async def send_input_to_ollama(prompt: str) -> str:
    url = urljoin(os.getenv("OLLAMA_API_URL"), "generate")
    payload = {
        "prompt": prompt,
        "model": "llama3.2"
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload)
        if response.status_code == 200:
            output = ""
            lines = response.text.split("\n")
            for line in lines:
                json_obj = json.loads(line or '{}')
                output += json_obj.get('response', "")
            return output
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return ""

if __name__ == "__main__":
    asyncio.run(start_in_ctx())
    tasks = fetch_all_tasks()
    task_list_for_ai = ""
    incomplete_tasks = ""
    for i in range(0, len(tasks) - 1):
        completion_status = "done" if tasks[i].completed else "not done"
        task_list_for_ai += f"{i+1}) {tasks[i].title} is {completion_status}\n"
        if not tasks[i].completed:
            incomplete_tasks += f"{tasks[i].title} was not completed!\n"
    incomplete_tasks = incomplete_tasks or "All tasks have been completed!"
    asyncio.run(analyze_data(incomplete_tasks))