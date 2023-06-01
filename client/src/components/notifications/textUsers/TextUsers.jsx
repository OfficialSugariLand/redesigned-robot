import "./textUsers.scss";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import noimage from "./noimageavater/noimage.png";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

export default function TextUsers({ textUser }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let isRendered = useRef(false);
    const [txtUsers, setTxtUsers] = useState();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Get paramater user
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/users/${textUser.sender_id}`)
            .then(res => {
                if (isRendered) {
                    setTxtUsers(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [textUser]);

    return (
        <div className="textUsers">
            {
                txtUsers?.map((t, id) =>
                    <div className="text_users_container" key={id}>
                        <Link to={`/textbox/sugarchat/${textUser.sender_id}`}>
                            <div className="text_imgs">
                                <img src={t.profilePicture ? PF + t.profilePicture : noimage} alt="" />
                            </div>
                            <div className="textUser_cred">
                                <div className="text_usern_time">
                                    <span>{t.username}</span>
                                    <span className="text_date_time">{format(textUser.date_time)}</span>
                                </div>
                                <p>{textUser.text?.substr(0, 35)}
                                    {
                                        textUser.text?.length > 35 &&
                                        <span>....</span>
                                    }
                                </p>
                            </div>
                        </Link>
                    </div>
                )
            }
        </div>
    )
}
