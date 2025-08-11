const express = require("express");
const app = express();

app.use("/hello/hi", (req, res) => {
  res.send("Hello hi from server");
});

app.use("/hello", (req, res) => {
  res.send("Hello from server");
});

app.use("/test", (req, res) => {
  res.send("test from server");
});

app.use("/", (req, res) => {
  res.send("Origin from server");
});

app.listen(3000, () => {
  console.log("Server is Listening in port 3000....");
});
