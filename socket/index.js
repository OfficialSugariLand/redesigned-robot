const io = require("socket.io")(4000, {
    cors: {
        origin: "http://localhost:3000",
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    //When connected
    console.log("a user connected", users)

    //Take userId and socket from user
    socket.on("newUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", {
            userId
        });
    });


    //Send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
        const user = getUser(receiverId);
        io.emit("getMessage", {
            senderId,
            receiverId,
            text,
            conversationId
        });
        //console.log("New text.", senderId, receiverId, text)
    });

    //Send and update conversation
    socket.on("sendConversation", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.emit("getConversation", {
            senderId,
            receiverId,
            text,
        });
        //console.log("New Conv.", senderId, receiverId, text)
    });


    //Notification

    socket.on("sendNotification", ({ followerId, followedId, activity }) => {
        const receiver = getUser(followedId);
        io.emit("getNotification", {
            followerId,
            followedId,
            activity
        });
        console.log("New Conv.", followerId, followedId, activity)
    });


    //When disconnected
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});