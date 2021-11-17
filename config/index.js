const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT,
  dbURL: process.env.DB_URL,
};
