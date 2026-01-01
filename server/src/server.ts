import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recommendRouter from './routes/recommend.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/recommend', recommendRouter);

app.listen(3001, () => {
  console.log('🎮 Game Music Backend running on http://localhost:3001');
});
