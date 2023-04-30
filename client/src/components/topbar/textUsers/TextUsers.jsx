import "./textUsers.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import UserMap from "../userMap/UserMap";

export default function TextUsers({ textUser }) {
    const [txtUsers, setTxtUsers] = useState();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Get paramater user
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get("/users/" + textUser.user_two);
            setTxtUsers(res.data);
        };
        fetchUser();
    }, [textUser]);

    return (
        <div className="textUsers">
            {
                txtUsers?.map((t, id) =>
                    < UserMap textUsers={t} key={id} />
                )
            }
        </div>
    )
}
