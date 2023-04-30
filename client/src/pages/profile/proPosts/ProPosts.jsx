import "./proPosts.scss";
import { format } from "timeago.js";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useEffect, useReducer, useState } from "react";
import { Delete, MoreVert } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { BsSuitHeart } from "react-icons/bs";
import HeartFilled from "../../../components/post/img/heartFilled.svg";
import { BiArrowBack } from "react-icons/bi";
import { useRef } from "react";
import axios from "axios";

export default function ProPosts({ post, user_id }) {
    const { user } = useContext(AuthContext);
    const [postUser, setPostUser] = useState();
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [postEditModal, setPostEditModal] = useState(false);
    const [editDropdown, setEditDropdown] = useState(false);
    const [readMore, setReadMore] = useState(false);
    const menuRef = useRef();
    const desc = useRef();
    const [currentDesc, setCurrentDesc] = useState(post.desc);
    const [loaded, setLoaded] = useState(false);
    const [postLike, setPostLike] = useState();
    const liked = postLike?.length;
    const postLikeUser = postLike?.find((p) => p.liker === user.user_id); //Posts liked by me
    const [btnDisable, setBtnDisable] = useState(false);
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

    //Click outside to close
    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            if (editDropdown && menuRef.current && !menuRef.current.contains(e.target)) {
                setEditDropdown(false);
            }
        };
        document.addEventListener("mousedown", checkIfClickedOutside);
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        }
    }, [editDropdown]);

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
                //window.location.reload()
            } catch (err) {
                console.log(err);
            }
        }
    };

    //Get post likes
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
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
                    setPostLike(like.data);
                } catch (err) {
                    console.log(err);
                }
            };
            getLikes();
        }, 1000);
        return () => clearInterval(interval);
    }, [ignored, post?.id, axiosInstance]); */

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
        forceUpdate();
    };

    useEffect(() => {
        if (btnDisable === true) {
            setTimeout(() => setBtnDisable({ btnDisable: false }), 2000);
        }
    }, [btnDisable]);

    //Unlike a post
    const UnlikePost = async () => {
        setBtnDisable(false);
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

    //Observer
    useEffect(() => {
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
        <div className={`proPosts ${loaded ? "loaded" : "loading"}`} src={""} data-src={PF + post.img} onLoad={() => setLoaded(true)}>
            <div className="proPosts_upper_container">
                <div className="proPosts_img_container">
                    {
                        postUser?.map((p, id) =>
                            <>
                                <img
                                    src={p.profilePicture ? PF + p.profilePicture :
                                        PF + "person/1658876240053sugarisland.jpeg"} alt="" key={id}
                                />
                                <span className="postUsername">{p.username}</span>
                            </>
                        )
                    }

                    <span className="post_Date">{format(post.date_time)}</span>
                </div>
                {
                    (!user_id || user_id === user.user_id) &&
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
            <div className="post_photos">
                <img src={PF + post.img} alt="" />
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
        </div>
    )
}
