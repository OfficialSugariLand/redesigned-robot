import "./postMap.scss"
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


export default function PostsMap({ posts, setImageOpen, imageOpen, current, setCurrent, index }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const length = posts.length;

   /*  const nextSlide = () => {
        setCurrent(current === length ? current + 1 : current - 1)
    }
    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1)
    } */

    const imgSlider = (action) => {
        const index = imageOpen.index;
        if (action === 'next_img') {
            setCurrent({ img: posts.img[posts + 1], index: index + 1 });
        }
        if (action === 'previous_img') {
            //setImageOpen({ img: post.img[index - 1], index: index - 1 });
            setCurrent({ img: posts.img[index - 1], index: index - 1 });
        }
        if (!action) {
            setCurrent({ img: '', index: 0 });
        }
    }

    //console.log(posts)


    /* const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1)
    }
    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1)
    } */

    //console.log(current)

    /* if (!Array.isArray(posts) || posts.length <= 0) {
        return null;
    } */

    return (
        <div className="images_slider">
            <div className="images_slider_container">
                <div className="cancel" title="Close" onClick={() => setImageOpen(!imageOpen)}>
                    <CloseIcon />
                </div>
                <div className="arrow_left" title="Previous" onClick={() => imgSlider('previous_img')}>
                    <ArrowLeftIcon />
                </div>
                <div className="arrow_right" title="Next" onClick={() => imgSlider('next_img')}>
                    <ArrowRightIcon />
                </div>
                <div className={index === current ? "slide active" : "slide"}>
                    {/* <img src={current.img} alt="images slide" /> */}
                    {current && (
                        <img src={current.img} alt="images slide" />
                    )}
                </div>
                {/* {
                    posts.map((data, index) => {
                        return (
                            <div className={index === current ? "slide active" : "slide"} key={index}>
                                {index === current && (
                                    <img src={PF + data.img} alt="images slide" />
                                )}
                            </div>
                        )
                    })
                } */}
            </div>
        </div>
    )
}
