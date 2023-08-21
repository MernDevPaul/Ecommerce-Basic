const express = require("express");
const bodyParser = require("body-parser");
const dbConnect = require("./src/utils/db");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 9000;
const cookieParser = require("cookie-parser");
const morgon = require("morgan");
const cors = require("cors");
const path = require("path");
const { notFound, errorHandler } = require("./src/utils/error_handle");
// adding 
app.use("/public/uploads/", express.static(path.join(__dirname, "public/uploads")));
//DataBase Connection
dbConnect();
app.use(morgon("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//routes
app.use(require("./src/routes"));
//image request
const arr = [];
app.post("/", (req, res) => {
  arr.push(req.body);
  res.send(arr);
});
//Error Handler
app.use(notFound);
app.use(errorHandler);
//Create Server
app.listen(PORT, () => {
  console.log(`Server is running at post ${PORT}`);
});