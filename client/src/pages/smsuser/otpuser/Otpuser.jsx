import "./otpuser.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../../components/topbar/sugarilandlogo/sugarilandlogo.png";
import { Link } from "react-router-dom";

export default function Otpuser() {
    const { user, updateUserIsVerified } = useContext(AuthContext);
    let isRendered = useRef(false);
    const [smsUser, setSmsUser] = useState();
    const [loading, setLoading] = useState(false);
    const [numConfirmed, setNumConfirmed] = useState(false);
    const [userNumVerified, setUserNumVerified] = useState(false);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

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

    //update user's phone status
    const userIsVerified = "true";
    const handleClickGender = async (e) => {
        e.preventDefault();
        if (userNumVerified === newSms?.otp) {
            const users = {
                isVerified: userIsVerified,
            };
            updateUserIsVerified(userIsVerified, () => {
                try {
                    axiosInstance.put(`/users/isverified/${user.user_id}`, users);
                    const setLoader = () => {
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            setNumConfirmed(true);
                        }, 1000)
                    }
                    setLoader();
                } catch (err) {
                    console.log(err)
                }
            });
            const userIdValue = {
                user_id: ""
            }
            try {
                axiosInstance.put(`/smsuser/${user.user_id}/${user.phone_num}`, userIdValue);
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log("Code is not valid")
        }
    };

    //Logout
    const handleLogout = async () => {
        localStorage.clear();
        window.location.reload();
    };

    //console.log(userNumVerified)
    //console.log(smsUser)


    return (
        <div className='otp_user'>
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        <div className="sugar_loader_content">
                            <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                        </div>
                    </Backdrop>
                    :
                    <div className="otp_user_container">
                        <p>Put the OTP sent to your phone to very your number</p>
                        <input type="number" value={userNumVerified} onChange={(e) => { setUserNumVerified(e.target.value) }} />
                        <div className="otp_logout">
                            <button onClick={handleClickGender}>Submit OTP</button>
                            <p>Or</p>
                            <button className="sms_logout" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
            }
            <div className={`${numConfirmed ? "showSuccess" : "hideSuccess"}`}>
                <p>Your number has been verified</p>
                <p>Click proceed to continue enjoying Sugar iLand</p>
                <div className="proceed_btn" onClick={() => window.location.reload()}>
                    <Link to={"/"}>
                        <button>Proceed</button>
                    </Link>
                </div>
            </div>
        </div >
    )
}
