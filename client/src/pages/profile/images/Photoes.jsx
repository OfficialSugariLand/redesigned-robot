import "./photoes.scss";
import { useEffect, useState } from "react";
import PostsMap from "./PostsMap";

export default function Photoes({ post, posts, index }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [imageOpen, setImageOpen] = useState(false);
    const [current, setCurrent] = useState({ img: '', index: 0 });



    //Click on the image to open
    const viewImg = (img, index) => {
        setCurrent({ img, index });
        //console.log(img, index)
    }

    //Set body scroll to hidden when modal is open
    useEffect(() => {
        if (imageOpen === true) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    });

    return (
        <div className="photo">
            <div className="photo_wrapper">
                <div className="photo_container">
                    <img src={PF + post.img} alt="" onClick={() => { setImageOpen(prev => !prev); viewImg(PF + post.img, index) }} />
                </div>
                <div className={`images_open ${imageOpen ? 'show_images' : 'hide_images'}`}>
                    <PostsMap posts={posts} index={index} setImageOpen={setImageOpen}
                        imageOpen={imageOpen} current={current} setCurrent={setCurrent}
                    />
                </div>
            </div>
        </div>
    )
}
