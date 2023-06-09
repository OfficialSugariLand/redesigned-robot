import "./viewpostsMobile.scss";
import axios from "axios";
import { format } from "timeago.js";
import { AuthContext } from "../../../context/AuthContext";
import { useState, useContext, useEffect, useReducer } from "react";
import { Delete, MoreVert } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { BsSuitHeart } from "react-icons/bs";
import HeartFilled from "./../img/heartFilled.svg";
import { BiArrowBack } from "react-icons/bi";
import { useRef } from "react";
import ProfileImage from "../../../pages/about/images/profileCovers.png"
import { Add, Remove } from "@material-ui/icons";
import { Link, useParams } from "react-router-dom";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";

export default function Viewpostsmobile() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);
    const [postUser, setPostUser] = useState();
    const [post, setPost] = useState();
    const img = useParams();
    const [posts, setPosts] = useState([]);
    const [postEditModal, setPostEditModal] = useState(false);
    const [editDropdown, setEditDropdown] = useState(false);
    const [readMore, setReadMore] = useState(false);
    const menuRef = useRef();
    const desc = useRef();
    const [currentDesc, setCurrentDesc] = useState(post?.desc);
    const [loaded, setLoaded] = useState(false);
    const [postLike, setPostLike] = useState();
    const liked = postLike?.length;
    const postLikeUser = postLike?.find((p) => p.liker === user.user_id); //Posts liked by me
    const [btnDisable, setBtnDisable] = useState(false);
    const [userFriends, setUserFriends] = useState([]);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Disable buttn after like clicked
    useEffect(() => {
        return () => setBtnDisable(false)
    }, []);

    //Get Post Users
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get("/users/" + post?.user_id);
            setPostUser(res.data);
        };
        fetchUser();
    }, [post]);

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

    //Delete function starts here
    const handleDelete = async () => {
        if (post?.user_id !== user.user_id) {
            console.log("Not your post")
        } else {
            try {
                await axiosInstance.delete("/posts/" + post.id, {
                    data: {
                        userId: user._id,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        }
    };

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
    /* useEffect(() => {
        const interval = setInterval(() => {
            const getLikes = async () => {
                try {
                    const like = await axiosInstance.get("/likes/" + post?.id);
                    //setLoading(true);
                    setPostLike(like.data);
                } catch (err) {
                    console.log(err);
                }
            };
            getLikes();
        }, 1000);
        return () => clearInterval(interval);
    }, [ignored, post?.id]); */

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

    //console.log(post)

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

    //Check if my user is following post user
    const followedUser = userFriends?.find((m) => m.followed === post?.user_id && m.follower === user.user_id);

    //Get all following
    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axiosInstance.get("/followers");
                //setLoading(true);
                setUserFriends(friendList.data);
            } catch (err) {
                console.log(err);
            }
        };
        getFriends();
    }, [ignored]);

    //Follow a user
    const handleFollow = async () => {
        const followUser = {
            follower: user.user_id,
            followed: post.user_id
        }
        try {
            await axiosInstance.post("/followers", followUser);
            //window.location.reload()
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
            //window.location.reload()
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
            //window.location.reload()
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
            //window.location.reload()
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

    return (
        <div className={`view_post_mobile ${loaded ? "loaded" : "loading"}`} src={""} data-src={PF + post?.img} onLoad={() => setLoaded(true)}>
            <div className="view_post_mobile_upper_container">
                <div className="post_img_container">
                    {
                        postUser?.map((p, id) =>
                            <div key={id}>
                                <Link to={`/profile/${p.user_id}`}>
                                    <img
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
                        )}
                </div>
                {
                    (!user.user_id || user.user_id === user.user_id) &&
                    <>
                        <div className="post_upper_right" onClick={() => setEditDropdown(prev => !prev)} ref={menuRef}>
                            <MoreVert />
                        </div>
                        <div className={`post_edit_dropdown ${editDropdown ? 'show_edit_dropdown' : 'hide_edit_dropdown'}`} ref={menuRef}>
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
                    </>
                }
            </div>
            {/* Post texts */}
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
            {/* Post foto*/}
            <div className="view_post_mobile_foto">
                {
                    posts?.length > 1 &&
                    <Link onClick={() => forceUpdate()} to={`/posts/${post?.user_id}/${getCurFotoPrev}`}>
                        <span className="slide_left">
                            <IoMdArrowDropleft />
                        </span>
                    </Link>
                }
                <img src={PF + post?.img} alt="" />
                {
                    posts?.length > 1 &&
                    <Link onClick={() => forceUpdate()} to={`/posts/${post?.user_id}/${getCurFotoNext}`}>
                        <span className="slide_right">
                            <IoMdArrowDropright />
                        </span>
                    </Link>
                }
            </div>
            <div className="post_bottom">
                <div className="post_bottom_left">
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
            {/* <Activity /> */}
        </div >
    )
}
