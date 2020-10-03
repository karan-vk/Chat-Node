const express = require("express");
const app = express();
const formatMessage = require("./utils/messages");
const http = require("http");
const {
  getCurrentUser,
  userJoin,
  getRoomUsers,
  userLeave,
} = require("./utils/users");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
app.use(express.static("Public"));
const botName = "Admin";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", formatMessage(botName, "Welcome to chatTY"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, ` ${user.username} has joined the chat`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  //   console.log("new Web server connection");

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(process.env.PORT || 3000, function() {
  console.log("http://localhost:3000");
});
