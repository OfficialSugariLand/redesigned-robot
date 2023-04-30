import "./proFeed.scss";
import { useEffect, useState } from "react";
import axios from "axios"
import { useParams } from "react-router-dom";
import ProPosts from "../proPosts/ProPosts";

export default function ProFeed() {
    const user_id = useParams().user_id;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axiosInstance.get("/posts/" + user_id)
            setLoading(true)
            setPosts(res.data.sort((p1, p2) => {
                return new Date(p2.date_time) - new Date(p1.date_time);
            })
            );
        };
        fetchPosts();
    }, [user_id]);

    return (
        <div className="proFeed">
            {posts?.map((p, id) => (
                <ProPosts key={id} post={p} loading={loading} user_id={user_id} />
            ))}
        </div>
    )
}
