import "./input.scss";
import axios from "axios";
//import { IoMdAttach } from "react-icons/io";
import { BiImageAdd } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import socketIOClient from "socket.io-client";

function Input({ ownUser, friendUser, conversation, forceUpdate }) {
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
        socket.current = socketIOClient("http://localhost:4000/");
    }, []);

    //Get unread texts
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get(`/unreadtexts/${ownUser.user_id}/${friendUser}`);
            setUnreadtText(res.data[0]);
        };
        fetchUser();
    }, [ownUser, friendUser]);

    //Reset img
    const reset = () => {
        ref.current.value = "";
    };

    //Send without file
    const handleSubmitNoFile = async (e) => {
        e.preventDefault();
        if (!conIdExist) {

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
                //img: fileName,
                conversationId: ownUser.user_id + friendUser
            });
            //Send conversaion to socket.io
            socket.current.emit("sendConversation", {
                senderId: ownUser.user_id,
                receiverId: friendUser,
                lastText: textM,
                //img: fileName,
                conversationId: ownUser.user_id + friendUser
            });

            const values = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                //img: fileName,
                conversation_id: ownUser.user_id + friendUser
            }
            try {
                await axiosInstance.post("/messenger", values);
            } catch (err) {
                console.log(err);
            }
            const valuesTwo = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                //img: fileName,
                conversation_id: friendUser + ownUser.user_id
            }
            try {
                await axiosInstance.post("/messenger", valuesTwo);
            } catch (err) {
                console.log(err);
            }
            //Send message to socket.io
            socket.current.emit("sendUnreadTexts", {
                receiver_id: friendUser,
                sender_id: ownUser.user_id,
            });
            const valuesUnread = {
                receiver_id: friendUser,
                sender_id: ownUser.user_id,
            }
            try {
                await axiosInstance.post("/unreadtexts", valuesUnread);
            } catch (err) {
                console.log(err);
            }

            //Send text notice to socket.io
            socket.current.emit("sendTextNotice", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                //img: fileName,
            });
            socket.current.emit("sendTextNoticeCount", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            });

            //text notification
            const textNotice = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                //img: fileName,
            }
            try {
                await axiosInstance.post("/textnotice", textNotice);
            } catch (err) {
                console.log(err);
            }

            //text notification count
            const textNoticeCount = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            }
            try {
                await axiosInstance.post("/textnotice/count", textNoticeCount);
            } catch (err) {
                console.log(err);
            }
        } else {

            //Send message to socket.io
            socket.current.emit("sendMessage", {
                senderId: ownUser.user_id,
                receiverId: friendUser,
                text: textM,
                //img: fileName,
                conversationId: ownUser.user_id + friendUser
            });
            //Send conversaion to socket.io
            socket.current.emit("sendConversation", {
                senderId: ownUser.user_id,
                receiverId: friendUser,
                lastText: textM,
                //img: fileName,
                conversationId: ownUser.user_id + friendUser
            });
            const values = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                //img: fileName,
                conversation_id: ownUser.user_id + friendUser
            }
            try {
                await axiosInstance.post("/messenger", values);
            } catch (err) {
                console.log(err);
            }
            const valuesTwo = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                //img: fileName,
                conversation_id: friendUser + ownUser.user_id
            }

            try {
                await axiosInstance.post("/messenger", valuesTwo);
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
                //Send message to socket.io
                socket.current.emit("sendUnreadTexts", {
                    receiver_id: friendUser,
                    sender_id: ownUser.user_id,
                });
                const valuesUnread = {
                    receiver_id: friendUser,
                    sender_id: ownUser.user_id,
                }
                try {
                    await axiosInstance.post("/unreadtexts", valuesUnread);
                } catch (err) {
                    console.log(err);
                }
            }

            //Send text notice to socket.io
            socket.current.emit("sendTextNotice", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                //img: fileName,
            });
            socket.current.emit("sendTextNoticeCount", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            });

            //text notification
            const textNotice = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                //img: fileName,
            }
            try {
                await axiosInstance.post("/textnotice", textNotice);
            } catch (err) {
                console.log(err);
            }

            //text notification count
            const textNoticeCount = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            }
            try {
                await axiosInstance.post("/textnotice/count", textNoticeCount);
            } catch (err) {
                console.log(err);
            }
        };
        setTimeout(() => {
            setFile(null);
            reset();
            setTextM("");
            forceUpdate();
        })
    };

    //Send file without text
    const handleSubmitFile = async (e) => {
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
                //text: textM,
                img: fileName,
                conversationId: ownUser.user_id + friendUser
            });
            //Send conversaion to socket.io
            socket.current.emit("sendConversation", {
                senderId: ownUser.user_id,
                receiverId: friendUser,
                //lastText: textM,
                img: fileName,
                conversationId: ownUser.user_id + friendUser
            });
            const values = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                //text: textM,
                img: fileName,
                conversation_id: ownUser.user_id + friendUser
            }
            try {
                await axiosInstance.post("/messenger", values);
            } catch (err) {
                console.log(err);
            }
            const valuesTwo = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                //text: textM,
                img: fileName,
                conversation_id: friendUser + ownUser.user_id
            }
            try {
                await axiosInstance.post("/messenger", valuesTwo);
            } catch (err) {
                console.log(err);
            }
            //Send message to socket.io
            socket.current.emit("sendUnreadTexts", {
                receiver_id: friendUser,
                sender_id: ownUser.user_id,
            });
            const valuesUnread = {
                receiver_id: friendUser,
                sender_id: ownUser.user_id,
            }
            try {
                await axiosInstance.post("/unreadtexts", valuesUnread);
            } catch (err) {
                console.log(err);
            }
            try {
                await axiosInstance.post("/upload", data);
            } catch (err) {
                console.log(err);
            }

            //Send text notice to socket.io
            socket.current.emit("sendTextNotice", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                //text: textM,
                img: fileName,
            });
            socket.current.emit("sendTextNoticeCount", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            });

            //text notification
            const textNotice = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                //text: textM,
                img: fileName,
            }
            try {
                await axiosInstance.post("/textnotice", textNotice);
            } catch (err) {
                console.log(err);
            }

            //text notification count
            const textNoticeCount = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            }
            try {
                await axiosInstance.post("/textnotice/count", textNoticeCount);
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
                //text: textM,
                img: fileName,
                conversationId: ownUser.user_id + friendUser
            });
            //Send conversaion to socket.io
            socket.current.emit("sendConversation", {
                senderId: ownUser.user_id,
                receiverId: friendUser,
                //lastText: textM,
                img: fileName,
                conversationId: ownUser.user_id + friendUser
            });
            const values = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                //text: textM,
                img: fileName,
                conversation_id: ownUser.user_id + friendUser
            }
            try {
                await axiosInstance.post("/messenger", values);
            } catch (err) {
                console.log(err);
            }
            const valuesTwo = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                //text: textM,
                img: fileName,
                conversation_id: friendUser + ownUser.user_id
            }

            try {
                await axiosInstance.post("/messenger", valuesTwo);
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
                //Send message to socket.io
                socket.current.emit("sendUnreadTexts", {
                    receiver_id: friendUser,
                    sender_id: ownUser.user_id,
                });
                const valuesUnread = {
                    receiver_id: friendUser,
                    sender_id: ownUser.user_id,
                }
                try {
                    await axiosInstance.post("/unreadtexts", valuesUnread);
                } catch (err) {
                    console.log(err);
                }
            }

            //Send text notice to socket.io
            socket.current.emit("sendTextNotice", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                //text: textM,
                img: fileName,
            });
            socket.current.emit("sendTextNoticeCount", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            });

            //text notification
            const textNotice = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                //text: textM,
                img: fileName,
            }
            try {
                await axiosInstance.post("/textnotice", textNotice);
            } catch (err) {
                console.log(err);
            }

            //text notification count
            const textNoticeCount = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            }
            try {
                await axiosInstance.post("/textnotice/count", textNoticeCount);
            } catch (err) {
                console.log(err);
            }
        };
        setTimeout(() => {
            setFile(null);
            reset();
            setTextM("");
            forceUpdate();
        })
    };

    //Send file & text
    const handleSubmitFileText = async (e) => {
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
            } catch (err) {
                console.log(err);
            }
            //Send message to socket.io
            socket.current.emit("sendUnreadTexts", {
                receiver_id: friendUser,
                sender_id: ownUser.user_id,
            });
            const valuesUnread = {
                receiver_id: friendUser,
                sender_id: ownUser.user_id,
            }
            try {
                await axiosInstance.post("/unreadtexts", valuesUnread);
            } catch (err) {
                console.log(err);
            }
            try {
                await axiosInstance.post("/upload", data);
            } catch (err) {
                console.log(err);
            }

            //Send text notice to socket.io
            socket.current.emit("sendTextNotice", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                img: fileName,
            });
            socket.current.emit("sendTextNoticeCount", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            });

            //text notification
            const textNotice = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                img: fileName,
            }
            try {
                await axiosInstance.post("/textnotice", textNotice);
            } catch (err) {
                console.log(err);
            }

            //text notification count
            const textNoticeCount = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            }
            try {
                await axiosInstance.post("/textnotice/count", textNoticeCount);
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
                //Send message to socket.io
                socket.current.emit("sendUnreadTexts", {
                    receiver_id: friendUser,
                    sender_id: ownUser.user_id,
                });
                const valuesUnread = {
                    receiver_id: friendUser,
                    sender_id: ownUser.user_id,
                }
                try {
                    await axiosInstance.post("/unreadtexts", valuesUnread);
                } catch (err) {
                    console.log(err);
                }
            }

            //Send text notice to socket.io
            socket.current.emit("sendTextNotice", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                img: fileName,
            });
            socket.current.emit("sendTextNoticeCount", {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            });

            //text notification
            const textNotice = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                img: fileName,
            }
            try {
                await axiosInstance.post("/textnotice", textNotice);
            } catch (err) {
                console.log(err);
            }

            //text notification count
            const textNoticeCount = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
            }
            try {
                await axiosInstance.post("/textnotice/count", textNoticeCount);
            } catch (err) {
                console.log(err);
            }
        };
        setTimeout(() => {
            setFile(null);
            reset();
            setTextM("");
            forceUpdate();
        })
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

    const [textState, setTextState] = useState(false);
    const [fileState, setFileState] = useState(false);
    const [fileTextState, setFileTextState] = useState(false);

    useEffect(() => {
        if (textM) {
            setTextState(true)
        } else {
            setTextState(false)
        }
    }, [textM]);

    useEffect(() => {
        if (file !== null) {
            setFileState(true);
        } else {
            setFileState(false)
        }
    }, [file]);
    useEffect(() => {
        if (file !== null && textM) {
            setFileTextState(true);
        } else {
            setFileTextState(false)
        }
    }, [file, textM]);

    useEffect(() => {
        if (textState === true && fileState !== true && fileTextState !== true /* {If there is text but no file} */) {
            document.getElementById('onlytext').style.display = "flex";
            document.getElementById('nullbtn').style.display = "none";
            document.getElementById('textfile').style.display = "none";
        } else if (textState !== true && fileState !== true /* {If there is no texts & no file} */) {
            document.getElementById('onlytext').style.display = "none";
            document.getElementById('onlyfile').style.display = "none";
            document.getElementById('textfile').style.display = "none";
            document.getElementById('nullbtn').style.display = "flex";
        } else if (fileState === true && fileTextState !== true) {
            document.getElementById('onlyfile').style.display = "flex";
            document.getElementById('onlytext').style.display = "none";
            document.getElementById('textfile').style.display = "none";
            document.getElementById('nullbtn').style.display = "none";
        } else if (fileTextState === true && fileState === true) {
            document.getElementById('textfile').style.display = "flex";
            document.getElementById('onlyfile').style.display = "none";
            document.getElementById('onlytext').style.display = "none";
            document.getElementById('nullbtn').style.display = "none";
        }
    }, [textState, fileState, fileTextState]);

    return (
        <div className='input'>
            <textarea type="text" placeholder="Type something"
                onChange={(e) => setTextM(e.target.value)} value={textM}
            />
            <div className="send">
                {file && (
                    <div className="cancel_filebtn">
                        <button className="btn_file_cancel" onClick={() => { setFile(null); reset() }}>
                            <MdOutlineCancel />
                        </button>
                        <img style={{ width: "3rem" }} src={URL.createObjectURL(file)} alt="" />
                    </div>
                )}
                {/* <IoMdAttach /> */}
                <input style={{ display: "none" }} id="file" type={"file"}
                    accept=".png,.jpeg,.jpg" onChange={(e) => setFile(e.target.files[0])} ref={ref} />
                <label htmlFor="file">
                    <BiImageAdd />
                </label>

                <button className="text_only_btn" id="onlytext" type="submit" onClick={handleSubmitNoFile}>
                    Send
                </button>
                <button className="file_only_btn" id="onlyfile" type="submit" onClick={handleSubmitFile}>
                    Send
                </button>
                <button id="textfile" className="file_text_btn" type="submit" onClick={handleSubmitFileText}>
                    Send
                </button>
                <button id="nullbtn" className="null_btn">
                    Send
                </button>
            </div>
        </div>
    )
}

export default Input