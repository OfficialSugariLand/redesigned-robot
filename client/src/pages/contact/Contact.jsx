import "./contact.scss";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";
import SugarImg from "../about/images/sugar_honey_breast.jpg";
import { MdEmail } from "react-icons/md";
import { BsMessenger } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";


export default function Contact() {
  return (
    <div className="contact">
      <Topbar />
      <Header title="Contact us" image={SugarImg}>
        Sugar iLand relies on your contributions to keep growing, therefor it is her duty to listen to all users around the globe,
        if there's any issue encountered please use of the methods below to reach out to technical department to fix the issue
        in order to keep serving you a more user friendly application, in a single click below your report will be heard.
      </Header>
      <div className="contact_US">
        <a href="mailto:sugariland@gmail.com" target="_blank" rel="noreferrer noopener">
          <div className="messengerGmail">
            <MdEmail />
          </div>
        </a>
        <a href="http://m.me/100079946314990" target="_blank" rel="noreferrer noopener">
          <div className="messengerFB">
            <BsMessenger />
          </div>
        </a>
        <a href="http://wa.me/+2349166494702" target="_blank" rel="noreferrer noopener">
          <div className="messengerWhatsapp">
            <IoLogoWhatsapp />
          </div>
        </a>
      </div>
    </div>
  )
}
