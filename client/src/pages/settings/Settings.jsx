import "./settings.scss";
import Topbar from "../../components/topbar/Topbar";
import Description from "./description/Description";
import Password from "./passset/Password";
import Username from "./children/Username";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Activity from "../../components/footerActivity/Activity";

export default function Settings() {
  const { user } = useContext(AuthContext);

  return (
    <div className="settings_page">
      <Topbar />
      <div className="settings_container">
        <div className="settings_left">
          <Link to={"/settings"}>
            <li>General</li>
          </Link>
          <Link to={"/settings=personal_information"}>
            <li>Personal Information</li>
          </Link>
          <Link to={"/settings=location"}>
            <li>Location Settings</li>
          </Link>
        </div>
        <div className="settings_right">
          <div className="usr_info_lists">
            <span>Username</span>
            <span>Password</span>
            <span>Description</span>
          </div>
          <div className="usr_info_values">
            <span>{user.username}</span>
            <span>Change password</span>
            <span>{user.desc}</span>
          </div>
          <div className="usr_info_update">
            <Username />
            <Password />
            <Description />
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="settings_mobile">
        <div className="settings_left">
          <Link to={"/settings=general_information"}>
            <li>General</li>
          </Link>
          <Link to={"/settings=personal_information"}>
            <li>Personal Information</li>
          </Link>
          <Link to={"/settings=location"}>
            <li>Location Settings</li>
          </Link>
        </div>
      </div>
      <Activity />
    </div>
  )
}
