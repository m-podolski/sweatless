const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { dbURL, port } = require("./config");

mongoose
  .connect(dbURL)
  .then(() => {
    return console.log("DB connected");
  })
  .catch((err) => {
    return console.log(err);
  });

app.use(cors());
app.use(express.json());

const logRoutes = require("./routes/logRoutes");
app.use("/logs", logRoutes);

app.use("/static", express.static(path.join(__dirname, "client/build/static")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
