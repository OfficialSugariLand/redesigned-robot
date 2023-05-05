import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { format } from "timeago.js";


export default function Texts({ message, ownUser }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [textUser, setTextUser] = useState();
    const scrollRef = useRef();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Get paramater user
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get("/users/" + message.receiver_id);
            setTextUser(res.data);
        };
        fetchUser();
    }, [message]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div>
            <div className={`sugarChats_messages ${message.sender_id === ownUser.user_id ? "own_messages" : "sugarChats_message"}`}
                key={message._id} ref={scrollRef}>
                <div className="sugarChats_TextCreatedAt">
                    {
                        textUser?.map((u, id) =>
                            <img src={u.profilePicture ? PF + u.profilePicture : PF + "person/1658876240053sugarisland.jpeg"}
                                key={id} alt=""
                            />
                        )
                    }
                    <span>{format(message.date_time)}</span>
                </div>
                <div className="sugarChats_textArea">
                    <p>{message.text}</p>
                </div>
            </div>
        </div>
    )
}
