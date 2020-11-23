var http = require('http');

var app = require('./app');

const port = process.env.PORT || 3000; //tao port ket noi server

var server = http.createServer(app); //tao server chay app.js

server.listen(port);