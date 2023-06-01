import "./topbar.scss";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import sugarilandlogo from "./sugarilandlogo/sugarilandlogo.png";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { IoIosArrowDropdown } from "react-icons/io";
import { AiFillSetting, AiOutlineLogout } from "react-icons/ai";
import { SlInfo } from "react-icons/sl";
import { BsMessenger, BsFillBellFill, BsFillPeopleFill } from "react-icons/bs";
import { GoThreeBars } from "react-icons/go";
import { MdOutlineClose, MdOutlineContactMail, MdOutlineWbSunny } from "react-icons/md";
import { DarkModeContext } from "../../context/darkModeContext";
import Follownotice from "../notifications/follownotice/Follownotice";
import TextUsers from "../notifications/textUsers/TextUsers";
import Likenotice from "../notifications/likesnotice/Likenotice";
import socketIOClient from "socket.io-client";

export default function Topbar() {
    const { user } = useContext(AuthContext);
    let isRendered = useRef(false);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { toggle, darkMode } = useContext(DarkModeContext);
    const [allUsersFilters, setAllUsersFilters] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [usersMobSearch, setUsersMobSearch] = useState(false);
    const [text, setText] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [openDropDown, setOpenDropDown] = useState(false);
    const [mobDropdown, setMobDropdown] = useState(false);
    const dropMenuRef = useRef();
    const [followedDrop, setFollowedDrop] = useState(false);
    const [likeDrop, setLikeDrop] = useState(false);
    const [textOpen, setTextOpen] = useState(false);
    const menuRefOne = useRef();
    const menuRef = useRef();
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

    // Get all Users
    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersList = await axiosInstance.get("/users");
                setAllUsers(usersList.data);
            } catch (err) {
                console.log(err);
            }
        };
        getUsers();
    }, []);

    /* https://www.youtube.com/watch?v=Q2aky3eeO40  {React autocomplete search from API} */
    const onSuggestHandler = (text) => {
        setText(text);
        setSuggestions([]);
    }
    const onChangeHandler = (text) => {
        let matches = []
        if (text.length > 0) {
            matches = allUsers.filter(user => {
                const regex = new RegExp(`${text}`, "gi");
                return user.username.match(regex);
            })
        }
        setSuggestions(matches);
        setText(text);
    }

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

    //console.log(userFollowed)

    // Get followed count
    useEffect(() => {
        const fetchFollowedCount = async () => {
            const res = await axiosInstance.get(`/follownotice/count/${user.user_id}`);
            setUserFollowedCount(res.data);
        };
        fetchFollowedCount();
    }, [user, ignored]);

    // Get likes notifications
    useEffect(() => {
        const fetchLikesNotice = async () => {
            const res = await axiosInstance.get(`/likenotice/${user.user_id}`);
            setLikesNotice(res.data.sort((p1, p2) => {
                return new Date(p2.date_time) - new Date(p1.date_time);
            })
            );
        };
        fetchLikesNotice();
    }, [user]);

    // Get likes count
    useEffect(() => {
        const fetchLikesCount = async () => {
            const res = await axiosInstance.get(`/likenotice/count/${user.user_id}`);
            setlikesCount(res.data);
        };
        fetchLikesCount();
    }, [user.user_id, ignored]);

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

    //Click outside to close
    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            if (openDropDown && dropMenuRef.current && !dropMenuRef.current.contains(e.target)) {
                setOpenDropDown(false);
            }
        };
        document.addEventListener("mousedown", checkIfClickedOutside);
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        }
    }, [openDropDown]);

    //Set body scroll to hidden when modal is open
    useEffect(() => {
        const fixedBody = () => {
            if (followedDrop === true) {
                document.body.style = "overflow hidden !important";
            } else {
                document.body.style = "overflow scroll !important";
            }
        };
        fixedBody();
    }, [followedDrop])

    useEffect(() => {
        const fixedBodyTwo = () => {
            if (likeDrop === true) {
                document.body.style = "overflow hidden !important";
            } else {
                document.body.style = "overflow scroll !important";
            }
        };
        fixedBodyTwo();
    }, [likeDrop])

    //Logout
    const handleLogout = async () => {
        localStorage.clear();
        window.location.reload();
    };

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

    return (
        <div className="topbar_Container">
            <div className="topbar_sugarlogo">
                <Link to="/" >
                    <img src={sugarilandlogo} alt="" />
                </Link>
            </div>
            <div className="dark_mode">
                {
                    darkMode ? <MdOutlineWbSunny onClick={toggle} /> : <DarkModeOutlinedIcon onClick={toggle} />
                }
            </div>
            <div className="search_topbar">
                <BsSearch />
                <input placeholder="Search for friends" onChange={(e) => onChangeHandler(e.target.value)} value={text}
                    onClick={() => setAllUsersFilters(!allUsersFilters)} />
                {allUsersFilters &&
                    <div className="search_users_filter">
                        {
                            suggestions && suggestions?.map(({ username, user_id, id, profilePicture }) =>
                                <Link to={"/profile/" + user_id} key={id}>
                                    <div className="auto_complete" key={id} onClick={() => onSuggestHandler(username)}>
                                        <img src={profilePicture ? PF + profilePicture : PF +
                                            "person/1658876240053sugarisland.jpeg"} alt="" />
                                        {username}
                                    </div>
                                </Link>)
                        }
                    </div>
                }
            </div>
            <div className="small_mob_search_icons">
                <BsSearch onClick={() => setUsersMobSearch(prev => !prev)} />
                {usersMobSearch &&
                    <div className="search_mob_topbar">
                        <input placeholder="Search for friends" onChange={(e) => onChangeHandler(e.target.value)} value={text} />
                        <div className="search_users_filter">
                            {
                                suggestions && suggestions.map(({ username, user_id, id, profilePicture }) =>
                                    <Link to={"/profile/" + user_id} key={id}>
                                        <div className="auto_complete" key={id} onClick={() => onSuggestHandler(username)}>
                                            <img src={profilePicture ? PF + profilePicture : PF +
                                                "person/1658876240053sugarisland.jpeg"} alt="" />
                                            {username}
                                        </div>
                                    </Link>)
                            }
                        </div>
                    </div>
                }
            </div>
            <div className="find_sugars_container">
                <Link to="/sugars">
                    <span>Find Sugar</span>
                </Link>
            </div>
            <div className="topbar_Right">
                {/* Follow notifications */}
                <div className="topbar_right_icons" onClick={() => { setFollowedDrop(prev => !prev); forceUpdate() }}
                    ref={menuRefOne}
                >
                    <BsFillPeopleFill />
                    {
                        newUserFollowedCount.length > 0 &&
                        <span className="topbar_icon_badge ">{newUserFollowedCount.length}</span>
                    }
                </div>
                <div className={`topbar_follow_notify ${followedDrop ? "show_follow_notify" : "hide_follow_notify"}`}>
                    {
                        newUserFollowed?.map((data, index) =>
                            <Follownotice followers={data} key={index} />
                        )

                    }
                </div>
                {/* Likes notifications */}
                <div className="topbar_right_icons" onClick={() => { setLikeDrop(prev => !prev) }} ref={menuRef}>
                    <BsFillBellFill />
                    {
                        newLikesCount.length > 0 &&
                        <span className="topbar_icon_badge ">{newLikesCount.length}</span>
                    }
                </div>
                <div className={`topbar_notify ${likeDrop ? "show_notify" : "hide_notify"}`}>
                    {
                        newLikesOne?.map((data, index) =>
                            <Likenotice likes={data} key={index} />
                        )
                    }
                </div>
                {/* Messenger */}
                <div className="topbar_right_icons">
                    <BsMessenger onClick={() => setTextOpen(prev => !prev)} />
                    {
                        textNoticeCount?.length > 0 &&
                        <span className="topbar_icon_badge ">{textNoticeCount?.length}</span>
                    }
                </div>
                <div className={`${textOpen ? "show_textOpen" : "hide_textOpen"} `}>
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
            {/* Mobile dropdown control */}
            <button className="mob_menu_icon" onClick={() => setMobDropdown(prev => !prev)}>
                {
                    mobDropdown ? <MdOutlineClose /> : <GoThreeBars />
                }
            </button>
            <div className={`topbar_links ${mobDropdown ? 'show_mob_dropdown' : 'hide_mob_dropdown'}`}>
                <li className="mob_dropdown_itms">
                    <Link to={`/profile/${user.user_id}`}>
                        <img src={user.profilePicture
                            ? PF + user.profilePicture : PF + "person/1658876240053sugarisland.jpeg"} alt=""
                        />
                        <span>{user.username}</span>
                    </Link>
                </li>
                <li>
                    <Link to="/">
                        <div className="mob_svg_class">
                            <SlInfo />
                        </div>
                        <span>Home</span>
                    </Link>
                </li>
                <li className="about_section">
                    <Link to="/about" >
                        <div className="mob_svg_class">
                            <SlInfo />
                        </div>
                        <span>About</span>
                    </Link>
                </li>
                <li className="setting_section">
                    <Link to="/settings">
                        <div className="mob_svg_class">
                            <AiFillSetting />
                        </div>
                        <span>Settings</span>
                    </Link>
                </li>
                <li>
                    <Link to="/contact" >
                        <div className="mob_svg_class">
                            <MdOutlineContactMail />
                        </div>
                        <span>Contact</span>
                    </Link>
                </li>
                <li className="mob_logout_btn">
                    <button type="submit" onClick={handleLogout}>
                        <Link to="/">

                            <div className="mob_svg_class">
                                <AiOutlineLogout />
                            </div>
                            <span>Log Out</span>

                        </Link>
                    </button>
                </li>
            </div>
            {/* Windows dropdown control */}
            <div className="window_dropdown" onClick={() => setOpenDropDown(prev => !prev)} ref={dropMenuRef}>
                <img src={user.profilePicture ? PF + user.profilePicture :
                    PF + "person/1658876240053sugarisland.jpeg"} alt=""
                />
                <IoIosArrowDropdown className="arrow_drop_down_svg" />
                {openDropDown && (
                    <ul>
                        <li className="profile_images_section">
                            <Link to={`/profile/${user.user_id}`}>
                                <img src={user.profilePicture
                                    ? PF + user.profilePicture : PF + "person/1658876240053sugarisland.jpeg"} alt=""
                                />
                                <span>{user.username}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="settings">
                                <div className="svg_class">
                                    <AiFillSetting />
                                </div>
                                <span>Settings</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="contact" >
                                <div className="svg_class">
                                    <MdOutlineContactMail />
                                </div>
                                <span>Contact Us</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="about" >
                                <div className="svg_class">
                                    <SlInfo />
                                </div>
                                <span>About Us</span>
                            </Link>
                        </li>
                        <li>
                            <button className="window_logout_btn" type="submit" onClick={handleLogout}>
                                <Link to="/">
                                    <div className="svg_class">
                                        <AiOutlineLogout />
                                    </div>
                                    <span>Log Out</span>
                                </Link>
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
}