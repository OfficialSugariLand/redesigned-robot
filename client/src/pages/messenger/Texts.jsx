import "./texts.scss"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Message from "../../components/message/Message";

function Texts({ messages }) {
    const { user: currentUser } = useContext(AuthContext);

    return (
        <div className="texts">
            {
                messages?.map((m) => (
                    <Message message={m} own={m.sender === currentUser._id} key={m._id} />
                ))
            }
        </div>
    )
}

export default Texts