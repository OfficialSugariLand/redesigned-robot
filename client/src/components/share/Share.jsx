import "./share.scss";
import axios from "axios";
import { PermMedia, EmojiEmotions, Cancel } from "@material-ui/icons";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import { useState } from "react";
import IosShareIcon from '@mui/icons-material/IosShare';

export default function Share({ forceUpdate }) {
    const { user } = useContext(AuthContext);
    let isRendered = useRef(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const desc = useRef();
    const ref = useRef();
    const [file, setFile] = useState(null);
    const [userFriends, setUserFriends] = useState([]);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Reset img
    const reset = () => {
        ref.current.value = "";
    };

    useEffect(() => {
        document.getElementById('submitfile').onclick = function () {
            setTimeout(() => {
                setFile(null)
                reset()
            }, 1500)
        }
    }, []);

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
    }, []);

    //Check if my user is following user
    const followedUser = userFriends?.find((m) => m.followed === user.user_id && m.follower === user.user_id);

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!followedUser) {
            const followUser = {
                follower: user.user_id,
                followed: user.user_id
            }
            try {
                await axiosInstance.post("/followers", followUser);
            } catch (err) {
                console.log(err);
            }
            const newPost = {
                user_id: user.user_id,
                desc: desc.current.value
            }
            if (file === null) {
                console.log("File is empty")
            } else {
                const data = new FormData();
                const fileName = Date.now() + "_" + user.username + "_sugarilandconnect.jpg";
                data.append("name", fileName);
                data.append("file", file);
                newPost.img = fileName;
                try {
                    await axiosInstance.post("/upload", data);
                } catch (err) {
                    console.log(err);
                }

                try {
                    await axiosInstance.post("/posts", newPost);
                } catch (err) { }
            }
        } else {
            const newPost = {
                user_id: user.user_id,
                desc: desc.current.value
            }
            if (file === null) {
                console.log("File is empty")
            } else {
                const data = new FormData();
                const fileName = Date.now() + "_" + user.username + "_shared_" + "_sugarilandconnect.jpg";
                data.append("name", fileName);
                data.append("file", file);
                newPost.img = fileName;
                try {
                    await axiosInstance.post("/upload", data);
                } catch (err) {
                    console.log(err);
                }

                try {
                    await axiosInstance.post("/posts", newPost);
                    //window.location.reload()
                } catch (err) { }
            }
        }
        forceUpdate();
    };

    //Auto resize textArea
    useEffect(() => {
        const textarea = document.querySelector("textarea");
        textarea?.addEventListener("keydown", e => {
            textarea.style.height = "auto";
            let scHeight = e.target.scrollHeight;
            textarea.style.height = `${scHeight}px`;
        });
    });

    return (
        <div className="share">
            <div className="share_Wrapper">
                <div className="shareTop">
                    <img src={user.profilePicture ? PF + user.profilePicture
                        : PF + "person/1658876240053sugarisland.jpeg"} alt=""
                    />
                    <textarea type="text" placeholder={"What are you feeling today " + user.username + "?"}
                        className="shareInput" ref={desc}
                    />
                </div>
                <hr className="shareHr" />
                {file && (
                    <div className="shareImgContainer">
                        <div className="shareCancelImgControl">
                            <Cancel onClick={() => setFile(null)} />
                        </div>
                        <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                    </div>
                )}
                <form className="shareBottom" onSubmit={submitHandler}>
                    <label htmlFor="file">
                        <PermMedia htmlColor="tomato" className="shareIcon" />
                        <span>Media</span>
                        <input style={{ display: "none" }} type={"file"} id="file"
                            accept=".png,.jpeg,.jpg,.mp4,.mp3,.mkv"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </label>
                    <div className="shareOptionFeelings">
                        <EmojiEmotions htmlColor="gold" className="shareIcon" />
                        <span>Feelings {/* When user click and select current feeling
                        it fetches people feeling same at the moment */}</span>
                    </div>
                    <button type="submit" id="submitfile" /* onClick={() => { reset() }} */>
                        <IosShareIcon />
                        <span> Share</span>
                    </button>
                </form>
            </div>
        </div>
    )
}
