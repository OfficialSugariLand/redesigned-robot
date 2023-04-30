import { Link } from "react-router-dom";
import "./passSuccess.scss";

export default function PassSuccess() {
    return (
        <div className="pass_success">
            <div className="pass_success_container">
                <div className="pass_succeed_container">
                    <div className="pass_succeeded_container">
                        <span>You have successfully changed your password</span>
                        <span className="success_line"></span>
                        <span>Click the login below to access your profile</span>
                        <span className="password_reset">
                            <Link to={"/login"}>
                                Login
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
