import React, { useCallback, useEffect, useRef, useState } from "react";
import { routes } from "../common/constant";
import styles from "./face-styles.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios, { Axios } from "axios";
import FaceCam from "./FaceCam";
import { FaSpinner } from "react-icons/fa";
import { FACE_AUTH_URL } from "../common/endpoints";
const FaceSignUp = () => {
  // const [videoTracks, setVideoTracks] = useState([]);
  // const [videoId, setVideoId] = useState("");
  const [imgSrc, setImgSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const webcamRef = useRef(null);
  // const dropZoneRef = useRef(null);
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const navigate = useNavigate();
  // const getMediaDevices = async () => {
  //   try {
  //     const mediaDevices = await navigator.mediaDevices.enumerateDevices();
  //     setVideoTracks(
  //       mediaDevices.filter((device) => device.kind === "videoinput")
  //     );
  //   } catch (error) {
  //     console.log("getMediaDevices error", error);
  //   }
  // };
  // useEffect(() => {
  //   getMediaDevices();
  // });
  // function dataURLtoFile(dataurl, filename) {
  //   let arr = dataurl.split(",");
  //   let mime = arr[0].match(/:(.*?);/)[1];
  //   let bstr = atob(arr[arr.length - 1]);
  //   let n = bstr.length;
  //   let u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new File([u8arr], filename, { type: mime });
  // }

  // const handleCapture = useCallback(() => {
  //   console.log("handleCapture");
  //   const image = webcamRef.current.getScreenshot();
  //   setFile(dataURLtoFile(image, "image.webp"));
  //   setImgSrc(image);
  //   // setImage(image, imgFile);
  // }, [webcamRef]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    const payload = new FormData();
    if (!file) {
      toast.error("Please upload an image");
    }
    if (!name) {
      nameRef.current.focus();
      toast.error("Please enter your name");
    }
    if (!email) {
      emailRef.current.focus();
      toast.error("Please enter your email");
    }
    payload.append("file", file);
    payload.append("filename", name);
    payload.append("Name", name);
    payload.append("Email", email);
    console.log("Payload", payload);
    // API call
    const response = await axios.post(`${FACE_AUTH_URL}/upload`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    setIsLoading(false);
  }, [file, name, email]);
  // const handleUpload = () => {
  //   dropZoneRef.current.open();
  // };
  return (
    <div className={styles.container}>
      <div className={styles.faceContainer}>
        {isLoading && <FaSpinner icon="spinner" className={styles.spinner} />}
        <FaceCam setFile={setFile} />
        <div className={styles.registerGroup}>
          <input
            ref={nameRef}
            required
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            ref={emailRef}
            type="text"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.submitGroup}>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Submit
          </button>
          <button
            className={styles.submitBtn}
            onClick={() => navigate(routes.face_login)}
          >
            Login
          </button>
        </div>
      </div>
      <div className={styles.imgContainer}>
        {
          imgSrc && (
            <div className={styles.capturedImg}>
              <img src={imgSrc} alt="captured image" />
              {/* <button onClick={() => deleteImg(i)}>Delete</button> */}
            </div>
          )
          // imgSrc.map((i) => {
          //   return (
          //     <div className="captured-imgs" key={i.id}>
          //       <img src={i.src} alt="captured image" />
          //       {/* <button onClick={() => deleteImg(i)}>Delete</button> */}
          //     </div>
          //   );
          // })
        }
      </div>
    </div>
  );
};

export default FaceSignUp;
