import express, { Request, Response, NextFunction } from 'express';

import databaseRouter from './routes/databaseRouter.js';
import leaderBoardRouter from './routes/leaderboardRouter.js';

import userRouter from './routes/userRouter.js';

import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// API Router Handler
app.use('/api/database', databaseRouter);

// Problems Router Handler
app.use('/api/leaderBoard', leaderBoardRouter);

// API Router Handler
app.use('/api/user', userRouter);

// Standard 404 Route Handler
app.use('/', (_req, res) => {
  res.status(404).send('Error page not found!');
});

// Express Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log(err);
  res.status(500).json(err);
});

// Starts the app on the given port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
