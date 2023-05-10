import "./texts.scss";
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { format } from "timeago.js";
import noImage from "../../../components/topbar/noimageavater/noimage.png";
import { useParams } from 'react-router-dom';


export default function Texts({ message, ownUser }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const user_id = useParams().user_id;
    const [textUser, setTextUser] = useState();
    const scrollRef = useRef();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Get text users
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get("/users/" + user_id);
            setTextUser(res.data);
        };
        fetchUser();
    }, [message]);

    const ownTextUser = textUser?.find((u) => u.user_id);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div>
            <div className={`sugarChats_messages ${message.sender_id === ownUser.user_id ? "own_messages" : "sugarChats_message"}`}
                key={message._id} ref={scrollRef}>
                <div className="sugarChats_user">
                    {
                        message.sender_id === ownUser.user_id ?
                            <img src={ownUser.profilePicture ? PF + ownUser.profilePicture : noImage}
                                alt=""
                            />
                            :
                            <img src={ownTextUser?.profilePicture ? PF + ownTextUser?.profilePicture : noImage
                            }
                                alt=""
                            />
                    }
                </div>
                <div className="sugarChats_text_container">
                    <div className={`sugarChats_textArea ${message.sender_id === ownUser.user_id ? "own_texts" : "friend_texts"}`}>
                        {
                            message.text !== "" &&
                            <p>{message.text}</p>
                        }
                    </div>
                    <div className="sugarChats_img">
                        <img src={PF + message.img} alt="" />
                    </div>
                    <span className={`${message.sender_id === ownUser.user_id ? "own_time" : "friend_time"}`}>{format(message.date_time)}</span>
                </div>
            </div>
        </div>
    )
}
