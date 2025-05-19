import React from "react";
import MeetingUI from "../meeting/meetingUI";
import GuestLogin from "../login/guestLogin";
import ReactMeet from '../../react-meet.js';

const EntryComponent = () => {
  return localStorage.getItem("auth_token") ? <ReactMeet /> : <GuestLogin />;
};

export default EntryComponent;
