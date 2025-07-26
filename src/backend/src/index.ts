import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatRoutes from './routes/chat';
import interviewPrepRoutes from './routes/interviewPrep';
import emergencyCrisisRoutes from './routes/emergencyCrisis';
import notificationRoutes from './routes/notification';
import nightAgentRoutes from './routes/nightAgent';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/interview-prep', interviewPrepRoutes);
app.use('/api/emergency', emergencyCrisisRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/night-agent', nightAgentRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 