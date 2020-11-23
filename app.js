const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes') 

var app = express();

var db = mongoose.connection;

mongoose.connect("mongodb+srv://NhaTro:123@quanlynhatro.7xdqc.mongodb.net/NhaTro?retryWrites=true&w=majority").then(() => console.log('DB Connected!'));

db.on('error', (err) => {
    console.log('DB connection error:', err.message);
})


app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(routes);

module.exports = app;