const express = require("express");
const app = express();

const { Auth, user } = require("./middleware/Auth");

app.use("/admin", Auth);

app.get("/admin/getAllData", (req, res, next) => {
  res.send("All the send");
});

app.get("/user", user, (req, res) => {
  res.send("users are Come From MiddleWare");
});
app.listen(3000, () => {
  console.log("Server is Listening in port 3000....");
});
