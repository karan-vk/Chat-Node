const express = require("express");
const app = express();
const http = require("http");
const { disconnect } = require("process");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
app.use(express.static("Public"));

io.on("connection", (socket) => {
  //   console.log("new Web server connection");
  socket.emit("message", "Welcome to chatTY");

  socket.broadcast.emit("message", "A user has joined the chat");
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});

server.listen(process.env.PORT || 3000, function() {
  console.log("http://localhost:3000");
});
