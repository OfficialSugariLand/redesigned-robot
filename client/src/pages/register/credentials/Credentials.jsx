import "./credentials.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
//import { FcPhoneAndroid } from "react-icons/fc";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import PhoneInput, { /*isValidPhoneNumber*/ } from "react-phone-number-input";
import "react-phone-number-input/style.css";
//import axios from "axios";

export default function Credentials({ formData, setFormData, usernameState, emailState, passwordState, passwordRepeatCheck,
}) {
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState();
  const [userState, setUserState] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  const [passCheck, setPassCheck] = useState(false);
  const [rePassCheck, setRePassCheck] = useState(false);

  useEffect(() => {
    if (formData.username.length < 3) {
      setUserState(false)
    } else {
      setUserState(true)
    }
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email_pattern.test(formData.email)) {
      setEmailCheck(false)
    } else {
      setEmailCheck(true)
    }
    const password_pattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
    if (!password_pattern.test(formData.password)) {
      setPassCheck(false)
    } else {
      setPassCheck(true)
    }
    if (formData.repeatPassword === "" || String(formData.repeatPassword) !== String(formData.password)) {
      setRePassCheck(false)
    } else {
      setRePassCheck(true)
    }
  }, [formData.username.length, formData.email, formData.password, formData.repeatPassword])

  //handle click state
  const handleClickEye = () => {
    setShowPass(!showPass)
  };

  useEffect(() => {
    if (usernameState && !userState === true) {
      document.getElementById("username_input").style.border = "1px solid red";
    } else {
      document.getElementById("username_input").style.border = "1px solid green";
    }
    if (emailState && !emailCheck === true) {
      document.getElementById("email_input").style.border = "1px solid red";
    } else {
      document.getElementById("email_input").style.border = "1px solid green";
    }
    if (passwordState && !passCheck === true) {
      document.getElementById("pass_input").style.border = "1px solid red";
    } else {
      document.getElementById("pass_input").style.border = "1px solid green";
    }
    if (passwordRepeatCheck && !rePassCheck === true) {
      document.getElementById("rep_pass_input").style.border = "1px solid red";
    } else {
      document.getElementById("rep_pass_input").style.border = "1px solid green";
    }
  })

  /* useEffect(() => {
    setFormData({ ...formData, phone_num: phone })
  }, [phone]) */
  console.log(formData)

  return (
    <div className="register">
      <div className="register_container">
        <div className="register_left">
          <h3>Sugar iLand</h3>
          <span>Connect with people of same Interest on Sugar iLand
          </span>
        </div>
        <div className="register_right">
          <div className="user_input_control">
            <div className="username_container">
              <input id="username_input" placeholder="Username" type="text" required value={formData?.username}
                onChange={(event) => setFormData({ ...formData, username: event.target.value })}
              />
              <FiUsers className="user_icon" />
              <div className="user_icon_divider">|</div>
              {
                userState === false &&
                <span className="username_check">{usernameState}</span>
              }
            </div>
            <div className="email_container">
              <input id="email_input" placeholder="Email" type={"email"} required value={formData?.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              />
              <MdOutlineMail className="email_icon" />
              <div className="email_icon_divider">|</div>
              {
                emailCheck === false &&
                <span className="check_email">{emailState}</span>
              }
            </div>
            <div className="password_container">
              <input id="pass_input" placeholder="Password" type={showPass ? "text" : "password"} required minLength={6} value={formData?.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              />
              <RiLockPasswordLine className="password_icon" />
              <div className="password_icon_divider">|</div>
              <div className="show_hide_password">
                {
                  showPass === false ? <Visibility onClick={handleClickEye} /> : <VisibilityOff onClick={handleClickEye} />
                }
              </div>
              {
                passCheck === false &&
                <span className="check_password">{passwordState}</span>
              }
            </div>
            <div className="confirm_password_container">
              <input id="rep_pass_input" placeholder="Confirm Password" type={showPass ? "text" : "password"} required value={formData?.repeatPassword}
                onChange={(event) => setFormData({ ...formData, repeatPassword: event.target.value })}
              />
              <RiLockPasswordLine className="repeat_password_icon" />
              <div className="repeat_pass_icon_divider">|</div>
              {
                rePassCheck === false &&
                <span className="check_passwordRepeat">{passwordRepeatCheck}</span>
              }
            </div>
            <div className="phone_container">
              <PhoneInput
                placeholder="Enter phone number"
                //value={phone}
                required value={formData?.phone_num}
                onChange={setPhone}
                //onChange={(event) => setFormData({ ...formData, phone_num: event.target?.value })}
                defaultCountry="US"
              />
            </div>
          </div>
          <h4>Already have an account?</h4>
          <div className="login_btn_con">
            <Link to={"/Login"}>
              <button>
                Login
              </button>
            </Link>
          </div>
        </div>
      </div >
    </div >
  )
}
