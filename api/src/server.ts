import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

interface Task {
    id: number;
    title: string;
    completed: boolean;
};

const tasksFilePath = path.join(process.cwd(), '/data/tasks.json');

const loadTasks = () => {
    try {
        const data = fs.readFileSync(tasksFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading tasks from file:', error);
        return [];
    }
};

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('API /');
});

app.get('/tasks', (req: Request, res: Response) => {
    const tasks = loadTasks();
    res.json(tasks);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
