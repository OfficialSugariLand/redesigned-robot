import "./sugarChats.scss";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useParams } from "react-router-dom";
import CutieBeach from "../../pages/about/images/cutie_on_beach.jpg";
import axios from "axios";
import { format } from "timeago.js";
import Input from "./Input";
import Conversations from "./Conversations";
import { BiLeftArrowCircle } from "react-icons/bi";
import { FiArrowDownCircle } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";
import { io } from "socket.io-client";

function SugarChats() {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const usersId = useParams().usersId;
    const [currentUser, setCurrentUser] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [friendChat, setFriendChat] = useState();
    const [curFriendChat, setCurFriendChat] = useState();
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    //const scrollRef = useRef(null);
    const [mdrop, setMdrop] = useState(false);

    //Get paramater user
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?usersId=${usersId}`);
            setCurrentUser(res.data);
        };
        fetchUser();
    }, [usersId]);

    //console.log(usersId)

    //Use socket oi to send and get texts instant
    useEffect(() => {
        setSocket(io("http://localhost:4000"));
    }, []);

    useEffect(() => {
        socket?.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, [socket]);

    useEffect(() => {
        arrivalMessage &&
            curFriendChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, curFriendChat]);

    //End of socket oi

    //Get coversations members
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);

    useEffect(() => {
        const newConversationUsers = conversations?.filter(twoUsers => twoUsers?.members.includes(user?._id && currentUser?._id));
        setFriendChat(newConversationUsers);
    }, [conversations, user?._id, currentUser?._id]);

    useEffect(() => {
        const curText = friendChat?.find((m) => m);
        setCurFriendChat(curText)
    }, [friendChat]);

    //Get messages
    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + curFriendChat?._id);
                setMessages(res.data)
            } catch (err) {
                console.log(err)
            }
        };
        getMessages();
    }, [curFriendChat]);

    /* useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]); */


    useEffect(() => {
        let container = document.querySelector(".sugarChats_con");
        container.scrollTop = container.scrollHeight;

        if (container.scrollTop + container.clientHeight + 100 < container.scrollHeight) {
            return;
        }
        //document.body.style.scrollBehavior = "smooth";
        //container?.addEventListener("scrollTop", scrollTop)
        /* function scrollTop() {
            if (container.scrollTop + container.clientHeight + 100 < container.scrollHeight) {
                return;
            }
        } */
    });

    return (
        <div className="sugarChats">
            <div className="sugarChats_container">
                <div className="textBox_left">
                    <input placeholder="Find user" />
                    {
                        conversations.map((c) => <Conversations conversation={c} key={c._id} />)
                    }
                </div>
                <div className="textBox_middle">
                    <div className="textBox_middleTop">
                        {
                            currentUser ?
                                (
                                    <>
                                        <img src={PF + currentUser.profilePicture ? PF + currentUser.profilePicture
                                            : PF + "person/1658876240053sugarisland.jpeg"} alt="" />
                                        <span className="middleTop_usrName">{currentUser.username}</span>
                                    </>
                                )
                                :
                                (
                                    ""
                                )
                        }
                        <div className="middle_top_drop">
                            <button onClick={() => setMdrop(prev => !prev)}>
                                {
                                    mdrop ? <MdOutlineClose /> : <FiArrowDownCircle />
                                }
                            </button>
                            <div className={`middletop_drop_items ${mdrop ? "show_mdrop" : "hide_mdrop"}`} >
                                <div className="middletop_usr_items">
                                    <Link to={"/profile/" + usersId}>View profile</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sugarChats_con">
                        {
                            messages.map((m) => (
                                <div className={`sugarChats_messages ${m.sender === user._id ? "own_messages" : "sugarChats_message"}`}
                                    key={m._id}>
                                    <div className="sugarChats_TextCreatedAt">
                                        <img src={m.sender === currentUser?._id ?
                                            PF + currentUser?.profilePicture :
                                            m.sender === user._id ? PF + user?.profilePicture :
                                                PF + "person/1658876240053sugarisland.jpeg"}
                                            alt=""
                                        />
                                        <span>{format(m.createdAt)}</span>
                                    </div>
                                    <div className="sugarChats_textArea">
                                        <p>{m.text}</p>
                                        <img src={PF + m.img} alt="" />
                                    </div>
                                    {/* <div ref={scrollRef} /> */}
                                </div>
                            ))
                        }
                    </div>
                    <Input curFriendChat={curFriendChat} messages={messages}
                        setMessages={setMessages} socket={socket} user={user} />
                </div>
                <div className="sugar_hot_cakes">
                    <div className="sugar_hot_wrapper">
                        <img src={CutieBeach} alt="" />
                    </div>
                </div>
                {/* <div className="textBox_right">
                    <div className="textBox_right_container">
                        <img src={CloseUp} alt="" />
                    </div>
                    <div className="textBox_right_container">
                        <img src={Guinness} alt="" />
                    </div>
                    <div className="textBox_right_container">
                        <img src={OralB} alt="" />
                    </div>
                </div> */}
            </div>
            {/* Mobile function */}
            <div className="mobile_container_wrapper">
                {
                    currentUser ?
                        (

                            <div className="textBox_middle">
                                <div className="textBox_middleTop">
                                    <div className="back_to_conBtn">
                                        <Link to={"/textbox"}>
                                            <BiLeftArrowCircle />
                                        </Link>
                                    </div>
                                    <div className="middle_userDetails">
                                        <img src={PF + currentUser.profilePicture ? PF + currentUser.profilePicture
                                            : PF + "person/1658876240053sugarisland.jpeg"} alt="" />
                                        <span>{currentUser.username}</span>
                                    </div>
                                    <div className="dropUser_profile">
                                        <FiArrowDownCircle />
                                    </div>
                                </div>
                                <div className="sugarChats_con">
                                    {
                                        messages.map((m) => (
                                            <div className={`sugarChats_messages ${m.sender === user._id ? "own_messages" : "sugarChats_message"}`}
                                                key={m._id} /* ref={scrollRef} */>
                                                <div className="sugarChats_TextCreatedAt">
                                                    <img src={m.sender === currentUser?._id ?
                                                        PF + currentUser?.profilePicture :
                                                        m.sender === user._id ? PF + user?.profilePicture :
                                                            PF + "person/1658876240053sugarisland.jpeg"}
                                                        alt=""
                                                    />
                                                    <span>{format(m.createdAt)}</span>
                                                </div>
                                                <div className="sugarChats_textArea">
                                                    <p>{m.text}</p>
                                                    <img src={PF + m.img} alt="" />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <Input curFriendChat={curFriendChat} messages={messages}
                                    setMessages={setMessages} socket={socket} user={user} />
                            </div>
                        )
                        :
                        (
                            <div className="textBox_left">
                                <input placeholder="Find user" />
                                {
                                    conversations.map((c) => <Conversations conversation={c} key={c._id} />)
                                }
                            </div>
                        )
                }
            </div>
        </div>
    )
}

export default SugarChats