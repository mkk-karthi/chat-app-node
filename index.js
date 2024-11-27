const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
var app = express();
let server = http.createServer(app);
var io = socketIO(server);

require("dotenv").config();

const BROWSER_CLIENTS = {};

io.on("connection", (socket) => {
    console.log("new user connected");
    BROWSER_CLIENTS[socket.id] = socket;

    socket.emit("newMessage", {
        to: "bot",
        text: "Hello! Welcome.",
        createdAt: Date.now()
    })

    socket.on("send", (msg) => {
        console.log("new message:", msg)
        for (let i in BROWSER_CLIENTS) {
            if (socket.id != i)
                BROWSER_CLIENTS[i].emit("newMessage", msg)
        }
    })

    socket.on("disconnect", () => {
        console.log("user disconnected");
        delete BROWSER_CLIENTS[socket.id];
    })
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

const port = process.env.PORT || 3000;
server.listen(port, console.log("App listened at", port))
