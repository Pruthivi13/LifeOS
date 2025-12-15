import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uploadsPath = path.join(process.cwd(), 'uploads');
console.log('Serving uploads from:', uploadsPath);

app.use('/uploads', (req, res, next) => {
    console.log(`Request for upload: ${req.url}`);
    next();
}, express.static(uploadsPath));

// Basic Route
app.get('/', (req, res) => {
    res.send('LifeOS API is running...');
});

// APIs
app.use('/api/auth', require('./routes/authRoutes').default);
app.use('/api/tasks', require('./routes/taskRoutes').default);
app.use('/api/habits', require('./routes/habitRoutes').default);
app.use('/api/moods', require('./routes/moodRoutes').default);
app.use('/api/notifications', require('./routes/notificationRoutes').default);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


