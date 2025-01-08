const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3002", // The frontend URL
    methods: ["GET", "POST"],
  },
});

const PORT = 3001;

// Middleware to handle CORS
app.use(cors({
  origin: "http://localhost:3002",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

// Listen for incoming WebSocket connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Emit connection status updates
  socket.emit("connection_status", { status: "connected" });

  // Emit new tracking events at intervals (Simulating real-time data)
  const interval = setInterval(() => {
    const newEvent = generateTrackingEvent();
    socket.emit("new_event", newEvent);
  }, 5000); // Emits event every 5 seconds

  // Clean up when a client disconnects
  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });
});

// Generate a random tracking event for testing
function generateTrackingEvent() {
  return {
    id: `${Date.now()}`,
    device_id: "Device_" + Math.floor(Math.random() * 10),
    latitude: 51.5110872,
    longitude: -0.147058,
    timestamp: Date.now(),
    accuracy: Math.random() * 50 + 10,
    battery: Math.floor(Math.random() * 100),
    location_details: {
      address: "123 Fake St.",
      area: "Some Area",
    },
    connection_type: "wifi",
    signal_strength: 100,
    movement_speed: 50,
  };
}

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
