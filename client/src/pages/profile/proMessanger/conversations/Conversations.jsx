import "./conversations.scss";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ChatUsers from '../chatUsers/ChatUsers';

export default function Conversations({ conversation, forceUpdate, ignored, setConversations }) {
    const [chatUser, setChatUser] = useState();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Get paramater user
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get("/users/" + conversation.user_two);
            setChatUser(res.data);
        };
        fetchUser();
    }, [conversation, ignored]);

    return (
        <div className='conversations'>
            <div className="conversation_wrapper">
                {
                    chatUser?.map((c, id) =>
                        <ChatUsers forceUpdate={forceUpdate} ignored={ignored} chatUsr={c} key={id} conversation={conversation}
                            setConversations={setConversations}
                        />
                    )
                }
            </div>
        </div>
    )
}
