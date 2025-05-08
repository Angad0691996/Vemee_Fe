// React System Libraries
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

// Customised Libraries or components
import NewNavbar from "../common/newNavbar";
import "font-awesome/css/font-awesome.min.css";
import Axios from "axios";
import { ENDPOINTURL } from "../common/endpoints";
import { constant, routes,apiRoutes } from "../common/constant";
import ErrorComponent from "../errorPage/errorPopup";
import { Link } from "react-router-dom";
function Prelaunch(props) {
  // Declare constant manage UseState
  const [audioTracks, setAudioTracks] = useState([]);
  const [videoTracks, setVideoTracks] = useState([]);
  const [isUserBusy, setIsUserBusy] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [audioId, setAudioId] = useState("");
  const [videoId, setVideoId] = useState("");
  const [vidCheck, setVidCheck] = useState(false);
  const [audCheck, setAudCheck] = useState(true);
  const token = localStorage.getItem("auth_token");
  // get media devices
  const getMediaDevices = async () => {
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    } catch (error) {
      console.log("getMediaDevices error", error);
    }
  };
  getMediaDevices();
  // Redirect based on Logged user Role
  const prelaunchRedirection = () => {
    try {
      if (localStorage.getItem("user_role") == "ADMIN") {
        window.location.href = routes.admin;
      } else {
        window.location.href = routes.meeting_list;
      }
    } catch (error) {
      console.log("onDeviceListChanged error", error);
    }
  };
  // const meetingJoing = async (meetingTitle) => {
  //   const requestParams = {
  //     meetingTitle: meetingTitle,
  //   };
  //   const meetingJoinResponse = await Axios.post(
  //     `${ENDPOINTURL}/meeting/meetingJoin`,
  //     requestParams,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  // };

  /**
   * Handles the audio change event.
   *
   * @param {Event} e - The event object.
   */
  const handleVidChange = (e) => {
    setVidCheck(e.target.checked);
    console.log("handleVide", !e.target.checked);
    props.joinWithVideoOff(!e.target.checked);
  };

  /**
   * Handles the audio change event.
   *
   * @param {Event} e - The event object.
   */
  const handleAudioChange = (e) => {
    setAudCheck(e.target.checked);
    console.log("handleAudi", !e.target.checked);
    // using ! (negation) because condition in meetingUi in inversed of checkbox
    props.joinWithAudioOff(!e.target.checked);
  };

  useEffect(() => {
    let audio = [];
    let video = [];
    if (props.mediaDevices.length !== 0) {
      // alert("props.mediaDevices");
      props.mediaDevices.map((device, i) => {
        if (device.kind === "audioinput") {
          // setAudioTracks((audioTracks) => [...audioTracks, device]);
          audio.push(device);
        } else if (device.kind === "videoinput") {
          // setVideoTracks((videoTracks) => [...videoTracks, device]);
          video.push(device);
        }
      });
      setAudioTracks(audio);
      setAudioId(audio[0].deviceId);
      setVideoTracks(video);
      setVideoId(video[0].deviceId);
    }
  }, [props.mediaDevices]);

  useEffect(() => {
    const getCurrentStatus = async () => {
      let userId = localStorage.getItem("user_id");
      const { status, data } = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.userStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("data and status",data,status)
      if (status === 200) {
        console.log(data.current_status);
        if (data.current_status == 1002  ) {
          setIsUserBusy(true);
        } else if (data.current_status == 1001) {
          setIsUserBusy(false);
        }
      } else {
        setErrorText(data.message);
      }
    };
    getCurrentStatus();
  }, []);

  useEffect(() => {
    console.log("Video", videoId);
    console.log("Audio", audioId);
  }, [videoId, audioId]);

  return (
    <>
      <div className="classroom_list flex-row">
        <NewNavbar />
        {errorText && <ErrorComponent>{errorText}</ErrorComponent>}
        <div className="cl_preview_device">
          {isUserBusy && <h5>{constant.other_device_warning}</h5>}
          <div className="wrapper">
            <div className="cl_preview_box">
              <h4>{constant.set_up}</h4>
              <p>{constant.setup_caption}</p>
              <div className="cl_preview_box_inr">
                <div className="cl_preview_box">
                  <div className={vidCheck ? "" : "preview_off"}>
                    <Webcam
                      audioConstraints={{ deviceId: audioId }}
                      videoConstraints={{ deviceId: videoId }}
                      id="video"
                    />
                  </div>
                  {/* <img src="images/Frame 3.png" alt=""/> */}
                  <div className="audio-container">
                    <div className="audio-cover"></div>
                  </div>
                  <div className="controls">
                    <div
                      style={{ opacity: vidCheck ? "1" : "0.5" }}
                      className="cl_preview_setting_title"
                    >
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 7.8125C0 6.9837 0.32924 6.18884 0.915291 5.60279C1.50134 5.01674 2.2962 4.6875 3.125 4.6875H14.8438C15.6017 4.68741 16.3339 4.9628 16.9039 5.46239C17.4739 5.96197 17.8429 6.6517 17.9422 7.40312L22.8016 5.24375C23.0394 5.13777 23.3 5.09291 23.5596 5.11326C23.8192 5.13361 24.0696 5.21851 24.288 5.36025C24.5065 5.502 24.686 5.69609 24.8104 5.92488C24.9347 6.15367 24.9999 6.40992 25 6.67031V18.3297C24.9998 18.5899 24.9346 18.8459 24.8103 19.0745C24.6861 19.3031 24.5067 19.4971 24.2885 19.6388C24.0702 19.7805 23.8201 19.8654 23.5607 19.886C23.3013 19.9065 23.0409 19.8619 22.8031 19.7563L17.9422 17.5969C17.8429 18.3483 17.4739 19.038 16.9039 19.5376C16.3339 20.0372 15.6017 20.3126 14.8438 20.3125H3.125C2.2962 20.3125 1.50134 19.9833 0.915291 19.3972C0.32924 18.8112 0 18.0163 0 17.1875V7.8125Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <label className="switch">
                      <input
                        onChange={(e) => {
                          handleVidChange(e);
                        }}
                        type="checkbox"
                        checked={vidCheck}
                      />
                      <span className="slider round"></span>
                    </label>
                    <div
                      style={{ opacity: audCheck ? "1" : "0.5" }}
                      className="cl_preview_setting_title"
                    >
                      <svg
                        height="512px"
                        id="Layer_1"
                        version="1.1"
                        viewBox="0 0 512 512"
                        width="512px"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path d="M256,353.5c43.7,0,79-37.5,79-83.5V115.5c0-46-35.3-83.5-79-83.5c-43.7,0-79,37.5-79,83.5V270   C177,316,212.3,353.5,256,353.5z" />
                          <path d="M367,192v79.7c0,60.2-49.8,109.2-110,109.2c-60.2,0-110-49-110-109.2V192h-19v79.7c0,67.2,53,122.6,120,127.5V462h-73v18   h161v-18h-69v-62.8c66-4.9,117-60.3,117-127.5V192H367z" />
                        </g>
                      </svg>
                    </div>
                    <label className="switch">
                      <input
                        onChange={(e) => {
                          handleAudioChange(e);
                        }}
                        type="checkbox"
                        checked={audCheck}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="cl_preview_setting">
                  <div className="cl_preview_setting_left">
                    <div className="cl_preview_setting_title">
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 7.8125C0 6.9837 0.32924 6.18884 0.915291 5.60279C1.50134 5.01674 2.2962 4.6875 3.125 4.6875H14.8438C15.6017 4.68741 16.3339 4.9628 16.9039 5.46239C17.4739 5.96197 17.8429 6.6517 17.9422 7.40312L22.8016 5.24375C23.0394 5.13777 23.3 5.09291 23.5596 5.11326C23.8192 5.13361 24.0696 5.21851 24.288 5.36025C24.5065 5.502 24.686 5.69609 24.8104 5.92488C24.9347 6.15367 24.9999 6.40992 25 6.67031V18.3297C24.9998 18.5899 24.9346 18.8459 24.8103 19.0745C24.6861 19.3031 24.5067 19.4971 24.2885 19.6388C24.0702 19.7805 23.8201 19.8654 23.5607 19.886C23.3013 19.9065 23.0409 19.8619 22.8031 19.7563L17.9422 17.5969C17.8429 18.3483 17.4739 19.038 16.9039 19.5376C16.3339 20.0372 15.6017 20.3126 14.8438 20.3125H3.125C2.2962 20.3125 1.50134 19.9833 0.915291 19.3972C0.32924 18.8112 0 18.0163 0 17.1875V7.8125Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <select
                      name=""
                      id=""
                      onChange={(e) => setVideoId(e.target.value)}
                      placeholder={constant.select_camera}
                    >
                      {/* <option value={constant.select_camera}>
                        {constant.select_camera}
                      </option> */}
                      {videoTracks &&
                        videoTracks.map((track, i) => (
                          <option key={i} value={track.deviceId}>
                            {track.label}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="cl_preview_setting_left">
                    <div className="cl_preview_setting_title">
                      <svg
                        height="512px"
                        id="Layer_1"
                        version="1.1"
                        viewBox="0 0 512 512"
                        width="512px"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path d="M256,353.5c43.7,0,79-37.5,79-83.5V115.5c0-46-35.3-83.5-79-83.5c-43.7,0-79,37.5-79,83.5V270   C177,316,212.3,353.5,256,353.5z" />
                          <path d="M367,192v79.7c0,60.2-49.8,109.2-110,109.2c-60.2,0-110-49-110-109.2V192h-19v79.7c0,67.2,53,122.6,120,127.5V462h-73v18   h161v-18h-69v-62.8c66-4.9,117-60.3,117-127.5V192H367z" />
                        </g>
                      </svg>
                    </div>
                    <select
                      name=""
                      id=""
                      onChange={(e) => setAudioId(e.target.value)}
                      placeholder={constant.select_microphone}
                    >
                      {/* <option value={constant.select_microphone}>
                        {constant.select_microphone}
                      </option> */}
                      {audioTracks &&
                        audioTracks.map((track, i) => (
                          <option key={i} value={track.deviceId}>
                            {track.label}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="submit_btn_box">
                    {/* <a
                      href="#"
                      onClick={prelaunchRedirection}
                      className="cl_cancel_btn"
                    >
                      {constant.cancel}
                    </a> */}
                    <Link
                      to={
                        localStorage.getItem("user_role") == "ADMIN"
                          ? routes.admin
                          : routes.meeting_list
                      }
                      className="cl_cancel_btn"
                    >
                      {constant.cancel}
                    </Link>
                    <button
                      className="cl_save_btn"
                      // disabled={!audioId || !videoId || isUserBusy}
                      onClick={() => {
                        if (audioId && videoId) {
                          props.prelaunchMediaHandler(
                            audioId,
                            videoId,
                            vidCheck,
                            audCheck
                          );
                          const meetingTitle =
                            localStorage.getItem("meeting_title");
                          // meetingJoing(meetingTitle);
                        } else {
                          alert("Please select valid devices. ");
                        }
                      }}
                    >
                      {constant.join}
                    </button>

                    {/* <button onClick={() => props.joinWithVideoOff()}>
                      vid
                    </button>
                    <button onClick={() => props.joinWithAudioOff()}>
                      aud
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Prelaunch;
