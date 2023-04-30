import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext';

export default function Location() {
    const { user } = useContext(AuthContext);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });
    const [editUserLocation, setEditUserLocation] = useState(false);
    const [getCountries, setGetCountries] = useState([]);
    const [getStates, setGetStates] = useState([]);
    const [getCities, setGetCities] = useState([]);

    const [formData, setFormData] = useState({
        userId: user._id,
        phoneNumber: "",
        country: "",
        state: "",
        city: ""
    });

    /* Location Settings */
    useEffect(() => {
        const getAllCountries = async () => {
            try {
                const res = await axios.get("/countries");
                setGetCountries(res.data)
            } catch (err) {
                console.log(err)
            }
        };
        getAllCountries();
    });

    const selectedCountry = (e) => {
        const getCountryid = e.target.value;
        const stateList = getCountries?.find(myCountry => myCountry.country === getCountryid).states;
        setGetStates(stateList)
        setFormData({ ...formData, country: e.target.value })
    };

    const selectedState = (e) => {
        const getStateid = e.target.value;
        const cityList = getStates?.find(myState => myState.state === getStateid).cities;
        setGetCities(cityList)
        setFormData({ ...formData, state: e.target.value })
    };

    const handleClick = async (e) => {
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
            country: formData.country,
            state: formData.state,
            city: formData.city,
            phone_num: user.phone_num,
            username: username.current.value,
        };
        try {
            await axiosInstance.put(`/users/ownuser/${user.user_id}`, users);
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div className="user_info_control">
            <ul>
                <div className="username">
                    <span>Location</span>
                    <span>Chane your location</span>
                    <span className="user_location">{user.city}</span>
                    <button onClick={() => setEditUserLocation(prev => !prev)}>Edit</button>
                </div>
                <form onSubmit={handleClick}>
                    <div className={`change_user_input ${editUserLocation ? "show_edit_user" : "hide_edit_user"}`}>
                        <div className="user_location_control">
                            <select value={formData.country} onChange={(e) => selectedCountry(e)} /* ref={formData.country} */>
                                <option required>Select your country</option>
                                {
                                    getCountries?.map((c, index) => (
                                        <option value={c.country} key={index}>{c.country}</option>
                                    ))
                                }
                            </select>
                            <select onChange={(e) => selectedState(e)}>
                                <option required>Select your state</option>
                                {
                                    getStates?.map((s, index) => (
                                        <option value={s.state} key={index}>{s.state}</option>
                                    ))
                                }
                            </select>
                            <select value={formData.city}
                                onChange={(event) => setFormData({ ...formData, city: event.target.value })} >
                                <option required>Select your city</option>
                                {
                                    getCities?.map((c, index) => (
                                        <option value={c.city} key={index}>{c.city}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <button className="submit_btn" type="submit">Update</button>
                    </div>
                </form>
            </ul>
        </div>
    )
}
