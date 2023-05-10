import "./home.scss";
import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Stories from "../../components/stories/Stories";
import Activity from "../../components/footerActivity/Activity";
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../components/topbar/sugarilandlogo/sugarilandlogo.png";
import Topbar from "../../components/topbar/Topbar";

export default function Home() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, []);

    return (
        <div className="home">
            <Topbar />
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        <div className="sugar_loader_content">
                            <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                        </div>
                    </Backdrop>
                    :
                    <>
                        <div className="home_container">
                            <div className="home_left_container">
                                <Sidebar />
                            </div>
                            <div className="home_middle">
                                <div className="story_home_container">
                                    <Stories />
                                </div>
                                <div className="feed_home_comtainer">
                                    <Feed />
                                </div>
                            </div>
                            <div className="home_right_container">
                                <Rightbar />
                            </div>
                        </div>
                        <div className="footer_home">
                            <Activity />
                        </div>
                    </>
            }
        </div>
    )
}