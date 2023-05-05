import "./profileHead.scss";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { MdOutlineCancel, MdPhotoLibrary } from "react-icons/md";
import CropIcon from '@mui/icons-material/Crop';
import { Slider, Typography } from '@mui/material';
import axios from 'axios';
import ChatIcon from '@material-ui/icons/Chat';
import { AuthContext } from "../../../context/AuthContext";
import getCroppedImg from "../imageCrop/utils/cropImage";
import Cropper from 'react-easy-crop';
import Backdrop from '@mui/material/Backdrop';
// import DotLoader from "react-spinners/DotLoader";

export default function ProfileHead({ user }) {
    const [loading, setLoading] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let isRendered = useRef(false);
    const [infoSubmitSuccess, setInfoSubmitSuccess] = useState(false);
    const user_id = useParams().user_id;
    const [currentUser, setCurrentUser] = useState([]);
    const [changeDp, setChangeDp] = useState(false);
    const [file, setFile] = useState(null);
    const { setAlert, updateUserPic } = useContext(AuthContext);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [photoURL, setPhotoURL] = useState();
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Get visited profile userId
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/users/${user_id}`)
            .then(res => {
                if (isRendered) {
                    setCurrentUser(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user_id]);

    const curUser = currentUser?.find((m) => m);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPhotoURL(URL.createObjectURL(file));
        }
    };

    //Crop Image func
    const cropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const zoomPercent = (value) => {
        return `${Math.round(value * 100)}%`;
    };

    const cropImage = async () => {
        try {
            const { file, url } = await getCroppedImg(
                photoURL,
                croppedAreaPixels,
            );
            setPhotoURL(url);
            setFile(file);
        } catch (error) {
            setAlert({
                isAlert: true,
                severity: 'error',
                message: error.message,
                timeout: 5000,
                location: 'modal',
            });
            console.log(error);
        }
    };

    //Post profile photo
    const submitProfile = async (e) => {
        e.preventDefault()
        const newProfilePic = {
            profilePicture: photoURL
        }
        if (file) {
            const data = new FormData();
            const fileName = Date.now() + "_" + user.username + "_sugarilandconnect.jpg";
            data.append("name", fileName);
            data.append("file", file);
            newProfilePic.profilePicture = fileName;
            try {
                await axiosInstance.post("/upload", data);
            } catch (err) {
                console.log(err);
            }
            updateUserPic(fileName, async () => {
                try {
                    await axiosInstance.put(`/users/ownuserpicture/${user.user_id}`, newProfilePic);
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
        }

    };

    const closeInfoSuccess = () => {
        window.location.reload();
    }

    //Set body scroll to hidden when modal is open
    useEffect(() => {
        const fixedBody = () => {
            if (infoSubmitSuccess === true) {
                document.body.style = "position: fixed !important";
            } else {
                document.body.style = "position: initial !important";
            }
        };
        fixedBody();
    }, [infoSubmitSuccess])

    return (
        <div className="user_profile_up_container">
            {
                loading ?
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                    </Backdrop>
                    :
                    <>
                        <img className="user_profile_cover" src={PF + "person/profileCovers.png"} alt="Profile Cover" />
                        <div className="usrImage_usrChangeImage">
                            <img className="user_profile_dp_img" src={curUser?.profilePicture ? PF + curUser?.profilePicture
                                : PF + "person/1658876240053sugarisland.jpeg"} alt="display dp"
                            />
                            {(!user_id || user_id === user?.user_id) &&
                                <button className="user_dp_change_icon" title="Change profile picture" onClick={() => setChangeDp(prev => !prev)}>
                                    <CameraAltIcon />
                                </button>
                            }
                        </div>
                        <div className={`change_profile_dp ${changeDp ? "show_change_dp" : "hide_chnage_dp"}`}>
                            <button className="cancel_btn" title="Cancel" onClick={() => setChangeDp(!changeDp)}>
                                <MdOutlineCancel />
                            </button>
                            {file ?
                                (
                                    <form className="photo_container" onSubmit={submitProfile} onChange={(e) => setFile(e.target.value)}>
                                        <div className="photo_container_wrapper">
                                            <button className="remove_photo_btn" title="Cancel" onClick={() => setFile(null)}>
                                                <MdOutlineCancel />
                                            </button>
                                            <div className="dialogContentBox">
                                                <Cropper
                                                    image={photoURL}
                                                    crop={crop}
                                                    zoom={zoom}
                                                    aspect={1}
                                                    onZoomChange={setZoom}
                                                    onCropChange={setCrop}
                                                    onCropComplete={cropComplete}
                                                />
                                            </div>
                                        </div>
                                        <div className="zoom_slider">
                                            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
                                            <Slider
                                                valueLabelDisplay="auto"
                                                valueLabelFormat={zoomPercent}
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                value={zoom}
                                                onChange={(e, zoom) => setZoom(zoom)}
                                            />
                                        </div>
                                        <div className="image_crop_zoom">
                                            <div className="cropImageButton" onClick={cropImage}>
                                                <CropIcon />
                                                Crop
                                            </div>
                                            <button className="submit_btn" title="Submit your photo">Submit</button>
                                        </div>
                                    </form>
                                )
                                :
                                (
                                    <div className="change_dp_container">
                                        <img src={PF + currentUser.profilePicture} alt="" />
                                        <label htmlFor="filedp">
                                            <span>+ Update profile Picture</span>
                                            <input style={{ display: "none" }} type="file" id="filedp" accept=".png,.jpeg,.jpg"
                                                onChange={handleChange}
                                            />
                                        </label>
                                    </div>
                                )
                            }
                        </div>
                        <h4>{curUser?.username}</h4>
                        <span>{curUser?.desc}</span>
                        <div className="user_messenger_image_btn">
                            <Link className="user_images_view" to={`/profile/${curUser?.user_id}/photos`} >
                                <MdPhotoLibrary />
                                Images
                            </Link>
                            {(!user?.user_id || user?.user_id !== curUser?.user_id) &&
                                <Link to={`/protext/${curUser?.user_id}`}>
                                    <button className="text_user">
                                        <ChatIcon />
                                        Message
                                    </button>
                                </Link>
                            }
                        </div>
                    </>
            }
            <div className={infoSubmitSuccess ? "info_success" : "hide_info_success"}>
                <div className="info_sub_success">
                    <span>You've successfully changed your profile picture</span>
                    <span className='close_info_success' onClick={() => {
                        setInfoSubmitSuccess(prev => !prev);
                        closeInfoSuccess(); setChangeDp(prev => !prev)
                    }}>Close</span>
                </div>
            </div>
        </div>
    )
}
