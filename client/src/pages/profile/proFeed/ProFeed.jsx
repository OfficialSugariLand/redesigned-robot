import "./proFeed.scss";
import { useEffect, useState, useRef, useReducer, useContext } from "react";
import axios from "axios"
import { useParams } from "react-router-dom";
import ProPosts from "../proPosts/ProPosts";
import ProShare from "../proShare/ProShare";
import { AuthContext } from "../../../context/AuthContext";

export default function ProFeed() {
    const { user } = useContext(AuthContext);
    const user_id = useParams().user_id;
    let isRendered = useRef(false);
    const [posts, setPosts] = useState([]);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/posts/${user_id}`)
            .then(res => {
                if (isRendered) {
                    setPosts(res.data.sort((p1, p2) => {
                        return new Date(p2.date_time) - new Date(p1.date_time);
                    })
                    );
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user_id, ignored]);

    return (
        <div className="proFeed">
            {(!user_id || user_id === user?.user_id) && <ProShare forceUpdate={forceUpdate} />}
            {posts?.map((p, id) => (
                <ProPosts key={id} post={p} user_id={user_id} ignored={ignored} forceUpdate={forceUpdate} />
            ))}
        </div>
    )
}
