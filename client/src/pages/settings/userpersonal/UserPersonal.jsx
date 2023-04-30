import "./userPersonal.scss";
import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import moment from 'moment';
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../../components/topbar/sugarilandlogo/sugarilandlogo.png";

export default function UserPersonal() {
    const [loading, setLoading] = useState(false);
    const [infoSubmitSuccess, setInfoSubmitSuccess] = useState(false);
    const { user, updateUserGender, updateUserSexuality, updateUserInterest, updateUserRelate, updateUserAge } = useContext(AuthContext);
    const { dob, gender, sexuality, interest, relationship } = useRef();
    const [editUserGender, setEditUserGender] = useState(false);
    const [editUserSexual, setEditUserSexual] = useState(false);
    const [editUserInterest, setEditUserInterest] = useState(false);
    const [editUserRelate, setEditUserRelate] = useState(false);
    const [editUserAge, setEditUserAge] = useState(false);
    const [curGender, setCurGender] = useState("");
    const [curSexual, setCurSexual] = useState({ sexuality: "" });
    const [curInterest, setCurInterest] = useState({ interest: "" });
    const [curRelate, setCurRelate] = useState({ relationship: "" });
    const [curAge, setCurAge] = useState('');
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //User's age calculator
    var todaysDate = moment(new Date());
    const duration = moment.duration(todaysDate?.diff(user?.dob));
    const userCurAge = duration._data.years;

    //User gender
    const handleClickGender = async (e) => {
        e.preventDefault();
        const users = {
            username: user.username,
            email: user.email,
            desc: user.desc,
            dob: user.dob,
            gender: curGender,
            interest: user.interest,
            sexuality: user.sexuality,
            relationship: user.relationship,
            country: user.country,
            state: user.state,
            city: user.city,
            phone_num: user.phone_num,
        };
        updateUserGender(curGender, () => {
            try {
                axiosInstance.put(`/users/ownuser/${user.user_id}`, users);
                setInterval(() => {
                    setInfoSubmitSuccess(true);
                }, 1000);
                const setLoader = () => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false)
                    }, 1000)
                }
                setLoader();
            } catch (err) {
                console.log(err)
            }
        });
    };

    //Interest
    const handleClickInterest = async (e) => {
        e.preventDefault();
        const users = {
            username: user.username,
            email: user.email,
            desc: user.desc,
            dob: user.dob,
            gender: user.gender,
            interest: curInterest,
            sexuality: user.sexuality,
            relationship: user.relationship,
            country: user.country,
            state: user.state,
            city: user.city,
            phone_num: user.phone_num,
        };
        updateUserInterest(curInterest, () => {
            try {
                axiosInstance.put(`/users/ownuser/${user.user_id}`, users);
                setInterval(() => {
                    setInfoSubmitSuccess(true);
                }, 1000);
                const setLoader = () => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false)
                    }, 1000)
                }
                setLoader();
            } catch (err) {
                console.log(err)
            }
        });
    };

    //Sexuality
    const handleClickSexual = async (e) => {
        e.preventDefault();
        const users = {
            username: user.username,
            email: user.email,
            desc: user.desc,
            dob: user.dob,
            gender: user.gender,
            interest: user.interest,
            sexuality: curSexual,
            relationship: user.relationship,
            country: user.country,
            state: user.state,
            city: user.city,
            phone_num: user.phone_num,
        };
        updateUserSexuality(curSexual, () => {
            try {
                axiosInstance.put(`/users/ownuser/${user.user_id}`, users);
                setInterval(() => {
                    setInfoSubmitSuccess(true);
                }, 1000);
                const setLoader = () => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false)
                    }, 1000)
                }
                setLoader();
            } catch (err) {
                console.log(err)
            }
        });
    };

    //Relationship Status
    const handleClickRelate = async (e) => {
        e.preventDefault();
        const users = {
            username: user.username,
            email: user.email,
            desc: user.desc,
            dob: user.dob,
            gender: user.gender,
            interest: user.interest,
            sexuality: user.sexuality,
            relationship: curRelate,
            country: user.country,
            state: user.state,
            city: user.city,
            phone_num: user.phone_num,
        };
        updateUserRelate(curRelate, () => {
            try {
                axiosInstance.put(`/users/ownuser/${user.user_id}`, users);
                setInterval(() => {
                    setInfoSubmitSuccess(true);
                }, 1000);
                const setLoader = () => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false)
                    }, 1000)
                }
                setLoader();
            } catch (err) {
                console.log(err)
            }
        });
    };

    //Age
    const handleClickAge = async (e) => {
        e.preventDefault();
        const users = {
            username: user.username,
            email: user.email,
            desc: user.desc,
            dob: curAge,
            gender: user.gender,
            interest: user.interest,
            sexuality: user.sexuality,
            relationship: user.relationship,
            country: user.country,
            state: user.state,
            city: user.city,
            phone_num: user.phone_num,
        };
        updateUserAge(curAge, () => {
            try {
                axiosInstance.put(`/users/ownuser/${user.user_id}`, users);
                setInterval(() => {
                    setInfoSubmitSuccess(true);
                }, 1000);
                const setLoader = () => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false)
                    }, 1000)
                }
                setLoader();
            } catch (err) {
                console.log(err)
            }
        });
    };

    const closeInfoSuccess = () => {
        window.location.reload();
    }

    return (
        <div className="personal">
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                    </Backdrop>
                    :
                    <>
                        <div className="personal_windows">
                            <div className="personal_left">
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
                            <div className="personal_right">
                                {/* To set your gender */}
                                <div className="user_gender">
                                    <span>Gender</span>
                                    <span>{user.gender}</span>
                                    <button onClick={() => setEditUserGender(prev => !prev)}>Edit</button>
                                </div>
                                <form onSubmit={handleClickGender}>
                                    <div className={`change_user_input ${editUserGender ? "show_edit_user" : "hide_edit_user"}`}>
                                        <div title="Go back" className="go_back" onClick={() => setEditUserGender(prev => !prev)}>
                                            <BiArrowBack />
                                        </div>
                                        <div className="personal_info">
                                            <select ref={gender} value={curGender} onChange={(e) => setCurGender(e.target.value)}>
                                                <option>Select your Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                            <span>
                                                Important notice: If you are a girl who like girls
                                                and want to meet your match on Sugar ILand, don't
                                                fake your gender just to attract girls to avoid
                                                messy situations, you are adviced to state your
                                                real gender then edit your sexuality to suit your
                                                interest and you will find your match here.
                                                Sugar ILand got your interest covered.
                                            </span>
                                            <button className="submit_btn" type="submit">Update</button>
                                        </div>
                                    </div>
                                </form>
                                {/* To set the gender you're interested in */}
                                <div className="user_gender">
                                    <span>Your-Interest</span>
                                    <span>{user.interest}</span>
                                    <button onClick={() => setEditUserInterest(prev => !prev)}>Edit</button>
                                </div>
                                <form onSubmit={handleClickInterest}>
                                    <div className={`change_user_input ${editUserInterest ? "show_edit_user" : "hide_edit_user"}`}>
                                        <div title="Go back" className="go_back" onClick={() => setEditUserInterest(prev => !prev)}>
                                            <BiArrowBack />
                                        </div>
                                        <div className="personal_info">
                                            <select ref={interest} value={curInterest} onChange={(e) => setCurInterest(e.target.value)}>
                                                <option value="selectYourInterest" required>Select your Interest</option>
                                                <option value="Men">Men</option>
                                                <option value="Women">Women</option>
                                                <option value="Both">Both</option>
                                            </select>
                                            <span>
                                                Important notice: If you are a girl who like girls
                                                and want to meet your match on Sugar ILand, don't
                                                fake your gender just to attract girls to avoid
                                                messy situations, you are adviced to state your
                                                real gender then edit your sexuality to suit your
                                                interest and you will find your match here.
                                                Sugar ILand got your interest covered.
                                            </span>
                                            <button className="submit_btn" type="submit">Update</button>
                                        </div>
                                    </div>
                                </form>
                                {/* To set the sex you're interested in */}
                                <div className="user_gender">
                                    <span>Sexuality</span>
                                    <span>{user.sexuality}</span>
                                    <button onClick={() => setEditUserSexual(prev => !prev)}>Edit</button>
                                </div>
                                <form onSubmit={handleClickSexual}>
                                    <div className={`change_user_input ${editUserSexual ? "show_edit_user" : "hide_edit_user"}`}>
                                        <div title="Go back" className="go_back" onClick={() => setEditUserSexual(prev => !prev)}>
                                            <BiArrowBack />
                                        </div>
                                        <div className="personal_info">
                                            <select ref={sexuality} value={curSexual} onChange={(e) => setCurSexual(e.target.value)}>
                                                <option value="selectYourSexuality" required>Select your Sexuality</option>
                                                <option value="Straight">Straight</option>
                                                <option value="Gay">Gay</option>
                                                <option value="Lesbian">Lesbian</option>
                                                <option value="Bisexual">Bisexual</option>
                                            </select>
                                            <span>
                                                Important notice: If you are a girl who like girls
                                                and want to meet your match on Sugar ILand, don't
                                                fake your gender just to attract girls to avoid
                                                messy situations, you are adviced to state your
                                                real gender then edit your sexuality to suit your
                                                interest and you will find your match here.
                                                Sugar ILand got your interest covered.
                                            </span>
                                            <button className="submit_btn" type="submit">Update</button>
                                        </div>
                                    </div>
                                </form>
                                {/* To set your relationship status */}
                                <div className="user_gender">
                                    <span>Relationship</span>
                                    <span>{user.relationship}</span>
                                    <button onClick={() => setEditUserRelate(prev => !prev)}>Edit</button>
                                </div>
                                <form onSubmit={handleClickRelate}>
                                    <div className={`change_user_input ${editUserRelate ? "show_edit_user" : "hide_edit_user"}`}>
                                        <div title="Go back" className="go_back" onClick={() => setEditUserRelate(prev => !prev)}>
                                            <BiArrowBack />
                                        </div>
                                        <div className="personal_info">
                                            <select ref={relationship} value={curRelate} onChange={(e) => setCurRelate(e.target.value)}>
                                                <option value="selectYourRelationship" required>Relationship Status</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Divorced">Divorced</option>
                                                <option value="Widowed">Widowed</option>
                                            </select>
                                            <span>
                                                Important notice: If you are a girl who like girls
                                                and want to meet your match on Sugar ILand, don't
                                                fake your gender just to attract girls to avoid
                                                messy situations, you are adviced to state your
                                                real gender then edit your sexuality to suit your
                                                interest and you will find your match here.
                                                Sugar ILand got your interest covered.
                                            </span>
                                            <button className="submit_btn" type="submit">Update</button>
                                        </div>
                                    </div>
                                </form>
                                {/* To set your age */}
                                <div className="user_gender">
                                    <span>Age</span>
                                    <div>
                                        {
                                            userCurAge > 0 && <span>{userCurAge}</span>
                                        }
                                    </div>
                                    <button onClick={() => setEditUserAge(prev => !prev)}>Edit</button>
                                </div>
                                <form onSubmit={handleClickAge}>
                                    <div className={`change_user_input ${editUserAge ? "show_edit_user" : "hide_edit_user"}`}>
                                        <div title="Go back" className="go_back" onClick={() => setEditUserAge(prev => !prev)}>
                                            <BiArrowBack />
                                        </div>
                                        <div className="personal_info">
                                            <input type="date" ref={dob} value={curAge} required onChange={(e) => setCurAge(e.target.value)}>
                                            </input>
                                            <span>
                                                Important notice: If you are a girl who like girls
                                                and want to meet your match on Sugar ILand, don't
                                                fake your gender just to attract girls to avoid
                                                messy situations, you are adviced to state your
                                                real gender then edit your sexuality to suit your
                                                interest and you will find your match here.
                                                Sugar ILand got your interest covered.
                                            </span>
                                            <button className="submit_btn" type="submit">Update</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* Mobile */}
                        <div className="user_personal">
                            <Link to={"/settings"}>
                                <BiArrowBack />
                            </Link>
                            {/* To set your gender */}
                            <div className="user_gender">
                                <span>Gender</span>
                                <span>{user.gender}</span>
                                <button onClick={() => setEditUserGender(prev => !prev)}>Edit</button>
                            </div>
                            <form onSubmit={handleClickGender}>
                                <div className={`change_user_input ${editUserGender ? "show_edit_user" : "hide_edit_user"}`}>
                                    <div title="Go back" className="go_back" onClick={() => setEditUserGender(prev => !prev)}>
                                        <BiArrowBack />
                                    </div>
                                    <div className="personal_info">
                                        <select ref={gender} value={curGender} onChange={(e) => setCurGender(e.target.value)}>
                                            <option>Select your Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        <span>
                                            Important notice: If you are a girl who like girls
                                            and want to meet your match on Sugar ILand, don't
                                            fake your gender just to attract girls to avoid
                                            messy situations, you are adviced to state your
                                            real gender then edit your sexuality to suit your
                                            interest and you will find your match here.
                                            Sugar ILand got your interest covered.
                                        </span>
                                        <button className="submit_btn" type="submit">Update</button>
                                    </div>
                                </div>
                            </form>
                            {/* To set the sex you're interested in */}
                            <div className="user_gender">
                                <span>Sexuality</span>
                                <span>{user.sexuality}</span>
                                <button onClick={() => setEditUserSexual(prev => !prev)}>Edit</button>
                            </div>
                            <form onSubmit={handleClickSexual}>
                                <div className={`change_user_input ${editUserSexual ? "show_edit_user" : "hide_edit_user"}`}>
                                    <div title="Go back" className="go_back" onClick={() => setEditUserSexual(prev => !prev)}>
                                        <BiArrowBack />
                                    </div>
                                    <div className="personal_info">
                                        <select ref={sexuality} value={curSexual} onChange={(e) => setCurSexual(e.target.value)}>
                                            <option value="selectYourSexuality" required>Select your Sexuality</option>
                                            <option value="Straight">Straight</option>
                                            <option value="Gay">Gay</option>
                                            <option value="Lesbian">Lesbian</option>
                                            <option value="Bisexual">Bisexual</option>
                                        </select>
                                        <span>
                                            Important notice: If you are a girl who like girls
                                            and want to meet your match on Sugar ILand, don't
                                            fake your gender just to attract girls to avoid
                                            messy situations, you are adviced to state your
                                            real gender then edit your sexuality to suit your
                                            interest and you will find your match here.
                                            Sugar ILand got your interest covered.
                                        </span>
                                        <button className="submit_btn" type="submit">Update</button>
                                    </div>
                                </div>
                            </form>
                            {/* To set the gender you're interested in */}
                            <div className="user_gender">
                                <span>Your-Interest</span>
                                <span>{user.interest}</span>
                                <button onClick={() => setEditUserInterest(prev => !prev)}>Edit</button>
                            </div>
                            <form onSubmit={handleClickInterest}>
                                <div className={`change_user_input ${editUserInterest ? "show_edit_user" : "hide_edit_user"}`}>
                                    <div title="Go back" className="go_back" onClick={() => setEditUserInterest(prev => !prev)}>
                                        <BiArrowBack />
                                    </div>
                                    <div className="personal_info">
                                        <select ref={interest} value={curInterest} onChange={(e) => setCurInterest(e.target.value)}>
                                            <option value="selectYourInterest" required>Select your Interest</option>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                            <option value="Both">Both</option>
                                        </select>
                                        <span>
                                            Important notice: If you are a girl who like girls
                                            and want to meet your match on Sugar ILand, don't
                                            fake your gender just to attract girls to avoid
                                            messy situations, you are adviced to state your
                                            real gender then edit your sexuality to suit your
                                            interest and you will find your match here.
                                            Sugar ILand got your interest covered.
                                        </span>
                                        <button className="submit_btn" type="submit">Update</button>
                                    </div>
                                </div>
                            </form>
                            {/* To set your relationship status */}
                            <div className="user_gender">
                                <span>Relationship</span>
                                <span>{user.relationship}</span>
                                <button onClick={() => setEditUserRelate(prev => !prev)}>Edit</button>
                            </div>
                            <form onSubmit={handleClickRelate}>
                                <div className={`change_user_input ${editUserRelate ? "show_edit_user" : "hide_edit_user"}`}>
                                    <div title="Go back" className="go_back" onClick={() => setEditUserRelate(prev => !prev)}>
                                        <BiArrowBack />
                                    </div>
                                    <div className="personal_info">
                                        <select ref={relationship} value={curRelate} onChange={(e) => setCurRelate(e.target.value)}>
                                            <option value="selectYourRelationship" required>Relationship Status</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                        <span>
                                            Important notice: If you are a girl who like girls
                                            and want to meet your match on Sugar ILand, don't
                                            fake your gender just to attract girls to avoid
                                            messy situations, you are adviced to state your
                                            real gender then edit your sexuality to suit your
                                            interest and you will find your match here.
                                            Sugar ILand got your interest covered.
                                        </span>
                                        <button className="submit_btn" type="submit">Update</button>
                                    </div>
                                </div>
                            </form>
                            {/* To set your age */}
                            <div className="user_gender">
                                <span>Age</span>
                                <div>
                                    {
                                        userCurAge > 0 && <span>{userCurAge}</span>
                                    }
                                </div>
                                <button onClick={() => setEditUserAge(prev => !prev)}>Edit</button>
                            </div>
                            <form onSubmit={handleClickAge}>
                                <div className={`change_user_input ${editUserAge ? "show_edit_user" : "hide_edit_user"}`}>
                                    <div title="Go back" className="go_back" onClick={() => setEditUserAge(prev => !prev)}>
                                        <BiArrowBack />
                                    </div>
                                    <div className="personal_info">
                                        <input type="date" ref={dob} value={curAge} required onChange={(e) => setCurAge(e.target.value)}>
                                        </input>
                                        <span>
                                            Important notice: If you are a girl who like girls
                                            and want to meet your match on Sugar ILand, don't
                                            fake your gender just to attract girls to avoid
                                            messy situations, you are adviced to state your
                                            real gender then edit your sexuality to suit your
                                            interest and you will find your match here.
                                            Sugar ILand got your interest covered.
                                        </span>
                                        <button className="submit_btn" type="submit">Update</button>
                                    </div>
                                </div>
                            </form>
                        </div >
                    </>
            }
            <div className={infoSubmitSuccess ? "info_success" : "hide_info_success"}>
                <div className="info_sub_success">
                    <span>Changed successfully</span>
                    <span className='close_info_success' onClick={() => {
                        setInfoSubmitSuccess(prev => !prev);
                        closeInfoSuccess(); setEditUserGender(prev => !prev); /* setEditUserInterest(prev => !prev);
                        setEditUserSexual(prev => !prev); setEditUserRelate(prev => !prev); setEditUserAge(prev => !prev) */
                    }}>Close</span>
                </div>
            </div>
        </div>
    )
}