const socket = io();

socket.on("message", (result) => console.log(result));

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // socket.emit("sendMessage", document.querySelector("#txtMessage").value);
  socket.emit("sendMessage", e.target.elements.message.value);
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation)
    return alert("Geolocation is not supported in your browser");

  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    socket.emit("sendLocation", { latitude, longitude });
  });
});
