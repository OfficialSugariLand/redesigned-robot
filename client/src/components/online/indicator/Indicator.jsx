import axios from 'axios';

export default function Indicator({ socketUsers, onlineUsers }) {
    const online = socketUsers?.userId === onlineUsers?.user_id;

    //console.log(onlineFriends)
    return (
        <>
            <span className={online ? "rightbarOnline" : "rightbarOffline"}></span>
        </>
    )
}
