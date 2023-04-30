import "./forgotPass.scss";
import { Link } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Backdrop from '@mui/material/Backdrop';

export default function ForgotPass() {
    const [loading, setLoading] = useState(false);
    const [emailCon, setEmailCon] = useState(false);
    const [userEmail, setUserEmail] = useState({ email: "" });
    const [userValues, setUserValues] = useState();
    const [userSecret, setUserSecret] = useState();
    const [sentMail, setSentMail] = useState();
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //get user details to post to db
    useEffect(() => {
        const forgotPassword = async () => {
            try {
                const req = await axiosInstance.get("/users/forgot-password/" + userEmail?.email);
                setUserValues(req.data)
            } catch (err) {
                console.log(err);
            }
        }
        forgotPassword();
        forceUpdate()
    }, [userEmail]);
    /*  useEffect(() => {
         const interval = setInterval(() => {
             const forgotPassword = async () => {
                 try {
                     const req = await axiosInstance.get("/users/forgot-password/" + userEmail?.email);
                     setUserValues(req.data)
                 } catch (err) {
                     console.log(err);
                 }
             }
             forgotPassword();
             forceUpdate()
         }, 1000);
         return () => clearInterval(interval);
     }, [userEmail, axiosInstance]); */

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, []);

    const loadOnBtn = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 3000)
    }

    //get users secrets
    useEffect(() => {
        const fetchUsersSecrets = async () => {
            const res = await axiosInstance.get(`/passwordreset/reset-password/${userEmail?.email}`);
            setUserSecret(res.data);
        };
        fetchUsersSecrets();
    }, [ignored, userEmail]);

    //Send pass change link to DB
    const forgotPassword = async () => {
        const values = {
            user_id: userValues?.user_id,
            email: userValues?.email
        }
        if (userSecret) {
            console.log("user exists")
        } else if (!userValues?.user_id) {
            console.log("")
        } else if (userValues) {
            try {
                const req = await axiosInstance.post("/passwordreset", values);
                setUserValues(req.data)
            } catch (err) {
                console.log(err);
            }
        }
    }

    //get && confirm if mail was sent
    useEffect(() => {
        const fetchMailSent = async () => {
            const res = await axiosInstance.get(`/sentmail/${userSecret?.user_id}/${userSecret?.secret}`);
            setSentMail(res.data);
        };
        fetchMailSent();
    }, [ignored, userSecret])

    const newSentMail = sentMail?.user_id === userSecret?.user_id && sentMail?.secret === userSecret?.secret;

    //Send mail to user
    const sendMail = async () => {
        if (!userSecret?.user_id) {
            console.log("User is empty")
        } else if (newSentMail) {
            console.log("Mail already sent")
        } else {
            const values = {
                userEmail: "turdanapsi@gufum.com",
                genLink: `http://localhost:3000/reset-password/link/${userSecret?.user_id}/${userSecret?.secret}`
            }
            try {
                await axiosInstance.post("/mailer/sendmail", values);
            } catch (err) {
                console.log(err);
            }
        }
        const sentMailValue = {
            user_id: userSecret?.user_id,
            secret: userSecret?.secret,
            email: userSecret?.email,
        }
        if (!newSentMail) {
            try {
                await axiosInstance.post("/sentmail", sentMailValue);
            } catch (err) {
                console.log(err);
            }
        };
    }

    const resedForgotPassword = async () => {

    }

    //console.log(userSecret)
    //console.log(`http://localhost:3000/reset-password/link/${userSecret?.user_id}/${userSecret?.secret}`)

    //🐧🌻🌿✨️💜😭☹️😕☹🖤

    return (
        <div className="forgot_password">
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        {/* <DotLoader color={"#dd73d2"} /> */}
                    </Backdrop>
                    :
                    <>
                        {
                            !sentMail ?
                                <div className="forgot_pass_container">
                                    <div className="email_container">
                                        <div className="user_email">
                                            {/* <span className="forgot_header">Forgot Password</span> */}
                                            <span>Put your email to proceed</span>
                                            <input type="email" value={userEmail?.email} onChange={(e) =>
                                                setUserEmail({ ...userEmail, email: e.target.value })}
                                            />
                                            <div className={emailCon ? "show_email_con" : "hide_email_con"}>
                                                {
                                                    userValues?.email ?
                                                        <span className="email_confirmation">Email is valid ✅</span>
                                                        :
                                                        <span className="email_confirm">Email is invalid ❌</span>
                                                }
                                            </div>
                                            {
                                                !userSecret ?
                                                    <button type="submit" onClick={(e) => {
                                                        forgotPassword(e); setEmailCon(prev => !prev);
                                                        loadOnBtn()
                                                    }}>
                                                        Confirm
                                                    </button>
                                                    :
                                                    <button type="submit" onClick={(e) => { sendMail(e); loadOnBtn() }}>
                                                        Request
                                                    </button>
                                            }
                                            <span className="login_forgot">
                                                <Link to={"/login"}>
                                                    Login
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="forgot_pass_container">
                                    <div className="email_container">
                                        <div className="user_email">
                                            <span>Password reset link has been sent to your email account</span>
                                            {/* <span>Please follow the instruction in your Email account to change your password</span> */}
                                            <span>If you didn't get the mail pls click resent</span>
                                            <button type="submit" onClick={(e) => { resedForgotPassword(e) }}>
                                                resend
                                            </button>
                                            <span className="login_forgot">
                                                <Link to={"/login"}>
                                                    Login
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                        }
                    </>
            }
        </div>
    )
}
