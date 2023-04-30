import "./profilePic.scss";
import { AuthContext } from "../../../context/AuthContext";
import { Cancel } from "@material-ui/icons";
import CropIcon from '@mui/icons-material/Crop';
import { useContext, useState } from "react";
import Cropper from 'react-easy-crop';
import { Slider, Typography } from '@mui/material';
import getCroppedImg from "./utils/cropImage";

export default function ProfilePic({ photoURL, setOpenCrop, setPhotoURL, setFile }) {
    const { setAlert, setLoading } = useContext(AuthContext);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const cropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    console.log(photoURL)

    const zoomPercent = (value) => {
        return `${Math.round(value * 100)}%`;
    };

    const cropImage = async () => {
        setLoading(true);
        try {
            const { file, url } = await getCroppedImg(
                photoURL,
                croppedAreaPixels,
            );
            setPhotoURL(url);
            setFile(file);
            setOpenCrop(false);
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
        setLoading(false);
    };

    return (
        <div className="image_crop">
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
            <div className="cropAreaCancelButton">
                <Cancel onClick={() => setOpenCrop(false)} />
            </div>
            <div className="image_crop_zoom">
                <div className="zoom_slider">
                    <div>
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
                </div>
                <div className="cropImageButton" onClick={cropImage}>
                    <CropIcon />
                    Crop
                </div>
            </div>
        </div>
    );
};