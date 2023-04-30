import "./conversations.scss"
import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { Link } from "react-router-dom";

function Conversations({ conversation }) {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [chatUser, setChatUser] = useState([]);
    const [messages, setMessages] = useState([]);
    const [userText, setUserText] = useState([]);
    //const [visible] = useState(2);

    //Get conversations users
    useEffect(() => {
        const friendId = conversation?.members?.find((m) => m !== user._id);
        const getUser = async () => {
            try {
                const res = await axios("/users?userId=" + friendId);
                setChatUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getUser();
    }, [user, conversation]);


    //Get messages
    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + conversation?._id);
                setMessages(res.data.sort((p1, p2) => {
                    return new Date(p1.createdAt) - new Date(p2.createdAt);
                })
                );
            } catch (err) {
                console.log(err)
            }
        };
        getMessages();
    }, [conversation, messages]);

    //console.log(messages.slice(-1))

    useEffect(() => {
        const newMessasge = messages.slice(-1);
        setUserText(newMessasge)
    }, [messages])

    return (
        <>
            <Link to={"/textbox/sugarchat/" + chatUser?.usersId}>
                <div className="conversation">
                    <img src={chatUser?.profilePicture ? PF + chatUser?.profilePicture : PF + "person/noimage.png"} alt="" />
                    <div className="username_text">
                        <span>{chatUser?.username}</span>
                        {
                            userText.map((m, index) => (
                                <div key={index} className="text_preview">
                                    <p>{m.text?.substr(0, 35)}</p>
                                    {
                                        m.text?.length > 35 &&
                                        <span>....</span>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Link>
        </>
    )
}

export default Conversations