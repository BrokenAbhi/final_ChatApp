// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const users = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  // Handle user login
  socket.on("login", (username) => {
    users[socket.id] = username;
    io.emit("updateUsers", Object.values(users));
  });

  // Handle incoming messages
  socket.on("chatMessage", (message) => {
    io.emit("chatMessage", { username: users[socket.id], message });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("updateUsers", Object.values(users));
  });
});

const PORT = process.env.PORT || 3100;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
