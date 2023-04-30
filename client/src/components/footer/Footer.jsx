import "./footer.scss";
import sugarilandlogo from "./../topbar/sugarilandlogo/sugarilandlogo.png";
import { Link } from "react-router-dom";
import { FaLinkedin, FaFacebookF } from "react-icons/fa";
import { AiOutlineTwitter, AiFillInstagram } from "react-icons/ai";

export default function Footer() {
    return (
        <footer>
            <div className="container footer_container">
                <article>
                    <Link to="/" className="logo">
                        <img src={sugarilandlogo} alt="Footer Logo" />
                    </Link>
                    {/* <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                        Nostrum aliquid harum repellendus delectus voluptatum
                        consectetur! Aspernatur enim voluptate quidem est!
                    </p> */}
                    <div className="social_connects">
                        <a href="https://linkedin.com/" target="_blank" rel='norefeeere noopener'>
                            <FaLinkedin />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel='norefeeere noopener'>
                            <FaFacebookF />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel='norefeeere noopener'>
                            <AiOutlineTwitter />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel='norefeeere noopener'>
                            <AiFillInstagram />
                        </a>
                    </div>
                </article>
                <article>
                    <h4>Permalinks</h4>
                    <Link to="/about-us">About Us</Link>
                    <Link to="/settings">Settings</Link>
                    <Link to="/contact-us">Contact Us</Link>
                </article>
                <article>
                    <h4>Permalinks</h4>
                    <Link to="/about-us">About Us</Link>
                    <Link to="/settings">Settings</Link>
                    <Link to="/contact-us">Contact Us</Link>
                </article>
                {/* <article>
                    <h4>Permalinks</h4>
                    <Link to="/about-us">About Us</Link>
                    <Link to="/settings">Settings</Link>
                    <Link to="/contact-us">Contact Us</Link>
                </article> */}
            </div>
            <div className="footer_copyright">
                <small>2022 Sugar iLand &copy; All Rights Reserved</small>
            </div>
        </footer>
    )
}
