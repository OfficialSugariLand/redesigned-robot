import "./input.scss";
import axios from "axios";
//import { IoMdAttach } from "react-icons/io";
import { BiImageAdd } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function Input({ ownUser, friendUser, conversation, ignored, forceUpdate }) {
    const [file, setFile] = useState(null);
    const ref = useRef();
    const socket = useRef();
    const [textM, setTextM] = useState("");
    const youAndMe = friendUser + ownUser.user_id;
    const meAndYou = ownUser.user_id + friendUser;
    const conIdExist = conversation?.find((c) => c?.conversation_id === youAndMe);
    const [unreadText, setUnreadtText] = useState();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    useEffect(() => {
        socket.current = io("http://localhost:4000");
    }, []);

    //console.log(file)
    //Get unread texts
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get(`/unreadtexts/${ownUser.user_id}/${friendUser}`);
            setUnreadtText(res.data[0]);
        };
        fetchUser();
    }, [ownUser, friendUser, ignored]);

    //Reset img
    const reset = () => {
        ref.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!conIdExist) {
            const data = new FormData();
            const fileName = Date.now() + "_" + ownUser.username + "_sugarilandconnect.jpg";
            data.append("name", fileName);
            data.append("file", file);

            //Create conversation id
            const conIdCreateOne = {
                conversation_id: youAndMe,
                user_id: ownUser.user_id,
                user_two: friendUser,
                last_text: textM
            }
            try {
                await axiosInstance.post("/conversations", conIdCreateOne);
            } catch (err) {
                console.log(err);
            }
            const conIdCreateTwo = {
                conversation_id: meAndYou,
                user_id: friendUser,
                user_two: ownUser.user_id,
                last_text: textM
            }
            try {
                await axiosInstance.post("/conversations", conIdCreateTwo);
            } catch (err) {
                console.log(err);
            }
            //Send message to socket.io
            socket.current.emit("sendMessage", {
                senderId: ownUser.user_id,
                receiverId: friendUser,
                text: textM,
                img: fileName,
                conversationId: ownUser.user_id + friendUser
            });
            //Send conversaion to socket.io
            socket.current.emit("sendConversation", {
                senderId: ownUser.user_id,
                receiverId: friendUser,
                text: textM,
            });
            const values = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                img: fileName,
                conversation_id: ownUser.user_id + friendUser
            }
            try {
                await axiosInstance.post("/messenger", values);
                setTextM("")
            } catch (err) {
                console.log(err);
            }
            const valuesTwo = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                img: fileName,
                conversation_id: friendUser + ownUser.user_id
            }
            try {
                await axiosInstance.post("/messenger", valuesTwo);
                setTextM("")
            } catch (err) {
                console.log(err);
            }
            const valuesUnread = {
                receiver_id: ownUser.user_id,
                sender_id: friendUser,
            }
            try {
                await axiosInstance.post("/unreadtexts", valuesUnread);
                setTextM("")
            } catch (err) {
                console.log(err);
            }
            try {
                await axiosInstance.post("/upload", data);
            } catch (err) {
                console.log(err);
            }
        } else {
            //File
            const data = new FormData();
            const fileName = Date.now() + "_" + ownUser.username + "_sugarilandconnect.jpg";
            data.append("name", fileName);
            data.append("file", file);

            //Send message to socket.io
            socket.current.emit("sendMessage", {
                senderId: ownUser.user_id,
                receiverId: friendUser,
                text: textM,
                img: fileName,
                conversationId: ownUser.user_id + friendUser
            });
            //Send conversaion to socket.io
            socket.current.emit("sendConversation", {
                senderId: ownUser.user_id,
                receiverId: friendUser,
                text: textM,
            });
            const values = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                img: fileName,
                conversation_id: ownUser.user_id + friendUser
            }
            try {
                await axiosInstance.post("/messenger", values);
                setTextM("")
            } catch (err) {
                console.log(err);
            }
            const valuesTwo = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                img: fileName,
                conversation_id: friendUser + ownUser.user_id
            }

            try {
                await axiosInstance.post("/messenger", valuesTwo);
                setTextM("")
            } catch (err) {
                console.log(err);
            }

            try {
                await axiosInstance.post("/upload", data);
            } catch (err) {
                console.log(err);
            }
            const valuesThree = {
                last_text: textM
            }
            try {
                await axiosInstance.put(`/conversations/${friendUser + ownUser.user_id}`, valuesThree);
            } catch (err) {
                console.log(err);
            }
            const valuesFour = {
                last_text: textM
            }
            try {
                await axiosInstance.put(`/conversations/${ownUser.user_id + friendUser}`, valuesFour);
            } catch (err) {
                console.log(err);
            }
            if (!unreadText) {
                const valuesUnread = {
                    receiver_id: ownUser.user_id,
                    sender_id: friendUser,
                }
                try {
                    await axiosInstance.post("/unreadtexts", valuesUnread);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        setTimeout(() => {
            setFile(null)
            reset()
            forceUpdate();
        }, 1000)
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
        <div className='input'>
            <textarea type="text" placeholder="Type something"
                onChange={(e) => setTextM(e.target.value)} value={textM}
            />
            <div className="send">
                {file && (
                    <img style={{ width: "3rem" }} src={URL.createObjectURL(file)} alt="" />
                )}
                {/* <IoMdAttach /> */}
                <input style={{ display: "none" }} id="file" type={"file"}
                    accept=".png,.jpeg,.jpg" onChange={(e) => setFile(e.target.files[0])} ref={ref} />
                <label htmlFor="file">
                    <BiImageAdd />
                </label>

                {
                    textM?.length > 0 ?
                        <button type="submit" onClick={handleSubmit}>
                            Send
                        </button>
                        :
                        file !== null ?
                            <button type="submit" onClick={handleSubmit}>
                                Send
                            </button>
                            :
                            ""
                }
            </div>
        </div>
    )
}

export default Input