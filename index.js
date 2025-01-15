const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // URL del frontend
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.get("/", (req, res) => {
  res.send("Pomodoro Backend is running");
});

// Manejador de conexiones
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Maneja eventos de sincronización del temporizador
  socket.on("sync-timer", (data) => {
    console.log("Syncing timer data:", data);
    socket.broadcast.emit("update-timer", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


server.listen(PORT, () => {
  console.log(`Backend server running on ${PORT}`);
});