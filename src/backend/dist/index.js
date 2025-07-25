"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const chat_1 = __importDefault(require("./routes/chat"));
const agent_1 = __importDefault(require("./routes/agent"));
const notification_1 = __importDefault(require("./routes/notification"));
const nightAgent_1 = __importDefault(require("./routes/nightAgent"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/chat', chat_1.default);
app.use('/api/agent', agent_1.default);
app.use('/api/notification', notification_1.default);
app.use('/api/night-agent', nightAgent_1.default);
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
