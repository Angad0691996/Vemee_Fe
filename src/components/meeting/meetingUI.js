// React System Libraries
import React, { useRef, useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import queryString from "query-string";
import io from "socket.io-client";
import {
  Label,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";

// Customised Libraries or components
import "../../css/new-style.css";
import "../../css/mobile-style.css";
import "../../css/meeting-style.css";
import { ENDPOINSOCKETURL, ENDPOINTURL } from "../common/endpoints";
import person from "../../images/person.jpg";
import main_bg_img from "../../images/main_bg_img.jpg";
import close from "../../images/close.svg";
import leaveButton from "../../images/leave-button.svg";
import audioOn from "../../images/audio-on.svg";
import audioOff from "../../images/audio-off.svg";
import videoOn from "../../images/video-on.svg";
import videoOff from "../../images/video-off.svg";
import fullScreen from "../../images/full-screen.svg";
import pin from "../../images/pin.svg";
import addUsers from "../../images/add-users.svg";
import settings from "../../images/settings.svg";
import documents from "../../images/documents.svg";
import Logo from "../../images/logo.svg";
import quality from "../../images/quality.svg";
import chatBox from "../../images/chat-box.svg";
import VoiceActive from "../../images/voice-active.svg";
import participant from "../../images/participant-list.svg";
import record from "../../images/record.svg";
import shareScreen from "../../images/share-screen.svg";
import screenShareActive from "../../images/share-screen-active.svg";
import whiteboard from "../../images/whiteboard.svg";
import ccButton from "../../images/cc-button.svg";
import muteAll from "../../images/mute_all.svg";
import rotatePhone from "../../images/rotate-phone.svg";
import tileViewIcon from "../../images/tile_view.svg";
import STTComponent from "../STTClassComponent";
import Prelaunch from "../meeting/prelaunch";
import NewNavbar from "../common/newNavbar";

//import Chat from './chat';
import CopyBtn from "../../images/copy.svg";
import Recorder from "../Recorder";
import Whiteboard from "./whiteboard";
import CheckLoginStatus from "../common/loginStatus";
import { Slider } from "@mui/material";
import JitsiComponent from "../meeting/JitsiComponent";
import Loader from "../Loader";
import { apiRoutes, constant, routes } from "../common/constant";
import ErrorComponent from "../errorPage/errorPopup";
import UserVideoBox from "./userVideoBox";
import ScrollContainer from "./ScrollContainer";
import { isEmptyObject } from "jquery";
import InviteUsers from "./inviteUsers";
import { toast } from "react-toastify";
// import ExtraUserBox from "./ExtraUserBox";

// Local Variables declared
// let currentPage = 0;
// const pageSize = 20;

let connection = null;
let room = null;
let isJoined = false;
let isAudioMuted = false;
let local_list = 0;
localStorage.setItem("isAudioMuted", false);
// let isVideoMuted = false;
let confOptions = {};
let startWithVideoMuted = true;
let startWithAudioMuted = false;
let localTracks = [];
let remoteTracks = {};
let muteAllParticipantsList = [];
let socket = "";
let isVideo = true;
let enabledScreenShare = false;
let count = 0;
let screenRecording = false;
let meetingId = localStorage.getItem("meeting_id");
let userId = localStorage.getItem("user_id");
let userRole = localStorage.getItem("user_role");
let meetingRole = localStorage.getItem("meeting_role");
let userName = localStorage.getItem("user_name");
let initialName = localStorage.getItem("initial_name");
let userProfileImage = localStorage.getItem("user_profile_image");
let unreadMessageCount = 0;
let muteWhenLoad = 0;
let localUserId = 0;
let remoteMuteCounter = 1;
let userVideo;
let userAudio;
let chatTimeValue;
let sttSentence = "";
let removeOldSTT = false;
let oldsubtitleSegment;
//let captions = [];
let isStudentPresented;
let newRoomName;
let isSTTStart = true;
let finalSTTMessage = "";

let { roomName, meetingData } = queryString.parse(window.location.search);
if (roomName) {
  roomName = roomName.toLowerCase();
}

function MeetingUI(props) {
  // Get ROOM ID from query string
  const [seconds, setSeconds] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const roomName = window.location.pathname.split("/").pop().toLowerCase();
  const [prelaunchScreen, setPrelaunchScreen] = useState(true);
  const [allMediaDevices, setAllMediaDevices] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [isSubtitle, setIsSubtitle] = useState(false);
  const [documentToggleModal, setDocumentToggleModal] = useState(false);
  const [subtitleDisplay, setSubtitleDiplay] = useState("");
  const [currentMeetingId, setCurrentMeetingId] = useState("");
  const [recordingHandler, setRecordingHandler] = useState("");
  const [userJoined, setUserJoined] = useState(false);
  const [recordAction, setRecordAction] = useState("start");
  const [errorText, setErrorText] = useState("");

  //STT - Start
  const [subtitle, setSubtitle] = useState("");
  const [subtitleFlag, setSubtitleFlag] = useState(false);
  const [subtitleSegment, setSubtitleSegment] = useState("");
  const [captions, setCaptions] = useState([]);
  const [count, setCount] = useState(0);
  const [sttAudio, setSttAudio] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  //const [finalSTTMessage, setfinalSTTMessage] = useState('');
  //STT - End
  const [userBox, setUserBox] = useState({});
  const [focusedUser, setFocusedUser] = useState("local");
  const [userColLength, setUserColLength] = useState(0);
  const [remoteParticipantList, setRemoteParticipantList] = useState([]);
  const [attendanceId, setAttendenceId] = useState("");
  const [modal, setModal] = useState(false);
  const [modalpwd, setModalpwd] = useState(false);
  const [modalInvitees, setModalInvitees] = useState(false);
  const [modalAdmit, setModalAdmit] = useState(false);
  const [admitText, setAdmitText] = useState("");
  const [admitList, setAdmitList] = useState([]);
  const [modalsecurity, setModalsecurity] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [meetingPassword, setMeetingPassword] = useState("");
  const [passwordRes, setpasswordRes] = useState("");
  const [password, setPassword] = useState("");
  const [chatMessage, setChatMessage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allChatMessages, setAllChatMessages] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [isfetchedMessages, setIsFetchedMessages] = useState(false);

  const [chatTime, setChatTime] = useState("");
  const [chatUnreadMessageCount, setChatUnreadMessageCount] = useState(0);
  const [meeetingDocumentCount, setMeeetingDocumentCount] = useState(0);
  const [componentStatus, setComponentStatus] = useState("");
  const [value1, setValue1] = useState(25);
  const [screenShared, setScreenShared] = useState("");
  const [leaveDisable, setLeaveDisable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const togglesecurity = () => setModalsecurity(!modalsecurity);

  const userListRef = useRef(null);
  const togglepwd = () => {
    setModalpwd(!modalpwd);
    navigate(routes.meeting_list);
  };
  const inviteToggle = () => {
    console.log("Josilxjmasl.amxlkxmaslcslaijsci");
    setModalInvitees(!modalInvitees);
  };
  const toggleAdmit = () => {
    console.log("slijcdij");
    setModalAdmit(!modalAdmit);
  };
  const setModalIsOpenToTrue = () => {
    setModalIsOpen(true);
  };
  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };
  const { className } = props;

  let userName = localStorage.getItem("user_name");
  let meetingTitle = localStorage.getItem("meeting_title");

  function formatMessageTime(timestamp) {
    if (!timestamp) {
      return "";
    }

    const date = new Date(timestamp);
    const currentDate = new Date();

    // Check if the message is from today
    if (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    ) {
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return `Today ${date.toLocaleTimeString("en-US", options)}`;
    }

    // Check if the message is from yesterday
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return `Yesterday ${date.toLocaleTimeString("en-US", options)}`;
    }

    // For older dates, show the formatted date
    const monthAbbreviation = date.toLocaleString("en-US", { month: "short" });
    const options = {
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return `${monthAbbreviation} ${date.getDate()}, at ${date.toLocaleTimeString(
      "en-US",
      options
    )}`;
  }

  /* global $, JitsiMeetJS */
  const options = {
    serviceUrl: "https://jitsi.samsanlabs.com/http-bind",
    hosts: {
      domain: "jitsi.samsanlabs.com",
      muc: "conference.jitsi.samsanlabs.com",
    },
    disableAudioLevels: false,
    // resolution: 1080,
    // defaultConstraints: { "maxHeight": 720, "maxFrameRate": 30 },
    // lastN: -1,
    // maxFullResolutionParticipants: -1,
    // setSenderVideoConstraint: '1080',
    // setReceiverVideoConstraint: '720',
    // enableLayerSupsension: true,
    doNotFlipLocalVideo: false,
    //setReceiverVideoConstraint: '1080',
    setSenderVideoConstraint: "144",
    constraints: {
      video: {
        aspectRatio: 16 / 9,
        height: {
          ideal: 144,
          max: 144,
          min: 144,
        },
      },
    },
  };

  confOptions = {
    // enableNoAudioDetection: true,
    // enableTalkWhileMuted: true,
    // enableNoisyMicDetection: true,
    disableAudioLevels: false,
    disableSimulcast: true,
    DisableRtx: true,
    p2p: {
      enabled: false,
      // preferredCodec: true,
      // disableH264: false,
    },
  };

  const initOptions = {
    disableAudioLevels: false,
    openBridgeChannel: "datachannel",
    // The ID of the jidesha extension for Chrome.
    desktopSharingChromeExtId: null,

    // Whether desktop sharing should be disabled on Chrome.
    desktopSharingChromeDisabled: false,

    // The media sources to use when using screen sharing with the Chrome
    // extension.
    desktopSharingChromeSources: ["screen", "window", "tab"],

    // Required version of Chrome extension
    desktopSharingChromeMinExtVersion: "0.1",

    // Whether desktop sharing should be disabled on Firefox.
    desktopSharingFirefoxDisabled: false,

    disableSimulcast: false,
  };

  // let user_threshold = 2; // change this to change no of user tiles in meeting
  function useStateWithLatest(initialValue) {
    const [state, setState] = useState(initialValue);
    const latestValueRef = useRef(initialValue);

    useEffect(() => {
      latestValueRef.current = state;
    }, [state]);

    const setStateAndUpdateLatest = (value) => {
      console.log("updating value:", value);
      setState(value);
      latestValueRef.current = value;
    };

    const getState = () => {
      return latestValueRef.current;
    };

    return [state, setStateAndUpdateLatest, getState];
  }
  const [user_threshold, setUserThreshold, getUserThreshold] =
    useStateWithLatest(14);
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Add event listener for orientation change
    // window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    // Clean up the event listener on component unmount
    return () => {
      // window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    getInitialSeconds();
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  const getMeetingRole = () => {
    return localStorage.getItem("meeting_role");
  };
  const isOrganiser = () => {
    return getMeetingRole() == "Organiser";
  };
  const getInitialSeconds = () => {
    let timestamp = Math.round(
      parseInt(localStorage.getItem("startMeetingTimer")) / 1000
    );
    console.log("timestamp", timestamp);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    setSeconds(currentTimestamp - timestamp);
    // return Math.max(0, timestamp - currentTimestamp);
  };
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    // const remainingSeconds = time % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    // const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };
  useEffect(() => {
    console.log("localTracks useEffect", localTracks);
  }, [localTracks]);
  useEffect(() => {
    // Show/hide popup based on orientation
    if (isPortrait) {
      // Logic to show the popup
      $(".landscape-restrict").removeClass("d-none");
    } else {
      // Logic to hide the popup
      $(".landscape-restrict").addClass("d-none");
    }
  }, [isPortrait]);

  useEffect(() => {
    if (recordingHandler === "start") {
      screenRecording = true;
    } else if (recordingHandler === "stop") {
      screenRecording = false;
      toast(constant.recording_saved);
    }
  }, [recordingHandler]);

  useEffect(() => {
    // Fetch chat data when the component mounts
    if (prelaunchScreen === false) {
      fetchChatData(currentPage, pageSize);
    }
  }, [prelaunchScreen]);
  useEffect(() => {
    local_list += 1;
    console.log(remoteParticipantList);
  }, [remoteParticipantList]);
  useEffect(() => {
    console.log("USER_BOX", userBox);
  }, [userBox]);
  useEffect(() => {
    // validate user is logged in to access
    const isUserLoggedIn = CheckLoginStatus();
    if (isUserLoggedIn === false) {
      navigate("/");
    }

    if (socket) {
      let socketRemoteUserId;
      //socket for Subtitle
      socket.on(
        "subtitle-data",
        ({
          sttSentence,
          userName,
          isSubtitle,
          remoteUserId,
          subtitle,
          subtitleFlag,
          subtitleSegment,
          remoteUserProfile,
        }) => {
          if (!isOrganiser()) {
            // Set Captions status
            setIsSubtitle(isSubtitle);

            if (isSubtitle) {
              $("body").addClass("STTOn");
            } else {
              $("body").removeClass("STTOn");
              let emptyCaption = [];
              setCaptions(emptyCaption);
              localStorage.setItem("removeOldSTT", 1);
            }
          }

          if (sttSentence != "Muted") {
            if (sttSentence) {
              $(".cl_main_noti_box").removeClass("d-none");
            }

            // Push Remote user captions
            if (subtitle) {
              if (captions.length > 0) {
                // Remove If user is exist
                if (captions[captions.length - 1].user_id === remoteUserId) {
                  localStorage.setItem("removeOldSTT", 0);
                  captions.splice(captions.length - 1, 1);
                  //sttSentence = subtitle;
                  captions.push({
                    user_id: remoteUserId,
                    username: userName,
                    captions: sttSentence,
                    currentSubtitle: subtitle,
                    subtitleFlag: subtitleFlag,
                    subtitleSegment: subtitleSegment,
                    userProfile: remoteUserProfile,
                  });
                }
                // else if (captions[captions.length - 1].user_id != remoteUserId &&
                //     oldsubtitleSegment == subtitleSegment) {
                //     let findIndex = captions.slice().reverse().find(cap => cap.user_id == remoteUserId);

                //     if(findIndex) {
                //         captions[captions.indexOf(findIndex)].captions = subtitle;
                //     }
                // }
                else {
                  // if(sttSentence.length > 100){
                  //     sttSentence = sttSentence.substring(20);
                  //     console.log('after : '+sttSentence.length);
                  //   }
                  localStorage.setItem("removeOldSTT", 1);
                  sttSentence = subtitle;
                  captions.push({
                    user_id: remoteUserId,
                    username: userName,
                    captions: sttSentence,
                    currentSubtitle: subtitle,
                    subtitleFlag: subtitleFlag,
                    subtitleSegment: subtitleSegment,
                    userProfile: remoteUserProfile,
                  });
                }
              } else {
                captions.push({
                  user_id: remoteUserId,
                  username: userName,
                  captions: sttSentence,
                  currentSubtitle: subtitle,
                  subtitleFlag: subtitleFlag,
                  subtitleSegment: subtitleSegment,
                  userProfile: remoteUserProfile,
                });
              }
            }
            console.log("isSubtitle : ", isSubtitle);

            // Set Captions
            setCaptions(captions);
            setCount((count) => count + 1);
            console.log("captions in subtitle-data: ", captions);
          }
          $(".cl_main_noti_box").animate(
            { scrollTop: $(".cl_main_noti_box").prop("scrollHeight") },
            0
          );
        }
      );

      // For Manage White board
      socket.on("on-handle-whiteboard", ({ action }) => {
        if (action === "open") {
          $(".whiteboard-wrapper").addClass("show");
          $(".whiteboard-wrapper").removeClass("d-none");
          $("body").addClass("white_board_on");

          //Teacher screen on whiteboard - start
          // $(".cl_user_list").css("right", "50px");
          // $(".cl_user_list").css("width", "250px");
          // $(".cl_user_list").css("position", "absolute");
          // $(".cl_user_list").css("z-index", "9999999");
          // $(".cl_user_list").css("top", "50px");
          // $(".cl_user_list").css("height", "auto");
          // $(".cl_user_list").css("aspect-ratio", "16/9");
          //Teacher screen on whiteboard - end
        } else {
          $(".whiteboard-wrapper").removeClass("show");
          $(".whiteboard-wrapper").addClass("d-none");
          $("body").removeClass("white_board_on");

          //Teacher screen on whiteboard - start
          // $(".cl_user_list").css("right", "");
          // $(".cl_user_list").css("width", "");
          // $(".cl_user_list").css("position", "");
          // $(".cl_user_list").css("z-index", "");
          // $(".cl_user_list").css("top", "");
          // $(".cl_user_list").css("height", "");
          //Teacher screen on whiteboard - end
        }
      });

      // New message from socket
      socket.on("new-message", ({ message, messagetime, name }) => {
        console.log(
          "captions in subtitle-data new-message : ",
          captions,
          message,
          messagetime,
          name
        );
        // Manage Unread counter badge
        unreadMessageCount = unreadMessageCount + 1;
        setChatUnreadMessageCount(unreadMessageCount);

        // Append New message to chat screen
        setAllChatMessages((prevMessages) => [
          ...prevMessages,
          { userId: name, userName: name, time: messagetime, message: message },
        ]);
      });
      //  return () => {
      //   socket.off("new-message");
      //   // ... other cleanup logic
      // };
      //socket for muteall participants
      socket.on("on-mute-everyone", () => {
        let t = isAudioMuted;
        t = !t;
        muteHandler();
      });

      // when we upload new document update document count to all active invites screen
      socket.on("on-document-counter", ({ count }) => {
        //setMeeetingDocumentCount(count);
        getDocumentList();
      });

      // When teacher is mute specific student from teacher mode to manage remote participant audio status
      socket.on("on-remote-participant-handler", ({ action }) => {
        if (room && room.p2pDominantSpeakerDetection) {
          if (room.p2pDominantSpeakerDetection.myUserID == action) {
            muteHandler();
            socket.emit("reset-remote-mute-counter");
          }
        }
      });

      // Reset counter for remote participant
      socket.on("on-reset-remote-mute-counter", () => {
        remoteMuteCounter = 1;
      });

      socket.on("on-admit-request", ({ user_id, user_name }) => {
        // Show modal for 2 seconds and if no action is taken add to admitList
        console.log("on admit request");
        setAdmitText(`${user_name} is trying to join the call`);
        setModalAdmit(true);
        setTimeout(() => {
          console.log("start timer");
          setModalAdmit(false);
          setAdmitText("");
          setAdmitList((prev) => {
            const isUserAlreadyExist = prev.some(
              (item) => item.user_id === user_id
            );
            if (!isUserAlreadyExist) {
              return [...prev, { user_id, user_name }];
            }
            return prev;
          });

          console.log("after set admit list");
        }, 3000);
      });

      // // Reset STT for local participant
      // socket.on("on-subtitle-callback", () => {
      //     isSTTStart = true;
      //     sttSentence = '';
      // });

      // Screen share socket
      // socket.on("screen-share-on", async ({ isScreenShareOn,newRoom }) => {
      //     if(isScreenShareOn === true){
      //             const resp = await delayStudentScreenShare();
      //             newRoomName = newRoom;
      //             // $('.cl_user_list').addClass('d-none');
      //              setScreenShared(true);
      //              $('.cl_main_home_box').addClass('d-none');
      //              $('.new_jitsi_component').removeClass('d-none');

      //     } else {
      //         newRoomName = "";
      //         $('.cl_user_list').removeClass('d-none');
      //         setScreenShared(false);
      //         $('.cl_main_home_box').removeClass('d-none');
      //         $('.new_jitsi_component').addClass('d-none');
      //     }
      // });

      // Present Student to Meeting
      socket.on("on-show-student", ({ id, action }) => {
        // Room Participants
        const allParticipants = room.getParticipants();

        // Remove presented UI box from Screen
        if (action === "endCall") {
          $(".meeting_video_body").removeClass("present_student");
        }

        // Map all tracks of presented student
        allParticipants.map((participants) => {
          // Remove presented student from UI
          if (action === "endCall") {
            participants._tracks.map((track) => {
              $(`.new_user_video_${track.getParticipantId()}`).remove();
              // $(".alimeet_section.student_page").removeClass(
              //   "teachersharestudent"
              // );
              $(`.new_user_audio_${track.getParticipantId()}`).remove();
            });
          }

          if (id === participants._id) {
            // Toggle Video
            $(".meeting_video_body").toggleClass("present_student");

            participants._tracks.map((track) => {
              const participant = track.getParticipantId();
              const trackType = track.getType();
              if (trackType === "video") {
                let userVideo = $(`.new_user_video_${participant}`).length;
                if (userVideo === 0) {
                  showUserToAll(track);
                } else {
                  $(`.new_user_video_${participant}`).remove();
                }
              } else {
                let userAudio = $(`.new_user_audio_${participant}`).length;
                if (userAudio === 0) {
                  showUserToAll(track);
                } else {
                  $(`.new_user_audio_${participant}`).remove();
                }
              }
            });
          }
        });
      });

      // screen + video of teacher to student
      socket.on("on-share-screen", ({ action }) => {
        console.log("Screen Shared:", action);
      });
    }
    // else {
    //   // Validate Room to allow user to join the meeting
    //   validateRoom(roomName);

    //   // Start Meeting
    //   JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
    //   console.log("Calling");
    //   startmeeting();

    //   //Socket Code start
    //   socket = io(ENDPOINSOCKETURL);
    //   socket.emit("join", { room: roomName });

    //   // Set Current time when page load
    //   formatAMPM(new Date());
    // }
  }, [socket]);

  useEffect(() => {
    // Validate Room to allow user to join the meeting
    validateRoom(roomName);

    // Start Meeting
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
    console.log("Calling");
    startmeeting();

    //Socket Code start
    socket = io(ENDPOINSOCKETURL);
    socket.emit("join", { room: roomName });

    // Set Current time when page load
    formatAMPM(new Date());
    return () => {
      console.log("unmount bef", localTracks);
      localTrackCleanUp();
      console.log("unmount aft", localTracks);
    };
  }, []);

  // For Only STT feature
  useEffect(() => {
    // if subtitle is off we will remove STT of local user
    // if(isSubtitle === false && captions.length > 0){
    //     console.log("STT OFF");
    //     for (var i in captions) {
    //         if (captions[i].user_id == userId) {
    //             captions.splice(i,1);
    //             //break; //Stop this loop, we found it!
    //         }
    //     }
    //     sttSentence = '';
    // }
    // // Pass Captions to Socket to remote users
    // let remoteUserId = userId;
    // let remoteUserProfile = userProfileImage;
    // if(socket && isSubtitle && subtitle && isAudioMuted === false) {
    //     if(subtitleFlag){
    //         sttSentence += subtitle;
    //         console.log('Flag in Meeting UI : '+subtitleFlag);
    //         console.log('finalMessage in Meeting UI : '+subtitle);
    //     }
    //     // add new captions object
    //     if(subtitle != '...'){
    //         // Append captions till new if someone is speaking
    //         // if(subtitleFlag){
    //         //     sttSentence += subtitle;
    //         //     console.log('Flag in Meeting UI : '+subtitleFlag);
    //         //     console.log('finalMessage in Meeting UI : '+subtitle);
    //         // }
    //         if(captions.length > 0 && isSTTStart == false){
    //             if(captions[captions.length - 1].user_id == userId) {
    //                 captions.splice(captions.length - 1,1);
    //             } else {
    //                 sttSentence = subtitle
    //             }
    //             captions.push({'user_id':userId,'username':userName,'captions':sttSentence, 'currentSubtitle':subtitle, 'subtitleFlag':subtitleFlag, 'subtitleSegment':subtitleSegment, 'userProfile':userProfileImage});
    //         }else{
    //             sttSentence = subtitle;
    //             // Add new captions
    //             captions.push({'user_id':userId,'username':userName,'captions':sttSentence, 'currentSubtitle':subtitle, 'subtitleFlag':subtitleFlag, 'subtitleSegment':subtitleSegment, 'userProfile':userProfileImage});
    //             // Set flag
    //             isSTTStart = false;
    //         }
    //         socket.emit('subtitle', { sttSentence, userName, isSubtitle, remoteUserId, subtitle, subtitleFlag, subtitleSegment, remoteUserProfile});
    //     }
    //     console.log(captions);
    //     $(".cl_main_noti_box").removeClass("d-none");
    // }else{
    //     //$(".cl_main_noti_box").addClass("d-none");
    //     socket.emit('subtitle', { sttSentence : '', userName : '', isSubtitle : isSubtitle, remoteUserId : remoteUserId, subtitle: '', subtitleFlag: '', remoteUserProfile: ''});
    // }
  });

  useEffect(() => {
    console.log("sttAudio ===== useeffect ", sttAudio);
  }, [sttAudio]);

  const videoQualityToggle = () => setModal(!modal);
  const handleChange = (event, newValue) => {
    if (room) {
      if (newValue == 0) {
        //onVideoMuteStateChanged(null);
        room.setSenderVideoConstraint(180);
        room.setReceiverVideoConstraint("180");
        room.setReceiverConstraints({ defaultConstraints: { maxHeight: 180 } });
      } else if (newValue == 25) {
        if (isVideoMuted === true) {
          // onVideoMuteStateChanged(null);
        }
        room.setSenderVideoConstraint(360);
        room.setReceiverVideoConstraint("720");
        room.setReceiverConstraints({ defaultConstraints: { maxHeight: 720 } });
      } else if (newValue == 50) {
        if (isVideoMuted === true) {
          // onVideoMuteStateChanged(null);
        }
        room.setSenderVideoConstraint(720);
        room.setReceiverVideoConstraint("1080");
        room.setReceiverConstraints({
          defaultConstraints: { maxHeight: 1080 },
        });
      } else if (newValue == 75) {
        if (isVideoMuted === true) {
          // onVideoMuteStateChanged(null);
        }
        room.setReceiverVideoConstraint("2160");
        room.setReceiverConstraints({
          defaultConstraints: { maxHeight: 2160 },
        });
      }
      setValue1(newValue);
    }
  };
  const marks = [
    {
      value: 0,
      label: "Low",
    },
    {
      value: 25,
      label: "Low defi.",
    },
    {
      value: 50,
      label: "Standart defi.",
    },
    {
      value: 75,
      label: "High defi.",
    },
  ];
  const toggleFocusScreen = () => {
    for (let child of userListRef.current.children) {
      child.classList.remove("focus");
    }
    document.querySelector(".cl_user_list").classList.add("focus-view");
    document.querySelector(".local_user_box").classList.add("focus");
  };
  const valuetext = (value) => {
    return `${value}`;
  };
  const valueLabelFormat = (value) => {
    return marks.findIndex((mark) => mark.value === value) + 1;
  };
  const videoQuality = (
    <div>
      <Slider
        key={value1}
        defaultValue={value1}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-restrict"
        onChange={handleChange}
        valueLabelDisplay="auto"
        step={null}
        marks={marks}
      />
    </div>
  );

  //That function is called when connection is established successfully
  const onConnectionSuccess = () => {
    try {
      console.log("OnConnectionSuccess");
      room = connection.initJitsiConference(roomName, confOptions);
      room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, onTrackRemoved);
      room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
      room.on(
        JitsiMeetJS.events.conference.DOMINANT_SPEAKER_CHANGED,
        changeDominantSpeakers
      );
      // room.on(JitsiMeetJS.events.conference.NOISY_MIC, () => {
      //   console.log("NOSIYD MIC");
      // });
      // room.on(JitsiMeetJS.events.conference.NO_AUDIO_INPUT, () => {
      //   console.log("NO AUDIO");
      // });e
      // room.on(JitsiMeetJS.events.conference.TALK_WHILE_MUTED, () => {
      //   console.log("TALK WHILE MUTED");
      // });
      room.on(
        JitsiMeetJS.events.conference.CONFERENCE_JOINED,
        onConferenceJoined
      );
      room.on(JitsiMeetJS.events.conference.USER_JOINED, (id) => {
        console.log("USER JOINED");
        //remoteTracks[id] = [];
      });
      room.on(
        JitsiMeetJS.events.conference.MESSAGE_RECEIVED,
        (id, text, ts) => {
          console.log("MESSAGE RECEIVED", id, text, ts);
        }
      );
      room.addCommandListener("SCREEN_SHARED", (val) => {});
      room.addCommandListener("SCREEN_SHARED_STOPPED", (val) => {
        // const element = $(`#remote-user-${participant}`);
        // if (element) {
        //   element.remove();
        // }
        // console.log(`track removed!!!${track}`);
        // getTotalRemoteUsers();
      });
      room.addCommandListener("KICK_PARTICIPANT", async ({ attributes }) => {
        console.log(attributes);
        console.log("kicked");
        if (
          attributes.participant != room.p2pDominantSpeakerDetection.myUserID
        ) {
          return;
        }
        // call leave function and show reason in the error
        await unload();
        alert(attributes.reason);
      });
      room.addCommandListener("MUTE_PARTICIPANT", ({ value }) => {
        console.log("MUTE_PARTICIPANT", value);
        if (value != room.p2pDominantSpeakerDetection.myUserID) {
          return;
        }
        // let t = isAudioMuted;
        // t = !t;
        muteHandler();
      });
      room.addCommandListener("TEXT_CMD", (val) => {
        console.log("TEXT_CMS", val);
      });
      room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
      room.on(
        JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED,
        onTrackMuteChanged
      );
      room.on(
        JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
        (userID, displayName) => console.log(`${userID} - ${displayName}`)
      );
      room.on(JitsiMeetJS.events.conference.USER_ROLE_CHANGED, (id, role) => {
        console.log("USER ROLE CHANGED", id, role);
        if (
          role == "moderator" &&
          id == room.p2pDominantSpeakerDetection.myUserID
        ) {
          // room.setStartMutedPolicy({ audio: false, video: true });
        }
      });
      room.on(
        JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
        (participantId, audioLevel) => {
          // console.log("REMOTE AUDIO LEVEL", participantId, audioLevel);
          if (participantId != room.p2pDominantSpeakerDetection.myUserID) {
            // $(`.audio-img-${participantId}`).removeClass("muted");
            if (audioLevel > 0.05) {
              $(`.audio-img-${participantId}`).removeClass("silent");
            } else {
              $(`.audio-img-${participantId}`).addClass("silent");
            }
          }
        }
      );
      let userRole = localStorage.getItem("user_role");
      let meetingRole = getMeetingRole();
      let userName = localStorage.getItem("user_name");
      let initialName = localStorage.getItem("initial_name");
      let userProfileImage = localStorage.getItem("user_profile_image");
      let userId = localStorage.getItem("user_id");
      console.log("MEETING+REL", meetingRole);
      room.setDisplayName(
        userRole +
          "#" +
          userName +
          "#" +
          initialName +
          "#" +
          userProfileImage +
          "#" +
          userId +
          "#" +
          meetingRole
      );
      room.setLocalParticipantProperty("meeting_role", getMeetingRole());
      room.setLocalParticipantProperty("is_organiser", isOrganiser());
      room.join();

      // Remove Participant left side
      // $(".cl_user_list").addClass("d-none");
    } catch (error) {
      console.log("onConnectionSuccess error", error);
    }
  };

  /**
   * That function is executed when the conference is joined
   */
  const onConferenceJoined = () => {
    try {
      isJoined = true;
      if (localTracks.length !== 0) {
        for (let i = 0; i < localTracks.length; i++) {
          if (
            localTracks[i] &&
            !localTracks[i].isEnded() &&
            !localTracks[i].disposed
          ) {
            room.setLocalParticipantProperty("userId", userId);
            room.addTrack(localTracks[i]);
            let myId = room.p2pDominantSpeakerDetection.myUserID;
            $(".local_user_box").attr("id", `remote-user-${myId}`);
          }
        }
      } else {
        console.log("No localtrack found");
      }
    } catch (error) {
      console.log("onConferenceJoined error", error);
    }
  };

  /**
   * Handles local tracks.
   * @param tracks Array with JitsiTrack objects
   */
  const onLocalTracks = (tracks) => {
    localTrackCleanUp();
    console.log("onLocalTracks", localTracks);
    localTracks = tracks;
    try {
      //to get prelaunch audio/video devices for prelaunch
      JitsiMeetJS.mediaDevices.enumerateDevices(onDeviceListChanged);
      if (localTracks.length !== 0) {
        for (let i = 0; i < localTracks.length; i++) {
          if (localTracks[i].getType() === "video") {
            if (startWithVideoMuted) {
              onVideoMuteStateChanged();
            }
            localTracks[i].attach($(`#localVideo`)[0]);
          } else {
            $("body").append(
              `<audio autoplay='1' muted="true" id='localAudio' />`
            );
            if (startWithAudioMuted) {
              console.log("attachinf");
              muteHandler();
            }
            localTracks[i].attach($(`#localAudio`)[0]);
          }
          localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
            (audioLevel) => {
              // console.log("TRACK AUDIO LEVEL CHANGED", audioLevel);
              // audiLevel between 0 to 1
              prelaunchScreen &&
                $(`.audio-cover`).css(
                  "transform",
                  `translateX(${audioLevel * 100}%)`
                );
              // TODO: ADD CODE FOR AUDIO DETECTION ON LOCAL SCREEN
              if (audioLevel > 0.05) {
                $(`.local_user_box .mute_icon`).removeClass("muted");
                $(`.local_user_box .mute_icon`).removeClass("silent");
              } else {
                if ($(`.local_user_box .mute_icon`).hasClass("muted")) {
                  return;
                }
                $(`.local_user_box .mute_icon`).addClass("silent");
              }
            }
          );
          localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
            () => console.log("local track muted")
          );
          localTracks[i].addEventListener(
            JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
            () => console.log("local track stoped")
          );
          localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
            (deviceId) =>
              console.log(
                `track audio output device was changed to ${deviceId}`
              )
          );
          if (isJoined) {
            // room.setLocalParticipantProperty("userId", userId);
            // room.addTrack(localTracks[i]);
            // console.log(room.isStartAudioMuted());
            // console.log(room.isStartVideoMuted());
          }
        }
      } else {
        console.log("localTracks not found");
      }
    } catch (error) {
      console.log("onLocalTracks error", error);
    }
    remoteExtaVideo();
  };

  const onTrackMuteChanged = (track) => {
    if (track.getType() === "video") {
      const participant = track.getParticipantId();
      if (!track.isMuted()) {
        $(`#remote-user-${participant}`).removeClass("vid-off");
      } else {
        $(`#remote-user-${participant}`).addClass("vid-off");
      }
    } else {
      const participantId = track.getParticipantId();
      if (track.isMuted()) {
        $(`#remote-user-${participantId}`).addClass("audio-off");
        $(`.audio-img-${participantId}`).addClass("muted");
      } else {
        $(`#remote-user-${participantId}`).removeClass("audio-off");
        $(`.audio-img-${participantId}`).removeClass("muted");
      }
    }

    // This code is used for managing mute all feature for remote track only
    if (localTracks[0] != track) {
      if (track.getType() === "audio") {
        if (track.isMuted() == true) {
          let position = muteAllParticipantsList.indexOf(track);
          if (position > -1) {
            muteAllParticipantsList.splice(position, 1);
          }
        } else {
          muteAllParticipantsList.push(track);
        }
        //console.log('muteAllParticipantsList ===> '+muteAllParticipantsList);

        if (muteAllParticipantsList.length > 0) {
          $("#muteall_participants1").css("stroke", "white");
          $("#muteall_participants2").css("stroke", "white");
        } else {
          $("#muteall_participants1").css("stroke", "red");
          $("#muteall_participants2").css("stroke", "red");
        }
      }
    }

    // Send message on enter KEY
    $("#send_mesage").on("keydown", function (event) {
      if (event.which == 13) {
        manageChat();
      }
    });
  };

  const onTrackRemoved = (track) => {
    if (track.isLocal()) {
      return;
    }
    let participant = track.getParticipantId();
    if ($(`#${participant}${track.getType()}`)[0]) {
      track.detach($(`#${participant}${track.getType()}`)[0]);
    }
    // if (remoteTracks[id].)

    // delete remoteTracks[id];
    console.log(remoteTracks);
    // getTotalRemoteUsers();
  };

  /**
   * Handles remote tracks
   * @param track JitsiTrack object
   */
  const onRemoteTrack = (track) => {
    try {
      if (track.isLocal()) {
        return;
      }
      console.log("remotetracks", track.isLocal(), track);
      let isUserJoined = userJoined;
      isUserJoined = !isUserJoined;
      setUserJoined(isUserJoined);
      if (isOrganiser()) {
        $(".cl_main_noti_box").css("left", "250px");
      }

      // Add track of remote users to manage Mute all
      if (!isOrganiser() && track.isMuted() == false) {
        muteAllParticipantsList.push(track);
      }

      const participant = track.getParticipantId();
      let participantName = room.getParticipantById(participant)._displayName;
      participantName = participantName.split("#");

      if (!remoteTracks[participant]) {
        remoteTracks[participant] = [];
      }
      const idx = remoteTracks[participant].push(track);
      track.addEventListener(
        JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        (val) => console.log("remote track muted", val)
      );
      track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () =>
        console.log("remote track stoped")
      );
      track.addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        (deviceId) =>
          console.log(`track audio output device was changed to ${deviceId}`)
      );
      const id = participant + track.getType();
      let role = localStorage.getItem("user_role");
      localUserId = track.ownerEndpointId;

      // if (participantName[0] === 'ADMIN' || participantName[0] === 'ADMIN') {
      //     // track.attach($(`#${id}`)[0]);
      //     return;
      // }

      //For Audio and Video img append
      if (track.getType() === "video") {
        userVideo = track.isMuted();
      } else {
        userAudio = track.isMuted();
      }

      if (isOrganiser()) {
        //alert('participantName[1] ===> '+participantName[1]);
        if (
          (!participantName[1] || participantName[1] == "undefined") &&
          track.videoType !== "desktop"
        ) {
          return;
        }
        if (track.getType() === "video") {
          addUserBox({
            role: "ATTENDEE",
            localUserId,
            participant,
            participantName,
            idx,
            parentRef: userListRef,
            focusedUser,
            setFocusedUser,
            track,
            handleMuteParticipant,
            kickParticipant,
            pinToMe,
          });
        } else {
          $("body").append(`<audio autoplay='1' id='${participant}audio' />`);
          track.attach($(`#${participant}audio`)[0]);
        }
      } else {
        if (
          participantName[5] === "Organiser" ||
          participantName[5] === "organiser"
        ) {
          if (track.getType() === "video" && track.videoType != "desktop") {
            // VIDEO
            $(".local_user_box").removeClass("focus");
            addUserBox({
              role: "MODERATOR",
              localUserId: null,
              participant,
              participantName,
              idx,
              parentRef: userListRef,
              focusedUser,
              setFocusedUser,
              track,
              pinToMe,
            });
          } else if (track.videoType == "desktop") {
            // CODE FOR REMOTE SCREEN SHARE VIDEO AND AUDIO BOTH(ADD ONLY AUDIO FOR NOW)
            if (track.getType() === "audio") {
              console.log("REMOTE SCREEN SHARE", track);
              $("body").append(
                `<audio autoplay='1' id='${participant}_screen_share_audio' />`
              );
              track.attach($(`#${participant}_screen_share_audio`)[0]);
            }
          } else {
            // AUDIO TRACK
            console.log("ADUIO REMOTE AIJFEMDSKM");
            $("body").append(`<audio autoplay='1' id='${participant}audio' />`);
            track.attach($(`#${participant}audio`)[0]);
          }
        } else {
          if (
            (!participantName[1] || participantName[1] == "undefined") &&
            track.videoType !== "desktop"
          ) {
            return;
          }
          if (track.getType() === "video") {
            addUserBox({
              role: "ATTENDEE",
              localUserId,
              participant,
              participantName,
              idx,
              parentRef: userListRef,
              focusedUser,
              setFocusedUser,
              track,
              pinToMe,
            });
          }
          // ALL PARTICIPANTS CAN STILL HEAR EACH OTHER
          if (track.getType() === "audio") {
            $("body").append(`<audio autoplay='1' id='${participant}audio' />`);
            track.attach($(`#${participant}audio`)[0]);
          }
        }
      }

      // To show default audio status for remote participant
      if (userAudio === true) {
        $(`#remote-user-${participant}`).addClass("audio-off");
      }
      if (userVideo === true) {
        $(`#remote-user-${participant}`).addClass("vid-off");
      }
      getTotalRemoteUsers();
    } catch (error) {
      console.log("onRemoteTrack error", error);
    }
  };
  /**
   * @param id
   * @param previousSpeakers
   */
  const changeDominantSpeakers = (id, previousSpeakers) => {
    console.log("changeDominantSpeakers", id, previousSpeakers);
    // if (!isOrganiser()) {
    //   return;
    // }
    let dominant = document.getElementById(`remote-user-${id}`);

    if (dominant) {
      dominant.setAttribute("data-dominant", 1);
      if (id != room.p2pDominantSpeakerDetection.myUserID) {
        showToMe(id);
      }
    }

    // increment data dominant value for previous speakers
    for (let i = 0; i < previousSpeakers.length; i++) {
      let element = document.querySelector(
        `#remote-user-${previousSpeakers[i]}`
      );
      if (element) {
        // let dominantValue = element.getAttribute("data-dominant");
        element.setAttribute("data-dominant", i + 2);
        element.classList.remove("d-off-ovr");
        console.log("prevSPeakrr", element);
      }
    }

    // Select all elements with a data-dominant attribute
    const elements = document.querySelectorAll("[data-dominant]");

    // Convert NodeList to an array for sorting
    const elementsArray = Array.from(elements);

    // Sort the array based on the value of data-dominant attribute in ascending order
    elementsArray.sort((a, b) => {
      const valueA = +a.getAttribute("data-dominant");
      const valueB = +b.getAttribute("data-dominant");
      return valueA - valueB;
    });
    for (let i = 0; i < elementsArray.length; i++) {
      // let domValue = elementsArray[i].getAttribute("data-dominant");
      if (i > getUserThreshold()) {
        elementsArray[i].classList.add("d-off-ovr");
      } else {
        elementsArray[i].classList.remove("d-off-ovr");
      }
      console.log(
        elementsArray[i].getAttribute("id") +
          "--" +
          elementsArray[i].classList +
          "--" +
          elementsArray[i].getAttribute("data-dominant")
      );
    }
  };

  /**
   * @param id
   */
  const onUserLeft = (id) => {
    try {
      // if (!remoteTracks[id]) {
      //   return;
      // }
      // //$('.cl_main_noti_box').css('left','0');
      // const tracks = remoteTracks[id];
      // // $("body").removeClass("organiser-focus");
      // if (tracks.length > 0) {
      //   const element = $(`#remote-user-${id}`);
      //   // if (element) {
      //   for (let i = 0; i < tracks.length; i++) {
      //     if ($(`#${id}${tracks[i].getType()}`)[0]) {
      //       tracks[i].detach($(`#${id}${tracks[i].getType()}`)[0]);
      //     }
      //   }
      //   delete remoteTracks[id];
      //   // element.remove();
      //   // }
      //   deleteUserBox(id);
      //   getTotalRemoteUsers();
      // } else {
      //   console.log("No Track Found To Remove");
      // }
      getTotalRemoteUsers();
      deleteUserBox(id);
    } catch (error) {
      console.log("onUserLeft error", error);
    }
  };

  /**
   * This function is called when the connection fail.
   */
  const onConnectionFailed = () => {
    console.error("Connection Failed!");
  };
  const sendText = () => {
    room.sendCommand("TEXT_CMD", {
      attributes: {
        text: "Hello",
        time: new Date().getTime(),
      },
    });
    // await room.broadcastEndpointMessage({ Hello: "12", world: "23" });
  };

  /**
   * This function is called when we disconnect.
   */
  const disconnect = () => {
    try {
      connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        onConnectionSuccess
      );
      connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_FAILED,
        onConnectionFailed
      );
      connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        disconnect
      );
    } catch (error) {
      console.log("disconnect error", error);
    }
  };

  /**
   * This function is called when the connection fail.
   */
  const onDeviceListChanged = (devices) => {
    try {
      setAllMediaDevices(devices);
      console.info("current devices", devices);
    } catch (error) {
      console.log("onDeviceListChanged error", error);
    }
  };

  const fetchChatData = async (page, pageSize) => {
    const token = localStorage.getItem("auth_token");
    // const meetingId = localStorage.getItem("active_meeting_id");
    try {
      const response = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.chat_get}?meetingId=${meetingId}&page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedMessages = response.data.flat();
      if (isEmptyObject(fetchedMessages)) {
        // fetchedMessages is used to block scroll event when we reach last
        setIsFetchedMessages(true);
      }
      setAllChatMessages((prevMessages) => [
        ...fetchedMessages,
        ...prevMessages,
      ]);
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  const handleScroll = (scrollTop) => {
    console.log("handleScroll meetingUI");
    if (currentPage > 0) {
      setPageSize(8);
    }
    if (scrollTop === 0 && !isfetchedMessages) {
      setCurrentPage((prevPage) => prevPage + 1);
      fetchChatData(currentPage + 1, pageSize);
    }
  };

  // Chat save
  const saveChat = async (message, messagetime) => {
    const token = localStorage.getItem("auth_token");
    try {
      const validateRoomResponse = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.chat_add}`,
        {
          message: message,
          time: messagetime,
          meetingId: meetingId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (validateRoomResponse.status === 200) {
        setComponentStatus({
          status: "OK",
          message: "Message send",
        });
      } else {
        setComponentStatus({
          status: "error",
          message: "Message not send",
        });
      }
    } catch (error) {
      // try block closed
      console.log("error while valdiating room");
    }
  };

  // Start meeting
  const startmeeting = async () => {
    try {
      console.log("start meeting is calling");
      localTracks = [];

      //Jitsi Object initialization
      JitsiMeetJS.init(initOptions);

      //Jitsi connection
      connection = new JitsiMeetJS.JitsiConnection(null, null, options);

      //Jitsi addEventListeners for connection successfully
      connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        onConnectionSuccess
      );
      connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_FAILED,
        onConnectionFailed
      );
      connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        disconnect
      );
      JitsiMeetJS.mediaDevices.addEventListener(
        JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
        onDeviceListChanged
      );

      // console.log("deviceMobile =========> ", deviceMobile)
      // if (prelaunchScreen === false || deviceMobile === true) {
      //     connection.connect();
      //     console.log('If prelaunchScreen ================> ', prelaunchScreen);
      // } else {
      //     console.log('Else prelaunchScreen ================> ', prelaunchScreen);
      // }

      //Create User Localtracks
      console.log("Second");
      JitsiMeetJS.createLocalTracks({
        devices: ["audio", "video"],
        resolution: 144,
        desktopSharingFrameRate: {
          min: 25,
          max: 25,
        },
      })

        .then((tracks) => {
          localTracks = tracks;
          console.log("Pelaunch", localTracks);
          JitsiMeetJS.mediaDevices.enumerateDevices(onDeviceListChanged);
        })
        .catch((error) => {
          if (error.name === "NotReadableError") {
            alert("Your webcam is already in use by another app !");
            navigate(routes.meeting_list);
          } else {
            console.log("error.name ==== " + error.name);

            setErrorText(error.message);
          }
        });
    } catch (error) {
      alert("Error while createLocalTrack : ", error);

      setErrorText(error.message);
    }
  };

  let isActionTaken = false;
  const handleAdmit = (action, user_id) => {
    socket.emit("admit-response", { action: action });
    setAdmitList((prev) => {
      // remove object with given user_id
      return prev.filter((item) => item.user_id !== user_id);
    });
    // toggleAdmit();
  };
  const handleAdmitFromModal = (action) => {
    isActionTaken = true;
    handleAdmit(action);
  };

  //For prelaunch
  const joinWithVideoOff = (state) => {
    console.log(state);
    startWithVideoMuted = state;
  };
  const joinWithAudioOff = (state) => {
    console.log(state);
    startWithAudioMuted = state;
  };
  const roomInit = (
    audioId,
    videoId,
    startWithVideoMuted,
    startWithAudioMuted
  ) => {
    console.log("roomInit", localTracks);
    try {
      // Clear localtracks if found any
      // if (localTracks.length !== 0) {
      //   for (let i = 0; i < localTracks.length; i++) {
      //     localTracks[i].dispose();
      //   }
      // }
      localStorage.setItem("videodeviceId", videoId);
      localStorage.setItem("audiodeviceId", audioId);
      joinWithVideoOff(!startWithVideoMuted);
      joinWithAudioOff(!startWithAudioMuted);
      // Create local tracks for audio and video
      JitsiMeetJS.createLocalTracks({
        devices: ["audio", "video"],
        // resolution: 144,
        // constraints: {
        //   video: {
        //     height: {
        //       ideal: 720,
        //       max: 720,
        //       min: 180,
        //     },
        //   },
        // },
        cameraDeviceId: videoId,
        micDeviceId: audioId,
      })
        .then(onLocalTracks)
        .catch((error) => {
          //throw error;
        });

      // set prelaunch screen to false to open meeting UI
      setPrelaunchScreen(false);

      // Invites Attendence
      checkInAttendence();
      //getDocumentList();
      connection.connect();
    } catch (error) {
      console.log("prelaunchMediaHandler error", error);
    }
  };
  const prelaunchMediaHandler = (
    audioId,
    videoId,
    startWithVideoMuted,
    startWithAudioMuted
  ) => {
    if (localStorage.getItem("user_role") == "Guest") {
      console.log("Kidin");
      socket.emit("admit-request", {
        user_id: localStorage.getItem("user_id"),
        user_name: localStorage.getItem("user_name"),
      });
      socket.on("on-admit-response", ({ action }) => {
        if (action == "allow") {
          console.log("ALLOWED");
          roomInit(audioId, videoId, startWithVideoMuted, startWithAudioMuted);
        } else if (action == "deny") {
          console.log("DENY");
          alert("Sorry!! You are Not aurthorized");
        }
      });
    } else {
      roomInit(audioId, videoId, startWithVideoMuted, startWithAudioMuted);
    }
  };

  /**
   *when user leave the meeting
   */
  const unload = async () => {
    try {
      //            captions = [];
      sttSentence = "";
      if (localTracks.length > 0) {
        for (let i = 0; i < localTracks.length; i++) {
          localTracks[i].dispose();
          //room.removeTrack(localTracks[i]);
        }

        // Checking out Invites attendence to meeting
        await checkOutAttendence();

        //Remove shared-student if any
        if (isOrganiser() && localStorage.getItem("is_student_present")) {
          localStorage.removeItem("presentedId");
          localStorage.removeItem("is_student_present");
          await socket.emit("show-student", {
            id: localStorage.getItem("presentedId"),
            action: "endCall",
          });
        }
        // Remove the room from JITSI
        if (room) {
          room.off(JitsiMeetJS.events.conference.TRACK_REMOVED, onTrackRemoved);
          room.off(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
          room.off(
            JitsiMeetJS.events.conference.DOMINANT_SPEAKER_CHANGED,
            changeDominantSpeakers
          );
          room.off(
            JitsiMeetJS.events.conference.CONFERENCE_JOINED,
            onConferenceJoined
          );
          room.off(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
          room.off(
            JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED,
            onTrackMuteChanged
          );
          await room.leave();
          await connection.disconnect();
        }
      } else {
        console.log("No Tracks found to remove");
      }
      if (localStorage.getItem("user_role") == "Guest") {
        navigate(routes.home);
        return;
      }
      // Redirect to Meeting List
      navigate(routes.meeting_list);
      // window.location.href = routes.meeting_list;
    } catch (error) {
      await connection.disconnect();

      // Redirect to Meeting List
      navigate(routes.meeting_list);
      // window.location.href = routes.meeting_list;

      console.log("unload error", error);
    }
  };

  /**
   * That function is executed when the track is muted
   */
  const muteHandler = () => {
    // Reset
    if (isSubtitle) {
      socket.emit("subtitle-callback");
    }

    console.log("Mute handling");
    if (localTracks.length !== 0) {
      for (let i = 0; i < localTracks.length; i++) {
        if (localTracks[i].type === "audio") {
          try {
            let isMuted = localTracks[i].isMuted();
            if (isMuted) {
              localTracks[i].unmute();
              $("#audio-btn").toggleClass("btn-off");
              $(`.local_user_box .mute_icon`).removeClass("muted");
              // $(`.local_user_box .mute_icon`).css("filter", `unset`);
              // $(".cl_main_noti_box").removeClass('d-none');
              //   $("#local_audio").css("fill", "#fff");
              //   $(".circle_background").css("fill", "#464958");
              //   $(".line").addClass("d-none");
              setIsAudioMuted(false);
              localStorage.setItem("isAudioMuted", false);
              localStorage.setItem("removeOldSTT", 1);
              setSttAudio(!sttAudio);
            } else {
              localTracks[i].mute();
              $("#audio-btn").toggleClass("btn-off");
              setIsAudioMuted(true);
              // huerotate green to red
              $(`.local_user_box .mute_icon`).addClass("muted");
              // $(`.local_user_box .mute_icon`).css(
              //   "filter",
              //   "hue-rotate(250deg) saturate(5) !important"
              // );
              localStorage.setItem("isAudioMuted", true);
              localStorage.setItem("removeOldSTT", 0);
              setSttAudio(!sttAudio);
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    } else {
      console.log("error while calling Audio mutehandler");
    }

    console.log("AUDIO USESTATE", sttAudio);
  };

  const refreshSTTPanel = async (e) => {
    console.log("called refreshSTTPanel --------> ");
  };
  /**
   * That function is executed when the video is muted
   */
  const onVideoMuteStateChanged = async (e) => {
    console.log("VideoMuteStateChanged", isVideoMuted);
    if (screenShared) {
      setIsVideoMuted(true);
      return;
    }
    if (localTracks.length !== 0) {
      for (let i = 0; i < localTracks.length; i++) {
        if (localTracks[i].type === "video") {
          try {
            if (isVideoMuted === true) {
              localTracks[i].unmute();
              setIsVideoMuted(false);
              $(`.local_user_box`).removeClass("vid-off");
              /*$("#local_video").css("fill", "#464958");
                            $('.local_video').removeClass('d-none');
                            $('.local_video_mute_img').addClass('d-none');*/

              // $("#local_video").css("fill", "#464958");
              // // $(".local_video").removeClass("d-none");
              // $(".line1").addClass("d-none");
              // $(".local_video_mute_img1").addClass("d-none");
              // $(".local_video_mute_img").addClass("d-none");
            } else {
              localTracks[i].mute();
              setIsVideoMuted(true);
              $(`.local_user_box`).addClass("vid-off");
              /*$("#local_video").css("fill", "#ff0000");
                            $('.local_video').addClass('d-none');
                            $('.local_video_mute_img').removeClass('d-none');*/
              // $("#local_video").css("fill", "#ff0000");
              // $(".line1").removeClass("d-none");
              // // $(".local_video").addClass("d-none");
              // if (userProfileImage) {
              //   $(".local_video_mute_img1").removeClass("d-none");
              //   $(".local_video_mute_img").addClass("d-none");
              // } else {
              //   $(".local_video_mute_img").removeClass("d-none");
              //   $(".local_video_mute_img1").addClass("d-none");
              // }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    } else {
      console.log("error while calling video mutehandler");
    }
  };

  //For remove extra localvideo
  const remoteExtaVideo = () => {
    let tags = $(".local-video");
    if (tags.length > 1) {
      $(".local-video")[1].remove();
    }
  };

  //For Getting Totalnumber of Remote Users
  const getTotalRemoteUsers = () => {
    const remoteUser = room.getParticipants();
    console.log("remoteUser", remoteUser);
    setUserColLength(remoteUser.length);
    setRemoteParticipantList(remoteUser);
  };

  function onPipWindowResize(event) {
    // Picture-in-Picture window has been resized.
    const { width, height } = event.target;
    updateVideoSize(width, height);
  }

  function updateVideoSize(width, height, event) {
    event.pictureInPictureWindow.height = height;
    event.pictureInPictureWindow.width = width;
  }

  /**
   * Screen Share
   */
  // const switchVideo = () => {
  //   if (!isVideo) {
  //     $("#switch_video").css("fill", "#464958");
  //   }
  //   isVideo = !isVideo; //switching the value
  //   // 0
  //   // 1
  //   // 2
  //   if (localTracks[2]) {
  //     localTracks[2].dispose();
  //     localTracks.pop();
  //   }
  //   if (localTracks[1]) {
  //     localTracks[1].dispose();
  //     localTracks.pop();
  //   }
  //   if (isVideo == true) {
  //     JitsiMeetJS.createLocalTracks({
  //       devices: ["video"],
  //       cameraDeviceId: localStorage.getItem("videodeviceId"),
  //       micDeviceId: localStorage.getItem("audiodeviceId"),
  //     })
  //       .then((tracks) => {
  //         localTracks.push(tracks[0]);

  //         localTracks[1].addEventListener(
  //           JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
  //           () => console.log("local track muted")
  //         );
  //         localTracks[1].addEventListener(
  //           JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
  //           () => {
  //             console.log("isVideo", isVideo);
  //             if (tracks[0].videoType === "desktop" && isVideo === false) {
  //               $("#switch_video").css("fill", "#464958");
  //               switchVideo();
  //             }
  //           }
  //         );
  //         if (document.pictureInPictureElement) {
  //           document.exitPictureInPicture();
  //         }

  //         localTracks[1].attach($("#localVideo")[0]);
  //         room.addTrack(localTracks[1]);
  //       })
  //       .catch((error) => {
  //         switchVideo();
  //       });
  //   } else {
  //     JitsiMeetJS.createLocalTracks({
  //       devices: ["video", "desktop"],
  //       cameraDeviceId: localStorage.getItem("videodeviceId"),
  //       micDeviceId: localStorage.getItem("audiodeviceId"),
  //     })
  //       .then((tracks) => {
  //         localTracks.push(tracks[0]);
  //         localTracks.push(tracks[1]);
  //         localTracks[0].addEventListener(
  //           JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
  //           () => console.log("local track muted")
  //         );
  //         localTracks[1].addEventListener(
  //           JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
  //           () => {
  //             console.log("isVideo", isVideo);
  //             if (tracks[0].videoType === "desktop" && isVideo === false) {
  //               $("#switch_video").css("fill", "#464958");
  //               switchVideo();
  //             } else {
  //             }
  //           }
  //         );

  //         if (localTracks[2].videoType === "camera") {
  //           localTracks[2].attach($("#pip-video")[0]);
  //           room.addTrack(localTracks[2]);
  //           let videoElement = document.getElementById("pip-video");

  //           videoElement.onloadedmetadata = function () {
  //             enterPictureInPicture(document.getElementById("pip-video"));
  //           };
  //           videoElement.addEventListener("enterpictureinpicture", (event) => {
  //             // Video entered Picture-in-Picture mode.
  //             const pipWindow = event.pictureInPictureWindow;

  //             const { width, height } = event.target;
  //             event.target.width = 500;
  //             event.target.height = 500;
  //             //updateVideoSize(width, height);
  //             //updateVideoSize(500, 500, event);
  //             //pipWindow.addEventListener("resize", onPipWindowResize);
  //           });

  //           function enterPictureInPicture(videoElement) {
  //             if (
  //               document.pictureInPictureEnabled &&
  //               !videoElement.disablePictureInPicture
  //             ) {
  //               try {
  //                 if (document.pictureInPictureElement) {
  //                   document.exitPictureInPicture();
  //                 }
  //                 videoElement.requestPictureInPicture();
  //               } catch (err) {
  //                 console.error(err);
  //               }
  //             }
  //           }
  //         }
  //         console.log("local tracks", localTracks);
  //         localTracks[2].attach($("#localVideo")[0]);
  //         room.addTrack(localTracks[1]);
  //       })
  //       .catch((error) => {
  //         switchVideo();
  //       });
  //   }
  // };
  const localTrackCleanUp = () => {
    // remove all tracks which are from video type
    localTracks.forEach(async (track) => {
      await track.dispose();
    });
    localTracks = [];
  };
  const handleStopSharing = async () => {
    // localTracks[localTracks.length - 1].detach($("#localVideo")[0]);
    room.sendCommand("SCREEN_SHARED_STOPPED", {
      attributes: {
        participant_id:
          localTracks[localTracks.length - 1]._sourceName.split("-")[0],
        id: localTracks[localTracks.length - 1].getId(),
      },
    });
    // await room.removeTrack(localTracks[localTracks.length - 1]);
    // localTrackCleanUp();

    JitsiMeetJS.createLocalTracks({
      devices: ["video", "audio"],
      cameraDeviceId: localStorage.getItem("videodeviceId"),
      micDeviceId: localStorage.getItem("audiodeviceId"),
    }).then(async (tracks) => {
      console.log("All new tracks", tracks);
      tracks.map(async (track) => {
        if (track.type == "video") {
          let vidTrackIdx = localTracks.findIndex((track) => {
            return track.type == "video" && track.videoType == "desktop";
          });
          if (vidTrackIdx != -1) {
            // Detach from container
            localTracks[vidTrackIdx].detach($("#localVideo")[0]);
            // dispose old track
            await localTracks[vidTrackIdx].dispose();
            // remove old track
            localTracks.splice(vidTrackIdx, 1, track);
          }
          // Add new track
          // localTracks.push(track);
          // attach new track
          track.attach($("#localVideo")[0]);
          if (isVideoMuted) {
            track.mute();
            setIsVideoMuted(true);
            $(`.local_user_box`).addClass("vid-off");
          }
          // add new track
          await room.addTrack(track);
        }
        if (track.type == "audio") {
          let audTrackIdx = localTracks.findIndex((track) => {
            return track.type == "audio";
          });
          console.log("Audio trakc", localTracks[audTrackIdx], audTrackIdx);
          if (audTrackIdx != -1) {
            // detach track
            localTracks[audTrackIdx].detach($("#localAudio")[0]);
            // dispose old track
            await localTracks[audTrackIdx].dispose();
            // remove old track
            localTracks.splice(audTrackIdx, 1, track);
          }
          // add new track
          // localTracks.push(track);
          // attach new track
          track.attach($("#localAudio")[0]);
          if (isAudioMuted) {
            track.mute();
            setIsAudioMuted(true);
          }
          // add new track
          await room.addTrack(track);
        }
      });
    });
    setScreenShared(false);
  };
  const switchVideo = () => {
    console.log("Localtrack", localTracks);
    JitsiMeetJS.createLocalTracks({
      devices: ["desktop"],
    })
      .then((tracks) => {
        console.log("All new tracks", tracks);
        tracks.map(async (track) => {
          if (track.type == "video") {
            let vidTrackIdx = localTracks.findIndex((track) => {
              return track.type == "video" && track.videoType == "camera";
            });
            console.log("New track", track);
            // Detach from container
            localTracks[vidTrackIdx].detach($("#localVideo")[0]);
            // dispose old track
            await localTracks[vidTrackIdx].dispose();
            // remove old track
            localTracks.splice(vidTrackIdx, 1, track);
            // Add new track
            // localTracks.push(track);
            // attach new track
            track.attach($("#localVideo")[0]);
            if ($(`.local_user_box`).hasClass("vid-off")) {
              $(`.local_user_box`).removeClass("vid-off");
            }
            // add new track
            await room.addTrack(track);
            track.addEventListener(
              JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
              handleStopSharing
            );
            room.sendCommand("SCREEN_SHARED", {
              attributes: {
                participant_id:
                  localTracks[localTracks.length - 1]._sourceName.split("-")[0],
                id: localTracks[localTracks.length - 1].getId(),
              },
            });
          } else if (track.type == "audio") {
            let audTrackIdx = localTracks.findIndex((track) => {
              return track.type == "audio";
            });
            console.log("New track", track);
            // detach track
            localTracks[audTrackIdx].detach($("#localAudio")[0]);
            // dispose old track
            await localTracks[audTrackIdx].dispose();
            // remove old track
            localTracks.splice(audTrackIdx, 1, track);
            // add new track
            // localTracks.push(track);
            // attach new track
            track.attach($("#localAudio")[0]);
            // add new track
            await room.addTrack(track);
            console.log("Localtrack", localTracks);
          } else {
            await track.dispose();
          }
        });
      })
      .catch((e) => {
        console.log(e);
        if (e.name == "gum.screensharing_user_canceled") {
          setScreenShared(false);
        }
      });
    setScreenShared(true);
  };
  //For SwitchVideo
  const switchVideohandler = () => {
    // $("#switch_video").css("fill", "#ff0000");
    switchVideo();
  };

  var timeout;

  function addHighlight() {
    if (document.querySelector(".meeting_room")) {
      document.querySelector(".meeting_room").classList.add("highlight");
    }
  }

  function removeHighlight() {
    if (document.querySelector(".meeting_room")) {
      document.querySelector(".meeting_room").classList.remove("highlight");
    }
  }

  function handleMouseMove() {
    addHighlight();
    clearTimeout(timeout);
    timeout = setTimeout(removeHighlight, 1000); // Adjust the time delay as needed
  }

  function enterFullscreen(element) {
    console.log(isFullscreen);
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      // IE/Edge
      element.msRequestFullscreen();
    }
  }

  function exitFullscreen() {
    console.log(isFullscreen);
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
  }
  function handleFullScreenChange() {
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      console.log("Fullscreen is ON");
      document.querySelector(".meeting_room").classList.add("full-screen");
      document
        .querySelector(".meeting_room")
        .addEventListener("mousemove", handleMouseMove);
      setIsFullscreen(!isFullscreen);
    } else {
      console.log("Fullscreen is OFF");
      document.querySelector(".meeting_room").classList.remove("full-screen");
      document
        .querySelector(".meeting_room")
        .removeEventListener("mousemove", handleMouseMove);
      setIsFullscreen(!isFullscreen);
    }
  }
  const switchBigScreen = () => {
    const elem = document.documentElement; // Use the root element for fullscreen

    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      enterFullscreen(elem);
      document.addEventListener("fullscreenchange", handleFullScreenChange);
      document.addEventListener("mozfullscreenchange", handleFullScreenChange); // Firefox
      document.addEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      ); // Chrome, Safari and Opera
      document.addEventListener("MSFullscreenChange", handleFullScreenChange); // IE/Edge
    } else {
      exitFullscreen();
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullScreenChange
      ); // Firefox
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      ); // Chrome, Safari and Opera
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullScreenChange
      ); // IE/Edge
    }
  };

  //MuteALl Participants
  const handleMuteAllParticipant = () => {
    // Mange SVG for MUTE all
    $("#muteall_participants1").css("stroke", "red");
    $("#muteall_participants2").css("stroke", "red");

    // Mute all remote Participants
    socket.emit("mute-everyone");
  };

  //for recording meeting
  const clickrecording = () => {
    if (screenRecording === false) {
      setRecordingHandler("start");
      setRecordAction("stop");
    } else {
      setRecordingHandler("stop");
      setRecordAction("start");
    }
    screenRecording = !screenRecording;
  };

  //for validate room to allow user to join meeting for invites
  const validateRoom = async () => {
    const token = localStorage.getItem("auth_token");
    const meetingId = localStorage.getItem("meeting_id");
    console.log("meeting id", meetingId);
    try {
      const validateRoomResponse = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.validateRoom}`,
        {
          meetingId: meetingId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (validateRoomResponse.status === 200) {
        localStorage.setItem("meetingId", validateRoomResponse.data.meeting.id);
        localStorage.setItem(
          "meeting_invities",
          JSON.stringify(validateRoomResponse.data.meeting.attendees)
        );
        localStorage.setItem(
          "meeting_uploaded_documents_count",
          validateRoomResponse.data.meeting.uploaded_documents_count
        );
        localStorage.setItem(
          "meeting_title",
          validateRoomResponse.data.meeting.meeting_title
        );

        // Set the current meeting Id
        setCurrentMeetingId(meetingId);
        setMeeetingDocumentCount(
          validateRoomResponse.data.meeting.uploaded_documents_count
        );

        let meetingUsers = validateRoomResponse.data.meeting.invitee;
        let userId = localStorage.getItem("user_id");
        let userRole = localStorage.getItem("user_role");
        if (
          meetingUsers &&
          meetingUsers.indexOf(parseInt(userId)) == -1 &&
          userRole != "ADMIN" &&
          userRole != "Guest"
        ) {
          alert(constant.not_invited);
          unload();
          navigate(routes.meeting_list);
        }
      } else {
        alert(constant.conf_went_wrong);
        //unload();
        navigate(routes.meeting_list);
      }
    } catch (error) {
      console.log("error while valdiating room");
    }
  };

  //for capturing attendance for invities
  const checkInAttendence = async () => {
    const userId = localStorage.getItem("user_id");
    // const meetingId = localStorage.getItem("active_meeting_id");

    const token = localStorage.getItem("auth_token");
    const checkinTime = new Date().toISOString();
    const meetingId = localStorage.getItem("meeting_id");
    console.log("checkintime", checkinTime, meetingId);
    try {
      const { status, data } = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.attendance_time}`,
        {
          meetingId: meetingId,
          isCheckOut: false,
          checkTime: checkinTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (status == 200) {
        await Axios.get(
          `${ENDPOINTURL}${apiRoutes.userStatus}`,
          // {
          // current_status: 1002,
          // id: userId,
          // },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      console.log("id", data.id);
      setAttendenceId(data.id);
    } catch (error) {
      console.log("error while capturing attendence");
    }
  };

  //for delay screen share student specific
  const delayStudentScreenShare = async () => {
    setTimeout(() => {
      console.log("checkoutAttendence");
    }, 3000);
  };
  //for capturing attendance for invities
  const checkOutAttendence = async () => {
    const checkOutTime = new Date().toISOString();
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("auth_token");
    const meetingId = localStorage.getItem("meeting_id");

    try {
      const { status, data } = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.attendance_time}`,
        {
          meetingId: meetingId,
          isCheckOut: true,
          checkTime: checkOutTime,
          attendance_id: attendanceId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (status == 200) {
        await Axios.get(
          `${ENDPOINTURL}${apiRoutes.userStatus}`,
          // {
          //   currentStatus: 1001,
          //   id: userId,
          // },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (data.data === "Attendance Check-out Successfully !") {
        socket.emit("endcall");
      }
    } catch (error) {
      console.log("error while capturing attendence");
    }
  };

  //For AddPassword
  const addPassword = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      let meeting = JSON.parse(meetingData);
      const data = Axios.post(
        `${ENDPOINTURL}/meeting/addPassword`,
        {
          meetingEntity: {
            meetingId: meeting.meetingId,
            roomName: meeting.roomName,
            meetingTitle: meeting.meetingTitle,
            meetingDesc: meeting.meetingDesc,
            invites: meeting.invites,
            startTime: meeting.startTime,
            endTime: meeting.endTime,
            meetingPassword: meetingPassword,
            user: {
              id: meeting.user.id,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    togglesecurity();
  };

  //For ConfirmPassword
  const confirmMeetingPassword = async () => {
    const token = localStorage.getItem("auth_token");
    const meetingId = localStorage.getItem("meeting_id");
    let meeting = JSON.parse(meetingData);
    const data = await Axios.post(
      `${ENDPOINTURL}/meeting/validateMeetingPassword?meetingId=${meeting.meetingId}&meetingPassword=${password}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (data) {
      if (data.data === "Password Matched!") {
        setModalpwd(false);
      } else {
        setpasswordRes(data.data);
      }
    }
  };

  // Meeting Participents
  const meetingParticipants = async () => {
    $("body").toggleClass("participant-listOpen");
    $("body").removeClass("ChatsBoxOpen");
    $("body").removeClass("document-listOpen");
  };
  const closeMeetingParticipants = async () => {
    $("body").removeClass("participant-listOpen");
  };
  const openAdmitList = () => {
    $("body").addClass("admit-listOpen");
  };
  const closeAdmitList = () => {
    $("body").removeClass("admit-listOpen");
  };
  //For chat handling
  const formatAMPM = async (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    chatTimeValue = strTime;
    setChatTime(strTime);
  };
  const chatHandler = () => {
    // Manage toggle
    $("body").toggleClass("ChatsBoxOpen");
    $("body").removeClass("participant-listOpen");
    $("body").removeClass("document-listOpen");

    // Reset Unread message count badge
    unreadMessageCount = 0;
    setChatUnreadMessageCount(unreadMessageCount);
  };
  const closeMeetingChat = async () => {
    $("body").removeClass("ChatsBoxOpen");
  };
  // Manage Live Chat for meeting
  const manageChat = async () => {
    // Set current time for chat message
    formatAMPM(new Date());

    if ($("#send_mesage").val() != "") {
      // Send message to conference
      var chatDate = Date.now();
      saveChat($("#send_mesage").val(), chatDate);
      var name = localStorage.getItem("user_name");
      var message = $("#send_mesage").val();
      socket.emit("send-message", {
        message: $("#send_mesage").val(),
        messagetime: chatDate,
        name: localStorage.getItem("user_name"),
      });

      // Append new message to chat
      // $("#remote_chat").append(
      //   '<span className="time_chat" id="my_name">You <strong>' +
      //     chatTimeValue +
      //     "</strong></span><p>" +
      //     $("#send_mesage").val() +
      //     "</p>"
      // );

      setAllChatMessages((prevMessages) => [
        ...prevMessages,
        { userId: name, userName: name, time: chatDate, message: message },
      ]);
      //fetchChatData();
      // Scroll to bottom
      // $("#user_chat_panel").animate(
      //   { scrollTop: $("#user_chat_panel").prop("scrollHeight") },
      //   1000
      // );
      // $("#user_chat_panel").on("scroll", function () {
      //   if ($(this).scrollTop() === 0) {
      //     // If the user has scrolled to the top, fetch more messages
      //     currentPage++;
      //     fetchChatData(currentPage, pageSize);
      //   }
      // });
      // Clear the message
      $("#send_mesage").val("");
      newChatMessage("");
    }
  };

  // Manage Meeting Documents
  const meetingDocumentsHandler = async () => {
    // Get Meeting Documents
    getDocumentList();

    // Manage toggle
    $("body").toggleClass("document-listOpen");
    $("body").removeClass("ChatsBoxOpen");
    $("body").removeClass("participant-listOpen");
  };

  // Close meeting documents on click of close icon
  const closeMeetingDocuments = async () => {
    $("body").removeClass("document-listOpen");
  };

  // Manage Meeting Documents
  let formData = new FormData();
  const uploadHandler = async (e) => {
    var fi = document.getElementById("meeting_document"); // GET THE FILE INPUT.
    const token = localStorage.getItem("auth_token");
    // const meetingId = localStorage.getItem("active_meeting_id");

    // checking for multiple file upload.
    if (e.target.files.length > 1) {
      // cannot add multiple files .
      alert("Sorry, multiple files are not allowed");
      return false;
    } else {
      formData.append("document", e.target.files[0]);
      formData.append("source", "Documents");
      formData.append("meetingId", meetingId);
      // Start Uploading an document
      setComponentStatus({
        status: "processing",
        message: "Uploading Document...",
      });
      try {
        setComponentStatus({
          status: "processing",
          message: "Processing...",
        });
        const uploadDocumentResponse = await Axios.post(
          `${ENDPOINTURL}${apiRoutes.document_upload}`,
          formData,
          // {
          //   document : formData,
          //   meetingId : meetingId,
          //   source : 'Recordings',
          // },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (uploadDocumentResponse.status === 200) {
          setDocumentList(uploadDocumentResponse.data);
          setMeeetingDocumentCount(uploadDocumentResponse.data.length);

          // Send Meeting documnts legnth to all participents
          socket.emit("document-counter", {
            count: uploadDocumentResponse.data.length,
          });

          // Remove Uplaoded file from formdata
          formData.delete("files");

          // Start Uploading an document
          setComponentStatus({
            status: "",
            message: "",
          });
        } else {
          alert(constant.conf_went_wrong);
          navigate(routes.meeting_list);
        }
      } catch (error) {
        setComponentStatus({
          status: "error",
          message: constant.document_upload_wrong,
        });
      }
    }
  };

  //For getting documentList
  const getDocumentList = async () => {
    const token = localStorage.getItem("auth_token");
    // const meetingId = localStorage.getItem("active_meeting_id");
    console.log("meeting doc is", meetingId);
    try {
      const meetingDocumentResponse = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.document_get}?meetingId=${meetingId}&source=Documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (meetingDocumentResponse.status === 200) {
        setDocumentList(meetingDocumentResponse.data);
        setMeeetingDocumentCount(meetingDocumentResponse.data.length);
      } else {
        alert(constant.conf_went_wrong);
        navigate(routes.meeting_list);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Delete the document from meeting
  const deleteDocument = async (documentId) => {
    try {
      setComponentStatus({
        status: "processing",
        message: "Processing...",
      });
      const token = localStorage.getItem("auth_token");
      console.log("doc id ", documentId);
      const deleteDocumentResponse = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.document_delete}`,
        {
          documentId: documentId,
          source: "DOCUMENTS",
        },

        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (deleteDocumentResponse.status === 200) {
        // Send Meeting documnts legnth to all participents
        socket.emit("document-counter", {
          count: deleteDocumentResponse.data.length,
        });

        // Set Documents
        setDocumentList(deleteDocumentResponse.data);
        setMeeetingDocumentCount(deleteDocumentResponse.data.length);
        setComponentStatus({
          status: "",
          message: "",
        });
      } else {
        alert(constant.something_went_wrong);
        navigate(routes.meeting_list);
      }
    } catch (error) {
      setComponentStatus({
        status: "error",
        message: constant.document_went_wrong,
      });
    }
  };

  // For Subtitle Handler
  const subtitleHandler = async () => {
    setIsSubtitle(!isSubtitle);

    $("body").toggleClass("STTOn");
    if ($("body").hasClass("STTOn") === false) {
      let emptyCaption = [];
      setCaptions(emptyCaption);
      localStorage.setItem("removeOldSTT", 1);
    }
    socket.emit("subtitle", {
      sttSentence: "Muted",
      userName: "",
      isSubtitle: !isSubtitle,
      remoteUserId: userId,
      subtitle: "",
      subtitleFlag: "",
      subtitleSegment: "",
      remoteUserProfile: "",
    });
  };

  // For White board Handler
  const whiteboardHandler = async (action) => {
    // Show Whiteboard to meeting participents
    if (action === true) {
      $(".whiteboard-wrapper").addClass("show");
      $(".whiteboard-wrapper").removeClass("d-none");
    } else {
      $(".whiteboard-wrapper").removeClass("show");
      $(".whiteboard-wrapper").addClass("d-none");
    }

    // Handle White board to show only by teacher
    if (isOrganiser()) {
      if (action === true) {
        socket.emit("handle-whiteboard", { action: "open" });
      } else {
        socket.emit("handle-whiteboard", { action: "close" });
      }
    }

    // Start = Student Side Only if user role is student then close white board and make previous UI
    // if (localStorage.getItem("user_role") === "Student") {
    //   if (action === false) {
    //     //Teacher screen on whiteboard - start
    //     // $(".meeting_video_body").css("overflow", "auto");
    //     // $(".cl_user_list").css("right", "");
    //     // $(".cl_user_list").css("width", "");
    //     // $(".cl_user_list").css("position", "");
    //     // $(".cl_user_list").css("z-index", "");
    //     // $(".cl_user_list").css("top", "");
    //     // $(".cl_user_list").css("height", "");
    //     //Teacher screen on whiteboard - end
    //   } else {
    //     //Teacher screen on whiteboard - start
    //     // $(".meeting_video_body").css("overflow", "visible");
    //     // $(".cl_user_list").css("right", "-90%");
    //     // $(".cl_user_list").css("width", "250px");
    //     // $(".cl_user_list").css("position", "relative");
    //     // $(".cl_user_list").css("z-index", "9999999");
    //     // $(".cl_user_list").css("top", "0");
    //     // $(".cl_user_list").css("height", "28%");
    //     //Teacher screen on whiteboard - end
    //   }
    // }
    // End = Student Side Only if user role is student then close white board and make previous UI
  };

  // For Tile View
  const tileView = async () => {
    userListRef.current.classList.toggle("tile_view");
    userListRef.current.classList.remove("focus-view");
    for (let child of userListRef.current.children) {
      child.classList.remove("focus");
    }
  };

  // For device change
  const deviceChanges = async () => {
    // window.location.href = "/user/meeting/MeetingUI/" + roomName;
    $(".popBar").toggleClass("popOpen");
  };
  const handleIndiMute = () => {
    if (remoteMuteCounter == 1) {
      let requestedParticipantId = $(this).data("participantid");
      socket.emit("remote-participant-handler", {
        requested_participant_id: requestedParticipantId,
      });
      remoteMuteCounter = remoteMuteCounter + 1;
    }
  };
  // Handle Aduio for specific students
  //$(".handle_remote_participant_audio").click(function(){
  $(document).on("click", "a.handle_remote_participant_audio", function (e) {
    e.stopPropagation();
    if (remoteMuteCounter == 1) {
      let requestedParticipantId = $(this).data("participantid");
      socket.emit("remote-participant-handler", {
        action: requestedParticipantId,
      });
      remoteMuteCounter = remoteMuteCounter + 1;
    }
  });

  // UNCOMMENT for KICK feature
  // $(document).on("click", "a.handle_kick_participant_audio", function (e) {
  //   // console.log("INDIE MUTER", e);
  //   e.stopPropagation();
  //   // if (remoteMuteCounter == 1) {
  //   let requestedParticipantId = $(this).data("participantid");
  //   room.kickParticipant(requestedParticipantId, "KICKED FOR TEST");
  //   // socket.emit("remote-participant-handler", {
  //   //   action: requestedParticipantId,
  //   // });
  //   // remoteMuteCounter = remoteMuteCounter + 1;
  //   // }
  // });

  const handleMuteParticipant = (participant) => {
    room.sendCommandOnce("MUTE_PARTICIPANT", {
      value: participant,
    });
    // socket.emit("mute-participant",{participant:participant})
  };
  const kickParticipant = (participant) => {
    console.log("KICKING ", participant);
    // socket.emit("kick-participant", {participant:participant})
    room.sendCommandOnce("KICK_PARTICIPANT", {
      attributes: {
        participant: participant,
        reason: "You are Kicked!!",
      },
    });
  };
  const showToMe = async (id) => {
    let userBox = document.querySelector(`#remote-user-${id}`);
    if (userBox.classList.contains("d-off-ovr")) {
      userBox.classList.remove("d-off-ovr");
      console.log("REMOTE TRACKS", remoteTracks);
      let userTracks = remoteTracks[id];
      if (!userTracks) {
        return;
      }
      let vidBox = document.querySelector(`#video${id}`);
      for (let track of userTracks) {
        if (track.getType() === "video") {
          track.attach(vidBox);
          break;
        }
      }
    }
  };
  // const pinToMe = (id) => {
  // let userBox;
  // if (id == "local") {
  //   userBox = document.querySelector(`.local_user_box`);
  // } else {
  //   userBox = document.querySelector(`#remote-user-${id}`);
  // }
  // document.querySelector(`cl_user_list`).classList.add("focus-view");
  // showToMe(id);
  // for (let child of userListRef.current.children) {
  //   child.classList.remove("focus");
  // }
  // if (userBox) {
  //   userBox.classList.add("focus");
  // }
  // };

  const handleExtraUsers = () => {
    const elements = document.querySelectorAll("[data-dominant]");

    // Convert NodeList to an array for sorting
    const elementsArray = Array.from(elements);

    // Sort the array based on the value of data-dominant attribute in ascending order
    elementsArray.sort((a, b) => {
      const valueA = +a.getAttribute("data-dominant");
      const valueB = +b.getAttribute("data-dominant");
      return valueA - valueB;
    });

    for (let i = 0; i < elementsArray.length; i++) {
      if (i > getUserThreshold()) {
        elementsArray[i].classList.add("d-off-ovr");
      } else {
        elementsArray[i].classList.remove("d-off-ovr");
      }
    }
  };
  const pinToMe = (id) => {
    if (id == "local") {
      id = room.p2pDominantSpeakerDetection.myUserID;
    }
    let prevFocused = document.querySelector(`.cl_user_list_box.focus`);
    let newUser = document.querySelector(`#remote-user-${id}`);
    let parent = document.querySelector(".cl_user_list");
    let prevUserId;
    if (prevFocused) {
      prevUserId = prevFocused.getAttribute("id").split("-")[2];
      if (prevUserId == id) {
        setUserThreshold(14);
        parent.classList.remove("focus-view");
        newUser.classList.remove("focus");
      } else {
        prevFocused.classList.remove("focus");
        newUser.classList.add("focus");
      }
    } else {
      setUserThreshold(2);
      parent.classList.add("focus-view");
      newUser.classList.add("focus");
    }

    handleExtraUsers();
  };
  // Present to Meeting
  const presentToMeeting = async (id, action) => {
    isStudentPresented = localStorage.getItem("is_student_present");

    // To Manage SVG for presenting students
    if (localStorage.getItem("present_" + id)) {
      // Remove Presented Student
      localStorage.removeItem("is_student_present");

      // Removed presneted student
      localStorage.removeItem("present_" + id);
      $("#" + id)
        .find("path")
        .css("fill", "black");

      //
      localStorage.removeItem("presentedId");

      // Present Student
      socket.emit("show-student", { id: id, action: action });
    } else {
      if (isStudentPresented) {
        alert("You have already presented one student");
        return false;
      } else {
        localStorage.setItem("is_student_present", true);
        localStorage.setItem("present_" + id, id);
        localStorage.setItem("presentedId", id);
        $("#" + id)
          .find("path")
          .css("fill", "red");

        // Present Student
        socket.emit("show-student", { id: id, action: action });
      }
    }
  };

  // Present student to all members of meeting
  const showUserToAll = async (track) => {
    if (track.isLocal()) {
      return;
    }
    if (room) {
      const participant = track.getParticipantId();
      let participantName = room.getParticipantById(participant)._displayName;
      participantName = participantName.split("#");

      if (!remoteTracks[participant]) {
        remoteTracks[participant] = [];
      }
      const idx = remoteTracks[participant].push(track);

      track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () =>
        console.log("remote track muted")
      );
      track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () =>
        console.log("remote track stoped")
      );
      track.addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        (deviceId) =>
          console.log(`track audio output device was changed to ${deviceId}`)
      );

      const id = participant + track.getType();

      if (participantName[0] === "ADMIN" || participantName[0] === "ADMIN") {
        return;
      }

      if (track.getType() === "video") {
        addUserBox({
          role: "PRESENTEE",
          localUserId: null,
          participant,
          participantName,
          idx,
          parentRef: userListRef,
          focusedUser,
          setFocusedUser,
          track,
          pinToMe,
        });
      } else {
        $("body").append(
          `<audio autoplay='1' new_user_audio_${participant} id='${participant}audio' />`
        );
        track.attach($(`#${id}`)[0]);
      }

      // To show default Video status for remote participant
      if (track.getType() === "video" && track.isMuted() === true) {
        // If there is profile image then show user profile other wise show short name
        $(`#remote-user-${participant}`).addClass("vid-off");
        // if (participantName[3]) {
        //   $(`#${participant}img`).addClass("d-none");
        //   $(`#${participant}profile_image`).removeClass("d-none");
        // } else {
        //   $(`#${participant}img`).removeClass("d-none");
        //   $(`#${participant}profile_image`).addClass("d-none");
        // }

        // $(`#${participant}video${idx}`).addClass("d-none");
      }

      // track.attach($(`#${id}`)[0]);
      getTotalRemoteUsers();
    } else {
      console.log("Error while presting student to all");
    }
  };

  // Set new message
  const newChatMessage = async (message) => {
    if (message) {
      setChatMessage(message);
      $("#send_message_svg").find("path").css("fill", "black");
    } else {
      $("#send_message_svg").find("path").css("fill", "none");
    }
  };

  //For AddPassword Modal
  const modalsecurity1 = `<div>
            <p>You can add a password to your meeting. Participants will need to provide the password before they are allowed to join the meeting.</p>
            <br></br>
            <Label>Password</Label>
            <Input type="email" name="password" id="password" placeholder="Add Meeting Password" onChange={(e) => setMeetingPassword(e.target.value)} />
        </div>`;

  if (!isSubtitle) {
    $("#subtitle_svg").css("fill", "#FFFFFF");
  } else {
    $("#subtitle_svg").css("fill", "#ff0000");
  }

  // Set new message
  const getCaptions = (latestCaptions) => {
    //if(isSubtitle && isAudioMuted == false) {
    if (
      isSubtitle &&
      (isAudioMuted == false ||
        oldsubtitleSegment ==
          latestCaptions[latestCaptions.length - 1].subtitleSegment)
    ) {
      //console.log('captions[captions.length - 1].user_id : ',captions[captions.length - 1].user_id);
      //console.log('userId : ',userId);
      oldsubtitleSegment =
        latestCaptions[latestCaptions.length - 1].subtitleSegment;
      if (
        captions.length > 0 &&
        captions[captions.length - 1].user_id === userId
      ) {
        captions.splice(captions.length - 1, 1);
        captions.push({
          user_id: userId,
          username: latestCaptions[latestCaptions.length - 1].username,
          captions: latestCaptions[latestCaptions.length - 1].captions,
          currentSubtitle:
            latestCaptions[latestCaptions.length - 1].currentSubtitle,
          subtitleFlag: latestCaptions[latestCaptions.length - 1].subtitleFlag,
          subtitleSegment:
            latestCaptions[latestCaptions.length - 1].subtitleSegment,
          userProfile: latestCaptions[latestCaptions.length - 1].userProfile,
        });
        removeOldSTT = false;
        localStorage.setItem("removeOldSTT", 0);
      } else {
        removeOldSTT = true;
        localStorage.setItem("removeOldSTT", 1);
        captions.push({
          user_id: userId,
          username: latestCaptions[latestCaptions.length - 1].username,
          captions: latestCaptions[latestCaptions.length - 1].captions,
          currentSubtitle:
            latestCaptions[latestCaptions.length - 1].currentSubtitle,
          subtitleFlag: latestCaptions[latestCaptions.length - 1].subtitleFlag,
          subtitleSegment:
            latestCaptions[latestCaptions.length - 1].subtitleSegment,
          userProfile: latestCaptions[latestCaptions.length - 1].userProfile,
        });
      }
      // Set Captions
      console.log(" before current Captions :::::: ", captions);
      setCaptions(captions);
      setCount((count) => count + 1);

      socket.emit("subtitle", {
        sttSentence: latestCaptions[latestCaptions.length - 1].captions,
        userName: latestCaptions[latestCaptions.length - 1].username,
        isSubtitle: isSubtitle,
        remoteUserId: userId,
        subtitle: latestCaptions[latestCaptions.length - 1].currentSubtitle,
        subtitleFlag: latestCaptions[latestCaptions.length - 1].subtitleFlag,
        subtitleSegment:
          latestCaptions[latestCaptions.length - 1].subtitleSegment,
        remoteUserProfile:
          latestCaptions[latestCaptions.length - 1].userProfile,
      });
      console.log("after current Captions :::::: ", captions);
    } else {
      socket.emit("subtitle", {
        sttSentence: "Muted",
        userName: "",
        isSubtitle: isSubtitle,
        remoteUserId: userId,
        subtitle: "",
        subtitleFlag: "",
        subtitleSegment: "",
        remoteUserProfile: "",
      });
    }
    $(".cl_main_noti_box").animate(
      { scrollTop: $(".cl_main_noti_box").prop("scrollHeight") },
      0
    );

    //  $( "div.demo" ).scrollTop( 300 );
  };

  const addUserBox = (userBoxProps) => {
    const newContainer = document.createElement("div");
    if (userBoxProps.role == "ATTENDEE") {
      newContainer.classList.add("cl_user_list_box", "attendee");
      newContainer.setAttribute("data-dominant", 2);
      newContainer.setAttribute(
        "id",
        `remote-user-${userBoxProps.participant}`
      );
    }
    if (userBoxProps.role == "MODERATOR") {
      newContainer.classList.add("cl_user_list_box", "moderator");
      newContainer.setAttribute("data-dominant", 2);
      newContainer.setAttribute(
        "id",
        `remote-user-${userBoxProps.participant}`
      );
    }
    if (userBoxProps.role == "PRESENTEE") {
      newContainer.classList.add(
        "cl_user_list_box",
        "present_student_video",
        `new_user_video_${userBoxProps.participant}`
      );
      newContainer.setAttribute("data-dominant", 2);
      newContainer.setAttribute(
        "id",
        `remote-user-${userBoxProps.participant}`
      );
    }
    const remoteUser = room.getParticipants();
    // Render the UserBox component inside the new container and pass the props
    ReactDOM.render(<UserVideoBox {...userBoxProps} />, newContainer);
    if (remoteUser.slice(getUserThreshold()).length > 0) {
      console.log("NO SHOW BOX");
      newContainer.classList.add("d-off-ovr");
    } else {
      console.log("SHOW BOX");
      let vidBox = newContainer.querySelector(
        `#video${userBoxProps.participant}`
      );
      console.log(vidBox);
      userBoxProps.track.attach(vidBox);
    }
    userListRef.current.appendChild(newContainer);
    setUserBox((prevContainers) => ({
      ...prevContainers,
      [userBoxProps.participant]: newContainer,
    }));
  };
  const deleteUserBox = (id) => {
    setUserBox((prevContainers) => {
      if (prevContainers[id]) {
        ReactDOM.unmountComponentAtNode(prevContainers[id]);
        prevContainers[id].remove();
        const { [id]: removedContainer, ...restContainers } = prevContainers;
        return restContainers;
      } else {
        return prevContainers;
      }
    });
    validateUserBox();
  };
  const validateUserBox = () => {
    const hiddenUserBox = document.querySelectorAll(
      ".cl_user_list_box.d-off-ovr"
    );
    if (hiddenUserBox.length == 0) {
      return;
    }
    let remoteUserId = hiddenUserBox[0].getAttribute("id").split("-")[2];
    showToMe(remoteUserId);
  };
  return (
    // <>
    <div className="classroom_list meeting_room flex-row">
      {/* <NewNavbar /> */}
      {errorText && <ErrorComponent>{errorText}</ErrorComponent>}
      <div className="landscape-restrict">
        <img src={rotatePhone} />
        <p>Please rotate your device in landscape mode</p>
      </div>
      <Modal
        isOpen={modalpwd}
        modalTransition={{ timeout: 700 }}
        backdropTransition={{ timeout: 1300 }}
        toggle={togglepwd}
        className={className}
      >
        <ModalHeader toggle={togglepwd}>{constant.password}</ModalHeader>
        <ModalBody>
          <Input
            name="password"
            id="password"
            placeholder={constant.password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={confirmMeetingPassword}>
            {constant.confirm}
          </Button>{" "}
          <Button color="secondary" onClick={togglepwd}>
            {constant.cancel}
          </Button>
        </ModalFooter>
        <center>
          <p style={{ margin: "10px" }}>{passwordRes}</p>
        </center>
      </Modal>
      <Modal
        isOpen={modalInvitees}
        toggle={inviteToggle}
        modalTransition={{ timeout: 700 }}
        backdropTransition={{ timeout: 1300 }}
      >
        <ModalHeader toggle={inviteToggle}>Add invitees</ModalHeader>
        <ModalBody>
          <InviteUsers
            isEdit={true}
            toggle={inviteToggle}
            roomName={roomName}
            meetingId={localStorage.getItem("meeting_id")}
            invites={localStorage.getItem("invites")}
          />
        </ModalBody>
        {/* <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Save
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter> */}
      </Modal>
      <Modal
        isOpen={modal}
        modalTransition={{ timeout: 700 }}
        backdropTransition={{ timeout: 1300 }}
        toggle={videoQualityToggle}
        className={className}
      >
        <ModalHeader toggle={videoQualityToggle}>
          {constant.vid_quality}
        </ModalHeader>
        <ModalBody>{videoQuality}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={videoQualityToggle}>
            {constant.ok}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalAdmit} toggle={toggleAdmit} backdrop={false}>
        <ModalHeader toggle={toggleAdmit}>{admitText}</ModalHeader>
      </Modal>
      {
        <STTComponent
          getCaptions={getCaptions}
          isSubtitle={isSubtitle}
          isAudioMuted={isAudioMuted}
          removeOldSTT={removeOldSTT}
        />
      }
      {prelaunchScreen === false ? (
        <div>
          {recordingHandler && (
            <Recorder
              handleRec={setRecordingHandler}
              stateChanger={setLeaveDisable}
              action={recordingHandler}
              meetingId={currentMeetingId}
              stateLoader={setSpinner}
            />
          )}
          <div
            style={{ height: "100vh", overflow: "hidden" }}
            className="cl_meeting_videos_main"
          >
            {/* Top  Meeting Menu  */}
            <div className="top_meeting_videos top">
              {/* <div className="logo">
                <button>
                  <svg
                    width="210"
                    height="30"
                    viewBox="0 0 210 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="210" height="30" fill="url(#pattern0)" />
                    <defs>
                      <pattern
                        id="pattern0"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use transform="scale(0.00357143 0.025)" />
                      </pattern>
                      <image id="image0" width="280" height="40" />
                    </defs>
                  </svg>
                </button>
              </div> */}
              <div className="meeting_title">{meetingTitle}</div>
              {/* <div className="meeting_menu">
                <ul>
                  <li>
                    <button onClick={switchBigScreen}>
                      <svg
                        width="23"
                        height="23"
                        viewBox="0 0 23 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0)">
                          <path
                            d="M21.4749 9.1083e-07H0.555859C0.48368 -0.000130564 0.412182 0.0139727 0.345459 0.0415037C0.278736 0.0690346 0.218096 0.109453 0.167011 0.160445C0.115926 0.211438 0.0753973 0.272003 0.047745 0.338676C0.0200926 0.405349 0.00585926 0.476821 0.00585938 0.549001V10.581C0.00585938 10.7266 0.0637003 10.8662 0.166658 10.9692C0.269615 11.0722 0.409256 11.13 0.554859 11.13C0.700848 11.1297 0.840857 11.072 0.944553 10.9692C1.04825 10.8665 1.10728 10.727 1.10886 10.581V1.1H20.9299V20.924H11.3889C11.2419 20.924 11.101 20.9824 10.9971 21.0863C10.8932 21.1902 10.8349 21.3311 10.8349 21.478C10.8349 21.6249 10.8932 21.7658 10.9971 21.8697C11.101 21.9736 11.2419 22.032 11.3889 22.032H21.4749C21.5476 22.0321 21.6197 22.0179 21.687 21.9901C21.7543 21.9623 21.8154 21.9215 21.8669 21.87C21.9184 21.8186 21.9592 21.7574 21.987 21.6902C22.0148 21.6229 22.029 21.5508 22.0289 21.478V0.554001C22.029 0.481212 22.0148 0.409112 21.987 0.341839C21.9592 0.274565 21.9184 0.21344 21.8669 0.16197C21.8154 0.1105 21.7543 0.0696978 21.687 0.0419033C21.6197 0.0141089 21.5476 -0.000130835 21.4749 9.1083e-07V9.1083e-07Z"
                            fill="black"
                          />
                          <path
                            d="M3.65786e-06 21.474C-0.000528309 21.6202 0.0569825 21.7607 0.159912 21.8645C0.262841 21.9684 0.402778 22.0272 0.549004 22.028H8.222C8.29479 22.0281 8.36689 22.0138 8.43417 21.9861C8.50144 21.9583 8.56256 21.9175 8.61403 21.866C8.6655 21.8145 8.70631 21.7534 8.7341 21.6861C8.7619 21.6189 8.77614 21.5468 8.776 21.474V13.806C8.77614 13.7332 8.7619 13.6611 8.7341 13.5938C8.70631 13.5265 8.6655 13.4654 8.61403 13.4139C8.56256 13.3625 8.50144 13.3216 8.43417 13.2939C8.36689 13.2661 8.29479 13.2518 8.222 13.252H0.550004C0.477523 13.2521 0.405783 13.2665 0.338907 13.2945C0.272032 13.3224 0.21134 13.3633 0.160321 13.4148C0.109303 13.4663 0.068963 13.5274 0.0416216 13.5945C0.0142803 13.6616 0.000476407 13.7335 0.00100366 13.806V21.474H3.65786e-06ZM1.1 14.355H7.673V20.924H1.103L1.1 14.355Z"
                            fill="black"
                          />
                          <path
                            d="M10.0351 11.9903C10.139 12.094 10.2798 12.1523 10.4266 12.1523C10.5734 12.1523 10.7142 12.094 10.8181 11.9903L17.0591 5.74528V9.34528C17.0591 9.49221 17.1175 9.63312 17.2214 9.73702C17.3253 9.84091 17.4662 9.89928 17.6131 9.89928C17.76 9.89928 17.9009 9.84091 18.0048 9.73702C18.1087 9.63312 18.1671 9.49221 18.1671 9.34528V4.41728C18.1672 4.34449 18.153 4.27239 18.1252 4.20512C18.0974 4.13784 18.0566 4.07672 18.0051 4.02525C17.9537 3.97378 17.8925 3.93298 17.8253 3.90518C17.758 3.87739 17.6859 3.86315 17.6131 3.86328H12.6831C12.5362 3.86328 12.3953 3.92165 12.2914 4.02554C12.1875 4.12944 12.1291 4.27035 12.1291 4.41728C12.1291 4.56421 12.1875 4.70512 12.2914 4.80901C12.3953 4.91291 12.5362 4.97128 12.6831 4.97128H16.2831L10.0381 11.2123C9.98669 11.2631 9.94581 11.3236 9.91782 11.3902C9.88983 11.4568 9.87528 11.5284 9.875 11.6007C9.87473 11.6729 9.88873 11.7446 9.9162 11.8114C9.94368 11.8783 9.98408 11.9391 10.0351 11.9903V11.9903Z"
                            fill="black"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width="22.027" height="22.032" fill="black" />
                          </clipPath>
                        </defs>
                      </svg>
                      <div className="icon_name">Full Screen</div>
                    </button>
                  </li>
                  {localStorage.getItem("user_role") === "Teacher" && (
                    <li>
                      <button className="TileMenu" onClick={tileView}>
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 23 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0)">
                            <path
                              d="M3.28045e-06 21.4119C-0.000528529 21.5749 0.0636198 21.7313 0.178364 21.847C0.293108 21.9627 0.449068 22.0281 0.612003 22.0289H9.158C9.23907 22.0291 9.31936 22.0132 9.39427 21.9822C9.46919 21.9512 9.53726 21.9058 9.59458 21.8485C9.6519 21.7912 9.69735 21.7231 9.72831 21.6482C9.75927 21.5733 9.77514 21.493 9.775 21.4119V12.8709C9.77514 12.7898 9.75927 12.7096 9.72831 12.6346C9.69735 12.5597 9.6519 12.4916 9.59458 12.4343C9.53726 12.377 9.46919 12.3316 9.39427 12.3006C9.31936 12.2697 9.23907 12.2538 9.158 12.2539H0.617003C0.536212 12.2539 0.456219 12.2699 0.38164 12.301C0.307061 12.332 0.239372 12.3776 0.182477 12.4349C0.125581 12.4923 0.0806063 12.5604 0.0501461 12.6352C0.0196858 12.71 0.00434322 12.7901 0.00500328 12.8709V21.4119H3.28045e-06ZM1.229 13.4829H8.55V20.7999H1.229V13.4829Z"
                              fill="black"
                            />
                            <path
                              d="M12.252 21.4119C12.2514 21.5749 12.3156 21.7313 12.4303 21.847C12.5451 21.9627 12.701 22.0281 12.864 22.0289H21.41C21.491 22.0291 21.5713 22.0132 21.6462 21.9822C21.7211 21.9512 21.7892 21.9058 21.8465 21.8485C21.9039 21.7912 21.9493 21.7231 21.9803 21.6482C22.0112 21.5733 22.0271 21.493 22.027 21.4119V12.8709C22.0271 12.7898 22.0112 12.7096 21.9803 12.6346C21.9493 12.5597 21.9039 12.4916 21.8465 12.4343C21.7892 12.377 21.7211 12.3316 21.6462 12.3006C21.5713 12.2697 21.491 12.2538 21.41 12.2539H12.869C12.7882 12.2539 12.7082 12.2699 12.6336 12.301C12.559 12.332 12.4913 12.3776 12.4344 12.4349C12.3775 12.4923 12.3326 12.5604 12.3021 12.6352C12.2716 12.71 12.2563 12.7901 12.257 12.8709V21.4119H12.252ZM13.481 13.4829H20.802V20.7999H13.481V13.4829Z"
                              fill="black"
                            />
                            <path
                              d="M3.28045e-06 9.15802C-0.000528529 9.32096 0.0636198 9.47743 0.178364 9.59311C0.293108 9.70879 0.449068 9.77423 0.612003 9.77503H9.158C9.23907 9.77516 9.31936 9.75926 9.39427 9.7283C9.46919 9.69734 9.53726 9.65193 9.59458 9.59461C9.6519 9.53729 9.69735 9.46921 9.72831 9.39429C9.75927 9.31937 9.77514 9.23908 9.775 9.15802V0.617005C9.77514 0.535943 9.75927 0.455655 9.72831 0.380738C9.69735 0.305821 9.6519 0.237741 9.59458 0.180421C9.53726 0.123101 9.46919 0.0776837 9.39427 0.0467232C9.31936 0.0157627 9.23907 -0.00013089 9.158 8.11852e-07H0.617003C0.536212 -1.88452e-06 0.456219 0.0159908 0.38164 0.0470589C0.307061 0.078127 0.239372 0.123671 0.182477 0.181031C0.125581 0.238391 0.0806063 0.306458 0.0501461 0.381287C0.0196858 0.456117 0.00434322 0.536216 0.00500328 0.617005V9.15802H3.28045e-06ZM1.229 1.229H8.55V8.54602H1.229V1.229Z"
                              fill="black"
                            />
                            <path
                              d="M12.252 9.15802C12.2514 9.32096 12.3156 9.47743 12.4303 9.59311C12.5451 9.70879 12.701 9.77423 12.864 9.77503H21.41C21.491 9.77516 21.5713 9.75926 21.6462 9.7283C21.7211 9.69734 21.7892 9.65193 21.8465 9.59461C21.9039 9.53729 21.9493 9.46921 21.9803 9.39429C22.0112 9.31937 22.0271 9.23908 22.027 9.15802V0.617005C22.0271 0.535943 22.0112 0.455655 21.9803 0.380738C21.9493 0.305821 21.9039 0.237741 21.8465 0.180421C21.7892 0.123101 21.7211 0.0776837 21.6462 0.0467232C21.5713 0.0157627 21.491 -0.00013089 21.41 8.11852e-07H12.869C12.7882 -1.88452e-06 12.7082 0.0159908 12.6336 0.0470589C12.559 0.078127 12.4913 0.123671 12.4344 0.181031C12.3775 0.238391 12.3326 0.306458 12.3021 0.381287C12.2716 0.456117 12.2563 0.536216 12.257 0.617005V9.15802H12.252ZM13.481 1.229H20.802V8.54602H13.481V1.229Z"
                              fill="black"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0">
                              <rect
                                width="22.026"
                                height="22.027"
                                fill="black"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <div className="icon_name">TileView</div>
                      </button>
                    </li>
                  )}
                </ul>
              </div> */}
            </div>
            {/*Top  Meeting Menu */}

            {/* Meeting Videos Body */}
            <div className="meeting_video_body">
              <div className="admit-list-wrapper">
                <div>
                  <h2>
                    {" "}
                    {constant.admit_list}
                    <button
                      className="admit-listClose"
                      onClick={closeAdmitList}
                    >
                      <img src={participant} alt="" />
                    </button>
                    <button onClick={closeAdmitList}>
                      <img src={close} alt="" />
                    </button>
                  </h2>
                  <ul className="admit-list">
                    <div className="='parent'">
                      {admitList &&
                        admitList.map((user) => (
                          <div className="users" key={user.user_id}>
                            {user.user_name}
                            <button
                              onClick={() => handleAdmit("allow", user.user_id)}
                            >
                              Allow
                            </button>
                            <button
                              onClick={() => handleAdmit("deny", user.user_id)}
                            >
                              Deny
                            </button>
                          </div>
                        ))}
                    </div>
                  </ul>
                </div>
              </div>
              <div className="participant-list-wrapper">
                <div>
                  <h2>
                    {" "}
                    {constant.participants}
                    <button
                      className="participant-listClose"
                      onClick={closeMeetingParticipants}
                    >
                      <img src={participant} alt="" />
                    </button>
                    <button onClick={meetingParticipants}>
                      <img src={close} alt="" />
                    </button>
                  </h2>
                  <ul className="participant-list">
                    <div className="parent">
                      {remoteParticipantList &&
                        remoteParticipantList.map((track) => (
                          <div className="users" key={track._id}>
                            {track._displayName.split("#")[1]}
                            {/* <button onClick={() => pinToMe(track._id)}>
                              <svg
                                width="20"
                                id={track._id}
                                className="presting_student"
                                height="20"
                                viewBox="0 0 30 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M28.125 0.8125H1.875C1.37772 0.8125 0.900805 1.01004 0.549175 1.36167C0.197544 1.71331 0 2.19022 0 2.6875V20.5C0 20.9973 0.197544 21.4742 0.549175 21.8258C0.900805 22.1775 1.37772 22.375 1.875 22.375H13.125V24.25H9.375V25.1875H20.625V24.25H16.875V22.375H28.125C28.6223 22.375 29.0992 22.1775 29.4508 21.8258C29.8025 21.4742 30 20.9973 30 20.5V2.6875C30 2.19022 29.8025 1.71331 29.4508 1.36167C29.0992 1.01004 28.6223 0.8125 28.125 0.8125ZM15.9375 24.25H14.0625V22.375H15.9375V24.25ZM29.0625 20.5C29.0625 20.7486 28.9637 20.9871 28.7879 21.1629C28.6121 21.3387 28.3736 21.4375 28.125 21.4375H1.875C1.62636 21.4375 1.3879 21.3387 1.21209 21.1629C1.03627 20.9871 0.9375 20.7486 0.9375 20.5V2.6875C0.9375 2.43886 1.03627 2.2004 1.21209 2.02459C1.3879 1.84877 1.62636 1.75 1.875 1.75H28.125C28.3736 1.75 28.6121 1.84877 28.7879 2.02459C28.9637 2.2004 29.0625 2.43886 29.0625 2.6875V20.5Z"
                                  fill="blue"
                                />
                                <path
                                  d="M1.875 17.6875H28.125V2.6875H1.875V17.6875ZM2.8125 3.625H27.1875V16.75H2.8125V3.625Z"
                                  fill="blue"
                                />
                                <path
                                  d="M15 20.5C15.5178 20.5 15.9375 20.0803 15.9375 19.5625C15.9375 19.0447 15.5178 18.625 15 18.625C14.4822 18.625 14.0625 19.0447 14.0625 19.5625C14.0625 20.0803 14.4822 20.5 15 20.5Z"
                                  fill="blue"
                                />
                              </svg>
                            </button> */}
                            <button
                              onClick={
                                () => pinToMe(track._id)
                                // presentToMeeting(track._id, "show")
                              }
                            >
                              <img src={pin} />
                            </button>
                          </div>
                        ))}
                    </div>
                  </ul>
                </div>
              </div>
              <div className="user_chat_box">
                <div className="user_chat_box_top">
                  <h3>{constant.chat}</h3>
                  <button className="CloseChat" onClick={closeMeetingChat}>
                    <img src={chatBox} alt="" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      chatHandler();
                    }}
                  >
                    <img src={close} alt="" />
                  </button>
                </div>
                {/* ... other chatbox content */}
                <ScrollContainer
                  onScroll={handleScroll}
                  currentPage={currentPage}
                >
                  <div className="user_chat_box_message" id="user_chat_panel">
                    <div className="user_chat_item" id="chat_data">
                      <div className="user_chat_item_inr" id="remote_chat">
                        {allChatMessages.slice().map((message) => (
                          <div key={message.id}>
                            <span className="time_chat" id="my_name">
                              {message.userName}{" "}
                              <strong>{formatMessageTime(message.time)}</strong>
                            </span>
                            <p>{message.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollContainer>
                {/* ... rest of your code */}

                <div className="user_chat_box_btm_main">
                  <div className="user_chat_box_btm">
                    <input
                      type="text"
                      id="send_mesage"
                      placeholder={constant.type_message}
                      autoComplete="off"
                      onChange={(e) => newChatMessage(e.target.value)}
                    />
                    <button className="send_btn" onClick={manageChat}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="send_message_svg"
                        width="30.548"
                        height="30.548"
                        viewBox="0 0 47.548 46.669"
                      >
                        <g
                          id="Icon_feather-send"
                          data-name="Icon feather-send"
                          transform="translate(23.335 -2.121) rotate(45)"
                        >
                          <path
                            id="Path_1217"
                            data-name="Path 1217"
                            d="M33,3,16.5,19.5"
                            fill="none"
                            stroke="#d0d7da"
                            strokeLinejoin="round"
                            strokeWidth="3"
                          />
                          <path
                            id="Path_1218"
                            data-name="Path 1218"
                            d="M33,3,22.5,33l-6-13.5L3,13.5Z"
                            fill="none"
                            stroke="#d0d7da"
                            strokeLinejoin="round"
                            strokeWidth="3"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="document-list-wrapper">
                <div>
                  <h2>
                    {" "}
                    {constant.documents}
                    <button
                      className="CloseChat"
                      onClick={closeMeetingDocuments}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 1L1 11M1 1L11 11"
                          stroke="#656185"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  </h2>
                  <ul className="document-list">
                    <div className="parent">
                      {documentList &&
                        documentList.map((doc, i) => (
                          <div className="users" key={i}>
                            {" "}
                            <span>{doc.document_title}</span>
                            <div className="actions">
                              <a href={doc.url} target="_blank">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="15"
                                  height="15"
                                  viewBox="0 0 22.038 22.038"
                                >
                                  <g
                                    id="Icon_feather-download"
                                    data-name="Icon feather-download"
                                    transform="translate(-3.5 -3.5)"
                                  >
                                    <path
                                      id="Path_1"
                                      data-name="Path 1"
                                      d="M24.538,22.5v4.453a2.226,2.226,0,0,1-2.226,2.226H6.726A2.226,2.226,0,0,1,4.5,26.953V22.5"
                                      transform="translate(0 -4.641)"
                                      fill="none"
                                      stroke="#000"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                    />
                                    <path
                                      id="Path_2"
                                      data-name="Path 2"
                                      d="M10.5,15l5.566,5.566L21.632,15"
                                      transform="translate(-1.547 -2.708)"
                                      fill="none"
                                      stroke="#000"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                    />
                                    <path
                                      id="Path_3"
                                      data-name="Path 3"
                                      d="M18,17.859V4.5"
                                      transform="translate(-3.481)"
                                      fill="none"
                                      stroke="#000"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                    />
                                  </g>
                                </svg>
                              </a>
                              {isOrganiser() && (
                                <button onClick={() => deleteDocument(doc.id)}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 15.635 20.102"
                                  >
                                    <path
                                      id="Icon_material-delete-forever"
                                      data-name="Icon material-delete-forever"
                                      d="M8.617,22.369A2.24,2.24,0,0,0,10.85,24.6h8.934a2.24,2.24,0,0,0,2.234-2.234V8.967H8.617Zm2.747-7.951,1.575-1.575,2.379,2.368,2.368-2.368,1.575,1.575-2.368,2.368,2.368,2.368-1.575,1.575-2.368-2.368L12.95,20.727l-1.575-1.575,2.368-2.368Zm7.862-8.8L18.109,4.5H12.526L11.409,5.617H7.5V7.85H23.135V5.617Z"
                                      transform="translate(-7.5 -4.5)"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </ul>
                </div>
                <div className="user_chat_box_btm_main">
                  {isOrganiser() && (
                    <div className="user_chat_box_btm">
                      <label htmlFor="meeting_document" className="btn">
                        {constant.documents}
                      </label>
                      <input
                        type="file"
                        id="meeting_document"
                        style={{ visibility: "hidden" }}
                        onChange={uploadHandler}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                      />
                      {componentStatus && componentStatus.status === "OK" && (
                        <p className="text-success">
                          {componentStatus.message}
                        </p>
                      )}
                      {componentStatus &&
                        componentStatus.status === "error" && (
                          <p className="text-danger">
                            {componentStatus.message}
                          </p>
                        )}
                      {componentStatus &&
                        componentStatus.status === "processing" && (
                          <p className="text-warning">
                            {componentStatus.message}
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>
              <div className="whiteboard-wrapper d-none">
                <Whiteboard
                  whiteboardhandler={whiteboardHandler}
                  roomName={roomName}
                />
              </div>
              <div
                ref={userListRef}
                className={
                  remoteParticipantList.length > 3
                    ? "cl_user_list par-16"
                    : remoteParticipantList.length < 3 &&
                      remoteParticipantList.length > 1
                    ? "cl_user_list par-4"
                    : "cl_user_list "
                }
              >
                <div
                  data-dominant="2"
                  className="cl_user_list_box  local_user_box"
                >
                  <div className="cl_user_list_box_videos cl_main_home_box_video">
                    <div className="cl_user_list_box_control">
                      <div className="mute_icon">
                        <img src={VoiceActive} />
                      </div>
                      <h4>
                        {userName}
                        {isOrganiser()
                          ? "(Organiser)"
                          : !isOrganiser()
                          ? "(Attendee)"
                          : ""}
                      </h4>
                      {remoteParticipantList.length > 0 && (
                        <button
                          className="kick-btn"
                          onClick={() => pinToMe("local")}
                        >
                          <img src={pin} />
                        </button>
                      )}
                    </div>
                    <video
                      autoPlay="1"
                      className="local_video video"
                      id="localVideo"
                    />
                    <div className="profile initialName">
                      <p>{localStorage.getItem("initial_name")}</p>
                    </div>
                    <div
                      className={
                        localStorage.getItem("user_profile_image")
                          ? `profile`
                          : `profile d-none`
                      }
                    >
                      <img
                        src={localStorage.getItem("user_profile_image")}
                        alt={`Profile of ${userName}`}
                      />
                    </div>
                    <img className="brand-logo" src={Logo} alt="Wvmee" />
                  </div>
                  {/* <div className="brand-logo">

                  </div> */}
                </div>

                {remoteParticipantList.slice(user_threshold).length > 0 && (
                  <div
                    class="cl_user_list_box extra_cl"
                    onClick={meetingParticipants}
                  >
                    <div class="user-length">
                      <p>
                        and {remoteParticipantList.slice(user_threshold).length}{" "}
                        others
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Meeting Videos Body */}
            {/* <div className="meeting_menu meeting_menu_center">
              <ul> */}
            {/* <li id="audio-btn" className={sttAudio ? "btn btn-off" : "btn"}>
                  <button onClick={() => muteHandler()}>
                    <img src={sttAudio ? audioOff : audioOn} alt="" />
                    <div className="icon_name">{constant.microphone}</div>
                  </button>
                </li>
                <li className={isVideoMuted ? "btn btn-off" : "btn"}>
                  <button onClick={onVideoMuteStateChanged}>
                    <img src={isVideoMuted ? videoOff : videoOn} alt="" />
                    <div className="icon_name">{constant.camera}</div>
                  </button>
                </li>
                {spinner ? (
                  <Loader loading={spinner} />
                ) : (
                  <li
                    className={
                      leaveDisable ? "disabled leave-btn btn" : "leave-btn btn"
                    }
                  >
                    <button onClick={unload}>
                      <img src={leaveButton} alt="leave" />
                      <div className="icon_name">
                        {leaveDisable ? constant.record : constant.leave}
                      </div>
                    </button>
                  </li>
                )}
                {localStorage.getItem("user_role") === "Teacher" && (
                  <li className="btn">
                    <button onClick={switchVideohandler}>
                      <img src={shareScreen} alt="" />
                      <div className="icon_name">{constant.screen_share}</div>
                    </button>
                  </li>
                )}
                {localStorage.getItem("user_role") === "Teacher" && (
                  <li className={screenRecording ? "btn btn-off" : "btn"}>
                    <button onClick={clickrecording}>
                      {recordingHandler === "start" ? (
                        <>
                          <img src={record} alt="" />
                        </>
                      ) : (
                        <>
                          <img src={record} alt="" />
                        </>
                      )}
                      <div className="icon_name">{constant.record}</div>
                    </button>
                  </li>
                )} */}
            {/* {localStorage.getItem("user_role") === "Teacher" && (
                  <li>
                    <button
                      className="cl_button"
                      id="togglePipButton"
                      style={{
                        backgroundColor: "transparent",
                        color: "transparent",
                        border: "transparent",
                        padding: "0px",
                      }}
                    >
                      PIP
                    </button>
                  </li>
                )} */}

            {/* {localStorage.getItem("user_role") === "Teacher" && (
                  <li className="pip-container">
                    <div id="outer-pip">
                      <video
                        className="remote-video-styles video-flip"
                        autoPlay
                        id="pip-video"
                      />
                    </div>
                  </li>
                )}  */}
            {/* </ul>
            </div> */}
            {/* Bottom Meeting Menu */}
            <div className="top_meeting_videos bottom_meeing_menu">
              {/* <div className="meeting_menu meeting_menu_bottom_left">
              
              </div> */}
              <div className="meeting_menu meeting_menu_bottom_left">
                <div className="meeting_timer">{formatTime(seconds)}</div>
                <button
                  className="copy_button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      window.location.origin + "/" + roomName
                    );
                    setErrorText("Copied!");
                    setIsSuccess(true);
                    setTimeout(() => {
                      setErrorText("");
                    }, 1000);
                  }}
                >
                  <img src={CopyBtn} alt="Copy link" /> {roomName}
                </button>
              </div>

              {/* <div className="meeting_title">{meetingTitle}</div> */}
              <div className="meeting_menu meeting_menu_bottom_right">
                <ul>
                  <li className="d-none">
                    <button onClick={togglesecurity}>
                      <Modal
                        isOpen={modalsecurity}
                        modalTransition={{ timeout: 700 }}
                        backdropTransition={{ timeout: 1300 }}
                        toggle={togglesecurity}
                        className={className}
                      >
                        <ModalHeader toggle={togglesecurity}>
                          Security option
                        </ModalHeader>
                        <ModalBody>{modalsecurity1}</ModalBody>
                        <ModalFooter>
                          <Button color="primary" onClick={addPassword}>
                            {constant.add}
                          </Button>
                          <Button color="primary" onClick={togglesecurity}>
                            {constant.cancel}
                          </Button>
                        </ModalFooter>
                      </Modal>
                      <svg
                        width="21"
                        height="24"
                        viewBox="0 0 21 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.7631 3.746C19.1857 3.54517 18.6616 3.21577 18.2302 2.78268C17.7989 2.34959 17.4716 1.82413 17.2731 1.246C17.1511 0.883357 16.9185 0.568089 16.608 0.344572C16.2975 0.121054 15.9247 0.000542988 15.5421 0H5.45506C5.07295 0.000260087 4.70052 0.120189 4.39005 0.342947C4.07959 0.565705 3.84669 0.880104 3.72406 1.242C3.52555 1.82013 3.19825 2.34559 2.76689 2.77868C2.33553 3.21177 1.81139 3.54117 1.23406 3.742C0.872321 3.86692 0.558693 4.10182 0.337067 4.41382C0.115441 4.72582 -0.00309105 5.0993 -0.0019406 5.482V8.034C-0.00587358 11.205 0.916696 14.3081 2.65239 16.9619C4.38809 19.6158 6.86129 21.7047 9.76806 22.972C9.99889 23.0716 10.2477 23.123 10.4991 23.123C10.7505 23.123 10.9992 23.0716 11.2301 22.972C14.0099 21.7655 16.3949 19.8022 18.1131 17.306C19.9969 14.5814 21.0035 11.3464 20.9981 8.034V5.482C20.9984 5.09998 20.8795 4.72739 20.6579 4.41619C20.4363 4.10499 20.1232 3.8707 19.7621 3.746H19.7631ZM19.6441 8.034C19.649 11.0717 18.7258 14.0385 16.9981 16.537C15.4237 18.8244 13.2383 20.6234 10.6911 21.729C10.6304 21.7552 10.5651 21.7687 10.4991 21.7687C10.433 21.7687 10.3677 21.7552 10.3071 21.729C7.64285 20.5666 5.37623 18.6513 3.7857 16.2183C2.19517 13.7853 1.35001 10.9407 1.35406 8.034V5.482C1.35347 5.38216 1.3841 5.28464 1.44165 5.20306C1.4992 5.12149 1.58081 5.05993 1.67506 5.027C2.44793 4.75777 3.14949 4.31638 3.72672 3.7362C4.30396 3.15602 4.74176 2.45223 5.00706 1.678C5.03875 1.58418 5.09896 1.50261 5.17929 1.4447C5.25962 1.38678 5.35603 1.35542 5.45506 1.355H15.5421C15.6411 1.35542 15.7375 1.38678 15.8178 1.4447C15.8982 1.50261 15.9584 1.58418 15.9901 1.678C16.2554 2.45223 16.6932 3.15602 17.2704 3.7362C17.8476 4.31638 18.5492 4.75777 19.3221 5.027C19.4163 5.05993 19.4979 5.12149 19.5555 5.20306C19.613 5.28464 19.6436 5.38216 19.6431 5.482L19.6441 8.034Z"
                          fill="white"
                        />
                        <path
                          d="M13.2567 8.81341H13.2127V6.96641C13.2127 6.24701 12.9269 5.55707 12.4182 5.04838C11.9095 4.53969 11.2196 4.25391 10.5002 4.25391C9.78078 4.25391 9.09085 4.53969 8.58215 5.04838C8.07346 5.55707 7.78769 6.24701 7.78769 6.96641V8.81341H7.74168C7.32758 8.81394 6.93059 8.97867 6.63777 9.27149C6.34495 9.56431 6.18022 9.9613 6.17969 10.3754V14.1074C6.18048 14.8788 6.48719 15.6183 7.03253 16.1639C7.57787 16.7094 8.31732 17.0163 9.08868 17.0174H11.9077C12.679 17.0163 13.4185 16.7094 13.9639 16.1639C14.5092 15.6183 14.8159 14.8788 14.8167 14.1074V10.3764C14.8164 9.96247 14.6521 9.56552 14.3597 9.27254C14.0673 8.97957 13.6706 8.81447 13.2567 8.81341ZM9.08469 6.96641C9.08469 6.59113 9.23377 6.23121 9.49913 5.96585C9.76449 5.70049 10.1244 5.55141 10.4997 5.55141C10.875 5.55141 11.2349 5.70049 11.5002 5.96585C11.7656 6.23121 11.9147 6.59113 11.9147 6.96641V8.81441H9.08469V6.96641ZM13.5217 14.1074C13.5212 14.5348 13.3512 14.9445 13.049 15.2467C12.7468 15.5489 12.337 15.7189 11.9097 15.7194H9.09068C8.66332 15.7189 8.25361 15.5489 7.95142 15.2467C7.64922 14.9445 7.47921 14.5348 7.47868 14.1074V10.3764C7.47868 10.3061 7.50661 10.2387 7.5563 10.189C7.606 10.1393 7.6734 10.1114 7.74368 10.1114H13.2567C13.327 10.1114 13.3944 10.1393 13.4441 10.189C13.4938 10.2387 13.5217 10.3061 13.5217 10.3764V14.1074Z"
                          fill="white"
                        />
                        <path
                          d="M10.5006 11.8145C10.3284 11.8145 10.1634 11.8828 10.0417 12.0046C9.91995 12.1263 9.85156 12.2913 9.85156 12.4635V13.6895C9.85156 13.8618 9.92005 14.0272 10.0419 14.1491C10.1638 14.271 10.3292 14.3395 10.5016 14.3395C10.6739 14.3395 10.8393 14.271 10.9612 14.1491C11.0831 14.0272 11.1516 13.8618 11.1516 13.6895V12.4635C11.1516 12.3781 11.1347 12.2935 11.102 12.2146C11.0692 12.1358 11.0212 12.0641 10.9608 12.0038C10.9003 11.9436 10.8285 11.8958 10.7495 11.8633C10.6706 11.8308 10.586 11.8142 10.5006 11.8145Z"
                          fill="white"
                        />
                      </svg>
                      <div className="icon_name">test</div>
                    </button>
                  </li>
                  <li
                    id="audio-btn"
                    onClick={() => muteHandler()}
                    className={sttAudio ? "btn btn-off" : "btn"}
                  >
                    <button>
                      <img src={isAudioMuted ? audioOff : audioOn} alt="" />
                      <div className="icon_name">{constant.microphone}</div>
                    </button>
                  </li>
                  <li
                    onClick={onVideoMuteStateChanged}
                    className={isVideoMuted ? "btn btn-off" : "btn"}
                  >
                    <button>
                      <img src={isVideoMuted ? videoOff : videoOn} alt="" />
                      <div className="icon_name">{constant.camera}</div>
                    </button>
                  </li>
                  {isOrganiser() && (
                    <li
                      onClick={
                        screenShared ? handleStopSharing : switchVideohandler
                      }
                      className={screenShared ? "btn btn-off" : "btn"}
                    >
                      <button>
                        <img
                          src={screenShared ? screenShareActive : shareScreen}
                          alt=""
                        />
                        <div className="icon_name">{constant.screen_share}</div>
                      </button>
                    </li>
                  )}
                  {spinner ? (
                    <Loader loading={spinner} />
                  ) : (
                    <li
                      onClick={unload}
                      className={
                        leaveDisable
                          ? "disabled leave-btn btn"
                          : "leave-btn btn"
                      }
                    >
                      <button>
                        <img src={leaveButton} alt="leave" />
                        <div className="icon_name">
                          {leaveDisable ? constant.record : constant.leave}
                        </div>
                      </button>
                    </li>
                  )}

                  {isOrganiser() && (
                    <li className="btn">
                      <a href="#." onClick={meetingParticipants}>
                        <img src={participant} alt="" />
                        <span
                          id="count_badge"
                          value=""
                          className="count-badge"
                          style={{ background: "gray" }}
                        >
                          {userColLength}
                        </span>
                        <div className="icon_name">{constant.participants}</div>
                      </a>
                    </li>
                  )}

                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      chatHandler();
                    }}
                    className="btn"
                  >
                    <button>
                      <span className="circle"></span>
                      <img src={chatBox} alt="" />
                      <span id="count_badge" value="" className="count-badge">
                        {chatUnreadMessageCount}
                      </span>
                      <div className="icon_name">{constant.chat}</div>
                    </button>
                  </li>
                  <li onClick={deviceChanges} className="btn">
                    <UncontrolledDropdown className="me-2" direction="up">
                      <DropdownToggle>
                        <button className="btn">
                          <img src={settings} alt="" />

                          <div className="icon_name">{constant.settings}</div>
                        </button>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          <button onClick={switchBigScreen} className="btn">
                            <img src={fullScreen} alt="" />
                            <div className="icon_name">
                              {constant.full_screen}
                            </div>
                          </button>
                        </DropdownItem>
                        {isOrganiser() && (
                          <DropdownItem>
                            <button
                              onClick={tileView}
                              className=" btn TileMenu"
                            >
                              <img src={tileViewIcon} alt="" />
                              <div className="icon_name">
                                {constant.tile_view}
                              </div>
                            </button>
                          </DropdownItem>
                        )}
                        <DropdownItem>
                          <button
                            onClick={() => whiteboardHandler(true)}
                            className="btn"
                          >
                            <img src={whiteboard} alt="" />
                            <div className="icon_name">
                              {constant.whiteboard}
                            </div>
                          </button>
                        </DropdownItem>

                        <DropdownItem>
                          <button
                            className="btn"
                            onClick={meetingDocumentsHandler}
                          >
                            <img src={documents} alt="" />
                            <span
                              id="count_badge"
                              value=""
                              className="count-badge"
                            >
                              {meeetingDocumentCount}
                            </span>
                            <div className="icon_name">
                              {constant.documents}
                            </div>
                          </button>
                        </DropdownItem>

                        {isOrganiser() && (
                          <DropdownItem>
                            <button className="btn" onClick={openAdmitList}>
                              <img src={participant} alt="" />
                              <span
                                id="count_badge"
                                value=""
                                className="count-badge"
                                style={{ background: "gray" }}
                              >
                                {admitList.length}
                              </span>
                              <div className="icon_name">
                                {constant.admit_list}
                              </div>
                            </button>
                          </DropdownItem>
                        )}
                        {isOrganiser() && (
                          <DropdownItem>
                            <a
                              onClick={clickrecording}
                              className={
                                screenRecording ? "btn btn-off" : "btn"
                              }
                              href="#."
                            >
                              {recordingHandler === "start" ? (
                                <>
                                  <img src={record} alt="" />
                                </>
                              ) : (
                                <>
                                  <img src={record} alt="" />
                                </>
                              )}
                              <div className="icon_name">{constant.record}</div>
                            </a>
                          </DropdownItem>
                        )}
                        {isOrganiser() && (
                          <DropdownItem>
                            <button onClick={handleMuteAllParticipant}>
                              <img src={muteAll} alt="" />
                              <div className="icon_name">
                                {constant.mute_all}
                              </div>
                            </button>
                          </DropdownItem>
                        )}
                        {isOrganiser() && (
                          <DropdownItem>
                            <button
                              onClick={() => setModalInvitees((prev) => !prev)}
                            >
                              <img src={participant} alt="" />
                              <div className="icon_name">Add users</div>
                            </button>
                          </DropdownItem>
                        )}
                        {/* {localStorage.getItem("user_role") === "Teacher" && (
              <li>
                <button
                 
                  // onClick={() => subtitleHandler()}
                >
                  <img src={ccButton} alt="" />
                  <div className="icon_name">{constant.captions}</div>
                </button>
              </li>
            )} */}
                        {isOrganiser() && (
                          <DropdownItem className="icon">
                            <button onClick={videoQualityToggle}>
                              <img src={quality} alt="" />
                              <div className="icon_name">
                                {constant.vid_quality}
                              </div>
                            </button>
                          </DropdownItem>
                        )}
                        {/* <DropdownItem divider />
      <DropdownItem>
        Another Action
      </DropdownItem> */}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </li>
                  {/* <li onClick={deviceChanges} className="btn">
                    <button>
                      <img src={settings} alt="" />

                      <div className="icon_name">{constant.settings}</div>
                    </button>
  
                    <div className="popBar">
                      <ul>
                        <li onClick={switchBigScreen} className="btn">
                          <button>
                            <img src={fullScreen} alt="" />
                            <div className="icon_name">
                              {constant.full_screen}
                            </div>
                          </button>
                        </li>
                        {isOrganiser() && (
                          <li onClick={tileView} className="btn">
                            <button className="TileMenu">
                              <img src={tileViewIcon} alt="" />
                              <div className="icon_name">
                                {constant.tile_view}
                              </div>
                            </button>
                          </li>
                        )}
                        
                      </ul>
                    </div>
                  </li> */}
                </ul>
              </div>
              <div className="meeting_menu meeting_menu_middle"></div>
            </div>
            {/* <!-- Bottom  Meeting Menu */}
          </div>
        </div>
      ) : (
        <Prelaunch
          mediaDevices={allMediaDevices}
          joinWithAudioOff={joinWithAudioOff}
          joinWithVideoOff={joinWithVideoOff}
          prelaunchMediaHandler={prelaunchMediaHandler}
          setPrelaunchScreen={setPrelaunchScreen}
        />
      )}
    </div>
  );
}

export default MeetingUI;
