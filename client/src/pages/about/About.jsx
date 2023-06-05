import "./about.scss";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";
import HeaderImage from "../about/images/rain_shower.jpg";
import aboutSugarImg from "../about/images/about_sugar.jpg";
import sugarVisionImg from "../about/images/sugar_vision.jpg";
import sugarMissionImg from "../about/images/sugar_mission.jpg";
/* import Sugar from "./images/Sugar_main_use.png"; */

export default function About() {
  return (
    <div className="about">
      <Topbar />
      <Header title="About Us" image={HeaderImage} className="about_main_header">
        Sugar iLand connects you with people of same interest
        to save you from awkward moments
      </Header>
      <section className="about_sugar">
        <div className="container sugar_about_container">
          <div className="about_section_img">
            <img src={aboutSugarImg} alt="ABout Sugar Img" />
          </div>
          <div className="about_sugar_section">
            <h1>All about Sugar</h1>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo qui nam minima fugit.
              Autem, nisi recusandae! Odio distinctio nisi, reiciendis consectetur suscipit sint
              molestias culpa facere eius labore, enim pariatur.
            </p>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo qui nam minima fugit.
              Autem, nisi recusandae! Odio distinctio nisi, reiciendis consectetur suscipit sint
              molestias culpa facere eius labore, enim pariatur.
            </p>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo qui nam minima fugit.
              Autem, nisi recusandae!
            </p>
          </div>
        </div>
      </section>

      <section className="sugar_vision">
        <div className="container sugar_vision_container">
          <div className="about_sugar_section">
            <h1>Sugar's Vision</h1>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo qui nam minima fugit.
              Autem, nisi recusandae! Odio distinctio nisi, reiciendis consectetur suscipit sint
              molestias culpa facere eius labore, enim pariatur.
            </p>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo qui nam minima fugit.
              Autem, nisi recusandae! Odio distinctio nisi, reiciendis consectetur suscipit sint
              molestias culpa facere eius labore, enim pariatur.
            </p>
          </div>
          <div className="about_section_img">
            <img src={sugarVisionImg} alt="Sugar Vision Img" />
          </div>
        </div>
      </section>

      <section className="sugar_mission">
        <div className="container sugar_mission_container">
          <div className="about_section_img">
            <img src={sugarMissionImg} alt="Sugar Mission Img" />
          </div>
          <div className="about_sugar_section">
            <h1>Sugar's Mission</h1>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo qui nam minima fugit.
              Autem, nisi recusandae! Odio distinctio nisi, reiciendis consectetur suscipit sint
              molestias culpa facere eius labore, enim pariatur.
            </p>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo qui nam minima fugit.
              Autem, nisi recusandae! Odio distinctio nisi, reiciendis consectetur suscipit sint
              molestias culpa facere eius labore, enim pariatur.
            </p>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo qui nam minima fugit.
              Autem, nisi recusandae!
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
