import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./face-styles.module.css";
// import { CameraIcon } from "../../images/video-on.svg";
import Webcam from "react-webcam";
import { constant, routes } from "../common/constant";
import queryString from "query-string";
import Dropzone from "react-dropzone";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { FACE_AUTH_URL } from "../common/endpoints";
const FaceLogin = () => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [videoId, setVideoId] = useState("");
  const [imgSrc, setImgSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [file, setFile] = useState(null);
  const webcamRef = useRef(null);
  const dropZoneRef = useRef(null);
  const navigate = useNavigate();
  let { meetingId, isRedirect, roomId } = queryString.parse(
    window.location.search
  );
  let file = null;
  let myTimeout = null;
  let continueCapture = false;
  const getMediaDevices = async () => {
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      let videoDevices = mediaDevices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("mediaDevices", mediaDevices);
      console.log("videoDevices", videoDevices);
      if (videoDevices.length > 0) {
        setVideoTracks(videoDevices);
        continueCapture = true;
      } else {
        toast.error("No Camera Found");
        continueCapture = false;
      }
    } catch (error) {
      console.log("getMediaDevices error", error);
    }
  };

  const startRecording = async () => {
    await getMediaDevices();
    myTimeout = setInterval(async () => {
      if (continueCapture) {
        setIsLoading(true);
        handleCapture();
        await handleSubmit();
        setIsLoading(false);
      }
    }, 5000);
  };
  useEffect(() => {
    startRecording();
    return () => {
      continueCapture = false;
      clearInterval(myTimeout);
    };
  }, []);

  const processInitialName = (name) => {
    // return first name if one word or two letters two letters
    let nameArray = String(name).split(" ");
    if (nameArray.length > 1) {
      return nameArray[0].charAt(0) + nameArray[1].charAt(0);
    } else {
      return nameArray[0].charAt(0);
    }
  };

  function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  const handleCapture = useCallback(() => {
    const image = webcamRef.current.getScreenshot();
    if (!image) {
      return;
    }
    file = dataURLtoFile(image, "image.webp");
    // setFile(dataURLtoFile(image, "image.webp"));
    setImgSrc(image);
  }, [webcamRef]);
  const handleSubmit = useCallback(async () => {
    console.log("handleUpload", file);
    const payload = new FormData();
    payload.append("file", file);
    payload.append("filename", `${Date.now()}image.webp`);
    // API call
    try {
      const response = await axios.post(`${FACE_AUTH_URL}/recognize`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      switch (response.data.code) {
        case "SUCCESS":
          continueCapture = false;
          alert("Hello " + response.data.person);
          localStorage.setItem("auth_token", response.data.token);
          let dcr_token = jwtDecode(response.data.token);
          console.log("decode token", dcr_token);
          localStorage.setItem("user_id", dcr_token.id);
          localStorage.setItem("user_name", dcr_token.user_name);
          localStorage.setItem("user_role", dcr_token.role);
          localStorage.setItem("user_email", dcr_token.email);
          localStorage.setItem(
            "initial_name",
            processInitialName(dcr_token.user_name)
          );
          if (dcr_token.url) {
            localStorage.setItem(
              "user_profile_image",
              dcr_token.url ? dcr_token.url : null
            );
          }
          if (dcr_token.role === "ADMIN") {
            navigate(routes.admin);
          } else {
            // if (meetingId || roomId) {
            //   let link = window.location.href + "/" +  ;
            //   window.location.replace(link);
            // } else {
            navigate(routes.meeting_list);
            // }
          }
          navigate(routes.meeting_list);
          break;
        case "FAKE_FACE":
          continueCapture = true;
          alert("Fake Face");
          break;
        case "NO_FACE":
          continueCapture = true;
          alert("No Face");
          break;
      }
    } catch (error) {
      console.log("error", error);
    }
  });
  const handleUpload = () => {
    dropZoneRef.current.open();
  };
  return (
    <>
      <div className={styles.faceContainer} style={{ margin: "0 auto" }}>
        <div className={styles.faceWindow}>
          {isLoading && <FaSpinner icon="spinner" className={styles.spinner} />}
          <Webcam
            audio={false}
            width={640}
            height={480}
            ref={webcamRef}
            videoConstraints={{ deviceId: videoId }}
            id="video"
          />
          {imgSrc && (
            <img
              className={styles.formImage}
              src={imgSrc}
              alt="captured image"
            />
          )}
          {/*  <Dropzone
            ref={dropZoneRef}
            onDrop={(acceptedFiles) => {
              console.log("acceptedFiles", acceptedFiles);

              setFile(acceptedFiles[0]);
              setImgSrc(URL.createObjectURL(acceptedFiles[0]));
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div className="dropzone" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drop photos here or click 'Upload'</p>
                </div>
              </section>
            )}
          </Dropzone> */}
          <div className={styles.buttonGroup}>
            <button className={styles.captureBtn} onClick={handleCapture}>
              Capture
            </button>
            {/*  <button className="upload-btn" onClick={handleUpload}>
              Upload
          </button> */}
          </div>
        </div>
        <div className={styles.cameraOptions}>
          <select
            name=""
            id=""
            onChange={(e) => setVideoId(e.target.value)}
            placeholder={constant.select_camera}
          >
            {videoTracks &&
              videoTracks.map((track, i) => (
                <option key={i} value={track.deviceId}>
                  {track.label}
                </option>
              ))}
          </select>
        </div>
        <div className={styles.submitGroup}>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Submit
          </button>
          <button
            className={styles.submitBtn}
            onClick={() => navigate(routes.face_register)}
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default FaceLogin;
