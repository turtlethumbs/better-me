import requests
import json
import os
from dotenv import load_dotenv
from urllib.parse import urljoin

load_dotenv()

def send_input_to_ollama(prompt):
    url = urljoin(os.getenv("OLLAMA_API_URL"), "generate")
    payload = {
        "prompt": prompt,
        "model": "llama3.2"
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        output = ""
        lines = response.text.split("\n")
        for line in lines:
            json_obj = json.loads(line or '{}')
            output += json_obj.get('response') or ""
        return output
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return ""

def main():
    with open("../api/data/tasks.json", 'r') as json_file:
        tasks = json.load(json_file)

    for task in tasks:
        if not task['completed']:
            task_title = task['title']
            result = send_input_to_ollama(f"I did not complete task {task_title}")
            print(result)
    
if __name__ == "__main__":
    main()