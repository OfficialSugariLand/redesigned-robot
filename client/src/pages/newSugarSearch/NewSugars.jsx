import "./newSugars.scss";
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../components/topbar/sugarilandlogo/sugarilandlogo.png";
import Topbar from "../../components/topbar/Topbar";

export default function NewSugars() {
    const { user } = useContext(AuthContext);
    const [allUsers, setAllUsers] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(16);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, []);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersList = await axiosInstance.get(`/users/${user.country}/${user.state}`);
                setAllUsers(usersList.data);
                setLoading(true);
            } catch (err) {
                console.log(err);
            }
        };
        getUsers();
    }, [user]);

    const showMorePeople = () => {
        setVisible((prevValue) => prevValue + 16);
    };

    return (
        <div className="sugars">
            <Topbar />
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        <div className="sugar_loader_content">
                            <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                        </div>
                    </Backdrop>
                    :
                    <div className="sugars_container">

                        {
                            allUsers.slice(0, visible).map(({ user_id, username, profilePicture, id }) =>
                                <div className="sugar_vContainer">
                                    <Link to={"/profile/" + user_id} style={{ textDecoration: "none" }} key={id}>
                                        <img src={profilePicture ? PF + profilePicture : PF + "person/1658876240053sugarisland.jpeg"} alt="" />
                                        <h4>{username}</h4>
                                    </Link>
                                </div>
                            )
                        }
                    </div>
            }
            <div className="view_more_sugar_btn">
                <button onClick={showMorePeople}>View more</button>
            </div>
        </div>
    )
}
