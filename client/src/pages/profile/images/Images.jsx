/*
https://www.youtube.com/watch?v=t6yN_NtTU6Q
Custom Image Slider in React JS
*/
import "./images.scss";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileHead from "../profileHead/ProfileHead";
import Photoes from "./Photoes";
import { AuthContext } from "../../../context/AuthContext";

export default function Images() {
    const { user } = useContext(AuthContext);
    const usersId = useParams().usersId;
    const [posts, setPosts] = useState([]);

    //Get Pictures
    useEffect(() => {
        const fetchPosts = async () => {
            const res =
                await axios.get(`/posts/profile/${usersId}/photos`)
            setPosts(res.data?.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
            );
        };
        fetchPosts();
    }, [usersId]);

    //console.log(posts)
    /* useEffect(() => {
        const fetchPostsImg = async () => {
            const newPosts = posts.map((post) => post.img)
            setMappedPost({ newPosts });
        };
        fetchPostsImg();
    }, [posts]); */

    //const setMappedPosts = [...posts.values()];
    //console.log("posts", mappedPost)

    /*  const handleClick = (img, index) => {
         setCurrentIndex(index);
         setClickedImg(img)
     } */

    /* const handleRotationRight = () => {
        const totalLenght = posts.map((m) => (m.img));
        const totalLengths = totalLenght.length;
    } */

    /* console.log("values", mappedPost) */

    /*     var currentScroll = 0;
        function lockscroll() {
            $(window).scrollTop(currentScroll);
        }
        $(viewImg).mouseenter(function () {
            currentScroll = $(window).scrollTop();
            $(window).bind('scroll', lockscroll);
        }).mouseleave(function () {
            currentScroll = $(window).scrollTop();
            $(window).unbind('scroll', lockscroll);
        }); */

    /*     useEffect(() => {
            document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll(viewImg).forEach(trigger => {
                    trigger.addEventListener('click', function () {
                        document.querySelectorAll('body').forEach(target => target.classList.add('no-scroll'));
                    });
                });
            });
    
            document.querySelectorAll('.hide_images').forEach(trigger => {
                trigger.addEventListener('click', function () {
                    document.querySelectorAll('body').forEach(target => target.classList.remove('no-scroll'));
                });
            });
        }); */

    /* useEffect(() => {
        const body = document.querySelector("body");
        const clickToViewImg = function (e) {
            viewImg.classList.toggle(e.target);
            if (viewImg && dropMenuRef.current && !dropMenuRef.current.contains(e.target)) {
                // Disable scroll
                body.style.overflow = "hidden";
            } else {
                // Enable scroll
                body.style.overflow = "auto";
            }
        };
        document.addEventListener("mousedown", clickToViewImg);
        return () => {
            document.removeEventListener("mousedown", clickToViewImg);
        }
    }, [viewImg]); */

    /*     useEffect(() => {
            const checkIfClickedOutside = (e) => {
                if (openDropDown && dropMenuRef.current && !dropMenuRef.current.contains(e.target)) {
                    setOpenDropDown(false);
                }
            };
            document.addEventListener("mousedown", checkIfClickedOutside);
            return () => {
                document.removeEventListener("mousedown", checkIfClickedOutside);
            }
        }, [openDropDown]); */

    /*     useEffect(() => {
            const modal = document.querySelector("#modal");
            const body = document.querySelector("body");
    
            const viewImg = function (e) {
                modal.classList.toggle("hidden");
    
                if (!modal.classList.contains("hidden")) {
                    // Disable scroll
                    body.style.overflow = "hidden";
                } else {
                    // Enable scroll
                    body.style.overflow = "auto";
                }
            };
        }) */

    return (
        <>
            <div className="user_images_section_container">
                <div className="user_images_container">
                    <ProfileHead />
                    <div className="user_images_down_container">
                        <header className="username_gallery">
                            <h3>
                                {user.username}
                                <span>  Gallery</span>
                            </h3>
                        </header>
                        <div className="user_images_map">
                            {
                                posts.map((p, index) => {
                                    return (
                                        <Photoes posts={posts} post={p} index={index} key={index} />
                                    )
                                })
                            }
                        </div>
                        {
                            /*                         <div className={viewImg ? "viewImg open" : "viewImg"}>
                                <button className="image_slide_left_icon" onClick={prevImageHandler}>
                                    <ArrowLeftIcon />
                                </button>
                                <img src={tempImg} alt="" />
                                <button className="image_slide_right_icon" onClick={nextImageHandler}>
                                    <ArrowRightIcon />
                                </button>
                                <CloseIcon className="image_show_close_icon" onClick={() => setViewImg(false)} />
                            </div> */
                        }
                    </div>
                </div>
                {/* <div className={`view_images_container ${viewImg ? "show_images" : "hide_images"}`}>
                    <CloseIcon className="image_show_close_icon" onClick={() => setViewImg(prev => !prev)} />
                </div> */}
            </div>
        </>
    )
}
