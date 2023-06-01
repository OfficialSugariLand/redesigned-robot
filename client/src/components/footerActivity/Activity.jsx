import "./activity.scss";
import { Link } from "react-router-dom";
import { BsMessenger, BsFillBellFill, BsFillPeopleFill } from "react-icons/bs";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Likenotice from "../notifications/likesnotice/Likenotice";
import Follownotice from "../notifications/follownotice/Follownotice";
import TextUsers from "../notifications/textUsers/TextUsers";
import socketIOClient from "socket.io-client";

export default function Activity() {
    const { user } = useContext(AuthContext);
    let isRendered = useRef(false);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [followedDrop, setFollowedDrop] = useState(false);
    const [likeDrop, setLikeDrop] = useState(false);
    const [textOpen, setTextOpen] = useState(false);
    const [userFollowed, setUserFollowed] = useState([]);
    const [userFollowedCount, setUserFollowedCount] = useState([]);
    const [newUserFollowed, setNewUserFollowed] = useState([]);
    const [newUserFollowedCount, setNewUserFollowedCount] = useState([]);
    const [likesNotice, setLikesNotice] = useState([]);
    const [likesCount, setlikesCount] = useState([]);
    const [newLikesOne, setNewLikesOne] = useState([]);
    const [newLikesCount, setNewLikesCount] = useState([]);
    const [arrivalFollowers, setArrivalFollowers] = useState();
    const [arrivalLikes, setArrivalLikes] = useState();
    const [textNotifications, setTextNotifications] = useState();
    const [textNoticeCount, setTextNoticeCount] = useState();
    const [arrivalTextNotice, setArrivalTextNotice] = useState();
    const [arrTxtNoticeCount, setArrTxtNoticeCount] = useState();
    const menuRef = useRef();
    const menuRefLike = useRef();
    const menuRefText = useRef();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });


    //Use socket oi to send and get texts instant
    useEffect(() => {
        const socket = socketIOClient("http://localhost:4000/");

        //Get likes
        socket?.on("getLikes", (data) => {
            setArrivalLikes({
                sender_id: data.senderId,
                receiver_id: data.receiverId,
                post_id: data.postId,
                activities: data.activity,
                date_time: Date.now(),
            });
        });
        //Get followings
        socket?.on("getFollowNotice", (data) => {
            setArrivalFollowers({
                follower_id: data.followerId,
                followed_id: data.followedId,
                activities: data.activity,
                date_time: Date.now(),
            });
        });

        //Get text notification
        socket?.on("getTextNoticeCount", (data) => {
            setArrTxtNoticeCount({
                sender_id: data.sender_id,
                receiver_id: data.receiver_id,
            });
        });
        //Get text notification
        socket?.on("getTextNotice", (data) => {
            setArrivalTextNotice({
                sender_id: data.sender_id,
                receiver_id: data.receiver_id,
                text: data.text,
                date_time: Date.now(),
            });
        });
    }, []);

    //Real time socket followers count notification
    useEffect(() => {
        arrivalFollowers &&
            user.user_id === arrivalFollowers?.followed_id &&
            setUserFollowedCount((prev) => [...prev, arrivalFollowers]);
    }, [arrivalFollowers, user]);
    //Real time socket followers users
    useEffect(() => {
        arrivalFollowers &&
            user.user_id === arrivalFollowers?.followed_id &&
            setUserFollowed((prev) => [arrivalFollowers, ...prev]);
    }, [arrivalFollowers, user]);

    //Real time socket likes count notification
    useEffect(() => {
        arrivalLikes &&
            user.user_id === arrivalLikes?.receiver_id &&
            setlikesCount((prev) => [...prev, arrivalLikes]);
    }, [arrivalLikes, user]);
    //Real time socket likes users
    useEffect(() => {
        arrivalLikes &&
            user.user_id === arrivalLikes?.receiver_id &&
            setLikesNotice((prev) => [arrivalLikes, ...prev]);
    }, [arrivalLikes, user]);

    //Real time socket text count
    useEffect(() => {
        arrTxtNoticeCount &&
            user.user_id === arrTxtNoticeCount?.receiver_id &&
            setTextNoticeCount((prev) => [arrTxtNoticeCount, ...prev]);
    }, [arrTxtNoticeCount, user]);
    //Real time socket text users
    useEffect(() => {
        arrivalTextNotice &&
            user.user_id === arrivalTextNotice?.receiver_id &&
            setTextNotifications((prev) => [arrivalTextNotice, ...prev]);
    }, [arrivalTextNotice, user]);

    // Get followed notifications
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/follownotice/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setUserFollowed(res.data.sort((p1, p2) => {
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
    }, [user, ignored]);


    // Get followed count
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/follownotice/count/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setUserFollowedCount(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user, ignored]);

    // Get likes notifications
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/likenotice/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setLikesNotice(res.data.sort((p1, p2) => {
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
    }, [user]);

    // Get likes count
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/likenotice/count/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setlikesCount(res.data.sort((p1, p2) => {
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
    }, [user, ignored]);

    //Filter followed users to only friends
    useEffect(() => {
        const newFollowedUser = userFollowed?.filter((f) => f.follower_id !== user.user_id);
        setNewUserFollowed(newFollowedUser);
    }, [userFollowed, user.user_id]);
    useEffect(() => {
        const newFollowedUser = userFollowedCount?.filter((f) => f.follower_id !== user.user_id);
        setNewUserFollowedCount(newFollowedUser);
    }, [userFollowedCount, user.user_id]);

    //Filter likes users to only friends
    useEffect(() => {
        const newActivityUser = likesNotice.filter((f) => f.sender_id !== user.user_id);
        setNewLikesOne(newActivityUser);
    }, [likesNotice, user.user_id]);
    useEffect(() => {
        const newActivityUser = likesCount.filter((f) => f.sender_id !== user.user_id);
        setNewLikesCount(newActivityUser);
    }, [likesCount, user.user_id]);


    //Text notification
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/textnotice/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setTextNotifications(res.data.sort((p1, p2) => {
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
    }, [user, ignored]);

    //Remove text notice duplicates
    const [newTextUsers, setNewTextUsers] = useState();
    useEffect(() => {
        const newTxtUsers = textNotifications?.filter((ele, ind) =>
            ind === textNotifications?.findIndex(elem => elem.sender_id === ele.sender_id &&
                elem.receiver_id === ele.receiver_id));
        setNewTextUsers(newTxtUsers);
    }, [textNotifications])

    //console.log(newTextUsers)

    //Text notification counts
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/textnotice/count/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setTextNoticeCount(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user, ignored]);


    // delete followed count
    useEffect(() => {
        setTimeout(() => {
            if (followedDrop === true) {
                const deleteNotification = async () => {
                    try {
                        await axiosInstance.delete(`/follownotice/count/${user.user_id}`, {
                            data: {
                                followed_id: user.user_id,
                            },
                        });
                    } catch (err) {
                        console.log(err);
                    }
                }
                deleteNotification();
                forceUpdate();
            }
        }, 500);
    }, [followedDrop, user.user_id]);

    // delete likes count
    useEffect(() => {
        setTimeout(() => {
            if (likeDrop === true) {
                const deleteNotification = async () => {
                    try {
                        await axiosInstance.delete(`/likenotice/count/${user.user_id}`, {
                            data: {
                                user_id: user.user_id,
                            },
                        });
                    } catch (err) {
                        console.log(err);
                    }
                }
                deleteNotification();
                forceUpdate();
            }
        }, 500);

    }, [likeDrop, user.user_id]);

    // delete followed count
    useEffect(() => {
        setTimeout(() => {
            if (textOpen === true) {
                const deleteNotification = async () => {
                    try {
                        await axiosInstance.delete(`/textnotice/count/${user.user_id}`, {
                            data: {
                                receiver_id: user.user_id,
                            },
                        });
                    } catch (err) {
                        console.log(err);
                    }
                }
                deleteNotification();
                forceUpdate();
            }
        }, 500);
    }, [textOpen, user.user_id]);


    //Set body scroll to hidden when modal is open
    useEffect(() => {
        const fixedBody = () => {
            if (followedDrop === true) {
                document.body.style = "overflow: hidden !important";
            } else {
                document.body.style = "overflow: scroll !important";
            }
        };
        fixedBody();
    }, [followedDrop])

    useEffect(() => {
        const fixedBodyTwo = () => {
            if (likeDrop === true) {
                document.body.style = "overflow: hidden !important";
            } else {
                document.body.style = "overflow: scroll !important";
            }
        };
        fixedBodyTwo();
    }, [likeDrop])

    useEffect(() => {
        const fixedBodyThree = () => {
            if (textOpen === true) {
                document.body.style = "overflow: hidden !important";
            } else {
                document.body.style = "overflow: scroll !important";
            }
        };
        fixedBodyThree();
    }, [textOpen])


    //Click outside to close
    useEffect(() => {
        let handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setFollowedDrop(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });

    useEffect(() => {
        let handler = (e) => {
            if (!menuRefLike.current.contains(e.target)) {
                setLikeDrop(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });
    useEffect(() => {
        let handler = (e) => {
            if (!menuRefText.current.contains(e.target)) {
                setTextOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });

    return (
        <div className="footer_activities">
            <div className="footer_container">
                {/* Follow notifications */}
                <div className="topbar_right_icons" ref={menuRef}>
                    <div onClick={() => { setFollowedDrop(prev => !prev) }}>
                        <BsFillPeopleFill />
                    </div>
                    {
                        newUserFollowedCount.length > 0 &&
                        <span className="topbar_icon_badge ">{newUserFollowedCount.length}</span>
                    }
                    <div className={`footer_follow_notify ${followedDrop ? "show_follow_notify" : "hide_follow_notify"}`}>
                        {
                            newUserFollowed?.map((data, index) =>
                                <Follownotice followers={data} key={index} />
                            )
                        }
                    </div>
                </div>
                {/* Likes notifications */}
                <div className="topbar_right_icons" ref={menuRefLike}>
                    <div onClick={() => { setLikeDrop(prev => !prev) }}>
                        <BsFillBellFill />
                    </div>
                    {
                        newLikesCount.length > 0 &&
                        <span className="topbar_icon_badge ">{newLikesCount.length}</span>
                    }

                    <div className={`footer_like_notify ${likeDrop ? "show_like_notify" : "hide_like_notify"}`}>
                        {
                            newLikesOne?.map((data, index) =>
                                <Likenotice likes={data} key={index} />
                            )
                        }
                    </div>
                </div>
                {/* Messenger */}
                <div className="topbar_right_icons" ref={menuRefText}>
                    <div onClick={() => setTextOpen(prev => !prev)}>
                        <BsMessenger />
                    </div>
                    {
                        textNoticeCount?.length > 0 &&
                        <span className="topbar_icon_badge ">{textNoticeCount?.length}</span>
                    }

                    <div className={`footer_text_notify ${textOpen ? "show_text_notify" : "hide_text_notify"} `}>
                        <div className="textOpen_container">
                            <div className="textOpen_up">
                                {
                                    newTextUsers?.map((t, id) =>
                                        <TextUsers textUser={t} key={id} />
                                    )
                                }
                            </div>
                            <div className="textOpen_down">
                                <Link to={"/textbox"}>
                                    <span>Go to inbox</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
