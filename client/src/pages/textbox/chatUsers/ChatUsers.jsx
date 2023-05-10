import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { AuthContext } from "../../../context/AuthContext";
import "./chatUsers.scss";
import { Link, useParams } from 'react-router-dom';

export default function ChatUsers({ chatUsr, conversation, forceUpdate, ignored, setConversations }) {
    const user_id = useParams().user_id;
    //const [readText, setReadText] = useState(false);
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

    useEffect(() => {
        if (user_id) {
            const autoRead = async () => {
                try {
                    await axiosInstance.delete("/unreadtexts/" + unreadText?.id, {
                        data: {
                            id: unreadText?.id,
                        },
                    });
                } catch (err) {
                    console.log(err);
                }
            }
            autoRead();
        }
    })

    return (
        <div className='chat_user'>
            {
                unreadText ?
                    <Link to={`/textbox/sugarchat/${chatUsr?.user_id}`} onClick={() => { forceUpdate() }}>
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
                    <Link to={`/textbox/sugarchat/${chatUsr?.user_id}`} onClick={forceUpdate}>
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
