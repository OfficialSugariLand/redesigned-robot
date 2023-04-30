import "./messenger.scss"
import Conversation from "../../components/conversations/Conversation";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client"
import Input from "./Input";
import Texts from "./Texts";
import { FaArrowAltCircleLeft } from "react-icons/fa";

export default function Messenger() {
    const { user: currentUser } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const socket = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [getUsers, setGetUsers] = useState([]);
    const [textUser, setTextUser] = useState([]);

    useEffect(() => {
        socket.current = io("ws://localhost:4000");

        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, [currentUser]);

    //console.log(getUsers)

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat])


    useEffect(() => {
        socket.current.emit("newUser", currentUser._id);
        socket.current.on("getUsers", users => {
            setOnlineUsers(
                currentUser.followings.filter((f) => users.some((u) => u.userId === f))
            );
        });
    }, [currentUser]);

    /*     useEffect(() => {
            const getConversations = async () => {
                const res = await axios.get("/conversations/" + currentUser._id);
                setConversations(res.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                }));
    
            };
            getConversations();
        }, [currentUser._id]); */

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + currentUser._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [currentUser._id]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + currentChat?._id);
                setMessages(res.data)
            } catch (err) {
                console.log(err)
            }
        };
        getMessages();
    }, [currentChat]);

    useEffect(() => {
        conversations?.forEach(membersId => {
            messages?.forEach(conversationsId => {
                const users = membersId?.members?.find((m) => m !== currentUser._id && conversationsId?.conversationId === membersId._id);
                setGetUsers(users)
                //const users = membersId?.members?.find((m) => m !== currentUser._id);
                const getMessengerUsers = async () => {
                    try {
                        const usersList = await axios.get("/users?userId=" + users);
                        //console.log(usersList)
                        setTextUser(usersList.data);
                    } catch (err) {
                        console.log(err);
                    }
                };
                getMessengerUsers();
            })
        });
    }, [currentUser, conversations, messages, getUsers]);


    return (
        <>
            <div className="messenger">
                <div className="messenger_container">
                    <div className="chatMenu">
                        <input placeholder="Find user" />
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c)} key={c._id}>
                                <Conversation conversation={c} currentUser={currentUser} />
                            </div>
                        ))}
                    </div>
                    {
                        currentChat ?
                            (
                                <div className="chat_box_container">
                                    <div className="current_chat_user">
                                        <img src={textUser?.profilePicture ? PF + textUser?.profilePicture :
                                            PF + "person/1658876240053sugarisland.jpeg"} alt=""
                                        />
                                        <span>{textUser?.username}</span>
                                    </div>
                                    <Texts messages={messages} conversations={conversations} />
                                    <Input currentChat={currentChat} messages={messages}
                                        setMessages={setMessages} socket={socket} currentUser={currentUser}
                                    />
                                </div>
                            )
                            :
                            (
                                <div className="empty_container">
                                    <div className="messenger_svg_span_container">
                                        <FaArrowAltCircleLeft />
                                        <span>Click user to start chat</span>
                                    </div>
                                </div>
                            )
                    }
                    <div className="chatOnline_container">
                        <div className="chatOnlineWrapper">
                            <ChatOnline
                                onlineUsers={onlineUsers}
                                currentId={currentUser._id}
                                setCurrentChat={setCurrentChat}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
