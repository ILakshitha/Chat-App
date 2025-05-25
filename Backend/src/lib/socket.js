import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]

    }
});

export function getReceverSocketId(userId){

    return userSocketMap[userId]; // Return the socket ID for the given userId
}
//use to store online users
const userSocketMap ={}; //userod: socketId


io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId; // Assuming userId is sent as a query parameter
  
    if (userId) {
        userSocketMap[userId] = socket.id; // Store the socket ID for the user
        console.log(`User ${userId} connected with socket ID ${socket.id}`);
    }
    io.emit("onlineUsers", Object.keys(userSocketMap)); // Emit online users to all clients
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        // Remove the user from the map when they disconnect
        delete userSocketMap[userId];

        io.emit("onlineUsers", Object.keys(userSocketMap)); // Emit updated online users to all clients
    });
});

export {io, server, app};