const express = require("express");
const { createServer } = require("node:http");
const path = require("path");
const { Server } = require("socket.io");
const { ExpressPeerServer } = require("peer");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);

// ✅ CORS Setup
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));

// ✅ Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// ✅ PeerJS Setup
const peerServer = ExpressPeerServer(server, { debug: true });
app.use("/peerjs", peerServer);

// ✅ Static Files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Fix sendFile Path Issue
app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Handle WebSockets
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("user-msg", (msg) => {
        console.log("New message:", msg);
        io.emit("msg", msg);
    });

    socket.on("join-call", (userId) => {
        console.log("User joined call:", userId);
        socket.broadcast.emit("user-connected", userId);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// ✅ Start Server
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
