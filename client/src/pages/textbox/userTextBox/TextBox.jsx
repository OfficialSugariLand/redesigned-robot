import "./textBox.scss";
import Topbar from "../../../components/topbar/Topbar";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import Conversations from "../conversations/Conversations";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import CutieBeach from "../../../pages/about/images/cutie_on_beach.jpg";
import socketIOClient from "socket.io-client";

function TextBox() {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [arrivalConversation, setArrivalConversation] = useState();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Use socket oi to send and get texts instant
    useEffect(() => {
        const socket = socketIOClient("http://localhost:4000/");
        socket?.on("getConversation", (data) => {
            setArrivalConversation({
                user_id: data.receiverId,
                user_two: data.senderId,
                last_text: data.lastText,
                img: data.img,
                conversation_id: data.conversationId,
                date_time: Date.now(),
            });
        });
    }, []);

    //Real time conversation rerender
    useEffect(() => {
        arrivalConversation &&
            user.user_id === arrivalConversation?.user_id &&
            setConversations((prev) => [arrivalConversation, ...prev]);
    }, [arrivalConversation, user.user_id]);

    //Get coversations members
    let isRendered = useRef(false);
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/conversations/${user.user_id}`)
            .then(res => {
                if (isRendered) {
                    setConversations(res.data.sort((p1, p2) => {
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
    }, [user]);

    //Remove duplicates
    const [newConId, setNewConId] = useState();
    useEffect(() => {
        const Newconversations = conversations?.filter((ele, ind) =>
            ind === conversations?.findIndex(elem => elem.user_two === ele.user_two &&
                elem.user_id === ele.user_id && elem.conversaion_id === ele.conversaion_id));
        setNewConId(Newconversations);
    }, [conversations])

    return (
        <div className="textBox">
            <Topbar />
            <div className="sugarChats_container">
                <div className="textBox_left">
                    <input placeholder="Find user" />
                    {
                        newConId?.map((c, id) =>
                            <Conversations conversation={c} key={id} />
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
        </div>
    )
}

export default TextBox