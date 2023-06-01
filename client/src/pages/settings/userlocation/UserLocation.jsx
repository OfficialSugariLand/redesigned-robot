import "./userLocation.scss";
import { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { BiArrowBack } from "react-icons/bi";
import Backdrop from '@mui/material/Backdrop';
import sugarilandlogo from "../../../components/topbar/sugarilandlogo/sugarilandlogo.png";

export default function UserLocation() {
    const [loading, setLoading] = useState(false);
    const { user, updateUserLocation } = useContext(AuthContext);
    const [infoSubmitSuccess, setInfoSubmitSuccess] = useState(false);
    const [getCountries, setGetCountries] = useState([]);
    const [editUserLocation, setEditUserLocation] = useState(false);
    const [userCountry, setUserCountry] = useState("");
    const [userState, setUserState] = useState("");
    const [userCity, setUserCity] = useState("");
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_COUNTRY_URL,
    });

    //Fetch countries
    useEffect(() => {
        const getAllCountries = async () => {
            try {
                const res = await axiosInstance.get("/countries");
                setGetCountries(res.data)
            } catch (err) {
                console.log(err)
            }
        };
        getAllCountries();
    });

    //Get selected country states
    const stateList = getCountries.find(myCountry => myCountry.country === userCountry)?.states;
    //Get selected country state cities
    const cityList = stateList?.find(myState => myState.state === userState)?.cities;

    //User location
    const handleClickLocation = async (e) => {
        e.preventDefault();
        const users = {
            username: user.username,
            email: user.email,
            desc: user.desc,
            dob: user.dob,
            gender: user.gender,
            interest: user.interest,
            sexuality: user.sexuality,
            relationship: user.relationship,
            country: userCountry,
            state: userState,
            city: userCity,
            phone_num: user.phone_num,
        };
        updateUserLocation(userCountry, userState, userCity, () => {
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
        <div className="location_settings">
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                        <img className="sugariLand_logo_loader" src={sugarilandlogo} alt="" />
                    </Backdrop>
                    :
                    <>
                        <div className="location_windows">
                            <div className="location_left">
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
                            <div className="location_right">
                                <span className="usr_location_head">Location</span>
                                <div className="user_location">
                                    <div className="user_current_location">
                                        <span>Country</span>
                                        <span>{user.country}</span>
                                    </div>
                                    <div className="user_current_location">
                                        <span>State</span>
                                        <span>{user.state}</span>
                                    </div>
                                    <div className="user_current_location">
                                        <span>City</span>
                                        <span>{user.city}</span>
                                    </div>
                                </div>
                                <button onClick={() => setEditUserLocation(prev => !prev)}>Edit</button>
                                <form onSubmit={handleClickLocation}>
                                    <div className={`change_user_input ${editUserLocation ? "show_edit_user" : "hide_edit_user"}`}>
                                        <div title="Go back" className="go_back" onClick={() => setEditUserLocation(prev => !prev)}>
                                            <BiArrowBack />
                                        </div>
                                        <div className="user_location_info">
                                            <select value={userCountry} onChange={(e) => setUserCountry(e.target.value)} >
                                                <option required>Select your country</option>
                                                {
                                                    getCountries.map((c, index) => (
                                                        <option value={c.country} key={index}>{c.country}</option>
                                                    ))
                                                }

                                            </select>
                                            <select value={userState} onChange={(e) => setUserState(e.target.value)} >
                                                <option required>Select your state</option>
                                                {
                                                    stateList?.map((s, index) => (
                                                        <option value={s.state} key={index}>{s.state}</option>
                                                    ))
                                                }
                                            </select>
                                            <select value={userCity} onChange={(e) => setUserCity(e.target.value)} >
                                                <option required>Select your city</option>
                                                {
                                                    cityList?.map((c, index) => (
                                                        <option value={c.city} key={index}>{c.city}</option>
                                                    ))
                                                }
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
                            </div>
                        </div>

                        <div className="location_mobile">
                            <div className="back_btn_location">
                                <Link to={"/settings"}>
                                    <BiArrowBack />
                                </Link>
                                <span className="usr_location_head">Location</span>
                            </div>
                            <div className="user_location">
                                <div className="user_current_location">
                                    <span>Country</span>
                                    <span>{user.country}</span>
                                </div>
                                <div className="user_current_location">
                                    <span>State</span>
                                    <span>{user.state}</span>
                                </div>
                                <div className="user_current_location">
                                    <span>City</span>
                                    <span>{user.city}</span>
                                </div>
                            </div>
                            <button onClick={() => setEditUserLocation(prev => !prev)}>Edit</button>
                            <form onSubmit={handleClickLocation}>
                                <div className={`change_user_input ${editUserLocation ? "show_edit_user" : "hide_edit_user"}`}>
                                    <div title="Go back" className="go_back" onClick={() => setEditUserLocation(prev => !prev)}>
                                        <BiArrowBack />
                                    </div>
                                    <div className="user_location_info">
                                        <select value={userCountry} onChange={(e) => setUserCountry(e.target.value)} >
                                            <option required>Select your country</option>
                                            {
                                                getCountries.map((c, index) => (
                                                    <option value={c.country} key={index}>{c.country}</option>
                                                ))
                                            }

                                        </select>
                                        <select value={userState} onChange={(e) => setUserState(e.target.value)} >
                                            <option required>Select your state</option>
                                            {
                                                stateList?.map((s, index) => (
                                                    <option value={s.state} key={index}>{s.state}</option>
                                                ))
                                            }
                                        </select>
                                        <select value={userCity} onChange={(e) => setUserCity(e.target.value)} >
                                            <option required>Select your city</option>
                                            {
                                                cityList?.map((c, index) => (
                                                    <option value={c.city} key={index}>{c.city}</option>
                                                ))
                                            }
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
                        </div>
                    </>
            }
            <div className={infoSubmitSuccess ? "info_success" : "hide_info_success"}>
                <div className="info_sub_success">
                    <span>Changed successfully</span>
                    <span className='close_info_success' onClick={() => {
                        setInfoSubmitSuccess(prev => !prev);
                        closeInfoSuccess(); setEditUserLocation(prev => !prev)
                    }}>Close</span>
                </div>
            </div>
        </div>
    )
}
