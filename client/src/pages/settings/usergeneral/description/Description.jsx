import "./description.scss";
import axios from 'axios';
import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../../../context/AuthContext';
import { BiArrowBack } from "react-icons/bi";
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../../../components/topbar/sugarilandlogo/sugarilandlogo.png";

export default function Description() {
    const { user, updateUserDesc } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const desc = useRef();
    const [editDesc, setEditDesc] = useState(false);
    const [currentDesc, setCurrentDesc] = useState(user.desc);
    const [error, setError] = useState(false)
    const limitCount = 30;      /* https://www.youtube.com/watch?v=z0_tNMq5jy4  {Reactjs User Limit Character length Size Restrict} https://www.youtube.com/watch?v=euRneiFD-6E*/
    const maxCount = 30;
    //const [descCount, setDescCount] = useState();
    //const [descOpen, setDescOpen] = useState(false);
    const [descSubmitSuccess, setDescSubmitSuccess] = useState(false);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    const countHandler = async (e) => {
        var lengthCount = e.target.value.length;
        var maxLength = maxCount;
        var result = maxLength - lengthCount;
        /*setDescCount({
            limitCount: result
        })*/
        if (result <= 5) {
            document.getElementById("limitCountId").style.color = "red";
        } else {
            document.getElementById("limitCountId").style.color = "black";
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const users = {
            desc: desc.current.value,
        };
        /* https://www.youtube.com/watch?v=rZpc7HkmF5Q      {This field cannot be empty} */
        if (currentDesc.length === 0) {
            setError(true);
        } else
            updateUserDesc(currentDesc, () => {
                try {
                    axiosInstance.put(`/users/ownuserdesc/${user.user_id}`, users);
                    setInterval(() => {
                        setDescSubmitSuccess(true);
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
    };

    const closeDescSuccess = () => {
        window.location.reload();
    }

    return (
        <div className="user_desc">
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        <div className="sugar_loader_content">
                            <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                        </div>
                    </Backdrop>
                    :
                    <div className="user_desc_container">
                        <div className="username">
                            <button onClick={() => setEditDesc(prev => !prev)}>Edit</button>
                        </div>
                        <form onSubmit={handleClick}>
                            <div className={`change_user_input ${editDesc ? "show_edit_user" : "hide_edit_user"}`}>
                                <div title="Go back" className="go_back" onClick={() => setEditDesc(prev => !prev)}>
                                    <BiArrowBack />
                                </div>

                                <div className="usr_input">
                                    <span>Change description</span>
                                    <input placeholder="Description" rows="10" maxLength={30} type={"text"} ref={desc}
                                        value={currentDesc} onChange={(e) => { setCurrentDesc(e.target.value); countHandler(e) }}
                                    />
                                    <button className="submit_btn" type="submit">Update</button>
                                    {error && currentDesc.length <= 0 ?
                                        <label htmlFor="" className="cannotBeEmpty">Description cannot be empty</label> : ""
                                    }
                                    <h1 id="limitCountId" className="limitNumberCount">
                                        Count : {limitCount}
                                    </h1>
                                    <div className={descSubmitSuccess ? "desc_success" : "hide_desc_success"}>
                                        <div className="desc_sub_success">
                                            <span>You have successfully changed your description</span>
                                            <span className='close_desc_success' onClick={() => {
                                                setDescSubmitSuccess(prev => !prev);
                                                closeDescSuccess(); setEditDesc(prev => !prev)
                                            }}>Close</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
            }
        </div>
    )
}
