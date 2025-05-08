import React, { useCallback, useEffect, useRef, useState } from "react";

import Webcam from "react-webcam";
import { constant } from "../common/constant";
const FaceCam = ({ setFile }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [videoId, setVideoId] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const webcamRef = useRef(null);

  const getMediaDevices = async () => {
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      console.log("mediaDevices", mediaDevices);
      setVideoTracks(
        mediaDevices.filter((device) => device.kind === "videoinput")
      );
    } catch (error) {
      console.log("getMediaDevices error", error);
    }
  };
  useEffect(() => {
    getMediaDevices();
  }, []);

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
    console.log("handleCapture");
    const image = webcamRef.current.getScreenshot();
    setFile(dataURLtoFile(image, "image.webp"));
    setImgSrc(image);
    // setImage(image, imgFile);
  }, [webcamRef]);

  return (
    <>
      <div className="face-window">
        <Webcam
          audio={false}
          width={640}
          height={480}
          ref={webcamRef}
          videoConstraints={{ deviceId: videoId }}
          id="video"
        />
        {imgSrc && (
          <img className="form-image" src={imgSrc} alt="captured image" />
        )}
        <div className="button-group">
          <button className="capture-btn" onClick={handleCapture}>
            Capture
          </button>
        </div>
      </div>
      <div className="camera-options">
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
    </>
  );
};

export default FaceCam;
