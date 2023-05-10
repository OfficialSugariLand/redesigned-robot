import "./profileRightbar.scss"
import axios from "axios";
import { useParams } from "react-router-dom";
import { useContext, useState, useEffect, useReducer, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import moment from 'moment';
import Followings from "./Followings";
import { io } from "socket.io-client";

export default function ProfileRightbar() {
    const { user } = useContext(AuthContext);
    let isRendered = useRef(false);
    const user_id = useParams().user_id;
    const [userId, setUserId] = useState([]);
    const [friends, setFriends] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [btnDisable, setBtnDisable] = useState(false);
    const socket = useRef();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    useEffect(() => {
        socket.current = io("ws://localhost:4000");
    }, []);

    //Get Visited Page Users
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/users/${user_id}`)
            .then(res => {
                if (isRendered) {
                    setUserId(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user_id]);

    //Get all param users following
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/followers/${user_id}`)
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
    }, [user_id, ignored]);

    //Get all following
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/followers`)
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
    }, [ignored]);

    const curProfileUser = userId?.find((m) => m);   //visited page user
    //Check if my user is following current profile user
    const followedUser = userFriends?.find((m) => m.followed === curProfileUser?.user_id && m.follower === user.user_id);

    //Follow a user
    const handleFollow = async () => {
        //Send message to socket.io
        socket.current.emit("sendNotification", {
            followerId: user.user_id,
            followedId: curProfileUser?.user_id,
            activity: "followed you",
        });
        const followUser = {
            follower: user.user_id,
            followed: curProfileUser.user_id,
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
            followed_id: curProfileUser.user_id,
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
            followed_id: curProfileUser.user_id,
            activities: "followed you"
        }
        try {
            await axiosInstance.post("/follownotice/count", followCount);
        } catch (err) {
            console.log(err);
        }
        setBtnDisable(true);
        setTimeout(() => {
            setBtnDisable(false);
            forceUpdate();
        }, 2000)
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

    //Remove my user from followed list
    const newFriends = friends?.filter((f) => f.followed !== user.user_id);

    //User's age calculator
    var todaysDate = moment(new Date());
    const duration = moment.duration(todaysDate?.diff(userId[0]?.dob));
    const userCurAge = duration._data.years;

    return (
        <div className="profile_rightbar_container">
            {
                (!curProfileUser?.user_id || curProfileUser?.user_id !== user.user_id) &&
                <div className="followControl">
                    {
                        followedUser ?
                            <button className="rightbarFollowButton" onClick={handleUnfollow}>
                                Unfollow
                                <Remove />
                            </button>
                            :
                            <button disabled={btnDisable === true} className="rightbarFollowButton" onClick={() => { handleFollow() }}>
                                Follow
                                <Add />
                            </button>
                    }
                </div>
            }
            <h4>User Information</h4>
            <div className="rightbarInfo">
                {
                    userId?.map((userInfo, id) =>
                        <div key={id}>
                            <div className="ProfileRightbarInfo">
                                <span className="ProfileRightbarInfoKey">Country:</span>
                                <span className="rightbarInfoValue">{userInfo?.country}</span>
                            </div>
                            <div className="ProfileRightbarInfo">
                                <span className="ProfileRightbarInfoKey">State:</span>
                                <span className="rightbarInfoValue">{userInfo?.state}</span>
                            </div>
                            <div className="ProfileRightbarInfo">
                                <span className="ProfileRightbarInfoKey">City:</span>
                                <span className="rightbarInfoValue">{userInfo?.city}</span>
                            </div>
                            <div className="ProfileRightbarInfo">
                                <span className="ProfileRightbarInfoKey">Gender:</span>
                                <span className="rightbarInfoValue">{userInfo?.gender}</span>
                            </div>
                            <div className="ProfileRightbarInfo">
                                <span className="ProfileRightbarInfoKey">Sexuality:</span>
                                <span className="rightbarInfoValue">{userInfo?.sexuality}</span>
                            </div>
                            <div className="ProfileRightbarInfo">
                                <span className="ProfileRightbarInfoKey">Interested in:</span>
                                <span className="rightbarInfoValue">{userInfo?.interest}</span>
                            </div>
                            <div className="ProfileRightbarInfo">
                                <span className="ProfileRightbarInfoKey">Relationship:</span>
                                <span className="rightbarInfoValue">{userInfo?.relationship}</span>
                            </div>
                            <div className="ProfileRightbarInfo">
                                <span className="ProfileRightbarInfoKey">Age:</span>
                                {
                                    userCurAge > 0 &&
                                    <span className="rightbarInfoValue">{userCurAge}</span>
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <div>
                {(!user.user_id || user.user_id === curProfileUser?.user_id) &&
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

