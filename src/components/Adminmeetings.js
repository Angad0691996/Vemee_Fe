import React, { useState, useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import { ENDPOINTURL } from "../components/common/endpoints";
import Axios from "axios";
import DatePicker from "react-datepicker";
import $ from "jquery";
import { FaBeer, FaCalendar } from "react-icons/fa";
import { apiRoutes, constant, routes } from "./common/constant";
import { Link } from "react-router-dom";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Form,
  FormGroup,
} from "reactstrap";
import ScheduleMeeting from "./meeting/scheduleMeeting";

function Adminmeetings(props) {
  const [Meetings, setMeetings] = useState("");
  const [date, setDate] = useState("");
  const token = localStorage.getItem("auth_token");
  const [role, setRole] = useState("");
  const [searchData, setSearchData] = useState("");
  const [serchResult, setserchResult] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const unmountOnClose = false;
  const toggle = () => setModal(!modal);

  let months_arr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateHandler = async (e) => {
    console.log(e);
    let date = e.getDate();

    if (date < 10) {
      date = "0" + date;
      console.log("Date: " + date);
    }

    let month = e.getMonth();
    let monthIndex = e.getMonth() + 1;
    month = months_arr[month];
    if (monthIndex < 10) {
      monthIndex = "0" + monthIndex;
      console.log("monthIndex: " + monthIndex);
    }

    const year = e.getFullYear();

    setDate(month + " " + date + " " + year);

    let userId = localStorage.getItem("user_id");

    localStorage.setItem("selectedDate", year + "-" + monthIndex + "-" + date);
    let selectedDate = localStorage.getItem("selectedDate");

    try {
      const meetingResponse = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.all_meeting_get}`,
        {
          page : 1,
          pageSize : 5,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (meetingResponse.status == 200) {
        setserchResult("");
        setMeetings(meetingResponse.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const getSearchUsers = async (res) => {
    const token = localStorage.getItem("auth_token");
    let selectedDate = localStorage.getItem("selectedDate");
    const serchdata = await Axios.get(
      `${ENDPOINTURL}/meeting/getAllMeetingListByDate?meetingDate=${selectedDate}&searchText=${res}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMeetings("");
    if (serchdata.status == 200) {
      setserchResult(serchdata.data);
    }

    setStudents([]);
    setTeachers([]);
  };

  const getMeetingInvites = (invites) => {
    let emailString = "";
    invites.map((email) => {
      emailString = emailString + email + ", ";
    });
    emailString = emailString.slice(0, -2);
    return emailString;
  };

  const deletehandler = async (meetingId) => {
    localStorage.setItem("deleteMeeting", meetingId);
    $(".custom-alert").removeClass("d-none");
  };

  const edithandler = (session) => {
    localStorage.setItem("edit_session", JSON.stringify(session));
    setIsEdit(true);
    toggle();
  };

  useEffect(() => {
    $(".react-datepicker__input-container").css("display", "none");
    dateHandler(new Date());
  }, []);

  return (
    <>
      <div className="custom-alert d-none">
        <div className="custom-alert-wrapper">
          <div className="custom-alert-content">
            <h3>
              <b>Delete meeting?</b>
            </h3>
            <br />
            <p style={{ fontSize: "16px" }}>
              Delete this meeting. <br />
              Deleted meetings cannot be restored. <br />
              Do you want to proceed with deletion?{" "}
            </p>
            <div className="custom-alert-button">
              <button
                className="btn blue_btn"
                onClick={async () => {
                  let meetingId = localStorage.getItem("deleteMeeting");
                  const { data } = await Axios.post(
                    `${ENDPOINTURL}${apiRoutes.delete_meeting}`,
                    {
                      meetingId:meetingId,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  if (data === "Meeting Successfully Deleted !") {
                    $(".custom-alert").addClass("d-none");
                    dateHandler(new Date());
                  }
                }}
              >
                Confirm
              </button>
              <button
                className="btn gray_btn"
                onClick={() => $(".custom-alert").addClass("d-none")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="right_meeting_box" style={{ float: "right" }}>
        <Modal isOpen={modal} toggle={toggle} unmountOnClose={unmountOnClose}>
          <ModalHeader toggle={toggle}>{constant.create_meeting}</ModalHeader>
          <ModalBody>
            <ScheduleMeeting toggle={toggle} isEdit={isEdit} />
          </ModalBody>
        </Modal>
        <button
          onClick={() => {
            setIsEdit(false);
            toggle();
          }}
          className="blue_btn"
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
          >
            <g fill="none" fillRule="evenodd">
              <g fill="#FFF" fillRule="nonzero">
                <g>
                  <g>
                    <g>
                      <g>
                        <path
                          d="M36 24.714L31.714 24.714 31.714 29 30.286 29 30.286 24.714 26 24.714 26 23.286 30.286 23.286 30.286 19 31.714 19 31.714 23.286 36 23.286z"
                          transform="translate(-1045 -139) translate(282 120) translate(1) translate(736)"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg> */}
          {constant.create_meeting}
        </button>
        <div className="search_box">
          <input
            type="text"
            value={searchData}
            placeholder="Search"
            onChange={(e) => {
              setSearchData(e.target.value);
              getSearchUsers(e.target.value);
            }}
          />
        </div>
      </div>

      <h2
        onClick={() => {
          $("#choose-date").click();
        }}
        style={{ width: "max-content" }}
      >
        <span>
          <FaCalendar />
        </span>
        {date}
      </h2>
      <DatePicker id="choose-date" onChange={dateHandler} />
      <table class="table table-bordered table-striped table-light">
        <thead>
          <tr className="text-center">
            <th scope="col">Meeting Name</th>
            <th scope="col">Start Time</th>
            <th scope="col">End Time</th>
            <th scope="col">Created On</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {Meetings &&
            Meetings.map((Meeting, index) => (
              <tr className="text-center" key={index}>
                <td>{Meeting.meeting_title}</td>
                <td>{Meeting.start_time}</td>
                <td>{Meeting.end_time}</td>
                <td>{Meeting.created_at}</td>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "300px",
                  }}
                >
                  <button
                    className="btn btn-info"
                    onClick={() => edithandler(Meeting)}
                  >
                    <i className="fa fa-pencil-square-o"></i>
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => deletehandler(Meeting.id)}
                  >
                    <i className="fa fa-trash-o"></i>
                  </button>
                  <Link
                    to={`${routes.meeting_list}/${Meeting.room_name}`}
                    // href={`/user/meeting/MeetingUI/${Meeting.roomName}`}
                    className="btn btn-info"
                  >
                    Join
                  </Link>
                </td>
              </tr>
            ))}
          {console.log(serchResult)}
          {serchResult &&
            serchResult.map((res, index) => (
              <tr className="text-center" key={index}>
                <td>{res.meeting_title}</td>
                <td>{res.start_time}</td>
                <td>{res.end_time}</td>
                <td>{res.created_at}</td>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "300px",
                  }}
                >
                  <button
                    className="btn btn-info"
                    onClick={() => edithandler(res)}
                  >
                    <i className="fa fa-pencil-square-o"></i>
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => deletehandler(res.id)}
                  >
                    <i className="fa fa-trash-o"></i>
                  </button>
                  <a
                    href={`/user/meeting/MeetingUI/${res.room_name}`}
                    className="btn btn-info"
                  >
                    Join
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
export default Adminmeetings;
