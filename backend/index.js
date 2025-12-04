import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import authRoutes from './authRoutes.js'; 
import predictRoutes from './routes/predict.js';
import reportRoutes from './routes/reports.js';
import uploadRoutes from './routes/upload.js';
import profileRoutes from './routes/profile.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


app.get('/', (req, res) => {
  res.send('ArogyaAI Backend API is running...');
});


app.use('/api/auth', authRoutes); 
app.use('/api/predict', predictRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', uploadRoutes); 


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
