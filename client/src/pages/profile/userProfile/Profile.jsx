import "./profile.scss";
import Topbar from "../../../components/topbar/Topbar";
import ProfileRightbar from "../rightbar/ProfileRightbar";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../../context/AuthContext";
/*import { motion } from "framer-motion";     https://www.youtube.com/watch?v=FdrEjwymzdY {npm install framer-motion} */
import ProfileHead from "../profileHead/ProfileHead";
import ProShare from "../proShare/ProShare";
import ProFeed from "../proFeed/ProFeed";
import Activity from "../../../components/footerActivity/Activity";
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../../components/topbar/sugarilandlogo/sugarilandlogo.png"

export default function Profile() {
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const user_id = useParams().user_id;

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, []);



    return (
        <div className="profile">
            <Topbar />
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                    </Backdrop>
                    :
                    <>
                        <div className="profile_container">
                            <ProfileHead user={user} />
                            <div className="user_profile_down_container">
                                {/* Mobile */}
                                <div className="user_friend_list_mobile">
                                    <ProfileRightbar />
                                </div>
                                <div className="user_profile_down_left">
                                    {(!user_id || user_id === user?.user_id) && <ProShare />}
                                    <ProFeed />
                                </div>
                                <div className="user_profile_down_right">
                                    <div className="user_friend_list">
                                        <ProfileRightbar />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Activity />
                    </>
            }
        </div >
    )
};