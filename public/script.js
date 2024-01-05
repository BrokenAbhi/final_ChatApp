// app.js
document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const userList = document.getElementById("user-list");
  const chatMessages = document.getElementById("chat-messages");
  const messageInput = document.getElementById("message-input");

  // Prompt for username on page load
  const currentUser = prompt("Enter your username:");
  socket.emit("login", currentUser);

  // Listen for user list updates
  socket.on("updateUsers", (users) => {
    userList.innerHTML = "<strong> </strong>" + users.join("<br>");
  });

  // Listen for incoming messages
  socket.on("chatMessage", (data) => {
    const message = document.createElement("div");
    message.className = "message";

    // Check if the message is from the current user
    if (data.username === currentUser) {
      message.classList.add("self-message");
    }

    message.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    chatMessages.appendChild(message);
  });

  // Function to send messages
  window.sendMessage = () => {
    const message = messageInput.value.trim();
    if (message !== "") {
      socket.emit("chatMessage", message);
      messageInput.value = "";
    }
  };

  // Send message on Enter key press
  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});
