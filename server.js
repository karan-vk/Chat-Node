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
  socket.on("joinRoom", ({ username, room }) => {
    socket.emit("message", formatMessage(botName, "Welcome to chatTY"));

    socket.broadcast.emit(
      "message",
      formatMessage(botName, "A user has joined the chat")
    );
  });
  //   console.log("new Web server connection");

  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("user", msg));
  });
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });
});

server.listen(process.env.PORT || 3000, function() {
  console.log("http://localhost:3000");
});
