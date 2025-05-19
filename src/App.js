import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRouteLoaderData,
} from "react-router-dom";
import NewSignup from "./components/signup/newsignup";
import "./css/fonts/stylesheet.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-tagsinput/react-tagsinput.css";
import "./css/mdb.min.css";
import "./css/magnific-popup.css";
import "./css/slick.css";
// import "./css/style.css"
import "./App.css";
import Error from "./components/errorPage/error";
import EditProfile from "./components/profile/editProfile";
import MeetingList from "./components/meeting/meetingList";
import VerifyNewAccount from "./components/verifyAccount";
import ResetPassword from "./components/resetPassword/resetPassword";
import Whiteboard from "./components/meeting/whiteboard";
import Adminpanelmain from "./components/adminpanelmain";
import ScreenRecording from "./components/meeting/screenRecording";
import DocumentUpload from "./components/documentUpload";
import Recorder from "./components/Recorder";
import ViewRecording from "./components/meeting/viewRecording";
import MeetingUI from "./components/meeting/meetingUI";
import MeetingAttendence from "./components/meeting/meetingAttendence";
import UserAttendence from "./components/meeting/userAttendence";
import MailSend from "./components/signup/mailsend";
import ForgotPassword from "./components/forgotPassword/newforgotPassword";
import PrivacyPolicy from "./components/signup/privacyPolicy";
import { useEffect } from "react";
import config from "./config.json";
import Calendar from "./components/calender/calendar";
import { routes } from "./components/common/constant";
import GuestLogin from "./components/login/guestLogin";
import LatestLogin from "./components/login/latestLogin";
import EntryComponent from "./components/common/EntryComponent";
import ReactMeet from './react-meet.js';
import ScreenRecorder from "./components/meeting/ScreenRecorder";
import FaceLogin from "./components/face_recognition/FaceLogin";
import FaceSignUp from "./components/face_recognition/FaceSignUp";
import AudioComponent from './components/AudioComponent.js';
import Translation from "./components/Translation";

function App() {
  useEffect(() => {
    for (const [key, value] of Object.entries(config)) {
      if (value != "") {
        document.documentElement.style.setProperty(`--${key}`, value);
      }
    }
  }, []);
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/xoxo" exact element={<Translation />} />
          <Route path={routes.home} exact element={<LatestLogin />} />
          <Route path={routes.face_login} exact element={<FaceLogin />} />
          <Route path={routes.face_register} exact element={<FaceSignUp />} />
          <Route path={`${routes.home}/:roomName`} element={<ReactMeet />} />
          <Route path={routes.signup} element={<NewSignup />} />
          <Route path={routes.error} element={<Error />} />
          <Route path={routes.edit_profile} element={<EditProfile />} />
          <Route path={routes.meeting_list} element={<MeetingList />} />
          <Route path={routes.record} element={<ViewRecording />} />
          <Route path={routes.tnc} element={<PrivacyPolicy />} />
          <Route path={routes.verify} element={<VerifyNewAccount />} />
          <Route path={routes.reset_password} element={<ResetPassword />} />
          <Route path={routes.whiteboard} element={<Whiteboard />} />
          <Route path={`${routes.mailsend}`} element={<MailSend />} />
          <Route path={routes.forgot_password} element={<ForgotPassword />} />

          {/* <Route
            path={`${routes.meeting_room}/:roomName`}
            element={<MeetingUI />}
          /> */}
          <Route path={routes.admin} element={<Adminpanelmain />} />
          <Route path={routes.screen_recording} element={<ScreenRecorder />} />
          <Route path={routes.documentupload} element={<DocumentUpload />} />
          <Route path={routes.recorder} element={<Recorder />} />
          <Route
            exact
            path={routes.attendance}
            element={<MeetingAttendence />}
          />
          <Route
            path={`${routes.attendance}/:id`}
            element={<UserAttendence />}
          />
          <Route path={`${routes.guest}/:roomid`} element={<GuestLogin />} />
          <Route
            path={`${routes.meeting_room}/:roomName`}
            element={<MeetingUI />}
          />
          <Route path={routes.calendar} element={<Calendar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
