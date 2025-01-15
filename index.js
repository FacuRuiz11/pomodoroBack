const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

// **Modificación en la configuración de CORS**
// Aquí cambiamos la URL para aceptar solicitudes desde cualquier dominio
// O, si sabes la URL de tu frontend desplegado, puedes ponerla específica como:
// origin: "https://mi-front-end-en-vercel.vercel.app"
const corsOptions = {
  origin: "*", // Cambia esto por la URL de tu frontend si es necesario
  methods: ["GET", "POST"],
};

const io = new Server(server, {
  cors: corsOptions,
});

app.use(cors());

// Ruta de ejemplo para confirmar que el backend está corriendo
app.get("/", (req, res) => {
  res.send("Pomodoro Backend is running");
});

// Manejador de conexiones de WebSocket
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Evento para sincronizar temporizador
  socket.on("sync-timer", (data) => {
    console.log("Syncing timer data:", data);
    socket.broadcast.emit("update-timer", data);
  });

  // Evento para manejar desconexión
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Inicia el servidor
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});