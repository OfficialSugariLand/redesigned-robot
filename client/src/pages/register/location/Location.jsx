import "./location.scss"
import { useEffect, useState } from 'react'
import axios from "axios";

export default function Location({ formData, setFormData }) {
    const [getCountries, setGetCountries] = useState([]);
    const [getStates, setGetStates] = useState([]);
    const [getCities, setGetCities] = useState([]);


    useEffect(() => {
        const getAllCountries = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/countries");
                setGetCountries(res.data)
            } catch (err) {
                console.log(err)
            }
        };
        getAllCountries();
    }, []);


    //https://www.youtube.com/watch?v=ddDFgH42kSg
    const selectedCountry = (e) => {
        const getCountryid = e.target.value;
        const stateList = getCountries.find(myCountry => myCountry.country === getCountryid).states;
        setGetStates(stateList)
        setFormData({ ...formData, country: e.target.value })
    };

    const selectedState = (e) => {
        const getStateid = e.target.value;
        const cityList = getStates.find(myState => myState.state === getStateid).cities;
        setGetCities(cityList)
        setFormData({ ...formData, state: e.target.value })
    };

    return (
        <div className='location'>
            <div className="localtion_container">
                <div className="user_location_left">
                    <h3>Sugar iLand</h3>
                    <span>Connect with people of same Interest on Sugar iLand
                    </span>
                </div>
                <div className="user_location_right">
                    <div className="user_location_control">
                        <select value={formData.county} onChange={(e) => selectedCountry(e)} /* ref={formData.country} */>
                            <option required>Select your country</option>
                            {
                                getCountries.map((c, index) => (
                                    <option value={c.country} key={index}>{c.country}</option>
                                ))
                            }

                        </select>
                        <select onChange={(e) => selectedState(e)} /* ref={formData.state} */>
                            <option required>Select your state</option>
                            {
                                getStates.map((s, index) => (
                                    <option value={s.state} key={index}>{s.state}</option>
                                ))
                            }
                        </select>
                        <select value={formData.city}
                            onChange={(event) => setFormData({ ...formData, city: event.target.value })} /* ref={formData.city} */>
                            <option required>Select your city</option>
                            {
                                getCities.map((c, index) => (
                                    <option value={c.city} key={index}>{c.city}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}
