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

const loadTasks = (): Task[] => {
    const tasksFilePath = path.join(process.cwd(), '/data/tasks.json');
    try {
        const data = fs.readFileSync(tasksFilePath, 'utf-8');
        return JSON.parse(data) as Task[];
    } catch (error) {
        console.error('Error reading tasks from file:', error);
        return [];
    }
};

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({'message': 'API /'});
});

app.get('/tasks', (req: Request, res: Response) => {
    res.json(loadTasks());
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
