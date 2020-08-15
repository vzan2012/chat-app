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

io.on("connection", () => console.log("New WebSocket Connection"));

server.listen(port, () => console.log(`App running on PORT ${port}`));
