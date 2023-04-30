import "./login.css";
import { useRef, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { loginCall } from "../../../apiCalls";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@material-ui/icons";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);
  const handleClick = (e) => {
    e.preventDefault();
    loginCall({ email: email.current.value, password: password.current.value }, dispatch);

  };

  const [openEye, setOpenEye] = useState(false)

  //handle click state
  const handleClickEye = () => {
    setOpenEye(!openEye)
  };

  return (
    <div className="login-page">
      <div className="login-Wrapper">
        <div className="login-Left">
          <h3 className="login-Logo">Sugar iLand</h3>
          <span className="login-Desc">Connect with people of same Interest
          </span>
        </div>
        <div className="user-Login-Right">
          <form className="login_box" onSubmit={handleClick}>
            <div className="user-Login-Input">
              <input placeholder="Email" type={"email"} required className="login-Inputs" ref={email} />
              <FaUserAlt className="user-icons" />
              <div className="user_icons_divider">|</div>
              <input placeholder="Password" type={(openEye === false) ? "password" : "text"} required minLength={6} className="login-Inputs" ref={password} />
              <RiLockPasswordFill className="password_icons" />
              <div className="password-icons-divider">|</div>
              <div className="show-hide-password">
                {
                  (openEye === false) ? <Visibility onClick={handleClickEye} /> : <VisibilityOff onClick={handleClickEye} />
                }
              </div>
            </div>
            <div className="forgot-password">
              <Link to={"/forgot-password"}>
                <span className="forgot-password-text">Forgot Password?</span>
              </Link>
            </div>
            <div className="user-login-btn-con">
              <button className="user-login-btn" type="submit" disabled={isFetching}>
                {isFetching ? <CircularProgress size={"30px"} /> : "Login"}
              </button>
            </div>
            <div className="user-reg-new-btn">
              <Link to={"/register-steps"}>
                <button className="user-reg-btn">
                  {isFetching ? <CircularProgress size={"30px"} /> : "Register new account"}
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
