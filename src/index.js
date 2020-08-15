const express = require("express");
const app = new express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.listen(port, () => console.log(`App running on PORT ${port}`));
