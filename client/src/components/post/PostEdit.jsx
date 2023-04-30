//https://www.youtube.com/watch?v=VCBxy8yczEg   {Fetching existing desc value idea came from this}


import "./postEdit.css";
import { useState } from 'react'
import { Dialog } from '@material-ui/core';
import { PermMedia, Cancel } from "@material-ui/icons"
import axios from "axios";
import { useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function PostEdit({ openPopup, setOpenPopup, post, forwardedRef }) {
    //const [openPostEdit, setOpenPostEdit] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const desc = useRef();
    /* const img = useRef(); */
    /* const cancelRef = useRef(forwardedRef); */
    const { user } = useContext(AuthContext);
    const [editFile, setEditFile] = useState(null);
    const [currentDesc, setCurrentDesc] = useState(post.desc);
    /* const [currentImg, setCurrentImg] = useState(post.img); */

    const handleClick = async (e) => {
        e.preventDefault();
        const posts = {
            userId: user._id,
            desc: desc.current.value,
            //img: img.current.value,
        };
        if (editFile) {
            const data = new FormData();
            const fileName = Date.now() + editFile.name;
            data.append("name", fileName);
            data.append("file", editFile);
            posts.img = fileName;
            try {
                await axios.post("/upload", data);
            } catch (err) {
                console.log(err);
            }
        }
        try {
            await axios.put(`/posts/${post._id}`, posts, {
                data: {
                    userId: user._id,
                },
            });
            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <>
            <div className="editPostControlBox" ref={forwardedRef}>
                {openPopup &&
                    <div className="editPostControlBoxWrapper">
                        <div className="titleControl">Update your post</div>
                        <div className='editPostCancelControl' >
                            <div className="editPostCancelWrapper">
                                <Cancel className='editPostCancelButton' onClick={() => setOpenPopup(false)(window.location.reload())} />
                            </div>
                        </div>
                        <div className="editTopControl">
                            <input placeholder={""} className="editInputControl"
                                value={currentDesc} ref={desc} onChange={(e) => setCurrentDesc(e.target.value)} />
                        </div>
                        {editFile && (
                            <div className="editImgContainer">
                                <img className="editImgControl" src={URL.createObjectURL(editFile)} alt="" />
                                <Cancel className="editCancelImg" onClick={() => setEditFile(null)} />
                            </div>
                        )}
                        <form className="editPostFormControl" onSubmit={handleClick}>
                            <div className="editPostRight">
                                <div className="pictureUpdateControl">
                                    <div className="editOptions">
                                        <label /*htmlFor="file"*/ className="editOption">
                                            <PermMedia htmlColor="tomato" className="editImgIcon" />
                                            <span className="exitOptionText">Choose another photo</span>
                                            {/*<input style={{ display: "none" }} type={"file"} id="file" accept=".png,.jpeg,.jpg,.mp4,.mp3,.mkv" onChange={(e) => setEditFile(e.target.files[0])} /> */}
                                        </label>

                                    </div>
                                </div>
                                <div className="editButtonControl">
                                    <button className="editPostUpdateButton" type="submit">Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                }
            </div>
        </>
    );
};
