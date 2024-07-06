// socketController.js

import { Server } from "socket.io";
import JWT from "jsonwebtoken";
import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";

const users = {};
let adminArray; // Declare the variable here

let ADMIN_ID;
function formatDateOnly(timestamp) {
  const date = new Date(timestamp);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2); // Get the last 2 digits of the year

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

export const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      // console.log("token-io.use:", token);

      const decoded = JWT.verify(token, process.env.JWT_SECRET);
      console.log("decoded-io.use:", decoded);

      const userId = decoded._id;
      // console.log("userId-io.use:", userId);

      if (userId) {
        socket.userId = userId;
        next();
      } else {
        socket.disconnect(true);
      }
    } catch (error) {
      socket.disconnect(true);
    }
  });

  io.on("connection", async (socket) => {
    console.log("connection to sockt :", socket.id);
    try {
      const adminArray = await getAdmin();
      ADMIN_ID = adminArray[0]._id; // Assuming there's only one admin
      // Rest of your socket code...

      const userId = socket.userId;
      socket.join(userId);
      //////////////////////////Admin socket.io functonality///////////////////////////////

      socket.on("adminJoin", ({ adminName, adminId }) => {
        console.log(`${adminName} has joined the chat  `);
        ADMIN_ID = adminId;
        users[socket.id] = adminName;

        // The admin joined the chat
        socket.join("admin");
      });

      socket.on(
        "OnSendingAdminMessage",
        async ({ userId, message, adminId }) => {
          // The admin sent a message to a user
          io.to(userId).emit("recieveSendedAdminmessage", {
            message,
            isAdmin: true,
          });

          try {
            const chatMessage = new chatModel({
              user: userId,
              message,
              isAdmin: true,
              adminId: adminId, // Associate the admin who sent the message
            });
            await chatMessage.save();
            io.emit("getUsers");
          } catch (error) {
            console.error("Error saving chat message:", error);
          }
        }
      );
    } catch (error) {
      console.error("An error occurred:", error.message);
    }

    //////////////////////////User socket.io functonality///////////////////////////////
    socket.on("getUsers", async () => {
      try {
        const uniqueUserIds = await chatModel.distinct("user");
        console.log("uniqueUserIds in getUsers:", uniqueUserIds);

        const chatMessagesWithUniqueUsers = await Promise.all(
          uniqueUserIds.map(async (userId) => {
            const user = await userModel.findById(userId, "name"); // Assuming you have a userModel for users
            const lastMessage = await chatModel
              .findOne({ user: userId })
              .sort({ timestamp: -1 });
            const allMessages = await chatModel
              .find({ user: userId })
              .sort({ timestamp: 1 });
            let lastMessageTime = formatDateOnly(lastMessage.timestamp);
            return {
              userId,
              name: user ? user.name : "Unknown",
              lastMessage: lastMessage
                ? lastMessage.message
                : "No messages yet",
              lastMessageTime: lastMessage ? lastMessageTime : null,
              allMessages: allMessages ? allMessages : [],
            };
          })
        );
        console.log(
          "chatMessagesWithUniqueUsers in getUsers:",
          chatMessagesWithUniqueUsers
        );

        const usersList = chatMessagesWithUniqueUsers;
        console.log("usersList-socket.on getUsers:", usersList);
        socket.emit("usersList", usersList);
      } catch (error) {
        console.error("Error getting users list:", error);
      }
    });

    socket.on("joined", ({ userName }) => {
      users[socket.id] = userName;
      console.log(`${userName} has joined `);

      socket.emit("welcome", {
        user: "Admin",
        message: `Welcome to the chat, ${users[socket.id]}`,
        isAdmin: true,
        adminId: ADMIN_ID,
      });
      // or
      io.to("admin").emit("userJoined", { user: userName });
    });

    socket.on(
      "OnSendingUserMessage",
      async ({ message, socketId, userId, isAdmin }) => {
        const userName = users[socketId];
        io.to(userId).emit("recieveSendedUserMessage", {
          user: userName,
          message,
          socketId,
          userId,
          isAdmin,
          adminId: ADMIN_ID,
        });
        io.to("admin").emit("updateUserList");

        io.to("admin").emit("recieveSendedUserMessage", {
          userId,
          message,
          isAdmin,
        });
        try {
          console.log("ADMIN_ID before save chat:", ADMIN_ID);
          const chatMessage = new chatModel({
            user: userId, // You can store the user's name or ID
            message,
            isAdmin: isAdmin,
            adminId: ADMIN_ID,
          });
          await chatMessage.save();
        } catch (error) {
          console.error("Error saving chat message:", error);
        }
      }
    );

    socket.on("userDisconnect", () => {
      let userName = users[socket.id];
      console.log(`${userName} left`);
      io.to("admin").emit("userLeft", { user: userName });

      delete users[socket.id];
    });

    socket.on("disconnect", () => {
      console.log("connected users array :", users);
      let userName = users[socket.id];
      console.log(`${userName} left`);
      delete users[socket.id];
    });
  });
};

///////////// socket.io  CONTROLLERS //////////////////

export const getChatController = async (req, res) => {
  const userId = req.params.userId;
  console.log("userId-getChatController:", userId);
  try {
    const messages = await chatModel
      .find({ user: userId })
      .sort({ timestamp: 1 });
    console.log("messages-getChatController:", messages);

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error while getting chat" });
  }
};

export const getAdmin = async () => {
  try {
    const admin = await userModel.find({ role: 1 });
    return admin; // Returning the JSON string
  } catch (error) {
    throw new Error("An error occurred while geting admin credential");
  }
};
