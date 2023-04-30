import "./resetPass.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ResetPass() {
    const navigate = useNavigate();
    const user_id = useParams().user_id;
    const secret = useParams().secret;
    const [passReset, setPassReset] = useState();
    const [userPass, setUserPass] = useState({ password: "", repeatPass: "" });
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Get password reset details
    useEffect(() => {
        const fetchPassReset = async () => {
            const res = await axiosInstance.get(`/passwordreset/reset-password/link/${user_id}/${secret}`);
            setPassReset(res.data);
        };
        fetchPassReset();
    }, [user_id, secret]);

    //console.log(secret)

    const newPassSubmit = async (e) => {
        e.preventDefault();
        if (userPass.repeatPass !== userPass.password) {
            userPass.repeatPass.current.setCustomValidity("Password is not same!")
        } else {
            try {
                await axiosInstance.put(`/users/new-password/${user_id}`, userPass);
                //navigate("/password-reset-success", { replace: true })
            } catch (err) {
                console.log(err);
            }
            try {
                await axiosInstance.delete(`/passwordreset/delete-request/${user_id}/${secret}`, {
                    data: {
                        id: passReset?.id
                    }
                });
                navigate("/password-reset-success", { replace: true })
            } catch (err) {
                console.log(err);
            }
        }
    }

    //console.log(userPass)
    return (
        <div className="reset_password">
            <div className="reset_pass_container">
                <div className="pass_container">
                    <div className="user_pass">
                        {
                            passReset ?
                                <>
                                    <span className="reset_header">Change your password</span>
                                    <span>Type your new password to proceed</span>
                                    <input placeholder="Password" type="password" value={userPass?.password} onChange={(e) =>
                                        setUserPass({ ...userPass, password: e.target.value })}
                                    />
                                    <input placeholder="Repeat password" type="password" value={userPass?.repeatPass} onChange={(e) =>
                                        setUserPass({ ...userPass, repeatPass: e.target.value })} />
                                    <button type="submit" onClick={(e) => { newPassSubmit(e) }}>
                                        Submit
                                    </button>
                                    <span className="password_reset">
                                        <Link to={"/login"}>
                                            Login
                                        </Link>
                                    </span>
                                </>
                                :
                                <>
                                    <span>Link is not valid or has expired</span>
                                    <span>Click forgot password to request again or click login</span>
                                </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
