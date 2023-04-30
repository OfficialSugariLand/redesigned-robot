import { useEffect, useState } from "react";
import "./personal.scss"

export default function Personal({ formData, setFormData, genderState, genderOneOption, sexState, sexOneOption,
    interestState, intOneOption, relateStatusState, relateOneOption }) {
    const [genderCheck, setGenderCheck] = useState(false);
    const [sexCheck, setSexCheck] = useState(false);
    const [intCheck, setIntCheck] = useState(false);
    const [relateCheck, setRelateCheck] = useState(false);

    useEffect(() => {
        if (formData.gender === "" || formData.gender === genderOneOption) {
            setGenderCheck(false)
        } else {
            setGenderCheck(true)
        }
        if (formData.sexuality === "" || formData.sexuality === sexOneOption) {
            setSexCheck(false)
        } else {
            setSexCheck(true)
        }
        if (formData.interest === "" || formData.interest === intOneOption) {
            setIntCheck(false)
        } else {
            setIntCheck(true)
        }
        if (formData.relationship === "" || formData.relationship === relateOneOption) {
            setRelateCheck(false)
        } else {
            setRelateCheck(true)
        }
    }, [formData.gender, formData.sexuality, formData.interest, formData.relationship,
        genderOneOption, sexOneOption, intOneOption, relateOneOption])

    useEffect(() => {
        if (genderState && !genderCheck === true) {
            document.getElementById("gender_select").style.border = "1px solid red";
        } else {
            document.getElementById("gender_select").style.border = "1px solid green";
        }
        if (sexState && !sexCheck === true) {
            document.getElementById("sex_select").style.border = "1px solid red";
        } else {
            document.getElementById("sex_select").style.border = "1px solid green";
        }
        if (interestState && !intCheck === true) {
            document.getElementById("int_select").style.border = "1px solid red";
        } else {
            document.getElementById("int_select").style.border = "1px solid green";
        }
        if (relateStatusState && !relateCheck === true) {
            document.getElementById("relate_select").style.border = "1px solid red";
        } else {
            document.getElementById("relate_select").style.border = "1px solid green";
        }
    })

    return (
        <div className='personal_info'>
            <div className="personal_info_container">
                <div className="user_personal_info_left">
                    <h3>Sugar iLand</h3>
                    <span>Connect with people of same Interest
                    </span>
                </div>
                <div className="user_personal_info_right">
                    <div className="user_select_control">
                        <div className="select_container">
                            <select value={formData.gender} id="gender_select"
                                onChange={(event) => setFormData({ ...formData, gender: event.target.value })}>
                                <option >{genderOneOption}</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {
                                genderCheck !== true &&
                                <span className="showCheck_gender">{genderState}</span>
                            }
                        </div>

                        <div className="select_container">
                            <select value={formData.sexuality} id="sex_select"
                                onChange={(event) => setFormData({ ...formData, sexuality: event.target.value })}>
                                <option required >{sexOneOption}</option>
                                <option value="Straight">Straight</option>
                                <option value="Gay">Gay</option>
                                <option value="Lesbian">Lesbian</option>
                                <option value="Bisexual">Bisexual</option>
                            </select>
                            {
                                sexCheck !== true &&
                                <span className="showCheck_sex">{sexState}</span>
                            }
                        </div>

                        <div className="select_container">
                            <select value={formData.interest} id="int_select"
                                onChange={(event) => setFormData({ ...formData, interest: event.target.value })}>
                                <option required>{intOneOption}</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Both">Both</option>
                            </select>
                            {
                                intCheck !== true &&
                                <span className="showCheck_interest">{interestState}</span>
                            }
                        </div>

                        <div className="select_container">
                            <select value={formData.relationship} id="relate_select"
                                onChange={(event) => setFormData({ ...formData, relationship: event.target.value })}>
                                <option required>{relateOneOption}</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                            {
                                relateCheck !== true &&
                                <span className="showCheck_status">{relateStatusState}</span>
                            }
                        </div>

                        <input type="date" value={formData.dob} required
                            onChange={(event) => setFormData({ ...formData, dob: event.target.value })}>
                        </input>
                    </div>
                </div>
            </div>
        </div>
    )
}
