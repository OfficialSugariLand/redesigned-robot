import "./textBox.scss";
import Topbar from "../../../components/topbar/Topbar";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useEffect, useReducer, useState } from "react";
import Conversations from "../conversations/Conversations";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import CutieBeach from "../../../pages/about/images/cutie_on_beach.jpg";
import Activity from "../../../components/footerActivity/Activity";

function TextBox() {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Get coversations members
    useEffect(() => {
        const getConvs = async () => {
            try {
                const res = await axiosInstance.get("/conversations/" + user.user_id);
                setConversations(res.data.sort((p1, p2) => {
                    return new Date(p2.date_time) - new Date(p1.date_time);
                })
                );
            } catch (err) {
                console.log(err);
            }
        };
        getConvs();
    }, [user, ignored]);

    return (
        <div className="textBox">
            <Topbar />
            <div className="sugarChats_container">
                <div className="textBox_left">
                    <input placeholder="Find user" />
                    {
                        conversations?.map((c, id) =>
                            <Conversations forceUpdate={forceUpdate} ignored={ignored} conversation={c} key={id}
                                setConversations={setConversations}
                            />
                        )
                    }
                </div>
                <div className="textBox_middle">
                    <FaArrowAltCircleLeft />
                    <span>Click user to start a chat</span>
                </div>
                <div className="sugar_hot_cakes">
                    <div className="sugar_hot_wrapper">
                        <img src={CutieBeach} alt="" />
                    </div>
                </div>
            </div>
            <Activity />
        </div>
    )
}

export default TextBox