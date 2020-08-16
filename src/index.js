const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = new express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoyPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoyPath));

io.on("connection", (socket) => {
  console.log("New WebSocket Connection");

  socket.broadcast.emit("message", "New User has joined");
  socket.on("sendMessage", (data) => io.emit("message", data));

  socket.on("sendLocation", (position) =>
    io.emit(
      "message",
      `https://www.google.com/maps?q=${position.latitude},${position.longitude}`
    )
  );

  socket.on("disconnect", () => io.emit("message", "A User has left"));
});

server.listen(port, () => console.log(`App running on PORT ${port}`));
