import "./input.scss";
import { IoMdAttach } from "react-icons/io";
import { BiImageAdd } from "react-icons/bi";
import { useEffect, useState } from "react";
import axios from "axios";

function Input({ currentChat, messages, setMessages, socket, currentUser }) {
    const [newMessage, setNewMessage] = useState([""]);
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            const images = {
                sender: currentUser._id,
                img: file,
                conversationId: currentChat._id
            };
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            images.img = fileName;
            try {
                await axios.post("/upload", data);
            } catch (err) {
                console.log(err);
            }

            try {
                const res = await axios.post("/messages", images);
                //setMessages([...messages, res.data])
                setFile("")
            } catch (err) {
                console.log(err)
            }
            setMessages("");
            setFile(null);
        } else {
            const message = {
                sender: currentUser._id,
                text: newMessage,
                img: file,
                conversationId: currentChat._id
            };
            const receiverId = currentChat.members.find(
                (member) => member !== currentUser._id);

            socket.current.emit("sendMessage", {
                senderId: currentUser._id,
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
            setMessages("");
            setFile(null);
        }
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
                onChange={(e) => setNewMessage(e.target.value)} value={newMessage}
            />
            <div className="send">
                {file && (
                    <img src={URL.createObjectURL(file)} alt="" />
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