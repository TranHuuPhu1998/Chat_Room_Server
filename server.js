import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import accessCodeRoutes from "./routes/accessCodeRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import SocketService from "./services/socketService.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = 8080;

app.use(express.json());
app.use("/api", accessCodeRoutes);
app.use("/api", studentRoutes);
app.use("/api", lessonRoutes);

// Initialize Socket.io controller
const socketService = new SocketService(io);

// Socket.io connection handling
io.on('connection', (socket) => {
    socketService.handleConnection(socket);
});


server.listen(port, () => console.log(`Server has started on port: ${port}`))