import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import healthRoutes from './routes/healthRoutes.js';
import linksRoutes from './routes/linkRoutes.js';   
import redirectRoutes from './routes/redirectRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use('/', linksRoutes);
app.use('/', healthRoutes);
app.use("/",redirectRoutes)

app.get('/', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});
