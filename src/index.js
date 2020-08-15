const path = require("path");

const express = require("express");
const app = new express();

const port = process.env.PORT || 3000;

const publicDirectoyPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoyPath));

app.listen(port, () => console.log(`App running on PORT ${port}`));
