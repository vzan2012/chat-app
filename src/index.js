const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const app = new express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoyPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoyPath));

io.on("connection", (socket) => {
  console.log("New WebSocket Connection");

  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit("message", generateMessage("Welcome !!!"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined`));

    // socket.emit, io.emit, socket.broadcast.emit,
    // io.to.emit, socket.broadcast.to.emit
  });

  socket.on("sendMessage", (data, callback) => {
    const filter = new Filter();
    if (filter.isProfane(data)) return callback("Profanity is not allowed");
    io.to("public").emit("message", generateMessage(data));
    callback("Delivered !!!");
  });

  socket.on("sendLocation", (position, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://www.google.com/maps?q=${position.latitude},${position.longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () =>
    io.emit("message", generateMessage("A User has left"))
  );
});

server.listen(port, () => console.log(`App running on PORT ${port}`));
