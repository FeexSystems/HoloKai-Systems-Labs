import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health.js';
import { oracleRouter } from './routes/oracle.js';

dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/oracle', oracleRouter);

function startServer(port: number) {
  const server = app.listen(port, () => {
    console.log(`🚀 HoloKai Planetary BFF API Gateway running on port ${port}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is occupied. Attempting fallback port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('BFF Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
