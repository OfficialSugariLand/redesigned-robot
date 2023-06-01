import "./stories.scss";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { MdOutlinePostAdd, MdOutlineCancel } from "react-icons/md";
import UserStories from "./userStories/UserStories";

export default function Stories() {
  const { user } = useContext(AuthContext);
  let isRendered = useRef(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [storyOpen, setStoryOpen] = useState(false);
  const [userFriends, setUserFriends] = useState([]);
  const [file, setFile] = useState(null);
  const ref = useRef();
  const [stories, setStories] = useState([]);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  //Get all following
  useEffect(() => {
    isRendered = true;
    axiosInstance
      .get("/followers/")
      .then(res => {
        if (isRendered) {
          setUserFriends(res.data);
        }
        return null;
      })
      .catch(err => console.log(err));
    return () => {
      isRendered = false;
    };
  }, [ignored]);

  //Check if my user is following user
  const followedUser = userFriends?.find((m) => m.followed === user.user_id && m.follower === user.user_id);

  //Set body scroll to hidden when story is open
  useEffect(() => {
    storyOpen ? document.body.style.overflow = "hidden"
      : document.body.style.overflow = "auto"
  });

  //Reset img
  const reset = () => {
    ref.current.value = "";
  };

  //Automatically call file input
  useEffect(() => {
    const setStoryOpen = () => {
      if (storyOpen === true) {
        document.getElementById('files').click();
      };
    };
    setStoryOpen();
  }, [storyOpen]);

  //File submission
  const submitHandler = async (e) => {
    e.preventDefault()
    if (!followedUser) {
      const followUser = {
        follower: user.user_id,
        followed: user.user_id
      }
      try {
        await axiosInstance.post("/followers", followUser);
      } catch (err) {
        console.log(err);
      }
      const newStory = {
        user_id: user.user_id,
      }
      if (file === null) {
        console.log("File is empty")
      } else {
        const data = new FormData();
        const fileName = Date.now() + "_" + user.username + "_stories_" + "_sugarilandconnect.jpg";
        data.append("name", fileName);
        data.append("file", file);
        newStory.img = fileName;
        try {
          await axiosInstance.post("/upload", data);
        } catch (err) {
          console.log(err);
        }

        try {
          await axiosInstance.post("/stories", newStory);
        } catch (err) { }
      }
    } else {
      const newStory = {
        user_id: user.user_id,
      }
      if (file === null) {
        console.log("File is empty")
      } else {
        const data = new FormData();
        const fileName = Date.now() + "_" + user.username + "_stories_" + "_sugarilandconnect.jpg";
        data.append("name", fileName);
        data.append("file", file);
        newStory.img = fileName;
        try {
          await axiosInstance.post("/upload", data);
        } catch (err) {
          console.log(err);
        }

        try {
          await axiosInstance.post("/stories", newStory);
        } catch (err) { }
      }
    }

    forceUpdate();
    setTimeout(() => {
      setFile(null);

      setStoryOpen(false);
    }, 2000);
  };


  //Fetch friends stories
  useEffect(() => {
    isRendered = true;
    axiosInstance
      .get(`/stories/${user.user_id}`)
      .then(res => {
        if (isRendered) {
          setStories(res.data.sort((p1, p2) => {
            return new Date(p2.date_time) - new Date(p1.date_time);
          })
          );
        }
        return null;
      })
      .catch(err => console.log(err));
    return () => {
      isRendered = false;
    };
  }, [user, ignored]);

  /* useEffect(() => {
    const fetchPosts = async () => {
      const res = await axiosInstance.get("/stories/" + user.user_id);
      setStories(res.data.sort((p1, p2) => {
        return new Date(p2.date_time) - new Date(p1.date_time);
      })
      );
    };
    fetchPosts();
  }, [user, ignored]); */

  return (
    <div className="stories">
      <div className="story_section">
        <div className="story_wrapper">
          <img src={user.profilePicture ? PF + user.profilePicture
            : PF + "person/1658876240053sugarisland.jpeg"} alt=""
          />
          <div className="half_background">
            <div className="story_input_svg" title="Add Stories" onClick={() => setStoryOpen(prev => !prev)}>
              <BsPlusLg />
            </div>
            <span>{user.username}</span>
          </div>
          {
            stories?.map((s, id) =>
              <UserStories key={id} story={s} id={id} user={user} forceUpdate={forceUpdate} />
            )
          }
        </div>
        <div className={`${storyOpen ? 'showStory_container' : 'hideStory_container'}`}>
          <div className="story_body">
            <BiArrowBack title="Go Back" className="cancel_story" onClick={() => { setStoryOpen(prev => !prev); setFile(null); reset() }} />
            {file && (
              <div className="story_Img">
                <button title="Cancel" onClick={() => { setFile(null); reset() }}>
                  <MdOutlineCancel />
                </button>
                <img src={URL.createObjectURL(file)} alt="" />
              </div>
            )}
            <form onSubmit={submitHandler} className="story_form">
              <label htmlFor="files">
                <AiOutlineVideoCameraAdd />
                <input style={{ display: "none" }} type={"file"} id="files"
                  accept=".png,.jpeg,.jpg" onChange={(e) => setFile(e.target.files[0])} ref={ref}
                />
              </label>
              <button type="submit">
                <MdOutlinePostAdd />
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
