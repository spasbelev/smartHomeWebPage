const express = require('express');
const path = require('path');
const app = express();

// const getCachedSensorReadings = require('./cache_sensor_data');
// const databaseOperations = require('./database-operations');
const https = require('https');
var socketIo = require('socket.io');
// const {subscribe, unsubscribe} = require('./notifier');
// const loginValidate = require("./login/loginValidate");

if (process.env.NODE_ENV !== 'production') {
    var selfSigned = require('openssl-self-signed-certificate');
 
    var options = {
        key: selfSigned.key,
        cert: selfSigned.cert
    };
 
    var httpsServer = https.createServer(options, app).listen(3000);
    console.log(`HTTPS started on port ${3000} (dev only).`);
}
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(bodyParser.json());

function requireHTTPS(req, res, next) {
	// The 'x-forwarded-proto' check is for Heroku
	if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
	  return res.redirect('https://' + req.get('host') + req.url);
	}
	next();
  }

app.use('/loginScreen', express.static(path.join(__dirname, 'loginScreen')))

app.use("/public/mainScreen", express.static(path.join(__dirname, '/mainScreen')));

app.get("/mainScreen/", function(req, res) {
	res.sendFile( __dirname + "/" + "mainScreen/" + "mainPage.html" );
})

// var socket = io.connect('http://localhost');


socketIo.on('connection', function (socket) {
    console.log("Client connected")
})

socketIo.on('disconnect', function(socket) {
    console.log("Disconnect");
})

socketIo.on("LoginSuccess", function(socket){
    window.href.location = '/mainScreen/mainPage.html';
})

socketIo.on('LoginFail', () => {
    alert("Username or password is incorrect!");
})