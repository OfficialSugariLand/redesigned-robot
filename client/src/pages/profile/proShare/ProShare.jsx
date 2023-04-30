import "./proShare.scss";
import { PermMedia, EmojiEmotions, Cancel } from "@material-ui/icons"
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useRef } from "react";
import { useState } from "react";
import axios from "axios";
import IosShareIcon from '@mui/icons-material/IosShare';

export default function ProShare() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  const ref = useRef();
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const reset = () => {
    ref.current.value = "";
  };

  //Auto resize textArea
  useEffect(() => {
    const textarea = document.querySelector("textarea");
    textarea.addEventListener("keyup", e => {
      textarea.style.height = "63px";
      let scHeight = e.target.scrollHeight;
      textarea.style.height = `${scHeight}px`;
    });
  });

  const submitHandler = async (e) => {
    e.preventDefault()
    const newPost = {
      user_id: user.user_id,
      desc: desc.current.value
    }
    if (file === null) {
      console.log("File is empty")
    } else {
      const data = new FormData();
      const fileName = Date.now() + "_sugariland_" + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      try {
        await axiosInstance.post("/upload", data);
      } catch (err) {
        console.log(err);
      }

      try {
        await axiosInstance.post("/posts", newPost);
      } catch (err) { }
    }
  };


  return (
    <div className="proShare">
      <div className="proShareTop">
        <img src={user?.profilePicture ? PF + user?.profilePicture
          : PF + "person/1658876240053sugarisland.jpeg"} alt=""
        />
        <textarea type="text" placeholder={"What are you feeling today " + user?.username + "?"}
          className="proShareInput" ref={desc}
        />
      </div>
      <hr className="proShareHr" />
      {file && (
        <div className="proShareImgContainer">
          <div className="proShareCancelImgControl">
            <Cancel onClick={() => { setFile(null); reset() }} />
          </div>
          <img className="proShareImg" src={URL.createObjectURL(file)} alt="" />
        </div>
      )}
      <form className="proShareBottom" onSubmit={submitHandler}>
        <label htmlFor="filepro" >
          <PermMedia htmlColor="tomato" />
          <span>Media</span>
          <input style={{ display: "none" }} type={"file"} id="filepro"
            accept=".png,.jpeg,.jpg,.mp4,.mp3,.mkv"
            onChange={(e) => setFile(e.target.files[0])} ref={ref}
          />
        </label>
        <div className="proShareFeelings">
          <EmojiEmotions htmlColor="gold" />
          <span>Feelings {/* When user click and select current feeling
                        it fetches people feeling same at the moment */}</span>
        </div>
        <button type="submit">
          <IosShareIcon />
          <span> Share</span>
        </button>
      </form>
    </div>
  )
}
