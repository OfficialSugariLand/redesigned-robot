import "./viewPosts.scss";
import Topbar from "../../topbar/Topbar";
import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { BsSuitHeart } from "react-icons/bs";
import HeartFilled from "./../img/heartFilled.svg";
import { AuthContext } from "../../../context/AuthContext";
import Viewpostsmobile from "../viewpostsmobile/Viewpostsmobile";


export default function Viewposts() {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [postUser, setPostUser] = useState();
    const [post, setPost] = useState();
    const img = useParams();
    const [posts, setPosts] = useState([]);
    const [readMore, setReadMore] = useState(false);
    const [postLike, setPostLike] = useState();
    const liked = postLike?.length;
    const postLikeUser = postLike?.find((p) => p.liker === user.user_id); //Posts liked by me
    const [btnDisable, setBtnDisable] = useState(false);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Get Post Users
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get("/users/" + img?.user_id);
            setPostUser(res.data[0]);
        };
        fetchUser();
    }, [img]);

    //Get param users posts
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axiosInstance.get("/posts/" + img?.user_id)
            setPosts(res.data.sort((p1, p2) => {
                return new Date(p2.date_time) - new Date(p1.date_time);
            })
            );
        };
        fetchPosts();
    }, [img]);

    //Get current post length number
    const curFotoNumber = posts?.findIndex((p) => p.img === post?.img)
    //Slide to previous post
    const isFirstSlide = curFotoNumber === 0;
    const getCurFotoPrev = posts[isFirstSlide ? posts.length - 1 : curFotoNumber - 1]?.img;
    //Slide to next post
    const isLastSlide = curFotoNumber === posts.length - 1;
    const getCurFotoNext = posts[isLastSlide ? 0 : curFotoNumber + 1]?.img;

    //Get param user's single post
    useEffect(() => {
        const getUsersPost = async () => {
            try {
                const post = await axiosInstance.get(`/posts/userpost/${img.user_id}/${img.img}`);
                setPost(post.data[0]);
            } catch (err) {
                console.log(err);
            }
        };
        getUsersPost();
    }, [img]);

    //Get post likes
    useEffect(() => {
        const getLikes = async () => {
            try {
                const like = await axiosInstance.get("/likes/" + post?.id);
                setPostLike(like.data);
            } catch (err) {
                console.log(err);
            }
        };
        getLikes();
    }, [post, ignored]);

    //Like a post
    const LikePosts = async () => {
        setBtnDisable(true);
        const values = {
            liker: user.user_id,
            post_id: post?.id,
        }
        try {
            await axiosInstance.post("/likes", values);
        }
        catch (err) {
            console.log(err);
        }
        //Send like notifications
        const notificationsOne = {
            sender_id: user.user_id,
            receiver_id: post?.user_id,
            post_id: post.id,
            activities: "likes your post"
        }
        try {
            await axiosInstance.post("/likenotice", notificationsOne);
        }
        catch (err) {
            console.log(err);
        }
        //Send like notifications counts
        const notificationsTwo = {
            sender_id: user.user_id,
            receiver_id: post?.user_id,
            post_id: post.id,
            activities: "likes your post"
        }
        try {
            await axiosInstance.post("/likenotice/count", notificationsTwo);
        }
        catch (err) {
            console.log(err);
        }
        forceUpdate();
    }

    useEffect(() => {
        if (btnDisable === true) {
            setTimeout(() => setBtnDisable({ btnDisable: false }), 2000);
        }
    }, [btnDisable]);

    //Unlike a post
    const UnlikePost = async () => {
        try {
            await axiosInstance.delete("/likes/" + postLikeUser?.post_id, {
                data: {
                    id: postLikeUser?.id
                }
            });
        }
        catch (err) {
            console.log(err);
        }
        forceUpdate();
    }

    //Read more function
    const showAllBtn = () => {
        setReadMore(prevState => !prevState)
    };

    return (
        <div className='view_posts'>
            <Topbar />
            <div className="view_posts_container">
                <div className="view_posts_foto">
                    <div className="foto_container">
                        {
                            posts?.length > 0 &&
                            <Link onClick={() => forceUpdate()} to={`/posts/${post?.user_id}/${getCurFotoPrev}`}>
                                <span className="slide_left">
                                    <IoMdArrowDropleft />
                                </span>
                            </Link>
                        }
                        <img src={PF + post?.img} alt="" />
                        {
                            posts?.length > 0 &&
                            <Link onClick={() => forceUpdate()} to={`/posts/${post?.user_id}/${getCurFotoNext}`}>
                                <span className="slide_right">
                                    <IoMdArrowDropright />
                                </span>
                            </Link>
                        }
                    </div>
                </div>
                <div className="view_posts_desc">
                    <div className="view posts_desc_upper">
                        <div className="view_posts_desc_foto">
                            <Link title="Go to profile" to={`/profile/${postUser?.user_id}`}>
                                <img src={PF + postUser?.profilePicture} alt="" />
                                <span>{postUser?.username}</span>
                            </Link>
                        </div>
                    </div>
                    <div className="postText_dotContainer">
                        <span className="spanText" id="readAll" onClick={showAllBtn}>{readMore ? post?.desc : post?.desc.substr(0, 200)}
                            {
                                post?.desc.length > 200 && "....."
                            }
                        </span>
                        {
                            post?.desc.length > 200 &&
                            <button onClick={showAllBtn} id="readAll">
                                {readMore ? "Read Less" : "...Read More"}
                            </button>
                        }
                    </div>
                    <div className="like_unlike">
                        {
                            postLike?.length > 0 ?
                                <>
                                    {
                                        postLikeUser ?
                                            <button onClick={UnlikePost}>
                                                <img src={HeartFilled} alt="" />
                                            </button>
                                            :
                                            <button disabled={btnDisable} onClick={() => { LikePosts(); }}>
                                                <BsSuitHeart />
                                            </button>
                                    }
                                    {
                                        liked
                                            ?
                                            (
                                                <div>
                                                    {liked > 1 ? (<span>{liked} likes</span>) : (<span>{liked} like</span>)}
                                                </div>
                                            )
                                            :
                                            ("")
                                    }
                                </>
                                :
                                <>
                                    <button disabled={btnDisable} onClick={() => { LikePosts(); }}>
                                        <BsSuitHeart />
                                    </button>
                                    {
                                        liked
                                            ?
                                            (
                                                <div>
                                                    {liked > 1 ? (<span>{liked} likes</span>) : (<span>{liked} like</span>)}
                                                </div>
                                            )
                                            :
                                            ("")
                                    }
                                </>
                        }
                    </div>
                </div>
                <Viewpostsmobile />
            </div>
        </div>
    )
}