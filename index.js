const express = require("express");
const {createServer} = require("node:http");
const path = require("path");
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

//--Handel All Socket---//

io.on("connection", (socket) => {
    socket.on("user-msg", (msg) =>{
        // console.log("A new user message", msg);
        io.emit("msg", msg);
    })
})

app.use(express.static(path.resolve("./public")))

app.get("/", (req, res) => {
    return res.sendFile("/public/index.html");
})

server.listen(PORT, () => {
    console.log(`server running at 3000`)
})


