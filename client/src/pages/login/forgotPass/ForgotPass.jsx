import "./forgotPass.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useReducer, useRef, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../../components/topbar/sugarilandlogo/sugarilandlogo.png";

export default function ForgotPass() {
    const [loading, setLoading] = useState(false);
    let isRendered = useRef(false);
    const [userValues, setUserValues] = useState();
    const [userNumVerified, setUserNumVerified] = useState("");
    const [smsUser, setSmsUser] = useState([]);
    const [arrivalSms, setArrivalSms] = useState();
    const [smsUserOpen, setSmsUserOpen] = useState(false);
    const socket = useRef();
    const navigate = useNavigate();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //+2349166494702

    //Show loading before page renders
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, []);

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
            userValues?.user_id === arrivalSms?.user_id && userValues?.phone_num === arrivalSms?.phone_num &&
            setSmsUser((prev) => [...prev, arrivalSms]);
    }, [arrivalSms, userValues?.user_id]);

    //get user details to post to db
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/users/passwordchange/forgot/${userNumVerified}`)
            .then(res => {
                if (isRendered) {
                    setUserValues(res.data)
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [userNumVerified]);

    //console.log(userValues)

    //generate sms
    const generateSms = async (e) => {
        //e.preventDefault();
        if (userValues) {
            const randomOtp = Math.floor(100000 + Math.random() * 900000);
            socket.current.emit("sendSms", {
                phone_num: userValues.phone_num,
                otp: randomOtp,
                user_id: userValues.user_id,
            });
            const smsValue = {
                phone_num: userValues.phone_num,
                otp: randomOtp,
                user_id: userValues.user_id
            }
            try {
                await axiosInstance.post("/smsuser", smsValue);
            } catch (err) {
                console.log(err);
            }
            //setLoading(true);

        } else {
            console.log("Number is not valid");
        }

    };


    //Get sms
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/smsuser/${userValues?.user_id}/${userValues?.phone_num}`)
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
    }, [userValues]);

    //find one
    const [newSms, setNewSms] = useState();
    useEffect(() => {
        const newSmsUser = smsUser?.find((s) => s.user_id === userValues?.user_id);
        setNewSms(newSmsUser);
    }, [smsUser]);

    //Send pass change link to user
    const forgotPassword = async () => {
        if (newSms) {
            const smsValues = {
                number: userValues?.phone_num,
                text: newSms?.otp,
            }
            try {
                await axiosInstance.post("/smsuser/smsusers", smsValues);
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("Number is not valid");
        }
    }

    const OTPSection = () => {
        if (userValues) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }

    const textSmsNavigate = () => {
        if (userValues) {
            setLoading(true);
            setSmsUserOpen(true);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }

    useEffect(() => {
        if (smsUserOpen === true) {
            setTimeout(() => {
                navigate("/resetpassword", { replace: true });
            }, 2000);
        }
    }, [smsUserOpen]);


    //console.log(userOTPVerified)
    //console.log(newSms?.otp)

    //🐧🌻🌿✨️💜😭☹️😕☹🖤

    return (
        <div className="forgot_password">
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        <div className="sugar_loader_content">
                            <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                        </div>
                    </Backdrop>
                    :
                    <div className="forgotPass_container">
                        {
                            newSms ?
                                <>
                                    <p className="forgot_pass_put">Click Request OTP to receive a</p>
                                    <p className="forgot_pass_put">one time passcode</p>
                                    <button onClick={() => { forgotPassword(); textSmsNavigate() }}>Request OTP</button>
                                </>
                                :
                                <>
                                    <p className="forgot_pass_put">Put your number to proceed</p>
                                    <p>Format example: +189337888</p>
                                    <input type="" value={userNumVerified} onChange={(e) => { setUserNumVerified(e.target.value) }} />
                                    <button onClick={() => { generateSms(); OTPSection() }}>Proceed</button>
                                </>
                        }
                    </div>
            }
        </div>
    )
}
