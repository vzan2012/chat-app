const socket = io();

socket.on("message", (result) => console.log(result));

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // socket.emit("sendMessage", document.querySelector("#txtMessage").value);
  socket.emit("sendMessage", e.target.elements.message.value);
});
