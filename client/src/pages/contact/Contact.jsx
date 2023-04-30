import "./contact.scss";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";
import SugarImg from "../about/images/sugar_honey_breast.jpg";
import { MdEmail } from "react-icons/md";
import { BsMessenger } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";


export default function Contact() {
  return (
    <div className="contact-us-page">
      <Topbar />
      <Header title="Contact us" image={SugarImg}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Doloremque tempore iste labore obcaecati provident dignissimos aut non atque,
        vel eveniet.
      </Header>
      <section className="contact">
        <div className="container contact_container">
          <div className="contact_wrapper">
            <a href="mailto:sugariland@gmail.com" target="_blank" rel="noreferrer noopener">
              <MdEmail />
            </a>
            <a href="http://m.me/100079946314990" target="_blank" rel="noreferrer noopener">
              <BsMessenger />
            </a>
            <a href="http://wa.me/+234" target="_blank" rel="noreferrer noopener">
              <IoLogoWhatsapp />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
