import "./userGeneral.scss";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Description from "./description/Description";
import Password from "./passset/Password";
import Username from "./username/Username";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

export default function UserGeneral() {
    const { user } = useContext(AuthContext);
    return (
        <div className="user_general">
            <Link to={"/settings"}>
                <BiArrowBack />
            </Link>
            <div className="usr_info_lists">
                <span>Username</span>
                <span>{user.username}</span>
                <Username />
            </div>
            <div className="usr_info_lists">
                <span>Password</span>
                <span>Change password</span>
                <Password />
            </div>
            <div className="usr_info_lists">
                <span>Description</span>
                <span>{user.desc}</span>
                <Description />
            </div>
        </div>
    )
}
