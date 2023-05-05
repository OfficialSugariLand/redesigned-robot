import "./activity.scss"
import { Link } from "react-router-dom";
import { BsMessenger, BsFillBellFill, BsFillPeopleFill } from "react-icons/bs";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
//import Followed from "../notifications/follownotice/Follownotice";
import Likenotice from "../notifications/likesnotice/Likenotice";
import Follownotice from "../notifications/follownotice/Follownotice";
import TextUsers from "../topbar/textUsers/TextUsers";

export default function Activity() {
    const { user } = useContext(AuthContext);
    let isRendered = useRef(false);
    const [textOpen, setTextOpen] = useState(false);
    const [userFollowed, setUserFollowed] = useState([]);
    const [followedDrop, setFollowedDrop] = useState(false);
    const [likeDrop, setLikeDrop] = useState(false);
    const [userFollowedTwo, setUserFollowedTwo] = useState([]);
    const [newFollowedOne, setNewFollowedOne] = useState([]);
    const [newFollowedTwo, setNewFollowedTwo] = useState([]);
    const [likesNoticeOne, setlikesNoticeOne] = useState([]);
    const [likesNoticeTwo, setlikesNoticeTwo] = useState([]);
    const [newLikesOne, setNewLikesOne] = useState([]);
    const [newLikesTwo, setNewLikesTwo] = useState([]);
    const [textNotifications, setTextNotifications] = useState();
    const menuRefOne = useRef();
    const menuRef = useRef();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

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
    }, [user]);

    /* useEffect(() => {
        const fetchFollowed = async () => {
            const res = await axiosInstance.get(`/follownotice/${user.user_id}`);
            setUserFollowed(res.data.sort((p1, p2) => {
                return new Date(p2.date_time) - new Date(p1.date_time);
            })
            );
        };
        fetchFollowed();
    }, [user]); */

    // Get followed count
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/follownotice/count/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setUserFollowedTwo(res.data.sort((p1, p2) => {
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
    /* useEffect(() => {
        const fetchFollowedCount = async () => {
            const res = await axiosInstance.get(`/follownotice/count/${user.user_id}`);
            setUserFollowedTwo(res.data);
        };
        fetchFollowedCount();
    }, [user]); */

    // Get likes notifications
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/likenotice/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setlikesNoticeOne(res.data.sort((p1, p2) => {
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

    /* useEffect(() => {
        const fetchLikesNotice = async () => {
            const res = await axiosInstance.get(`/likenotice/${user.user_id}`);
            setlikesNoticeOne(res.data.sort((p1, p2) => {
                return new Date(p2.date_time) - new Date(p1.date_time);
            })
            );
        };
        fetchLikesNotice();
    }, [user]); */

    // Get likes count
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/likenotice/count/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setlikesNoticeTwo(res.data.sort((p1, p2) => {
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

    /* useEffect(() => {
        const fetchLikesNotice = async () => {
            const res = await axiosInstance.get(`/likenotice/${user.user_id}`);
            setlikesNoticeOne(res.data.sort((p1, p2) => {
                return new Date(p2.date_time) - new Date(p1.date_time);
            })
            );
        };
        fetchLikesNotice();
    }, [user]); */

    //Filter followed users to only friends
    useEffect(() => {
        const newFollowedUser = userFollowed?.filter((f) => f.follower_id !== user.user_id);
        setNewFollowedOne(newFollowedUser);
    }, [user]);
    useEffect(() => {
        const newFollowedUser = userFollowedTwo?.filter((f) => f.follower_id !== user.user_id);
        setNewFollowedTwo(newFollowedUser);
    }, [user]);

    //Filter likes users to only friends
    useEffect(() => {
        const newActivityUser = likesNoticeOne.filter((f) => f.sender_id !== user.user_id);
        setNewLikesOne(newActivityUser);
    }, [likesNoticeOne, user.user_id]);
    useEffect(() => {
        const newActivityUser = likesNoticeTwo.filter((f) => f.sender_id !== user.user_id);
        setNewLikesTwo(newActivityUser);
    }, [likesNoticeTwo, user]);


    //Text notification
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/messenger/textnotification/${user.user_id}`)
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
    }, [user]);

    /* useEffect(() => {
        const getTextNotification = async () => {
            try {
                const res = await axiosInstance.get("/messenger/textnotification/" + user.user_id);
                setTextNotifications(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getTextNotification();
    }, [user]); */

    //Set body scroll to hidden when modal is open
    useEffect(() => {
        const fixedBody = () => {
            if (followedDrop === true) {
                document.body.style = "position: fixed !important";
            } else {
                document.body.style = "position: initial !important";
            }
        };
        fixedBody();
    })

    useEffect(() => {
        const fixedBodyTwo = () => {
            if (likeDrop === true) {
                document.body.style = "position: fixed !important";
            } else {
                document.body.style = "position: initial !important";
            }
        };
        fixedBodyTwo();
    }, [likeDrop])


    return (
        <div className="footer_activities">
            <div className="footer_right">
                {/* Follow notifications */}
                <div className="topbar_right_icons" onClick={() => { setFollowedDrop(prev => !prev) }} ref={menuRefOne}>
                    <BsFillPeopleFill />
                    {
                        newFollowedOne.length > 0 &&
                        <span className="topbar_icon_badge ">{newFollowedOne.length}</span>
                    }
                </div>
                <div className={`footer_follow_notify ${followedDrop ? "show_follow_notify" : "hide_follow_notify"}`}>
                    {
                        newFollowedOne.length > 0 ?
                            newFollowedOne?.map((data, index) =>
                                <Follownotice followCount={data} key={index} followedDrop={followedDrop} user={user} />
                            )
                            :
                            newFollowedTwo?.map((data, index) =>
                                <Follownotice followCount={data} key={index} followedDrop={followedDrop} />
                            )
                    }
                </div>
                {/* Likes notifications */}
                <div className="topbar_right_icons" onClick={() => { setLikeDrop(prev => !prev) }} ref={menuRef}>
                    <BsFillBellFill />
                    {
                        newLikesOne.length > 0 &&
                        <span className="topbar_icon_badge ">{likesNoticeOne.length}</span>
                    }
                </div>
                <div className={`footer_like_notify ${likeDrop ? "show_notify" : "hide_notify"}`}>
                    {newLikesOne.length > 0 ?
                        newLikesOne?.map((data, index) =>
                            <Likenotice likeCount={data} key={index} likeDrop={likeDrop} />
                        )
                        :
                        newLikesTwo?.map((data, index) =>
                            <Likenotice likeCount={data} key={index} likeDrop={likeDrop} />
                        )
                    }
                </div>
                {/* Messenger */}
                <div className="topbar_right_icons">
                    <BsMessenger onClick={() => setTextOpen(prev => !prev)} />
                    {
                        textNotifications?.length > 0 &&
                        <span className="topbar_icon_badge ">{textNotifications?.length}</span>
                    }
                </div>
                <div className={`footer_text_notify ${textOpen ? "show_textOpen" : "hide_textOpen"} `}>
                    <div className="textOpen_container">
                        <div className="textOpen_up">
                            {
                                textNotifications?.map((t, id) =>
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
    )
}
