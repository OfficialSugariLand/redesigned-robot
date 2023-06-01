import "./sugarChats.scss";
import Topbar from "../../../components/topbar/Topbar";
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useParams } from "react-router-dom";
import CutieBeach from "../../../pages/about/images/cutie_on_beach.jpg";
import axios from "axios";
import { FiArrowDownCircle } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";
import Conversations from "../conversations/Conversations";
import Texts from "../texts/Texts";
import Input from "../input/Input";
import noimage from "./noimageavater/noimage.png";
import socketIOClient from "socket.io-client";

function SugarChats() {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let isRendered = useRef(false);
    const user_id = useParams().user_id;
    const [currentUser, setCurrentUser] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [arrivalConversation, setArrivalConversation] = useState();
    const [messages, setMessages] = useState([]);
    const [mdrop, setMdrop] = useState(false);
    const [textOpen, setTextOpen] = useState(false);
    const [arrivalMessage, setArrivalMessage] = useState();
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Use socket oi to send and get texts instant
    useEffect(() => {
        const socket = socketIOClient("http://localhost:4000/");
        socket?.on("getMessage", (data) => {
            setArrivalMessage({
                sender_id: data.senderId,
                receiver_id: data.receiverId,
                text: data.text,
                img: data.img,
                conversation_id: user_id + user.user,
                date_time: Date.now(),
            });
        });

        socket?.on("getConversation", (data) => {
            setArrivalConversation({
                user_id: data.receiverId,
                user_two: data.senderId,
                last_text: data.lastText,
                img: data.img,
                conversation_id: data.conversationId,
                date_time: Date.now(),
            });
        });
    }, []);

    //Real time conversation rerender
    useEffect(() => {
        arrivalConversation &&
            user.user_id === arrivalConversation?.user_id &&
            setConversations((prev) => [arrivalConversation, ...prev]);
    }, [arrivalConversation, user.user_id]);

    //Rerender messages
    useEffect(() => {
        arrivalMessage &&
            user.user_id === arrivalMessage?.receiver_id && user_id === arrivalMessage?.sender_id &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, user, user_id]);
    useEffect(() => {
        arrivalMessage &&
            user.user_id === arrivalMessage?.sender_id &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, user]);

    //Get paramater user
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/users/${user_id}`)
            .then(res => {
                if (isRendered) {
                    setCurrentUser(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        }
    }, [user_id]);

    //Get coversations members
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/conversations/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setConversations(res.data.sort((p1, p2) => {
                        return new Date(p2.date_time) - new Date(p1.date_time);
                    })
                    );
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user, ignored]);

    //Get chat
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/messenger/${user.user_id + user_id}`)
            .then(res => {
                if (isRendered) {
                    setMessages(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user.user_id, user_id]);


    //Remove duplicates
    const [newConId, setNewConId] = useState();
    useEffect(() => {
        const Newconversations = conversations?.filter((ele, ind) =>
            ind === conversations?.findIndex(elem => elem.user_two === ele.user_two &&
                elem.user_id === ele.user_id && elem.conversaion_id === ele.conversaion_id));
        setNewConId(Newconversations);
    }, [conversations])

    useEffect(() => {
        if (user_id) {
            setTextOpen(true);
        } else {
            setTextOpen(false);
        }
    }, [user_id]);

    //Delete unread
    useEffect(() => {
        if (textOpen === true) {
            const autoRead = async () => {
                try {
                    await axiosInstance.delete(`/unreadtexts/${user.user_id}/${user_id}`, {
                        data: {
                            receiver_id: user_id,
                            sender_id: user.user_id,
                        },
                    });
                } catch (err) {
                    console.log(err);
                }
            }
            autoRead();
            forceUpdate();
        }
    }, [user_id, user.user_id]);

    return (
        <div className="sugarChats">
            <Topbar />
            <div className="sugarChats_container">
                <div className="textBox_left">
                    <input placeholder="Find user" />
                    {
                        newConId?.map((c, id) =>
                            <Conversations conversation={c} key={id} ignored={ignored} />
                        )
                    }
                </div>
                <div className="textBox_middle">
                    <div className="textBox_middleTop">
                        {
                            currentUser?.map((u, id) =>
                                <div className="user_details" key={id}>
                                    <img src={u.profilePicture ? PF + u.profilePicture
                                        : noimage} alt="" />
                                    <span className="middleTop_usrName">{u.username}</span>
                                </div>
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
                                    <Link to={"/profile/" + user_id}>View profile</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sugarChats_con">
                        {
                            messages?.map((m, id) => (
                                <Texts message={m} key={id} />
                            ))
                        }
                    </div>
                    <Input ownUser={user} friendUser={user_id} conversation={conversations} forceUpdate={forceUpdate} />
                </div>
                <div className="sugar_hot_cakes">
                    <div className="sugar_hot_wrapper">
                        <img src={CutieBeach} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SugarChats