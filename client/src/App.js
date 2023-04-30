import "./app.css";
import "./style.scss";
import Home from "./pages/home/Home";
import Login from "./pages/login/userLogin/Login";
import Profile from "./pages/profile/userProfile/Profile";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Modal from './components/modal/Modal';
import NewSugars from "./pages/newSugarSearch/NewSugars";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Settings from "./pages/settings/Settings";
import Images from "./pages/profile/images/Images";
import NotFound from "./pages/notFound/NotFound";
import { DarkModeContext } from "./context/darkModeContext";
import Signup from "./pages/register/signup/Signup";
import Topbar from "./components/topbar/Topbar";
import { io } from "socket.io-client";
import TextBox from "./pages/textbox/TextBox";
import SugarChats from "./pages/textbox/SugarChats";
import UserGeneral from "./pages/settings/UserGeneral";
import UserPersonal from "./pages/settings/userpersonal/UserPersonal";
import UserLocation from "./pages/settings/userlocation/UserLocation";
import ProText from "./pages/profile/proMessanger/protext/ProText";
import ForgotPass from "./pages/login/forgotPass/ForgotPass";
import ResetPass from "./pages/login/resetPass/ResetPass";
import PassSuccess from "./pages/login/passSuccess/PassSuccess";
import Viewposts from "./components/post/viewposts/Viewposts";

function App() {
  const { user } = useContext(AuthContext)
  const { darkMode } = useContext(DarkModeContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", user?.user_id);
  }, [socket, user?.user_id]);

  //console.log(socket)

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <Router>
        {/* {
          user &&
          <Topbar />
        } */}
        <Routes>
          <Route exact path="/" element={user ? <Home /> : <Login />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPass />} />
          <Route path="/reset-password/link/:user_id/:secret" element={user ? <Navigate to="/" /> : <ResetPass />} />
          <Route path="/password-reset-success" element={user ? <Navigate to="/" /> : <PassSuccess />} />
          <Route path="/register-steps" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route exact path="/textbox" element={!user ? <Navigate to="/" /> : <TextBox />} />
          <Route exact path="/protext/:user_id" element={!user ? <Navigate to="/" /> : <ProText />} />
          <Route path="/textbox/sugarchat/:user_id" element={!user ? <Navigate to="/" /> : <SugarChats />} />
          <Route path="/textbox/sugarchat/:user_id" element={!user ? <Navigate to="/" /> : <SugarChats />} />
          <Route path="/posts/:user_id/:img" element={!user ? <Navigate to="/" /> : <Viewposts />} />
          <Route exact path="/profile/:user_id" element={!user ? <Navigate to="/" /> : <Profile />} />
          <Route exact path="/profile/:user_id/photos" element={!user ? <Navigate to="/" /> : <Images />} />
          <Route exact path="/sugars" element={<NewSugars />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/settings" element={<Settings />} />
          <Route exact path="/settings=general_information" element={<UserGeneral />} />
          <Route exact path="/settings=personal_information" element={<UserPersonal />} />
          <Route exact path="/settings=location" element={<UserLocation />} />
          <Route exact path='*' element={<NotFound />} />
        </Routes>
        <Modal />
      </Router>
    </div>
  );
}

export default App;
