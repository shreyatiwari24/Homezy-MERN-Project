const socketIo = require("socket.io");

let io;
// Map to store connected users: userId -> socketId
const userSockets = new Map();

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    // Register user when they log in or connect
    socket.on("register", (userId) => {
      if (userId) {
        userSockets.set(userId.toString(), socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      // Remove from map
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} unregistered`);
          break;
        }
      }
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Utility function to send real-time notification to a specific user
const sendNotificationToUser = (userId, notification) => {
  if (io && userId) {
    const socketId = userSockets.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit("new_notification", notification);
      console.log(`Sent notification to user ${userId} via socket ${socketId}`);
    } else {
      console.log(`User ${userId} is not online to receive notification`);
    }
  }
};

module.exports = {
  initSocket,
  getIo,
  sendNotificationToUser,
};
