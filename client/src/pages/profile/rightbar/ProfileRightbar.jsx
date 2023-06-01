import "./profileRightbar.scss"
import axios from "axios";
import { useParams } from "react-router-dom";
import { useContext, useState, useEffect, useReducer, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import moment from 'moment';
import Followings from "./Followings";
import socketIOClient from "socket.io-client";

export default function ProfileRightbar() {
    const { user } = useContext(AuthContext);
    let isRendered = useRef(false);
    const user_id = useParams().user_id;
    const [userId, setUserId] = useState([]);
    const [friends, setFriends] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [arrivalFollower, setArrivalFollower] = useState();
    const socket = useRef();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Use socket oi to send and get texts instant
    useEffect(() => {
        socket.current = socketIOClient("http://localhost:4000/");
    }, []);

    //Take from socket
    useEffect(() => {
        const socket = socketIOClient("http://localhost:4000/");

        socket?.on("getFollowing", (data) => {
            setArrivalFollower({
                follower: data.followerId,
                followed: data.followedId,
            });
        });
    }, []);

    //Rerender likes when changes are made
    useEffect(() => {
        arrivalFollower &&
            user.user_id === arrivalFollower?.follower &&
            setUserFriends((prev) => [...prev, arrivalFollower]);
    }, [arrivalFollower, user]);

    //Get Visited Page Users
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/users/${user_id}`)
            .then(res => {
                if (isRendered) {
                    setUserId(res.data[0]);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user_id]);


    //Get my user followings
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/followers/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setFriends(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user, ignored]);

    //Get param user followed by me
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/followers/${user.user_id}/${user_id}`)
            .then(res => {
                if (isRendered) {
                    setUserFriends(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user, ignored]);

    //Follow a user
    const handleFollow = async () => {
        //Send message to socket.io
        socket.current.emit("sendFollowNotice", {
            followerId: user.user_id,
            followedId: user_id,
            activity: "followed you",
        });
        socket.current.emit("sendFollowing", {
            followerId: user.user_id,
            followedId: user_id,
        });
        const followUser = {
            follower: user.user_id,
            followed: userId.user_id,
            user_id: user.user_id
        }
        try {
            await axiosInstance.post("/followers", followUser);
        } catch (err) {
            console.log(err);
        }
        //Send notification
        const followUserNotice = {
            follower_id: user.user_id,
            followed_id: userId.user_id,
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
            followed_id: userId.user_id,
            activities: "followed you"
        }
        try {
            await axiosInstance.post("/follownotice/count", followCount);
        } catch (err) {
            console.log(err);
        }
    };

    //Unfollow a user
    const [followingUser, setFollowingUser] = useState();
    useEffect(() => {
        const followingUsr = userFriends?.find((f) => f.followed === user_id)
        setFollowingUser(followingUsr);
    }, [userFriends]);
    const handleUnfollow = async () => {
        try {
            await axiosInstance.delete(`/followers/${followingUser?.followed}`, {
                data: {
                    followed: followingUser?.followed
                }

            });
        } catch (err) {
            console.log(err);
        }
        forceUpdate();
    };

    //Remove my user from followed list
    const newFriends = friends?.filter((f) => f.followed !== user.user_id);

    //User's age calculator
    var todaysDate = moment(new Date());
    const duration = moment.duration(todaysDate?.diff(userId[0]?.dob));
    const userCurAge = duration._data.years;

    return (
        <div className="profile_rightbar_container">
            {
                (userId?.user_id !== user.user_id) &&
                <div className="followControl">
                    {followingUser ?
                        <button className="rightbarFollowButton" onClick={handleUnfollow}>
                            Unfollow
                            <Remove />
                        </button>
                        :
                        <button className="rightbarFollowButton" onClick={() => { handleFollow() }}>
                            Follow
                            <Add />
                        </button>
                    }
                </div>
            }
            <h4>User Information</h4>
            <div className="rightbarInfo">
                <div className="ProfileRightbarInfo">
                    <span className="ProfileRightbarInfoKey">Country:</span>
                    <span className="rightbarInfoValue">{userId?.country}</span>
                </div>
                <div className="ProfileRightbarInfo">
                    <span className="ProfileRightbarInfoKey">State:</span>
                    <span className="rightbarInfoValue">{userId?.state}</span>
                </div>
                <div className="ProfileRightbarInfo">
                    <span className="ProfileRightbarInfoKey">City:</span>
                    <span className="rightbarInfoValue">{userId?.city}</span>
                </div>
                <div className="ProfileRightbarInfo">
                    <span className="ProfileRightbarInfoKey">Gender:</span>
                    <span className="rightbarInfoValue">{userId?.gender}</span>
                </div>
                <div className="ProfileRightbarInfo">
                    <span className="ProfileRightbarInfoKey">Sexuality:</span>
                    <span className="rightbarInfoValue">{userId?.sexuality}</span>
                </div>
                <div className="ProfileRightbarInfo">
                    <span className="ProfileRightbarInfoKey">Interested in:</span>
                    <span className="rightbarInfoValue">{userId?.interest}</span>
                </div>
                <div className="ProfileRightbarInfo">
                    <span className="ProfileRightbarInfoKey">Relationship:</span>
                    <span className="rightbarInfoValue">{userId?.relationship}</span>
                </div>
                <div className="ProfileRightbarInfo">
                    <span className="ProfileRightbarInfoKey">Age:</span>
                    {
                        userCurAge > 0 &&
                        <span className="rightbarInfoValue">{userCurAge}</span>
                    }
                </div>
            </div>
            <div>
                {(!user.user_id || user.user_id === userId?.user_id) &&
                    <>
                        <h4>User friends</h4>
                        <div className="rightbarFollowings">
                            {
                                newFriends?.map((f, id) =>
                                    <Followings userFriends={f} key={id} />
                                )
                            }
                        </div>
                    </>
                }
            </div>
        </div>
    );
};