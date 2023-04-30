import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { AuthContext } from "../../context/AuthContext";
import Notify from '../notify/Notify';

export default function Modal() {
    const { modal, setModal, alert: { location, isAlert }, setAlert, } = useContext(AuthContext);

    const handleClose = () => {
        setModal({ ...modal, isOpen: false });
    };

    useEffect(() => {
        if (modal.isOpen === false) {
            if (isAlert && location === 'modal') {
                setAlert({ ...alert, isAlert: false });
            }
        }
    }, [modal?.isOpen]);
    return (
        <Dialog open={modal.isOpen} onClose={handleClose}>
            <DialogTitle>
                {modal.title}
                <IconButton
                    aria-label="Close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            {location === 'modal' && <Notify />}
            {modal.content}
        </Dialog>
    )
}
