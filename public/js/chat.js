const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $shareLocationButton = document.querySelector("#send-location");

socket.on("message", (result) => console.log(result));

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  // socket.emit("sendMessage", document.querySelector("#txtMessage").value);
  socket.emit("sendMessage", $messageFormInput.value, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) return console.log(error);
    console.log("Message Delivered !!!");
  });
});

$shareLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation)
    return alert("Geolocation is not supported in your browser");

  $shareLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    socket.emit("sendLocation", { latitude, longitude }, () => {
      $shareLocationButton.removeAttribute("disabled");
      console.log("Location Shared");
    });
  });
});
