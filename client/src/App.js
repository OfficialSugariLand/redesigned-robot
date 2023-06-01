import "./app.css";
import "./style.scss";
import Home from "./pages/home/Home";
import Login from "./pages/login/userLogin/Login";
import Profile from "./pages/profile/userProfile/Profile";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
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
import TextBox from "./pages/textbox/userTextBox/TextBox";
import SugarChats from "./pages/textbox/sugarChats/SugarChats";
import UserGeneral from "./pages/settings/UserGeneral";
import UserPersonal from "./pages/settings/userpersonal/UserPersonal";
import UserLocation from "./pages/settings/userlocation/UserLocation";
import ForgotPass from "./pages/login/forgotPass/ForgotPass";
import ResetPass from "./pages/login/resetPass/ResetPass";
import Viewposts from "./components/post/viewposts/Viewposts";
import Smsuser from "./pages/smsuser/Smsuser";
import socketIOClient from "socket.io-client";
import Otpuser from "./pages/smsuser/otpuser/Otpuser";

function App() {
  const { user } = useContext(AuthContext)
  const { darkMode } = useContext(DarkModeContext);
  //const [data, setData] = useState();

  useEffect(() => {
    const socket = socketIOClient("http://localhost:4000/");
    socket?.emit("newUser", user?.user_id);
    /* socket.on("getUsers", (data) => {
      setData(data);
    }); */
  }, []);

  /* useEffect(() => {
    const socket = socketIOClient("http://localhost:4000/", {
      path: '/mysocket'
    });
    socket?.emit("newUser", user?.user_id);
    socket.on("getUsers", (data) => {
      setData(data);
    });
  }, []); */

  //console.log(data)

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <Router>
        <Routes>
          <Route path="/register-steps" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route exact path="/" element={!user ? <Login /> : user?.isVerified === "true" ? <Home /> : <Smsuser />} />
          <Route path="/otpuser" element={!user ? <Navigate to="/" /> : <Otpuser />} />
          <Route exact path="/profile/:user_id" element={!user ? <Navigate to="/" /> : <Profile />} />
          <Route exact path="/profile/:user_id/photos" element={!user ? <Navigate to="/" /> : <Images />} />
          <Route path="/forgotpassword" element={user ? <Navigate to="/" /> : <ForgotPass />} />
          <Route path="/resetpassword" element={user ? <Navigate to="/" /> : <ResetPass />} />
          <Route exact path="/textbox" element={!user ? <Navigate to="/" />
            : user?.isVerified === "true" ? <TextBox /> : <Smsuser />} />
          <Route path="/textbox/sugarchat/:user_id" element={!user ? <Navigate to="/" />
            : user?.isVerified === "true" ? <SugarChats /> : <Smsuser />} />
          <Route path="/posts/:user_id/:img" element={!user ? <Navigate to="/" /> : <Viewposts />} />
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
