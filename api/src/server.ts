import { Redis } from '@upstash/redis';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN || "",
});

app.use(cors());
app.use(express.json());

interface Task {
    id: number;
    title: string;
    completed: boolean;
};

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({'message': 'API /'});
});

// Get all tasks
app.get('/tasks', async (req: Request, res: Response) => {
    try {
        const taskKeys = await redis.keys('task:*');
        const tasks = await Promise.all(
            taskKeys.map(async (key) => await redis.get(key))
        );
        res.json({ tasks: tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create a new task
app.post('/tasks', async (req: Request, res: Response) => {
    try {
        const newTask: Task = req.body;
        newTask.id = Date.now();  // Generate a unique ID
        const taskKey = `task:${newTask.id}`;
        await redis.set(taskKey, JSON.stringify(newTask));
        res.status(201).json({ task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a task
app.put('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const taskId = Number(req.params.id);
        const taskKey = `task:${taskId}`;
        const updatedTaskData = req.body;
        const taskData = await redis.get(taskKey);
        if (!taskData) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const task: Task = taskData as Task;
        task.completed = updatedTaskData.completed;
        await redis.set(taskKey, JSON.stringify(task));
        res.status(200).json({ task });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a task
app.delete('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const taskId = Number(req.params.id);
        const taskKey = `task:${taskId}`;
        const taskData = await redis.get(taskKey);
        if (!taskData) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await redis.del(taskKey);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
