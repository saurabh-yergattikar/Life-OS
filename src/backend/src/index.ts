import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import chatRoutes from './routes/chat';
import agentRoutes from './routes/agent';
import notificationRoutes from './routes/notification';
import nightAgentRoutes from './routes/nightAgent';
import interviewPrepRoutes from './routes/interviewPrep';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/night-agent', nightAgentRoutes);
app.use('/api/interview-prep', interviewPrepRoutes);

io.on('connection', (socket: any) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
}); 