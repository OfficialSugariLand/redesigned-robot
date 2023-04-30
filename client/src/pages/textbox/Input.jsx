import "./input.scss";
import { IoMdAttach } from "react-icons/io";
import { BiImageAdd } from "react-icons/bi";
import { useEffect, useState } from "react";
import axios from "axios";

function Input({ ownUser, friendUser, conversation, socket }) {
    //const [newMessage, setNewMessage] = useState([""]);
    const [file, setFile] = useState(null);

    const [textM, setTextM] = useState("");
    const youAndMe = friendUser + ownUser.user_id;
    const meAndYou = ownUser.user_id + friendUser;
    const conIdExist = conversation?.find((c) => c?.conversation_id === youAndMe);

    /* const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            const message = {
                sender: user._id,
                text: newMessage,
                conversationId: curFriendChat?._id
            };
            const receiverId = curFriendChat?.members.find((m) => m !== user._id);
            socket?.emit("sendMessage", {
                senderId: user._id,
                receiverId,
                text: newMessage,
            });
            try {
                const res = await axios.post("/messages", message);
                setMessages([...messages, res.data])
                setNewMessage("")
            } catch (err) {
                console.log(err)
            }
        } else {
            const message = {
                sender: user._id,
                text: newMessage,
                img: file,
                conversationId: curFriendChat._id
            };
            const receiverId = curFriendChat.members?.find(
                (member) => member !== user._id
            );
            socket?.emit("sendMessage", {
                senderId: user._id,
                receiverId,
                text: newMessage,
            });
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            message.img = fileName;
            try {
                await axios.post("/upload", data);
            } catch (err) {
                console.log(err);
            }
            try {
                const res = await axios.post("/messages", message);
                setMessages([...messages, res.data])
                setNewMessage("")
                setFile("")
            } catch (err) {
                console.log(err)
            }
            //setMessages("");
            setFile(null);
        }
    }; */

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!conIdExist) {
            const conIdCreateOne = {
                conversation_id: youAndMe,
                user_id: ownUser.user_id,
                user_two: friendUser,
                last_text: textM
            }
            try {
                await axios.post("http://localhost:8800/backend/conversations", conIdCreateOne);
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
                await axios.post("http://localhost:8800/backend/conversations", conIdCreateTwo);
            } catch (err) {
                console.log(err);
            }
            const values = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                conversation_id: ownUser.user_id + friendUser
            }
            try {
                await axios.post("http://localhost:8800/backend/messenger", values);
                setTextM("")
            } catch (err) {
                console.log(err);
            }
            const valuesTwo = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                conversation_id: friendUser + ownUser.user_id
            }
            try {
                await axios.post("http://localhost:8800/backend/messenger", valuesTwo);
                setTextM("")
            } catch (err) {
                console.log(err);
            }
            const valuesThree = {
                last_text: textM
            }
            try {
                await axios.put(`http://localhost:8800/backend/conversations/${friendUser + ownUser.user_id}`, valuesThree);
            } catch (err) {
                console.log(err);
            }
            const valuesFour = {
                last_text: textM
            }
            try {
                await axios.put(`http://localhost:8800/backend/conversations/${ownUser.user_id + friendUser}`, valuesFour);
            } catch (err) {
                console.log(err);
            }
            const receiverId = friendUser;
            socket?.emit("sendMessage", {
                senderId: ownUser.user_id,
                receiverId,
                text: textM,
            });

            socket?.emit("sendConversation", {
                conIdOne: youAndMe,
                senderId: ownUser.user_id,
                receiverId,
                text: textM,
            });
        } else {
            const values = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                conversation_id: ownUser.user_id + friendUser
            }
            try {
                await axios.post("http://localhost:8800/backend/messenger", values);
                setTextM("")
            } catch (err) {
                console.log(err);
            }
            const valuesTwo = {
                sender_id: ownUser.user_id,
                receiver_id: friendUser,
                text: textM,
                conversation_id: friendUser + ownUser.user_id
            }

            try {
                await axios.post("http://localhost:8800/backend/messenger", valuesTwo);
                setTextM("")
            } catch (err) {
                console.log(err);
            }
            const valuesThree = {
                last_text: textM
            }
            try {
                await axios.put(`http://localhost:8800/backend/conversations/${friendUser + ownUser.user_id}`, valuesThree);
            } catch (err) {
                console.log(err);
            }
            const valuesFour = {
                last_text: textM
            }
            try {
                await axios.put(`http://localhost:8800/backend/conversations/${ownUser.user_id + friendUser}`, valuesFour);
            } catch (err) {
                console.log(err);
            }
            const receiverId = friendUser;
            socket?.emit("sendMessage", {
                senderId: ownUser.user_id,
                receiverId,
                text: textM,
            });

            socket?.emit("sendConversation", {
                conIdOne: youAndMe,
                senderId: ownUser.user_id,
                receiverId,
                text: textM,
            });
        };

    };

    //Auto resize textArea
    useEffect(() => {
        const textarea = document.querySelector("textarea");
        textarea.addEventListener("keyup", e => {
            textarea.style.height = "63px";
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
                <IoMdAttach />
                <input style={{ display: "none" }} id="file" type={"file"}
                    accept=".png,.jpeg,.jpg" onChange={(e) => setFile(e.target.files[0])} />
                <label htmlFor="file">
                    <BiImageAdd />
                </label>
                <button onClick={handleSubmit} /* disabled={newMessage === null} */>Send</button>
            </div>
        </div>
    )
}

export default Input