import "./children.scss";
import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { BiArrowBack } from "react-icons/bi";

export default function Username() {
    const { user, updateUser } = useContext(AuthContext);
    const username = useRef();
    const [editUser, setEditUser] = useState(false);
    const [currentUsername, setCurrentUsername] = useState(user.username);
    const [error, setError] = useState(false);
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
                    window.location.reload();
                } catch (err) {
                    console.log(err)
                }
            });
    };

    return (
        <div className="user_info_control">
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
                </div>
            </form>
        </div>
    )
}
