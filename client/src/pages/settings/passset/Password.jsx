import './password.scss';
import axios from 'axios';
import bcrypt from "bcryptjs";
import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { BiArrowBack } from "react-icons/bi";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Backdrop from '@mui/material/Backdrop';

export default function Password() {
    const { user, updateUserPassword } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const password = useRef();
    const [editPass, setEditPass] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [currentPass, setCurrentPass] = useState('');
    const [newPassRep, setNewPassRep] = useState('');
    const [viewOldPass, setViewOldPass] = useState(false);
    const [viewNewPass, setViewNewPass] = useState(false);
    const [viewNewPassRep, setViewNewPassRep] = useState(false);
    const [passCheck, setPassCheck] = useState(false);
    const [rePassCheck, setRePassCheck] = useState(false);
    const [oldPass, setOldPass] = useState(false);
    const [passSubmitSuccess, setPassSubmitSuccess] = useState(false);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //handle click state
    const viewOldPassHandle = () => {
        setViewOldPass(!viewOldPass)
    };
    const viewNewPassHandle = () => {
        setViewNewPass(!viewNewPass)
    };

    const viewNewPassRepHandle = () => {
        setViewNewPassRep(!viewNewPassRep)
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const users = {
            password: password.current.value,
        };
        const match = await bcrypt.compare(oldPassword, user.password);
        const password_pattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.current.value, salt);
        if (!match) {
            console.log("Password is not correct")
            setOldPass(true)
        } else if (!password_pattern.test(currentPass)) {
            setPassCheck(true)
            console.log("Pass didn't meet")
        } else if (newPassRep === "" || String(newPassRep) !== String(currentPass)) {
            console.log("Password did not matched")
            setRePassCheck(true);
        } else {
            updateUserPassword(hashedPassword, () => {
                try {
                    axiosInstance.put(`/users/ownuser/pass/${user.user_id}`, users);
                    setInterval(() => {
                        setPassSubmitSuccess(true);
                    }, 1000);

                    const setLoader = () => {
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false)
                        }, 1000)
                    }
                    setLoader();
                } catch (err) {
                    console.log(err)
                }
            });
        }
    };

    const closePassSuccess = () => {
        window.location.reload();
    }

    return (
        <div className="password_set">
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                    </Backdrop>
                    :
                    <>
                        <div className="username">
                            <button onClick={() => setEditPass(prev => !prev)}>Edit</button>
                        </div>
                        <form onSubmit={handleClick}>
                            <div className={`change_user_input ${editPass ? "show_edit_user" : "hide_edit_user"}`}>
                                <div title="Go back" className="go_back" onClick={() => setEditPass(prev => !prev)}>
                                    <BiArrowBack />
                                </div>
                                <div className="usr_input">
                                    <div className="change_pass_vlue">
                                        <span>Type your old password</span>
                                        <div className="password_change">
                                            <input placeholder="Password" rows="10" maxLength={20} type={(viewOldPass === false) ? "password" : "text"}
                                                value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} id="old_pass_border"
                                            />
                                            <div className="view_pass_control">
                                                {
                                                    (viewOldPass === false) ? <Visibility onClick={viewOldPassHandle} /> : <VisibilityOff onClick={viewOldPassHandle} />
                                                }
                                            </div>
                                        </div>
                                        <span className={oldPass ? "pass_validation" : "hide_pass_validation"}>
                                            Password is not correct
                                        </span>
                                        <div className="line_divider"></div>
                                    </div>

                                    <div className="change_pass_vlue">
                                        <span>Type your new password</span>
                                        <div className="password_change">
                                            <input placeholder="Password" rows="10" maxLength={20} type={(viewNewPass === false) ? "password"
                                                : "text"} id="pass_border"
                                                value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} ref={password}
                                            />
                                            <div className="view_pass_control">
                                                {
                                                    (viewNewPass === false) ? <Visibility onClick={viewNewPassHandle} /> : <VisibilityOff onClick={viewNewPassHandle} />
                                                }
                                            </div>
                                        </div>
                                        <span className={passCheck ? "pass_validation" : "hide_pass_validation"}>
                                            Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!
                                        </span>
                                    </div>
                                    <div className="password_change_rep">
                                        <input placeholder="Repeat password" rows="10" maxLength={20} type={(viewNewPassRep === false) ? "password" : "text"}
                                            value={newPassRep} onChange={(e) => setNewPassRep(e.target.value)}
                                        />
                                        <div className="view_pass_control">
                                            {
                                                (viewNewPassRep === false) ? <Visibility onClick={viewNewPassRepHandle} /> : <VisibilityOff onClick={viewNewPassRepHandle} />
                                            }
                                        </div>
                                    </div>
                                    <span className={rePassCheck ? "pass_validation" : "hide_pass_validation"}>
                                        Password did not match
                                    </span>
                                    <button className="submit_btn" title="Update user" type="submit">Update</button>
                                    <div className={passSubmitSuccess ? "pass_success" : "hide_pass_success"}>
                                        <div className="pass_sub_success">
                                            <span>You have successfully changed your password</span>
                                            <span className='close_pass_success' onClick={() => {
                                                setPassSubmitSuccess(prev => !prev);
                                                closePassSuccess(); setEditPass(prev => !prev)
                                            }}>Close</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>
            }
        </div>
    )
}
