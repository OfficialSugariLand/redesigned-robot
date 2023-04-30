import "./closeFriend.scss";
import { Link } from "react-router-dom";


export default function CloseFriend({ people }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="online_friends_container">
      <Link to={"/profile/" + people.user_id}>
        <li className="sidebarFriend">
          <img className="sidebarFriendImg" src={people.profilePicture ? PF + people.profilePicture : PF + "person/1658876240053sugarisland.jpeg"} alt="" />
          <span className="sidebarFriendName">{people.username}</span>
        </li>
      </Link>
    </div>
  )
}
