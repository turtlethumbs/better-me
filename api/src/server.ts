import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());

interface Task {
    id: number;
    title: string;
    completed: boolean;
};

const tasksFilePath = path.join(process.cwd(), '/data/tasks.json');

const loadTasks = (): Task[] => {
    try {
        const data = fs.readFileSync(tasksFilePath, 'utf-8');
        return JSON.parse(data) as Task[];
    } catch (error) {
        console.error('Error reading tasks from file:', error);
        return [];
    }
};

const saveTasks = (tasks: Task[]) => {
    try {
        fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    } catch (error) {
        console.error('Error saving tasks to file:', error);
    }
};

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({'message': 'API /'});
});

app.get('/tasks', (req: Request, res: Response) => {
    res.json({"tasks" : loadTasks()});
});

app.post('/tasks', (req: Request, res: Response) => {
    const newTask: Task = req.body;
    const tasks = loadTasks();
    newTask.id = Date.now();
    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json({ task: newTask });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
