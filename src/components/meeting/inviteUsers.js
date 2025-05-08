// React System Libraries
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import Select from "react-select";
import $ from "jquery";
import CopyBtn from "../../images/copy.svg";
import { apiRoutes, routes } from "../common/constant";
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
import { constant } from "../common/constant";
import ErrorComponent from "../errorPage/errorPopup";
// Global Variables declarations
const queryString = require("query-string");
let meetingTime = "";
let totalEmails = 0;

function InviteUsers(props) {
  //Storing Values in useState
  //   const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingRoomName, setMeetingRoomName] = useState("");
  //   const [meetingStartTime, setMeetingStartTime] = useState();
  //   const [meetingEndTime, setMeetingEndTime] = useState();
  //   const [meetingDescription, setMeetingDescription] = useState("");
  const [meetingId, setMeetingId] = useState("");
  //   // const { editmeeting } = props.isEdit;
  //   const [meetingTitleErr, setMeetingTitleErr] = useState("");
  const [invitesErr, setInvitesErr] = useState("");
  //   const [startDateError, setMeetingStartDateError] = useState("");
  //   const [endDateError, setMeetingEndDateError] = useState("");
  const [componentStatus, setComponentStatus] = useState("");
  const [meetingInvities, setMeetingInvities] = useState([]);
  const [selectedMeetingInvites, setSelectedMeetingInvites] = useState([]);
  const [selectedInvites, setselectedInvites] = useState([]);
  //   const [startDate, setStartDate] = useState();
  //   const [endDate, setEndDate] = useState();
  const [errorText, setErrorText] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [invites, setInvites] = useState([]);
  let sessionEditemails = [];
  const toggle = props.toggle;

  useEffect(() => {
    console.log("meetingInvities", meetingInvities);
  }, [meetingInvities]);
  useEffect(() => {
    // validate user is logged in to access
    const isUserLoggedIn = CheckLoginStatus();
    if (isUserLoggedIn === false) {
    }

    // Get List active students for meeting
    getEmailSuggestion("Student");

    const inv = localStorage.getItem("invites");
    setMeetingRoomName(props.roomName);
    setMeetingId(props.meetingId);
    setInvites(JSON.parse(inv));
    // Set Invites
    // fillInvities(JSON.parse(inv));
  }, []);

  const fillInvities = (arrMeeting) => {
    arrMeeting.map((email) => {
      if (email.length !== 0) {
        sessionEditemails.push({ value: email, label: email });
      }
    });

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

      // if (role === "ADMIN") {
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
      invitesSuggestions = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.all_users}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (invitesSuggestions.status == 200) {
        let response = invitesSuggestions.data;
        let inviteResult = [];
        const currInvitees = JSON.parse(localStorage.getItem("invites"));
        console.log("cuurinvites", currInvitees);
        response.map((data) => {
          console.log(
            "data",
            data.email,
            currInvitees.find((item) => item.email === data.email)
          );
          if (
            data.email.length !== 0 &&
            !currInvitees.find((item) => item.email === data.email)
          ) {
            inviteResult.push({ value: data.email, label: data.email });
          }
        });
        setMeetingInvities(inviteResult);
      }
    } catch (error) {
      setErrorText(error.message);
    }
  };

  //When user Save created Meeting
  // const submitHandler = async (e) => {
  //   const invitesRes = Validateinvites(totalEmails);
  //   if (invitesRes.status) {
  //     setInvitesErr("");

  //     const token = localStorage.getItem("auth_token");
  //     const user_id = localStorage.getItem("user_id");
  //     let userEmail = localStorage.getItem("user_email");

  //     let invitedEmails = selectedMeetingInvites;
  //     invitedEmails.push(userEmail);

  //     try {
  //       setComponentStatus({
  //         status: "processing",
  //         message: "Processing...",
  //       });
  //       const saveMeetingResponse = await Axios.post(
  //         `${ENDPOINTURL}/meeting/saveMeetingAPI`,
  //         {
  //           meetingEntity: {
  //             invites: invitedEmails,
  //             user: {
  //               id: user_id,
  //             },
  //           },
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (saveMeetingResponse.data.Status === "200") {
  //         setComponentStatus({
  //           status: "OK",
  //           message: saveMeetingResponse.data.message,
  //         });
  //       } else {
  //         setComponentStatus({
  //           status: "error",
  //           message: saveMeetingResponse.data.message,
  //         });
  //       }
  //     } catch (error) {
  //       setErrorText(error.message);
  //     }
  //   } else {
  //     setInvitesErr(invitesRes.error);
  //   }
  //   toggle();
  // };

  //When user want to edit Meeting
  const editSessionHandler = async (e) => {
    e.preventDefault();
    let invitedEmails = selectedMeetingInvites;
    const invitesRes = Validateinvites(invitedEmails.length);
    let token = localStorage.getItem("auth_token");
    const user_id = localStorage.getItem("user_id");
    // let userEmail = localStorage.getItem("user_email");
    // invitedEmails.push(userEmail);
    if (invitesRes.status) {
      setInvitesErr("");
      try {
        const { data, status } = await Axios.put(
          `${ENDPOINTURL}${apiRoutes.meeting_update}`,
          {
            invites: invitedEmails,
            roomName: meetingRoomName
              ? meetingRoomName
              : localStorage.getItem("meetingRoomName"),
            meetingId: meetingId
              ? meetingId
              : localStorage.getItem("meetingId"),
            user: {
              id: user_id,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (status == 200) {
          localStorage.setItem("invites", JSON.stringify(invitedEmails));
        }
      } catch (error) {
        setErrorText(error.message);
      }
    } else {
      setInvitesErr(invitesRes.error);
    }
    toggle();
  };

  //For Set StartMeeting and EndMeeting DateandTime
  //   const dateHandler = async (e, date_type) => {
  //     // Set Selected Date to useState
  //     if (date_type == "startdate") {
  //       setStartDate(e.getTime());
  //     }
  //     if (date_type == "enddate") {
  //       setEndDate(e.getTime());
  //     }

  //     // Get Timing data from selected by user
  //     let year = e.getFullYear();
  //     let month = e.getMonth() + 1;
  //     let date = e.getDate();
  //     let hour = e.getHours();
  //     let minutes = e.getMinutes();
  //     let seconds = e.getSeconds();
  //     if (month < 10) {
  //       month = "0" + month;
  //     }
  //     if (date < 10) {
  //       date = "0" + date;
  //     }
  //     if (hour < 10) {
  //       hour = "0" + hour;
  //     }
  //     if (minutes < 10) {
  //       minutes = "0" + minutes;
  //     }
  //     if (seconds < 10) {
  //       seconds = "0" + seconds;
  //     } else {
  //       seconds = parseInt(seconds);
  //       seconds = seconds.toFixed(3);
  //     }
  //     if (seconds === "0.000") {
  //       seconds = "00.000";
  //     }

  //     if (date_type == "startdate") {
  //       let selected_time =
  //         year +
  //         "-" +
  //         month +
  //         "-" +
  //         date +
  //         "T" +
  //         hour +
  //         ":" +
  //         minutes +
  //         ":" +
  //         seconds;
  //       setMeetingStartTime(selected_time);
  //       setMeetingStartDateError("");
  //     }

  //     if (date_type == "enddate") {
  //       let selected_end_time =
  //         year +
  //         "-" +
  //         month +
  //         "-" +
  //         date +
  //         "T" +
  //         hour +
  //         ":" +
  //         minutes +
  //         ":" +
  //         seconds;
  //       setMeetingEndTime(selected_end_time);
  //       setMeetingEndDateError("");
  //     }
  //   };

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
      let currInvitees = JSON.parse(localStorage.getItem("invites"));
      selectedMeetingInvites = [...currInvitees, ...selectedMeetingInvites];
      setSelectedMeetingInvites(selectedMeetingInvites);
      setselectedInvites(selectedInvites);
    } else {
      // setselectedInvites(selectedInvites);
    }
  };

  //   const filterPassedTime = (time) => {
  //     const currentDate = new Date();
  //     const selectedDate = new Date(time);
  //     return currentDate.getTime() < selectedDate.getTime();
  //   };

  //   const filterPassedTime1 = (time) => {
  //     const currentDate = new Date();
  //     const selectedDate = new Date(time);
  //     return startDate < selectedDate.getTime();
  //   };

  return (
    <div className="classroom_list ">
      {errorText && (
        <ErrorComponent isSuccess={isSuccess}>{errorText}</ErrorComponent>
      )}
      {/* <NewNavbar /> */}
      <div className="">
        <div className="">
          <div className="cl_edit_content_box meeting_details">
            {/* <div className="">
              <h2>Meeting Details</h2>
            </div> */}
            <div className="meeting_details">
              {/* <div className="title">
                <img src={EditTitle} alt="" />
                <input
                  type="text"
                  name="meeting_title"
                  placeholder={constant.add_title}
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                />
                <small className="error">{meetingTitleErr}</small>
              </div> */}
              {/* <div className="schedule_time">
                <img src={Time} alt="" />
                <div className="start_datetime">
                  <div className="datepicker">
                    <DatePicker
                      id="meeting_startdate"
                      selected={startDate}
                      showTimeSelect
                      minDate={new Date()}
                      maxDate={endDate != null ? endDate : null}
                      onChange={(date) => dateHandler(date, "startdate")}
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
                      onChange={(date) => dateHandler(date, "enddate")}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      filterTime={filterPassedTime1}
                      placeholderText={constant.choose_end_time}
                    />
                    <img src={Calendar} alt="" />
                  </div>
                  <small className="error">{endDateError}</small>
                </div>
              </div> */}

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

                <Select
                  id="meeting_invitie"
                  value={selectedInvites}
                  isMulti
                  name="meeeting_invites"
                  options={meetingInvities}
                  onChange={emailHandler}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                <small className="error">{invitesErr}</small>
                <button
                  className="cl_save_btn export-margin"
                  onClick={() => $("#excel-file-input").click()}
                >
                  {constant.excel_import}
                </button>
              </div>
              {/* 
              <div className="agenda">
                <img src={Summary} alt="" />
                <textarea
                  value={meetingDescription}
                  placeholder={constant.description}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                  ></textarea>
                </div> */}
              <div className="btn_meeting">
                {/* <Link to="/user/meeting/meetinglist">
                  <button type="button" className="cl_cancel_btn">
                    Cancel
                    </button>
                  </Link> */}
                {errorText && <p className="text-success">Copied</p>}
                <button
                  className="copy_button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      window.location.origin +
                        // routes.guest +
                        "/" +
                        JSON.parse(localStorage.getItem("meetingMetadata"))
                          .roomName
                    );
                    setErrorText("Copied!");
                    setIsSuccess(true);
                    setTimeout(() => {
                      setErrorText("");
                    }, 1000);
                  }}
                >
                  <img src={CopyBtn} alt="Copy link" />
                </button>
                <button
                  onClick={toggle}
                  type="button"
                  className="cl_cancel_btn"
                >
                  {constant.cancel}
                </button>

                <button
                  type="button"
                  className="cl_save_btn"
                  onClick={editSessionHandler}
                >
                  {constant.update}
                </button>
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
export default InviteUsers;
