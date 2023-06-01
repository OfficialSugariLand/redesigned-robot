import "./resetPass.scss";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../../components/topbar/sugarilandlogo/sugarilandlogo.png";
import { Visibility, VisibilityOff } from "@material-ui/icons";

export default function ResetPass() {
    const [loading, setLoading] = useState(false);
    let isRendered = useRef(false);
    const [userValues, setUserValues] = useState();
    const [userNumVerified, setUserNumVerified] = useState("");
    const [smsUser, setSmsUser] = useState([]);
    const [userOTPVerified, setUserOTPVerified] = useState("");
    const [confirmOTP, setConfirmOTP] = useState(false);
    const [currentPass, setCurrentPass] = useState('');
    const [newPassRep, setNewPassRep] = useState('');
    const [viewNewPass, setViewNewPass] = useState(false);
    const [viewNewPassRep, setViewNewPassRep] = useState(false);
    const password = useRef();
    const [passCheck, setPassCheck] = useState(false);
    const [rePassCheck, setRePassCheck] = useState(false);
    const [successPass, setSuccessPass] = useState(false);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });


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

    const otpVerification = () => {
        if (userOTPVerified === newSms?.otp) {
            setConfirmOTP(true);
        } else {
            console.log("Code is wrong");
        }
    }

    //New pass
    const viewNewPassHandle = () => {
        setViewNewPass(!viewNewPass)
    };

    //Repeat new pass
    const viewNewPassRepHandle = () => {
        setViewNewPassRep(!viewNewPassRep)
    };

    //update user's phone status
    const handleClick = async (e) => {
        e.preventDefault();
        const users = {
            password: password.current.value,
        };
        const password_pattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
        if (!password_pattern.test(currentPass)) {
            setPassCheck(true)
            console.log("Pass didn't meet")
        } else if (newPassRep === "" || String(newPassRep) !== String(currentPass)) {
            console.log("Password did not match")
            setRePassCheck(true);
        } else {
            try {
                axiosInstance.put(`/users/ownuser/pass/${newSms.user_id}`, users);
            } catch (err) {
                console.log(err)
            }
            setLoading(true);
            setTimeout(() => {
                setSuccessPass(true);
                setLoading(false);
            }, 2000)
        }
    };

    //+2349166494702

    console.log(newSms)
    return (
        <div className="resetPass">
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        <div className="sugar_loader_content">
                            <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                        </div>
                    </Backdrop>
                    :
                    <div className="resetPass_container">
                        <p>Put your mobile number and the One Time</p>
                        <p>Password sent to your phone to proceed</p>
                        <input type="" value={userNumVerified} onChange={(e) => { setUserNumVerified(e.target.value) }} />
                        <input type="number" value={userOTPVerified} onChange={(e) => { setUserOTPVerified(e.target.value) }} />
                        <button onClick={() => { otpVerification() }}>Confirm OTP</button>

                        <div className={`${confirmOTP === true ? "show_passChange" : "hide_passChange"}`}>
                            <form onSubmit={handleClick}>
                                <p>Type your new password</p>
                                <div className="changePass_First">
                                    <input placeholder="New Password" maxLength={20} type={(viewNewPass === false) ? "password"
                                        : "text"} id="pass_border"
                                        value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} ref={password} />
                                    <div className="view_pass_control" >
                                        {
                                            (viewNewPass === false) ? <Visibility onClick={viewNewPassHandle} /> : <VisibilityOff onClick={viewNewPassHandle} />
                                        }
                                    </div>
                                </div>
                                <div className="changePass_rep">
                                    <input placeholder="Confirm Password" maxLength={20} type={(viewNewPassRep === false) ? "password" : "text"}
                                        value={newPassRep} onChange={(e) => setNewPassRep(e.target.value)} />
                                    <div className="view_pass_control">
                                        {
                                            (viewNewPassRep === false) ? <Visibility onClick={viewNewPassRepHandle} /> : <VisibilityOff onClick={viewNewPassRepHandle} />
                                        }
                                    </div>
                                </div>
                                <button type="submit">Proceed</button>
                            </form>
                        </div>
                        <div className={`${successPass === true ? "show_successPass" : "hide_successPass"}`}>
                            <p>Your password was changed successfully</p>
                            <p>Please login</p>
                            <Link to={"/login"}>
                                <button type="submit">Login</button>
                            </Link>
                        </div>
                    </div>
            }
        </div>
    )
}
