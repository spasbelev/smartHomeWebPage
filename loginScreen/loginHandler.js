
var socketio = require("socket.io");

function sendLoginData() {
    var username = document.getElementById("userName").value;
    var password = document.getElementById("userPass").value;

    socketio.emit("LoginCredentials", {username, password});
}