const env = require("dotenv");
env.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// eslint-disable-next-line
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@m-podolski.zqz7g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    return app.listen(3001, () => {
      console.log("Server is listening");
    });
  })
  .catch((err) => {
    return console.log(err);
  });

const logRoutes = require("./routes/logRoutes");

app.use(express.json());
app.use("/logs", logRoutes);
