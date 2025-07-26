"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const chat_1 = __importDefault(require("./routes/chat"));
const interviewPrep_1 = __importDefault(require("./routes/interviewPrep"));
const emergencyCrisis_1 = __importDefault(require("./routes/emergencyCrisis"));
const notification_1 = __importDefault(require("./routes/notification"));
const nightAgent_1 = __importDefault(require("./routes/nightAgent"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/chat', chat_1.default);
app.use('/api/interview-prep', interviewPrep_1.default);
app.use('/api/emergency', emergencyCrisis_1.default);
app.use('/api/notifications', notification_1.default);
app.use('/api/night-agent', nightAgent_1.default);
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
