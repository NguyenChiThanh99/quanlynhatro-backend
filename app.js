require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/routes");

var app = express();

var db = mongoose.connection;

// mongoose.connect("mongodb+srv://NhaTro:123@quanlynhatro.7xdqc.mongodb.net/NhaTro?retryWrites=true&w=majority").then(() => console.log('DB Connected!'));
mongoose
  .connect(
    "mongodb+srv://quanlynhatro:123@cluster0.0wdtd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Connected!"));

db.on("error", (err) => {
  console.log("DB connection error:", err.message);
});

app.use(bodyParser());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());
app.use(routes);

module.exports = app;
