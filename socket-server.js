// socket-server.js
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Your Next.js frontend
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("send-message", ({ to, from, message }) => {
    io.to(to).emit("receive-message", { from, message });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("🚀 Socket server running on http://localhost:3001");
});