import json

def main():
    with open("../api/data/tasks.json", 'r') as json_file:
        tasks = json.load(json_file)
    
    

if __name__ == "__main__":
    main()