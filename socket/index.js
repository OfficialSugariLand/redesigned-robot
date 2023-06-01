import express from "express";
import http from "http";
import { Server } from "socket.io";
const PORT = process.env.PORT || 4000;
const app = express();
const httpServer = http.createServer(app);
const server = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});

//https://www.youtube.com/watch?v=cmDna276eCo

let users = [];

const addUser = (user_id, socketId) => {
    !users.some((user) => user.user_id === user_id) &&
        users.push({ user_id, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getMessage = (user_id) => {
    return users.find(user => user.user_id === user_id)
}

const getConversation = (user_id) => {
    return users.find(user => user.user_id === user_id)
}

const getUnread = (user_id) => {
    return users.find(user => user.user_id === user_id)
}

const postUser = (user_id) => {
    return users.find(user => user.user_id === user_id)
}

const postLiker = (user_id) => {
    return users.find(user => user.user_id === user_id)
}

const followedUser = (user_id) => {
    return users.find(user => user.user_id === user_id)
}

const textNotice = (user_id) => {
    return users.find(user => user.user_id === user_id)
}

const smsUser = (user_id) => {
    return users.find(user => user.user_id === user_id)
}

server.on("connection", (socket) => {
    console.log("a user connected", users)

    //Take userId and socket from user
    socket.on("newUser", (user_id) => {
        addUser(user_id, socket.id);
        server.emit("getUsers", {
            user_id
        });
    });
    //When disconnected
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        server.emit("getUsers", users);
    });


    //Send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text, img, conversationId }) => {
        getMessage(receiverId);
        server.emit("getMessage", {
            senderId,
            receiverId,
            text,
            img,
            conversationId
        });
        //console.log("New text.", senderId, receiverId, text, img)
    });

    //Send and get conversation
    socket.on("sendConversation", ({ senderId, receiverId, lastText, img, conversationId }) => {
        getConversation(receiverId);
        server.emit("getConversation", {
            senderId,
            receiverId,
            lastText,
            img,
            conversationId
        });
        //console.log("New conversation.", senderId, receiverId, lastText, img)
    });

    //Send and get unread texts
    socket.on("sendUnreadTexts", ({ sender_id, receiver_id }) => {
        getUnread(receiver_id);
        server.emit("getUnreadTexts", {
            sender_id,
            receiver_id
        });
        console.log("New unread.", sender_id, receiver_id)
    });

    //Send and get likes
    socket.on("sendLikes", ({ senderId, receiverId, postId, activity }) => {
        postUser(receiverId);
        server.emit("getLikes", {
            senderId,
            receiverId,
            postId,
            activity,
        });
        //console.log("Like notice", senderId, receiverId, postId, activity)
    });

    //Send and get liker
    socket.on("sendLiker", ({ senderId, postId }) => {
        postLiker(senderId);
        server.emit("getLiker", {
            senderId,
            postId,
        });
        //console.log("Liker notice", senderId, postId)
    });

    //Send and get followings
    socket.on("sendFollowNotice", ({ followerId, followedId, activity }) => {
        followedUser(followerId);
        server.emit("getFollowNotice", {
            followerId,
            followedId,
            activity
        });
        console.log("follower notice", followerId, followedId, activity)
    });

    //Send and get following
    socket.on("sendFollowing", ({ followerId, followedId }) => {
        followedUser(followerId);
        server.emit("getFollowing", {
            followerId,
            followedId,
        });
        //console.log("follower notice", followerId, followedId)
    });


    //Send and get text notice
    socket.on("sendTextNotice", ({ sender_id, receiver_id, text }) => {
        textNotice(receiver_id);
        server.emit("getTextNotice", {
            sender_id,
            receiver_id,
            text
        });
        //console.log("text notice", sender_id, receiver_id, text)
    });
    //Send and get text notice
    socket.on("sendTextNoticeCount", ({ sender_id, receiver_id }) => {
        textNotice(receiver_id);
        server.emit("getTextNoticeCount", {
            sender_id,
            receiver_id,
        });
        //console.log("text notice", sender_id, receiver_id, text)
    });

    //Send and get sms
    socket.on("sendSms", ({phone_num, otp, user_id }) => {
        smsUser(user_id);
        server.emit("getSms", {
            phone_num,
            otp,
            user_id,
        });
        //console.log("Sms", phone_num, otp, user_id)
    });
});


httpServer.listen(PORT, () => {
    console.log("Listening")
});