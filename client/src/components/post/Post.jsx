import "./post.scss";
import axios from "axios";
import { format } from "timeago.js"
import { AuthContext } from "../../context/AuthContext";
import { useState, useContext, useEffect } from "react";
import { Delete, MoreVert } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { BsSuitHeart } from "react-icons/bs";
import HeartFilled from "./img/heartFilled.svg";
import { BiArrowBack } from "react-icons/bi";
import { useRef } from "react";
import ProfileImage from "../../pages/about/images/profileCovers.png"
import { Add, Remove } from "@material-ui/icons";
import { Link } from "react-router-dom";
import socketIOClient from "socket.io-client";

export default function Post({ post, forceUpdate }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);
    const [postUser, setPostUser] = useState();
    const [postEditModal, setPostEditModal] = useState(false);
    const [postEditDropdown, setPostEditDropdown] = useState(false);
    const [readMore, setReadMore] = useState(false);
    const menuRef = useRef();
    const desc = useRef();
    const [currentDesc, setCurrentDesc] = useState(post.desc);
    const [loaded, setLoaded] = useState(false);
    const [postLike, setPostLike] = useState();
    const [postLikeUsers, setPostLikeUsers] = useState();
    const liked = postLike?.length;
    const [userFriends, setUserFriends] = useState([]);
    const socket = useRef();
    const [arrivalLikes, setArrivalLikes] = useState();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    useEffect(() => {
        const postLikeUser = postLike?.find((p) => p.liker === user.user_id); //Posts liked by me
        setPostLikeUsers(postLikeUser);
    }, [postLike, user])

    //Send to socket
    useEffect(() => {
        socket.current = socketIOClient("http://localhost:4000/");
    }, []);

    //Take from socket
    useEffect(() => {
        const socket = socketIOClient("http://localhost:4000/");

        socket?.on("getLiker", (data) => {
            setArrivalLikes({
                liker: data.senderId,
                post_id: data.postId,
            });
        });
    }, []);

    //Rerender likes when changes are made
    useEffect(() => {
        arrivalLikes &&
            post?.id === arrivalLikes?.post_id && arrivalLikes?.liker === user.user_id &&
            setPostLike((prev) => [...prev, arrivalLikes]);
    }, [arrivalLikes, post.id, user]);

    //console.log(arrivalLikes)

    //Get Post Users
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get(`/users/${post?.user_id}`);
            setPostUser(res.data);
        };
        fetchUser();
    }, [post]);

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
    }, [post]);

    //Like a post
    const LikePosts = async () => {
        socket.current.emit("sendLikes", {
            senderId: user.user_id,
            receiverId: post?.user_id,
            postId: post?.id,
            activity: "likes your post"
        });
        socket.current.emit("sendLiker", {
            senderId: user.user_id,
            postId: post?.id,
        });
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
    }

    //Unlike a post
    const UnlikePost = async () => {
        try {
            await axiosInstance.delete(`/likes/${user.user_id}/${postLikeUsers?.post_id}`, {
                data: {
                    liker: user.user_id,
                    post_id: postLikeUsers?.post_id
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

    //Check if my user is following post user
    const followedUser = userFriends?.find((m) => m.followed === post?.user_id && m.follower === user.user_id);

    //Get all following
    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axiosInstance.get("/followers");
                setUserFriends(friendList.data);
            } catch (err) {
                console.log(err);
            }
        };
        getFriends();
    }, []);

    //Follow a user
    const handleFollow = async () => {
        const followUser = {
            follower: user.user_id,
            followed: post.user_id
        }
        try {
            await axiosInstance.post("/followers", followUser);
        } catch (err) {
            console.log(err);
        }
        //Send notification
        const followUserNotice = {
            follower_id: user.user_id,
            followed_id: post.user_id,
            activities: "followed you"
        }
        try {
            await axiosInstance.post("/follownotice", followUserNotice);
        } catch (err) {
            console.log(err);
        }
        //Send notification count
        const followCount = {
            follower_id: user.user_id,
            followed_id: post.user_id,
            activities: "followed you"
        }
        try {
            await axiosInstance.post("/follownotice/count", followCount);
        } catch (err) {
            console.log(err);
        }
        forceUpdate();
    };

    //Unfollow a user
    const handleUnfollow = async () => {
        try {
            await axiosInstance.delete("/followers", {
                data: {
                    id: followedUser.id
                }

            });
        } catch (err) {
            console.log(err);
        }
        forceUpdate();
    };

    //Post submit after edit
    const handlePostEdit = async (e) => {
        e.preventDefault();
        const posts = {
            userId: user._id,
            desc: desc.current.value,
            //img: img.current.value,
        };
        try {
            await axiosInstance.put(`/posts/${post._id}`, posts, {
                data: {
                    userId: user._id,
                },
            });
            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        //https://www.youtube.com/watch?v=5L_XYLTjgiQ
        let observer = new window.IntersectionObserver(function (entries, self) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadImages(entry.target);
                    self.unobserve(entry.target);
                }
            });
        },
        );
        const imgs = document.querySelectorAll(".post");
        imgs.forEach(post => {
            observer.observe(post);
        });
        return () => {
            imgs.forEach(post => {
                observer.unobserve(post);
            });
        }
    }, []);

    function loadImages(image) {
        image.src = image.dataset.src;
    }

    //Delete a post
    const handleDelete = async () => {
        if (post?.user_id !== user.user_id) {
            console.log("Not your post")
        } else {
            try {
                await axiosInstance.delete(`/posts/${post.id}/${user.user_id}`, {
                    data: {
                        userId: user._id,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        }
        setTimeout(() => {
            setPostEditDropdown(false)
            forceUpdate()
        }, 1000)
    };

    //Click outside to close post edit
    useEffect(() => {
        //https://www.youtube.com/watch?v=HfZ7pdhS43s
        let handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setPostEditDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });

    return (
        <div className={`post ${loaded ? "loaded" : "loading"}`} onLoad={() => setLoaded(true)}>
            <div className="post_wrapper">
                <div className="post_upper_container">
                    {
                        postUser?.map((p, id) =>
                            <div className="postImgDrop_control" key={id}>
                                <Link to={`/profile/${p.user_id}`}>
                                    <img className="postUpper_Img"
                                        src={p.profilePicture ? PF + p.profilePicture :
                                            PF + "person/1658876240053sugarisland.jpeg"} alt=""
                                    />
                                    <div className="usrname_postTime">
                                        <span className="postUsername">{p.username}</span>
                                        < span className="post_Date">{format(post.date_time)}</span>
                                    </div>
                                </Link>
                                {(!p.user_id || p.user_id !== user.user_id) &&
                                    <div className="view_profile_dropdown">
                                        <img className="sugar_cover" src={ProfileImage} alt="Profile Cover" />
                                        <img className="user_img_drop_view" src={p.profilePicture ? PF + p.profilePicture :
                                            PF + "person/1658876240053sugarisland.jpeg"} alt=""
                                        />
                                        <span>{p.username}</span>

                                        <div className="follow_control">
                                            {
                                                followedUser ?
                                                    <button className="dropdown_follow_btn" onClick={handleUnfollow}>
                                                        Unfollow
                                                        <Remove />
                                                    </button>
                                                    :
                                                    <button className="dropdown_follow_btn" onClick={handleFollow}>
                                                        Follow
                                                        <Add />
                                                    </button>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    }
                    {
                        (!user.user_id || user.user_id === user.user_id) &&
                        <div className="post_edit_delete" ref={menuRef}>
                            <div className="post_upper_right" onClick={() => setPostEditDropdown(prev => !prev)} >
                                <MoreVert />
                            </div>
                            <div className={`post_edit_dropdown ${postEditDropdown ? 'show_edit_dropdown' : 'hide_edit_dropdown'}`}>
                                <li title="Edit post" onClick={() => { setPostEditModal(prev => !prev) }}>
                                    <EditIcon />
                                </li>
                                <li title="Delete post" onClick={handleDelete}>
                                    <Delete />
                                </li>
                                <div className={`post_edit_container ${postEditModal ? "show_post_edit" : "hide_post_edit"}`}>
                                    <BiArrowBack onClick={() => { setPostEditModal(prev => !prev) }} />
                                    <div className="post_edit_wrapper">
                                        <input placeholder={""} value={currentDesc} ref={desc} onChange={(e) => setCurrentDesc(e.target.value)} />
                                    </div>
                                    <form onSubmit={handlePostEdit}>
                                        <div className="editPostRight">
                                            <button type="submit">Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="postText_dotContainer">

                </div>
                <div className="postImg_container">
                    <Link to={`/posts/${post.user_id}/${post.img}`}>
                        <img src={PF + post.img} alt="" />
                    </Link>
                </div>
                <div className="post_bottom">
                    {
                        postLikeUsers ?
                            <button onClick={UnlikePost}>
                                <img src={HeartFilled} alt="" />
                            </button>
                            :
                            <button onClick={() => { LikePosts() }}>
                                <BsSuitHeart />
                            </button>
                    }
                    {
                        liked
                            ?
                            (
                                <div className="like_count">
                                    {liked > 1 ? (<span>{liked} likes</span>) : (<span>{liked} like</span>)}
                                </div>
                            )
                            :
                            ("")
                    }
                </div>
            </div>
        </div>
    )
}