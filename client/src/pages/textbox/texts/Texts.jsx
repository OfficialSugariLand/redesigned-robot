import "./texts.scss";
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { format } from "timeago.js";
import noImage from "./noimageavater/noimage.png";
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";


export default function Texts({ message }) {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let isRendered = useRef(false);
    const user_id = useParams().user_id;
    const [textUser, setTextUser] = useState();
    const scrollRef = useRef();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Get text users
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/users/${user_id}`)
            .then(res => {
                if (isRendered) {
                    setTextUser(res.data[0]);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user_id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div>
            <div className={`sugarChats_messages ${message.sender_id === user.user_id ? "own_messages" : "sugarChats_message"}`}
                key={message._id} ref={scrollRef}>
                <div className="sugarChats_user">
                    {
                        message.sender_id === user.user_id ?
                            <img src={user.profilePicture ? PF + user.profilePicture : noImage}
                                alt=""
                            />
                            :
                            <img src={textUser?.profilePicture ? PF + textUser?.profilePicture : noImage
                            }
                                alt=""
                            />
                    }
                </div>
                <div className="sugarChats_text_container">
                    <div className={`sugarChats_textArea ${message.sender_id === user.user_id ? "own_texts" : "friend_texts"}`}>
                        {
                            message.text !== null &&
                            <p>{message.text}</p>
                        }
                    </div>
                    {
                        message.img &&
                        <div className="sugarChats_img">
                            <img src={PF + message.img} alt="" />
                        </div>
                    }
                    <span className={`${message.sender_id === user.user_id ? "own_time" : "friend_time"}`}>{format(message.date_time)}</span>
                </div>
            </div>
        </div>
    )
}
