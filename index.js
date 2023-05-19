const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require('path');

app.use(cors());

app.use(express.static(path.join(__dirname + "/public")))
app.get('*', (req, res) => {
    res.sendFile(
        path.join(__dirname, "/public/index.html")
      );
})

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://mynodejschatapp.vercel.app",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with id: ${socket.id} joined room: ${data}`);
    })

    socket.on("send_message", (data) => {
        console.log("data", data);
        socket.to(data.room).emit("receive_message", data)
    })
    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);
    })
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

