import "./textBox.scss";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import axios from "axios";
import Conversations from "./Conversations";

function TextBox() {
    const { user } = useContext(AuthContext);
    //const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [conversations, setConversations] = useState([]);

    //Get coversations members
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);

    return (
        <div className="textBox">
            <div className="textBox_container">
                <div className="textBox_left">
                    <input placeholder="Find user" />
                    {
                        conversations.map((c) => <Conversations conversation={c} key={c._id} />)
                    }
                </div>
                <div className="textBox_middle">
                    <div className="textBox_empty_container">
                        <FaArrowAltCircleLeft />
                        <span>Click user to start chat</span>
                    </div>
                </div>
                <div className="textBox_right">
                    <div className="textBox_right_container">
                        {/* <img src={CloseUp} alt="" /> */}
                    </div>
                    <div className="textBox_right_container">
                        {/* <img src={Guinness} alt="" /> */}
                    </div>
                    <div className="textBox_right_container">
                        {/* <img src={OralB} alt="" /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TextBox