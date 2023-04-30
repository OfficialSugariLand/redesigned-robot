import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { AuthContext } from "../../../../context/AuthContext";
import "./chatUsers.scss";
import { Link, useParams } from 'react-router-dom';
import { io } from "socket.io-client";

export default function ChatUsers({ chatUsr, conversation, forceUpdate, ignored, setConversations }) {
    const user_id = useParams().user_id;
    const [socket, setSocket] = useState(null);
    const [arrivalConversation, setArrivalConversation] = useState();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [unreadText, setUnreadtText] = useState();

    //Get unread texts
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get(`/unreadtexts/${chatUsr?.user_id}/${user.user_id}`);
            setUnreadtText(res.data[0]);
        };
        fetchUser();
    }, [user, chatUsr, ignored]);

    const handleDeleteUnread = async () => {
        try {
            await axiosInstance.delete("/unreadtexts/" + unreadText?.id, {
                data: {
                    id: unreadText?.id,
                },
            });
        } catch (err) {
            console.log(err);
        }
        forceUpdate()
    }

    /* //Use socket oi to send and get texts instant
    useEffect(() => {
        setSocket(io("http://localhost:4000"));
    }, []);

    useEffect(() => {
        socket?.on("getConversation", (data) => {
            setArrivalConversation({
                sender_id: data.senderId,
                receiver_id: data.receiverId,
                text: data.text,
                date_time: Date.now(),
            });
        });
    }, [socket])

    useEffect(() => {
        arrivalConversation &&
            conversation?.user_id === arrivalConversation?.sender_id && user_id === arrivalConversation?.receiver_id &&
            setConversations((prev) => [...prev, arrivalConversation]);
    }, [conversation, arrivalConversation])

    console.log(conversation?.user_id)
    console.log(arrivalConversation?.sender_id) */

    return (
        <div className='chat_user'>
            {
                unreadText ?
                    <Link to={`/protext/${chatUsr?.user_id}`} onClick={() => { forceUpdate(); handleDeleteUnread() }}>
                        <div className="chatUsr_wrapper_up">
                            <img src={PF + chatUsr.profilePicture ? PF + chatUsr.profilePicture
                                : PF + "person/1658876240053sugarisland.jpeg"} alt="" />
                            <div className="text_preview">
                                <span className="chat_user_name">{chatUsr.username}</span>
                                <p>{conversation.last_text?.substr(0, 35)}
                                    {
                                        conversation.last_text?.length > 35 &&
                                        <span>....</span>
                                    }
                                </p>

                            </div>
                        </div>
                    </Link>
                    :
                    <Link to={`/protext/${chatUsr?.user_id}`} onClick={forceUpdate}>
                        <div className="chatUsr_wrapper_down">
                            <img src={PF + chatUsr.profilePicture ? PF + chatUsr.profilePicture
                                : PF + "person/1658876240053sugarisland.jpeg"} alt="" />
                            <div className="text_preview">
                                <span className="chat_user_name">{chatUsr.username}</span>
                                <p>{conversation.last_text?.substr(0, 35)}
                                    {
                                        conversation.last_text?.length > 35 &&
                                        <span>....</span>
                                    }
                                </p>

                            </div>
                        </div>
                    </Link>
            }
        </div>
    )
}
