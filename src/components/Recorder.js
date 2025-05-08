// React System Libraries
import React, { useEffect, useState } from "react";
import Axios from "axios";
import $ from "jquery";
import {
  useReactMediaRecorder,
  ReactMediaRecorder,
} from "react-media-recorder-2";

// Customised Libraries or components
import { ENDPOINTURL } from "./common/endpoints";
import { apiRoutes, constant } from "./common/constant";

function Recorder(props) {
  // Use State for Recorder
  const [videoUrl, setVideoUrl] = useState("");
  const [currentMeetingId, setCurrentMeetingId] = useState();
  const [response, setResponse] = useState("");
  const [componentStatus, setComponentStatus] = useState("");
  const token = localStorage.getItem("auth_token");
  const userId = localStorage.getItem("user_id");
  const [exitbutton, setexitbutton] = useState("");
  const [recordStatus, setRecordingStatus] = useState("");
  const {
    error,
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
  } = useReactMediaRecorder({ screen: true, audio: true });
  useEffect(() => {
    if (props.action === "start") {
      startRecording();
    }
    if (props.action === "stop") {
      stopRecording();

      // if (mediaBlobUrl && error !== "permission_denied") {
      //   // window.open(videoUrl, '_blank');
      //   uplaodDocument(mediaBlobUrl);
      // }

      // clearBlobUrl();
      //props.recordState('stop');
    }

    //for setmeeting id from meetingUI component
    if (props.meetingId) {
      setCurrentMeetingId(props.meetingId);
    }
  }, [props.action, videoUrl, props.meetingId]);

  useEffect(() => {
    if (error === "permission_denied") {
      props.stateChanger(false);
      props.stateLoader(false);
      props.handleRec("stop");
      //props.recordState('stop');
    }
  }, [error]);

  useEffect(() => {
    console.log(status);
    if (status === "recording") {
      props.stateChanger(true);
      props.stateLoader(true);
      //props.recordState('start');
      props.handleRec("start");
    } else if (status == "stopped") {
      stopRecording();
      props.stateChanger(false);
      props.stateLoader(false);
      props.handleRec("stop");
      console.log("mediaURL", mediaBlobUrl);
    }
  }, [status]);

  useEffect(() => {
    if (mediaBlobUrl) {
      setVideoUrl(mediaBlobUrl);
      if (mediaBlobUrl && error !== "permission_denied") {
        // const blob = new Blob(mediaBlobUrl, { type: "video/webm" });
        const url = window.URL.createObjectURL(mediaBlobUrl);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `Test.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          console.log(`${a.download} save option shown`);
        }, 100);
        // uplaodDocument(mediaBlobUrl);
      }

      clearBlobUrl();
    }
  }, [mediaBlobUrl]);

  // const stopRec = (error) => {
  //   setexitbutton(error);
  // }

  // const statusRec = (status) => {
  //   setRecordingStatus(status);
  // }

  // Upload an document of recording to AWS
  const uplaodDocument = async (mediaBlobUrl) => {
    console.log("mediaBlobUrl", mediaBlobUrl);
    props.stateChanger(true);
    props.stateLoader(true);
    //props.recordState('start');
    setComponentStatus({
      status: "processing",
      message: "Uploading Document...",
    });

    var formData = new FormData();
    let blob = await fetch(mediaBlobUrl).then((r) => r.blob());
    var today = new Date().toString();
    let teacherName = localStorage.getItem("user_name");
    teacherName = teacherName.replaceAll(" ", "");
    let meetingId = localStorage.getItem("meeting_id");
    let fileName = teacherName + "" + meetingId + "" + today + ".mp4";
    // formData.append("files", blob, fileName);
    formData.append("document", blob, fileName);
    formData.append("source", "Recordings");
    formData.append("meetingId", currentMeetingId);

    try {
      setComponentStatus({
        status: "processing",
        message: "processing",
      });
      const recordingResponse = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.document_upload}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (recordingResponse.status === 200) {
        props.stateChanger(false);
        props.stateLoader(false);
        //props.recordState('stop');
        setComponentStatus({
          status: "OK",
          message: recordingResponse.data.message,
        });
      } else {
        props.stateChanger(false);
        props.stateLoader(false);
        setComponentStatus({
          status: "error",
          message: recordingResponse.data.message,
        });
      }
    } catch (error) {
      props.stateChanger(false);
      props.stateLoader(false);
      //props.recordState('stop');
      setComponentStatus({
        status: "error",
        message: constant.record_save_wrong,
      });
    }
  };

  return <div></div>;
}

export default Recorder;
