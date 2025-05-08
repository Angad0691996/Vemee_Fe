// React System Libraries
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import Select from "react-select";
import $ from "jquery";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

// Customised Libraries or components
import "../../css/new-style.css";
import "../../css/mobile-style.css";
import { ENDPOINTURL } from "../common/endpoints";
import { randomString } from "../randomString";
import CheckLoginStatus from "../common/loginStatus";
import NewNavbar from "../common/newNavbar";
import { ValidateMeetingTitle, Validateinvites } from "../validation";

import { ExcelRenderer } from "react-excel-renderer";
import { findAllInRenderedTree } from "react-dom/test-utils";
import EditTitle from "../../images/ic_outline-edit.svg";
import Time from "../../images/tdesign_time.svg";
import AddUser from "../../images/tdesign_user-add.svg";
import ArrowRight from "../../images/teenyicons_arrow-right-solid.svg";
import Summary from "../../images/fluent_text-description-24-filled.svg";
import Calendar from "../../images/Calendar_gray.svg";
import { apiRoutes, constant } from "../common/constant";
import ErrorComponent from "../errorPage/errorPopup";

// Global Variables declarations
const queryString = require("query-string");
let meetingTime = "";
let totalEmails = 0;

function ScheduleMeeting(props) {
  //Storing Values in useState
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingRoomName, setMeetingRoomName] = useState("");
  const [meetingStartTime, setMeetingStartTime] = useState();
  const [meetingStartDate, setMeetingStartDate] = useState();
  const [meetingEndTime, setMeetingEndTime] = useState();
  const [meetingEndDate, setMeetingEndDate] = useState();
  const [meetingDescription, setMeetingDescription] = useState("");
  const [meetingId, setMeetingId] = useState("");
  // const { editmeeting } = props.isEdit;
  const [meetingTitleErr, setMeetingTitleErr] = useState("");
  const [invitesErr, setInvitesErr] = useState("");
  const [startDateError, setMeetingStartDateError] = useState("");
  const [endDateError, setMeetingEndDateError] = useState("");
  const [componentStatus, setComponentStatus] = useState("");
  const [meetingInvities, setMeetingInvities] = useState([]);
  const [selectedMeetingInvites, setSelectedMeetingInvites] = useState([]);
  const [selectedInvites, setselectedInvites] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [errorText, setErrorText] = useState("");
  let sessionEditemails = [];

  const [state, setState] = useState([]);
  const toggle = props.toggle;
  const editmeeting = props.isEdit;
  //When This component needs to do something after render editmeeting.
  useEffect(() => {
    // Get List active students for meeting
    getEmailSuggestion();
  }, []);
  useEffect(() => {
    // validate user is logged in to access
    console.log("isEdit:", props.isEdit, editmeeting);
    const isUserLoggedIn = CheckLoginStatus();
    if (isUserLoggedIn === false) {
    }

    //EditMeeting
    if (props.isEdit == true) {
      let edit_session = localStorage.getItem("edit_session");
      console.log(edit_session);
      edit_session = JSON.parse(edit_session);

      console.log("edit session 2222",edit_session)
      // Title and Dates
      setMeetingId(edit_session.id);
      setMeetingTitle(edit_session.meeting_title);
      setMeetingDescription(edit_session.meeting_des);
      setMeetingRoomName(edit_session.room_name);

      // Start and end time
      setStartDate(new Date(edit_session.start_time));
      setEndDate(new Date(edit_session.end_time));

      // Manage to send for meeting as Kedar needs it to send in this format
      // dateHandler(
      //   new Date(parseInt(edit_session.start_time)),
      //   "startdate"
      // );
      // dateHandler(new Date(parseInt(edit_session.start_time)), "enddate");

      // Set Invites
    console.log("edit session",edit_session)
      fillInvities(edit_session.attendees);

      // let sess_emails = edit_session.invites;
      // sess_emails.map(email => {
      //     if(email.length !== 0 ){
      //         sessionEditemails.push({ value: email, label: email })
      //     }
      // });

      //console.log(sessionEditemails)
    } else {
      
      setMeetingId("");
      setMeetingTitle("");
      setMeetingDescription("");
      setMeetingRoomName("");
      setStartDate();
      setEndDate();
      setSelectedMeetingInvites([]);
      setselectedInvites([]);
    }
  }, [props]);
    
  const fillInvities = (arrMeeting) => {
    arrMeeting.map((email) => {
      if (email.length !== 0) {
        sessionEditemails.push({ value: email.id, label: email.email });
      }
    });
    console.log("email session",sessionEditemails)
    emailHandler(sessionEditemails);
  };

  const importFileHandler = (event) => {
    setInvitesErr("");
    let fileObj = event.target.files[0];

    if (
      event.target.files[0].type === "application/vnd.ms-excel" ||
      event.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      //setResponse('uploading excel...');
      ExcelRenderer(fileObj, (err, resp) => {
        if (err) {
          console.log(err);
        } else {
          console.log("resp", resp);
          let expArr = ["name", "email"];
          if (
            JSON.stringify(resp.rows[0]) === JSON.stringify(["name", "email"])
          ) {
            setState({
              cols: resp.cols,
              rows: resp.rows,
            });

            let totalRows = resp.rows;
            var i;
            for (i = 1; i < totalRows.length; i++) {
              if (totalRows[i][1].length !== 0) {
                console.log(
                  "MeetingInvites",
                  totalRows[i][1],
                  totalRows.length,
                  totalRows[i][1].length
                );
                if (
                  !selectedMeetingInvites.some(
                    (item) => totalRows[i][1] === item
                  )
                ) {
                  selectedMeetingInvites.push(totalRows[i][1]);
                  // sessionEditemails.push({ value: totalRows[i][1], label: totalRows[i][1] })
                }
              }
            }

            //console.log(selectedMeetingInvites);
            //Add Item in se ssionEditemails list
            fillInvities(selectedMeetingInvites);
          } else {
            setInvitesErr("Invalid file template!");
          }
        }
      });
    } else {
      setInvitesErr("Invalid file format!");
      $("#excel-form-reset").onClick();
    }
  };

  //For Email Suggestion
  const getEmailSuggestion = async () => {
    // if no invities selected make clear the array and return
    // if (user_role.length === 0) {
    //   setMeetingInvities([]);
    //   return;
    // }

    // Get All Active students to invite
    try {
      const token = localStorage.getItem("auth_token");
      // let role = localStorage.getItem("user_role");
      let invitesSuggestions;
      invitesSuggestions = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.all_users}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // if (role === "Admin") {
      //   invitesSuggestions = await Axios.get(
      //     `${ENDPOINTURL}/user/getAllUsers/both`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   );
      // } else {
      //   invitesSuggestions = await Axios.get(
      //     `${ENDPOINTURL}/user/getAllUsers/both`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   );
      // }

      if (invitesSuggestions.status == 200) {
        let response = invitesSuggestions.data;
        let inviteResult = [];
        let userEmail = localStorage.getItem("user_email");
      
        response.map((data) => {
          if (data.email.length !== 0) {
            if(data.email!=userEmail)
            {
              inviteResult.push({ value: data.id, label: data.email });
   
            }
          }
        });
        setMeetingInvities(inviteResult);
      }
    } catch (error) {
      setErrorText(error.message);
    }
  };

  //When user Save created Meeting
  const submitHandler = async (e) => {
    const meetingTitleRes = ValidateMeetingTitle(meetingTitle);
    const invitesRes = Validateinvites(totalEmails);
    // const meetingStartDate = $("#meeting_startdate").val();
    // const meetingEndDate = $("#meeting_enddate").val();
    if (
      meetingTitleRes.status &&
      invitesRes.status
      // &&
      // meetingStartDate &&
      // meetingEndDate
    ) {
      setMeetingTitleErr("");
      setInvitesErr("");
      setMeetingStartDateError("");
      setMeetingEndDateError("");

      const roomName = randomString(15);
      const token = localStorage.getItem("auth_token");
      const user_id = localStorage.getItem("user_id");
      //adding the logined user email to the invite meeting list
    //   let userEmail = localStorage.getItem("user_email");
    let invitedEmails = selectedMeetingInvites;
    //   console.log("invited email",invitedEmails)
    //  // invitedEmails.push(userEmail);

      try {
        setComponentStatus({
          status: "processing",
          message: "Processing...",
        });
        const saveMeetingResponse = await Axios.post(
          `${ENDPOINTURL}${apiRoutes.meeting_save}`,
          {
            roomName: roomName,
            meetingTitle: meetingTitle,
            // meetingDesc: meetingDescription,
            invites: invitedEmails,
            startTime: meetingStartTime,
            endTime: meetingEndTime,
            // startMeetingTime: meetingStartDate,
            // endMeetingTime: meetingEndDate,
            organiser_id: user_id,
            // user: {

            // },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (saveMeetingResponse.status === 200) {
          setComponentStatus({
            status: "OK",
            message: saveMeetingResponse.data.message,
          });
        } else {
          setComponentStatus({
            status: "error",
            message: saveMeetingResponse.data.message,
          });
        }
      } catch (error) {
        setErrorText(error.message);
      }
    } else {
      setMeetingTitleErr(meetingTitleRes.error);
      setInvitesErr(invitesRes.error);
      if (!meetingStartDate) {
        setMeetingStartDateError("Select start date");
      }
      if (!meetingEndDate) {
        setMeetingEndDateError("Select end date");
      }
    }
    toggle();
  };

  //When user want to edit Meeting
  const editSessionHandler = async (e) => {
    e.preventDefault();
    let invitedEmails = selectedMeetingInvites;
    console.log("update invited mails",invitedEmails);
    const meetingTitleRes = ValidateMeetingTitle(meetingTitle);
    const invitesRes = Validateinvites(invitedEmails.length);
    // const meetingStartDate = $("#meeting_startdate").val();
    // const meetingEndDate = $("#meeting_enddate").val();
    let token = localStorage.getItem("auth_token");
    const user_id = localStorage.getItem("user_id");
    // let userEmail = localStorage.getItem("user_email");
    // invitedEmails.push(userEmail);
    if (
      meetingTitleRes.status &&
      invitesRes.status
      // &&
      // meetingStartDate &&
      // meetingEndDate
    ) {
      setMeetingTitleErr("");
      setInvitesErr("");
      setMeetingStartDateError("");
      setMeetingEndDateError("");
      try {
        const editMeetingResponse = await Axios.put(
          `${ENDPOINTURL}${apiRoutes.meeting_update}`,
          {
            // meetingEntity: {
              // roomName: meetingRoomName,
              meetingId: meetingId,
              meetingTitle: meetingTitle,
              // meetingDesc: meetingDescription,
              invites: invitedEmails,
              startTime: meetingStartTime,
              endTime: meetingEndTime,

              // startMeetingTime: meetingStartDate,
              // endMeetingTime: meetingEndDate,
              organiser_id: user_id,
              // user: {

              // },
            },
          // },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        setErrorText(error.message);
      }
    } else {
      setMeetingTitleErr(meetingTitleRes.error);
      setInvitesErr(invitesRes.error);
      if (!meetingStartDate) {
        setMeetingStartDateError("Start date error");
      }
      if (!meetingEndDate) {
        setMeetingEndDateError("end date error");
      }
    }
    toggle();
  };

  //For Set StartMeeting and EndMeeting DateandTime
  const dateHandler = async (val, date_type) => {
    // Set Selected Date to useState
    let e = new Date(val);
    // Get Timing data from selected by user
    // let year = e.getFullYear();
    // let month = e.getMonth() + 1;
    // let date = e.getDate();
    // let hour = e.getHours();
    // let minutes = e.getMinutes();
    // let seconds = e.getSeconds();
    // if (month < 10) {
    //   month = "0" + month;
    // }
    // if (date < 10) {
    //   date = "0" + date;
    // }
    // if (hour < 10) {
    //   hour = "0" + hour;
    // }
    // if (minutes < 10) {
    //   minutes = "0" + minutes;
    // }
    // if (seconds < 10) {
    //   seconds = "0" + seconds;
    // } else {
    //   seconds = parseInt(seconds);
    //   seconds = seconds.toFixed(3);
    // }
    // if (seconds === "0.000") {
    //   seconds = "00.000";
    // }

    if (date_type == "startdate") {
      // let selected_time =
      //   year +
      //   "-" +
      //   month +
      //   "-" +
      //   date +
      //   "T" +
      //   hour +
      //   ":" +
      //   minutes +
      //   ":" +
      //   seconds;
      setMeetingStartTime(e);
      setStartDate(e.getTime());
      setMeetingStartDateError("");
    }

    if (date_type == "enddate") {
      // let selected_end_time =
      //   year +
      //   "-" +
      //   month +
      //   "-" +
      //   date +
      //   "T" +
      //   hour +
      //   ":" +
      //   minutes +
      //   ":" +
      //   seconds;
      setMeetingEndTime(e);
      setEndDate(e.getTime());
      setMeetingEndDateError("");
    }
  };

  //For Handling Users By email
  const emailHandler = (e) => {
    console.log("list", e);
    let selectedMeetingInvites = [];
    let selectedInvites = [];
    totalEmails = e.length;
    if (e.length !== 0) {
      e &&
        e.map((singleinvitie, i) =>
          selectedMeetingInvites.push(singleinvitie.value)
        );
      e &&
        e.map((singleinvitie, i) =>
          selectedInvites.push({
            value: singleinvitie.value,
            label: singleinvitie.label,
          })
        );

      setSelectedMeetingInvites(selectedMeetingInvites);
      setselectedInvites(selectedInvites);
      console.log("select list", selectedMeetingInvites);
      console.log("select invites", selectedInvites);
    } else {
      setselectedInvites(selectedInvites);
    }
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  const filterPassedTime1 = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return startDate < selectedDate.getTime();
  };

  return (
    <div className="classroom_list ">
      {errorText && <ErrorComponent>{errorText}</ErrorComponent>}
      {/* <NewNavbar /> */}
      <div className="">
        <div className="">
          <div className="cl_edit_content_box meeting_details">
            {/* <div className="">
              <h2>Meeting Details</h2>
            </div> */}
            <div className="meeting_details">
              <div className="title">
                <img src={EditTitle} alt="" />
                <input
                  type="text"
                  name="meeting_title"
                  placeholder={constant.add_title}
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                />
                <small className="error">{meetingTitleErr}</small>
              </div>
              <div className="schedule_time">
                <img src={Time} alt="" />
                <div className="start_datetime">
                  <div className="datepicker">
                    <DatePicker
                      id="meeting_startdate"
                      selected={startDate}
                      showTimeSelect
                      minDate={new Date()}
                      maxDate={endDate != null ? endDate : null}
                      onChange={(date) => {
                        setStartDate(date);
                        setMeetingStartTime(date);
                        setMeetingStartDate(date.getTime());
                        // setStartDate(date.getTime());
                        setMeetingStartDateError("");
                      }}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      filterTime={filterPassedTime}
                      placeholderText={constant.choose_start_time}
                    />
                    <img src={Calendar} alt="" />
                  </div>
                  <small className="error">{startDateError}</small>
                </div>
                <img src={ArrowRight} alt="" />
                <div className="endDate">
                  <div className="datepicker">
                    <DatePicker
                      id="meeting_enddate"
                      showTimeSelect
                      selected={endDate}
                      minDate={startDate != null ? startDate : new Date()}
                      //minTime={startDate}
                      onChange={(date) => {
                        setEndDate(date);
                        setMeetingEndTime(date);
                        setMeetingEndDate(date.getTime());
                        setMeetingEndDateError("");
                      }}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      filterTime={filterPassedTime1}
                      placeholderText={constant.choose_end_time}
                    />
                    <img src={Calendar} alt="" />
                  </div>
                  <small className="error">{endDateError}</small>
                </div>
              </div>

              <div className="client_login_content_form_box addAttendee">
                <img src={AddUser} alt="" />
                <form onSubmit={importFileHandler} className="d-none">
                  <input
                    type="file"
                    id="excel-file-input"
                    onChange={importFileHandler}
                  />
                  <input type="submit" />
                  <input type="reset" id="excel-form-reset" />
                </form>

                {/* {editmeeting == true ? (
                  <Select
                    id="meeting_invitie"
                    value={
                      selectedInvites
                        ? selectedInvites
                        : meetingInvities.map((ele) => ele)
                    }
                    isMulti
                    name="meeeting_invites"
                    options={meetingInvities}
                    onChange={emailHandler}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                ) : (
                  <Select
                    id="meeting_invitie"
                    value={
                      selectedInvites
                        ? selectedInvites
                        : meetingInvities.map((ele) => ele)
                    }
                    isMulti
                    name="meeeting_invites"
                    options={meetingInvities}
                    onChange={emailHandler}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )} */}
                {editmeeting == true ? (
                  <Select
                    id="meeting_invitie"
                    value={
                      selectedInvites
                        ? selectedInvites
                        : meetingInvities.map((ele) => ele)
                    }
                    isMulti
                    name="meeeting_invites"
                    options={meetingInvities}
                    onChange={emailHandler}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                ) : (
                  <Select
                    id="meeting_invitie"
                    value={
                      selectedInvites
                        ? selectedInvites
                        : meetingInvities.map((ele) => ele)
                    }
                    isMulti
                    name="meeeting_invites"
                    options={meetingInvities}
                    onChange={emailHandler}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
                <small className="error">{invitesErr}</small>
                <button
                  className="cl_save_btn export-margin"
                  onClick={() => $("#excel-file-input").click()}
                >
                  {constant.excel_import}
                </button>
              </div>

              <div className="agenda">
                <img src={Summary} alt="" />
                <textarea
                  value={meetingDescription}
                  placeholder={constant.description}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="btn_meeting">
                {/* <Link to="/user/meeting/meetinglist">
                  <button type="button" className="cl_cancel_btn">
                    Cancel
                  </button>
                </Link> */}
                <button
                  onClick={toggle}
                  type="button"
                  className="cl_cancel_btn"
                >
                  {constant.cancel}
                </button>
                {editmeeting == true ? (
                  <button
                    type="button"
                    className="cl_save_btn"
                    onClick={editSessionHandler}
                  >
                    {constant.update}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="cl_save_btn"
                    onClick={submitHandler}
                  >
                    {constant.save}
                  </button>
                )}

                {componentStatus && componentStatus.status === "OK" && (
                  <p className="text-success">{componentStatus.message}</p>
                )}
                {componentStatus && componentStatus.status === "error" && (
                  <p className="text-danger">{componentStatus.message}</p>
                )}
                {componentStatus && componentStatus.status === "processing" && (
                  <p className="text-warning">{componentStatus.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ScheduleMeeting;
