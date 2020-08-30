const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = new express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoyPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoyPath));

io.on("connection", (socket) => {
  console.log("New WebSocket Connection");

  socket.on("join", (options, callback) => {
    const { user, error } = addUser({ id: socket.id, ...options });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit(
      "message",
      generateMessage("Admin", `Welcome ${user.username}!!!`)
    );
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage("Admin", `${user.username} has joined`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (data, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(data)) return callback("Profanity is not allowed");
    if (user) {
      io.to(user.room).emit("message", generateMessage(user.username, data));
      callback("Delivered !!!");
    }
  });

  socket.on("sendLocation", (position, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "locationMessage",
        generateLocationMessage(
          user.username,
          `https://www.google.com/maps?q=${position.latitude},${position.longitude}`
        )
      );
      callback();
    }
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left`)
      );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => console.log(`App running on PORT ${port}`));
