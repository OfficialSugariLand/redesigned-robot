import "./username.scss";
import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { BiArrowBack } from "react-icons/bi";
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../../../components/topbar/sugarilandlogo/sugarilandlogo.png";

export default function Username() {
    const { user, updateUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const username = useRef();
    const [editUser, setEditUser] = useState(false);
    const [currentUsername, setCurrentUsername] = useState(user.username);
    const [error, setError] = useState(false);
    const [userSubmitSuccess, setUserSubmitSuccess] = useState();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    const handleClick = async (e) => {
        e.preventDefault();
        const users = {
            username: username.current.value,
            email: user.email,
            desc: user.desc,
            dob: user.dob,
            gender: user.gender,
            interest: user.interest,
            sexuality: user.sexuality,
            relationship: user.relationship,
            country: user.country,
            state: user.state,
            city: user.city,
            phone_num: user.phone_num,
        };
        if (currentUsername.length === 0) {
            setError(true);
        } else
            updateUser(username.current.value, () => {
                try {
                    axiosInstance.put(`/users/ownuser/${user.user_id}`, users);
                    const setLoader = () => {
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false)
                        }, 1000)
                    }
                    setLoader();
                    setInterval(() => {
                        setUserSubmitSuccess(true);
                    }, 1000);
                } catch (err) {
                    console.log(err)
                }
            });
    };

    const closeUserSuccess = () => {
        window.location.reload();
    }

    return (
        <div className="user_info_control">
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        <div className="sugar_loader_content">
                            <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                        </div>
                    </Backdrop>
                    :
                    <>
                        <div className="username">
                            <button onClick={() => setEditUser(prev => !prev)}>Edit</button>
                        </div>
                        <form onSubmit={handleClick}>
                            <div className={`change_user_input ${editUser ? "show_edit_user" : "hide_edit_user"}`}>
                                <div title="Go back" className="go_back" onClick={() => setEditUser(prev => !prev)}>
                                    <BiArrowBack />
                                </div>
                                <div className="usr_input">
                                    <span>Change your username</span>
                                    <input placeholder="Username" rows="10" maxLength={20} type={"text"} ref={username}
                                        value={currentUsername} onChange={(e) => setCurrentUsername(e.target.value)}
                                    />
                                    {error && currentUsername.length <= 0 ?
                                        <label htmlFor="" className="userCannotBeEmpty">Username cannot be empty</label> : ""
                                    }
                                    <button className="submit_btn" title="Update user" type="submit">Update</button>
                                </div>
                                <div className={userSubmitSuccess ? "user_success" : "hide_user_success"}>
                                    <div className="user_sub_success">
                                        <span>You have successfully changed your username</span>
                                        <span className='close_user_success' onClick={() => {
                                            setUserSubmitSuccess(prev => !prev);
                                            closeUserSuccess(); setEditUser(prev => !prev)
                                        }}>Close</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>
            }
        </div>
    )
}
