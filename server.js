const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
app.use(express.static("Public"));

io.on("connection", (socket) => {
  console.log("new Web server connection");
  socket.emit("message", "Welcome to chatTY");
});

server.listen(process.env.PORT || 3000, function() {
  console.log("http://localhost:3000");
});
