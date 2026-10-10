import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : ["http://localhost:5173"],
    credentials: true,
  },
  maxHttpBufferSize: 1e8, // 100MB for large payloads
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ─── WebRTC Signaling Events ─────────────────────────────────

  // Caller initiates a call
  socket.on("call:initiate", ({ to, from, callerName, callerPic, callType }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:incoming", {
        from,
        callerName,
        callerPic,
        callType, // "audio" or "video"
      });
    } else {
      // User is offline
      socket.emit("call:unavailable", { to });
    }
  });

  // Callee accepts the call
  socket.on("call:accept", ({ to, from }) => {
    const callerSocketId = userSocketMap[to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("call:accepted", { from });
    }
  });

  // Callee rejects the call
  socket.on("call:reject", ({ to, from }) => {
    const callerSocketId = userSocketMap[to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("call:rejected", { from });
    }
  });

  // Exchange SDP offer
  socket.on("call:offer", ({ to, offer }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:offer", { from: userId, offer });
    }
  });

  // Exchange SDP answer
  socket.on("call:answer", ({ to, answer }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:answer", { from: userId, answer });
    }
  });

  // Exchange ICE candidates
  socket.on("call:ice-candidate", ({ to, candidate }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:ice-candidate", { from: userId, candidate });
    }
  });

  // End call
  socket.on("call:end", ({ to }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:ended", { from: userId });
    }
  });

  // ─── Disconnect ──────────────────────────────────────────────

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
