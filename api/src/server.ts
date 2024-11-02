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

app.put('/tasks/:id', (req: Request, res: Response) => {
    const taskId = Number(req.params.id);
    const updatedTask = req.body;
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }
    tasks[taskIndex].completed = updatedTask.completed;
    saveTasks(tasks);
    res.status(200).json({ task: tasks[taskIndex] });
});

app.delete('/tasks/:id', (req: Request, res: Response) => {
    const taskId = Number(req.params.id);
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }
    tasks.splice(taskIndex, 1);
    saveTasks(tasks);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
