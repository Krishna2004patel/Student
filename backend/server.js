import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import studentRoutes from './routes/students.js';
import Student from './models/Student.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');

  app.use(express.static(frontendPath));

  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });

} else {
  app.get('/', (req, res) => {
    res.send('Student Management Portal API is running...');
  });
}

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/student-portal')
  .then(async () => {

    console.log('Connected to MongoDB');

    try {
      // Seed Demo Admin
      const adminExists = await Student.findOne({ email: 'admin@example.com' });

      if (!adminExists) {
        await Student.create({
          name: 'Demo Admin',
          email: 'admin@example.com',
          password: 'password123',
          role: 'admin'
        });

        console.log('Demo Admin seeded successfully');
      }

    } catch (err) {
      console.error('Failed to seed demo admin:', err);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });