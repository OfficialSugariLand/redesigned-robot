import "./userMap.scss";

export default function UserMap({ textUsers }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <div className='userMap'>
            <img src={PF + textUsers.profilePicture} alt="" />
        </div>
    )
}
