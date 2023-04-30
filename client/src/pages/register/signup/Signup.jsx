import "./signup.scss";
import axios from "axios";
import { useEffect, useState } from 'react';
import Personal from "../../register/personal/Personal";
import Location from "../../register/location/Location";
import Credentials from "../../register/credentials/Credentials";
import { useNavigate } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../../components/topbar/sugarilandlogo/sugarilandlogo.png";

export default function Signup() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    //const [phone, setPhone] = useState();
    const [page, setPage] = useState(0);
    const navigate = useNavigate();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
        profilePicture: "",
        coverPicture: "",
        isAdmin: "false",
        desc: "",
        dob: '',
        gender: "",
        interest: "",
        sexuality: "",
        relationship: "",
        country: "",
        state: "",
        city: "",
        user_id: "",
        phone_num: ''
    });

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, []);

    //Get Post Users
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axiosInstance.get("/users/email/values");
            setUsers(res.data);
        };
        fetchUser();
    }, []);

    const checkEmailExist = users?.find((u) => u.email === formData?.email)

    const [usernameState, setUsernameState] = useState();
    const username_pattern = /^[A-Za-z0-9]{3,16}$/
    const [emailState, setEmailState] = useState();
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const [passwordState, setPasswordState] = useState();
    const password_pattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
    const [passwordRepeatCheck, setPasswordRepeatCheck] = useState();
    const [genderState, setGenderState] = useState();
    const genderOneOption = "Select your Gender";
    const [sexState, setSexState] = useState();
    const sexOneOption = "Select your Sexuality";
    const [interestState, setInterestState] = useState();
    const intOneOption = "Select your Interest";
    const [relateStatusState, setRelateStatusState] = useState();
    const relateOneOption = "Select your relationship status";
	//eslint-disable-next-line
    const PHONE_REGEX = new RegExp(/"^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"/gmi);
    //const [phoneState, setPhoneState] = useState();

    const checkErrors = () => {
        let error = {}
        if (formData.username === "") {
            error.username = "Username cannot be empty"
            setUsernameState(error.username)
        } else if (!username_pattern.test(formData.username)) {
            error.username = "Username should be 3-16 characters and shouldn't include any special character!"
            setUsernameState(error.username)
        }
        if (formData.email === "") {
            error.email = "Email should not be empty"
            setEmailState(error.email)
        } else if (!email_pattern.test(formData.email)) {
            error.email = "Email is not valid"
            setEmailState(error.email)
        } else if (checkEmailExist) {
            error.email = "Email already exist & cannot be used!"
            setEmailState(error.email)
        }
        if (formData.password === "") {
            error.password = "Password cannot be empty"
            setPasswordState(error.password)
        } else if (!password_pattern.test(formData.password)) {
            error.password = "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!"
            setPasswordState(error.password)
        }
        if (formData.repeatPassword === "" || String(formData.repeatPassword) !== String(formData.password)) {
            error.repeatPassword = "Password did not match"
            setPasswordRepeatCheck(error.repeatPassword)
        }
        if (formData.gender === "") {
            error.gender = "Gender cannot be empty"
            setGenderState(error.gender)
        } else if (formData.gender === genderOneOption) {
            error.gender = "Please select your gender"
            setGenderState(error.gender)
        } if (formData.sexuality === "") {
            error.sexuality = "Sex cannot be empty"
            setSexState(error.sexuality)
        } else if (formData.sexuality === sexOneOption) {
            error.sexuality = "Please select your sex"
            setSexState(error.sexuality)
        } if (formData.interest === "") {
            error.interest = "Interest cannot be empty"
            setInterestState(error.interest)
        } else if (formData.interest === intOneOption) {
            error.interest = "Please select your interest"
            setInterestState(error.interest)
        } if (formData.relationship === "") {
            error.relationship = "Relationship status cannot be empty"
            setRelateStatusState(error.relationship)
        } else if (formData.relationship === relateOneOption) {
            error.relationship = "Please select your relationship status"
            setRelateStatusState(error.relationship)
        }
        if (PHONE_REGEX.test(formData.phone_num)) {
            error.phone_num = null;
        } else {
            error.phone_num = "Invalid phone number. Please try again."
            //setPhoneState(error.phone_num)
        }
    }

    const slideTitle = ["#Sign-Up", "#Personal-Info", "#Location"];
    const curPageDisplay = () => {
        if (page === 0) {
            return <Credentials formData={formData} setFormData={setFormData}
                emailState={emailState} passwordState={passwordState}
                passwordRepeatCheck={passwordRepeatCheck} usernameState={usernameState}
            /*  phone={phone} setPhone={setPhone} */
            />
        } else if (page === 1) {
            return <Personal formData={formData} setFormData={setFormData} genderOneOption={genderOneOption}
                genderState={genderState} sexState={sexState} sexOneOption={sexOneOption}
                interestState={interestState} intOneOption={intOneOption} relateStatusState={relateStatusState}
                relateOneOption={relateOneOption}
            />
        } else if (page === 2) {
            return <Location formData={formData} setFormData={setFormData} />
        }
    }

    const handleClick = async (e) => {
        e.preventDefault();
        if (formData.repeatPassword !== formData.password) {
            formData.repeatPassword.current.setCustomValidity("Password is not same!")
        } else {
            try {
                await axiosInstance.post("/users", formData);
                navigate("/login", { replace: true })
            } catch (err) {
                console.log(err)
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className='slide_steps_container'>
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        {/* <DotLoader color={"#dd73d2"} /> */}
                        <div className="sugar_loader_content">
                            <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                        </div>
                    </Backdrop>
                    :
                    <div className="slide_step">
                        <div className="sign_up_up_container">
                            <div className="progress_bar">
                                <div style={{ width: page === 0 ? "33.3%" : page === 1 ? "66.6%" : "100%" }}></div>
                            </div>
                            <header className="slide_title">{slideTitle[page]}</header>
                        </div>
                        <div className="sign_up_body_container">
                            <div className="body_container">{curPageDisplay()}</div>
                        </div>
                        <div className="sign_up_down_container">
                            <form className="prev_next_btn" onSubmit={handleSubmit}>
                                <button disabled={(page == (slideTitle.length < 1))}
                                    onClick={() => { setPage((presPage) => presPage - 1) }}>
                                    Prev
                                </button>
                                <div className={page === slideTitle.length - 1 ? "hide_next_btn" : "show_next_btn"}>
                                    <button type="submit" disabled={page === slideTitle.length - 1}
                                        onClick={() => {
                                            formData.username === "" ? checkErrors() : !username_pattern.test(formData.username) ? checkErrors() :
                                                formData.email === "" ? checkErrors() : !email_pattern.test(formData.email) ? checkErrors() :
                                                    formData.password === "" ? checkErrors() : !password_pattern.test(formData.password) ? checkErrors() :
                                                        formData.repeatPassword === "" || String(formData.repeatPassword) !== String(formData.password)
                                                            ? checkErrors() : checkEmailExist ? checkErrors() :
                                                                page === 1 && formData.gender === "" ? checkErrors() :
                                                                    page === 1 && formData.gender === genderOneOption ? checkErrors() :
                                                                        page === 1 && formData.sexuality === "" ? checkErrors() :
                                                                            page === 1 && formData.sexuality === sexOneOption ? checkErrors() :
                                                                                page === 1 && formData.interest === "" ? checkErrors() :
                                                                                    page === 1 && formData.interest === intOneOption ? checkErrors() :
                                                                                        page === 1 && formData.relationship === "" ? checkErrors() :
                                                                                            page === 1 && formData.relationship === relateOneOption ? checkErrors() :
                                                                                                PHONE_REGEX.test(formData.phone_num) ? checkErrors() :
                                                                                                    setPage((presPage) => presPage + 1)
                                        }} >
                                        Next
                                    </button>
                                </div>
                                <div className={page === slideTitle.length - 1 ? "show_submit_btn" : "hide_submit_btn"}>
                                    <button type="submit" onClick={(e) => { handleClick(e) }}>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
            }
        </div>
    )
}
