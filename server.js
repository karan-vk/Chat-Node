const express = require("express");
const app = express();
const formatMessage = require("./utils/messages");
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
app.use(express.static("Public"));
const botName = "Admin";

io.on("connection", (socket) => {
  //   console.log("new Web server connection");
  socket.emit("message", formatMessage(botName, "Welcome to chatTY"));

  socket.broadcast.emit(
    "message",
    formatMessage(botName, "A user has joined the chat")
  );
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});

server.listen(process.env.PORT || 3000, function() {
  console.log("http://localhost:3000");
});
