import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// GET route
app.get('/api/items', (req: Request, res: Response) => {
  const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
  res.json(items);
});

// POST route
app.post('/api/items', (req: Request, res: Response) => {
  const newItem = req.body; // Assuming { name: 'New Item' }
  // Here you would normally save the item to a database
  res.status(201).json(newItem);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
