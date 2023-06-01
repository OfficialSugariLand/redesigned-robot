import "./smsuser.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import socketIOClient from "socket.io-client";
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../components/topbar/sugarilandlogo/sugarilandlogo.png";
import { Link, useNavigate } from "react-router-dom";

export default function Smsuser() {
    const { user } = useContext(AuthContext);
    let isRendered = useRef(false);
    const [smsUser, setSmsUser] = useState([]);
    const [arrivalSms, setArrivalSms] = useState();
    const socket = useRef();
    const [loading, setLoading] = useState(false);
    const [smsUserOpen, setSmsUserOpen] = useState(false);
    const navigate = useNavigate();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Send to socket
    useEffect(() => {
        socket.current = socketIOClient("http://localhost:4000/");
    }, []);

    //Take from socket
    useEffect(() => {
        const socket = socketIOClient("http://localhost:4000/");

        socket?.on("getSms", (data) => {
            setArrivalSms({
                phone_num: data.phone_num,
                otp: data.otp,
                user_id: data.user_id,
            });
        });
    }, []);

    //Rerender OTP when changes are made
    useEffect(() => {
        arrivalSms &&
            user.user_id === arrivalSms?.user_id && user.phone_num === arrivalSms?.phone_num &&
            setSmsUser((prev) => [...prev, arrivalSms]);
    }, [arrivalSms, user.user_id]);

    //generate sms
    const generateSms = async (e) => {
        e.preventDefault()
        const randomOtp = Math.floor(100000 + Math.random() * 900000);
        socket.current.emit("sendSms", {
            phone_num: user.phone_num,
            otp: randomOtp,
            user_id: user.user_id,
        });
        const smsValue = {
            phone_num: user.phone_num,
            otp: randomOtp,
            user_id: user.user_id
        }
        try {
            await axiosInstance.post("/smsuser", smsValue);
        } catch (err) {
            console.log(err);
        }
        setLoading(true);
    };

    useEffect(() => {
        setInterval(() => {
            if (arrivalSms?.user_id === user.user_id) {
                setLoading(false);
            }
        }, 2000)
    }, [arrivalSms, user.user_id]);

    //Get sms
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/smsuser/${user.user_id}/${user.phone_num}`)
            .then(res => {
                if (isRendered) {
                    setSmsUser(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, []);

    //find one
    const [newSms, setNewSms] = useState();
    useEffect(() => {
        const newSmsUser = smsUser?.find((s) => s.user_id === user.user_id);
        setNewSms(newSmsUser);
    }, [smsUser]);

    //text sms to user
    const textSms = async (e) => {
        //e.preventDefault()
        const smsValues = {
            number: user.phone_num,
            text: newSms?.otp,
        }
        try {
            await axiosInstance.post("/smsuser/smsusers", smsValues);
        } catch (err) {
            console.log(err);
        }
    };

    const textSmsNavigate = () => {
        setLoading(true);
        setSmsUserOpen(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    useEffect(() => {
        if (smsUserOpen === true) {
            setTimeout(() => {
                navigate("/otpuser", { replace: true });
            }, 2000);
        }
    }, [smsUserOpen])

    //console.log(smsUserOpen)

    //Logout
    const handleLogout = async () => {
        localStorage.clear();
        window.location.reload();
    };

    //console.log(newSms)

    return (
        <div className='sms_user'>
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        <div className="sugar_loader_content">
                            <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                        </div>
                    </Backdrop>
                    :
                    <>
                        {
                            newSms ?
                                <div className="sms_container">
                                    <p className="send_otp">A one time password has been generated for you.</p>
                                    <p className="send_otp">Click Send OTP to continue</p>
                                    <span className="sms_user_phone">{user.phone_num}</span>
                                    <button className="sms_sendOTP" onClick={() => { textSms(); textSmsNavigate() }}>Send OTP</button>
                                    <Link to={"/otpuser"} id="otpuserlink"></Link>
                                </div>
                                :
                                <div className="sms_container">
                                    <p>Verify your phone number to continue</p>
                                    <span className="sms_user_phone">{user.phone_num}</span>
                                    <div className="sms_btn">
                                        <button onClick={generateSms}>Click to verify</button>
                                        <button className="sms_logout" onClick={handleLogout}>Logout</button>
                                    </div>
                                </div>
                        }
                    </>
            }
        </div>
    )
}
