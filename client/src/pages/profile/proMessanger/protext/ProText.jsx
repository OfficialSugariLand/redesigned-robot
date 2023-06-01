import "./proText.scss";
import Topbar from "../../../../components/topbar/Topbar";
import axios from "axios";
import { useContext, useEffect, useReducer, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { Link, useParams } from "react-router-dom";
import CutieBeach from "../../../../pages/about/images/cutie_on_beach.jpg";
import { FiArrowDownCircle } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";
import { io } from "socket.io-client";
import Conversations from "../conversations/Conversations";
import Texts from "../texts/Texts";
import Input from "../input/Input";

function SugarChats() {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const user_id = useParams().user_id;
    const [currentUser, setCurrentUser] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [mdrop, setMdrop] = useState(false);
    const [socket, setSocket] = useState(null);
    const mysocket = process.env.REACT_APP_SOCKET_URL;
    const [arrivalMessage, setArrivalMessage] = useState();
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Use socket oi to send and get texts instant
    useEffect(() => {
        setSocket(io(mysocket));
    }, []);

    useEffect(() => {
        socket?.on("getMessage", (data) => {
            setArrivalMessage({
                sender_id: data.senderId,
                receiver_id: data.receiverId,
                text: data.text,
                img: data.img,
                conversation_id: data.conversationId,
                date_time: Date.now(),
            });
        });
    }, [socket]);

    useEffect(() => {
        arrivalMessage &&
            user_id === arrivalMessage?.sender_id &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, user_id])

    //Get paramater user
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get("/users/" + user_id);
            setCurrentUser(res.data);
        };
        fetchUser();
    }, [user_id]);

    const curProfileUser = currentUser?.find((m) => m);   //visited page user

    //Get coversations members
    useEffect(() => {
        const getConvs = async () => {
            try {
                const res = await axiosInstance.get("/conversations/" + user.user_id);
                setConversations(res.data.sort((p1, p2) => {
                    return new Date(p2.date_time) - new Date(p1.date_time);
                })
                );
            } catch (err) {
                console.log(err);
            }
        };
        getConvs();
    }, [user, ignored]);

    //Get chat
    useEffect(() => {
        const getChats = async () => {
            try {
                const res = await axiosInstance.get("/messenger/" + user.user_id + user_id);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getChats();
    }, [user, user_id, ignored]);

    return (
        <div className="sugarChats">
            <Topbar />
            <div className="sugarChats_container">
                <div className="textBox_left">
                    <input placeholder="Find user" />
                    {
                        conversations?.map((c, id) =>
                            <Conversations forceUpdate={forceUpdate} ignored={ignored} conversation={c} key={id}
                                setConversations={setConversations}
                            />
                        )
                    }
                </div>
                <div className="textBox_middle">
                    <div className="textBox_middleTop">
                        <>
                            <img src={curProfileUser ? PF + curProfileUser.profilePicture
                                : PF + "person/noimage.png"} alt="" />
                            <span className="middleTop_usrName">{curProfileUser?.username}</span>
                        </>
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
                                <Texts message={m} ownUser={user} curProfileUser={curProfileUser} key={id} />
                            ))
                        }
                    </div>
                    <Input ownUser={user} friendUser={user_id} conversation={conversations} setConversation={setConversations}
                        socket={socket} forceUpdate={forceUpdate} ignored={ignored}
                    />
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