import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Axios from "axios";
import DatePicker from "react-datepicker";
import CheckLoginStatus from "../common/loginStatus";
import { ENDPOINTURL } from "../common/endpoints";
import NewNavbar from "../common/newNavbar";
import "../../css/new-style.css";
import calendarDark from "../../images/calendar-dark.svg";
import leftArrow from "../../images/ic_round-less-than.svg";
import rightArrow from "../../images/ic_round-greater-than.svg";
import { apiRoutes, constant, routes } from "../common/constant";
import ScheduleMeeting from "../meeting/scheduleMeeting";
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
import { useNavigate } from "react-router-dom";

const MyCalendar = (props) => {
  const navigate = useNavigate();
  // Global Variables
  const months_arr = [
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
  const [meetingData, setMeetingData] = useState([]);
  const [selectedView, setSelectedView] = useState("week");

  const [events, setNewArray] = useState([]);
  const localizer = momentLocalizer(moment);
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("user_role");
  const token = localStorage.getItem("auth_token");
  // const [myEvents, setEvents] = useState(events);
  const [eventss, setEvents] = useState([]);
  let filterDate = "";
  const calendarRef = useRef(null);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const unmountOnClose = false;
  const [isEdit, setIsEdit] = useState(false);
  const [date, setDate] = useState("");
  const [errorText, setErrorText] = useState("");
  const onClose = () => {
    try {
      //To Get Current Date
      const presentTime = new Date();
      const year = presentTime.getFullYear();
      let month = presentTime.getMonth();
      const curr_date = presentTime.getDate();
      filterDate = year + "-" + (month + 1) + "-" + curr_date;

      month = months_arr[month];
      setDate(month + " " + curr_date + " " + year);
      //get Logged User meeting Data
      getMeetingData(userId);
    } catch (error) {
      setErrorText(error.message);
    }
  };

  // To Get Today Meeting List when page load
  useEffect(() => {
    // if (!modal) {
    //Validate user is logged in to access the website
    const isUserLoggedIn = CheckLoginStatus();
    if (isUserLoggedIn === false) {
      navigate("/");
    }

    //To hiding Data Calander inputBox
    // $(".react-datepicker__input-container").css("display", "none");

    //To Get Current Date
    const presentTime = new Date();
    const year = presentTime.getFullYear();
    let month = presentTime.getMonth();
    const curr_date = presentTime.getDate();
    filterDate = year + "-" + (month + 1) + "-" + curr_date;

    month = months_arr[month];
    // setDate(month + " " + curr_date + " " + year);

    //Get Meeting-List Data for Current Date
    try {
      //get Logged User meeting Data
      getMeetingData(userId);
    } catch (error) {
      //   setErrorText(error.message);
    }
    // }
  }, []);

  //   const events = [
  //     {
  //       title: 'Event 1',
  //       start: new Date(2024, 0, 15),
  //       end: new Date(2024, 0, 17),
  //     },
  //         {
  //           title: 'Event 2',
  //           start: new Date(2024, 0, 20),
  //           end: new Date(2024, 0, 20),
  //         },
  //         {
  //             title: 'Event 3',
  //             start: new Date(),
  //             end: new Date(),
  //           },
  //     // Add more events as needed
  //   ];

  // To get logged in user meeting data
  const getMeetingData = async (userId) => {
    try {
      //   searchText = $("#search").val();

      //Start Loader to loadData
      // setComponentStatus({
      //     status: "processing",
      //     message: constant.processing,
      //   });

      //For Getting curruntDate Meeting
      if (userId) {
        // const requestParams = {
        //   meetingDate: filterDate,
        //   userId: userId,
        //   //   search: searchText,
        // };
        const today = new Date().toISOString();
        console.log("date format today", today);
        const meetingResponse = await Axios.post(
          `${ENDPOINTURL}${apiRoutes.get_meeting_by_week}`,

          {
            meetingDate: today,
            getAll: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (meetingResponse.status == 200) {
          //   setMeetingList("");
          //   setMeetingList(meetingResponse.data.data);

          console.log(meetingResponse.data);
          // const meetdata = meetingData.data.data;
          setMeetingData("");
          setMeetingData(meetingResponse.data);

          // Extract specific data from apiData and store it in a new array
          const newArray = meetingResponse.data.map((meeting) => ({
            title: meeting.meeting_title,
            start: new Date(meeting.start_time),
            end: new Date(meeting.end_time),
            roomName: meeting.room_name,
            // Add other properties you want to extract
          }));

          // Log the new array to the console
          console.log("New Array:", newArray);
          setNewArray(newArray);
          //   console.log(da) ;
          //   setComponentStatus({
          //     status: "",
          //     message: "",
          //   });
        } else {
          //   setComponentStatus({
          //     status: "error",
          //     message: constant.something_went_wrong,
          //   });
        }
      } else {
        // setComponentStatus({
        //   status: "error",
        //   message: "Wrong Input",
        // });
      }
    } catch (error) {
      //   setErrorText(error.message);
    }
  };

  const handleEventClick = (event) => {
    // Handle event click here
    navigate(`/${event.roomName}`);
    console.log("Event clicked:", event);
  };

  useEffect(() => {
    if (calendarRef.current) {
      const interval = setInterval(() => {
        const currentTimeIndicator = document.querySelector(
          ".rbc-current-time-indicator"
        );
        if (currentTimeIndicator) {
          currentTimeIndicator.scrollIntoView({
            block: "center",
            inline: "nearest",
          });
          clearInterval(interval); // Stop checking once the current time indicator is found
        }
      }); // Check every second

      return () => {
        clearInterval(interval); // Clean up the interval when component unmounts
      };
    }
  }, []);

  const handleSlotSelect = (slotInfo) => {
    console.log("slot details", slotInfo.slots);
    setModal(true);
  };

  const scrollToCurrentTime = () => {
    // console.log("working")
    if (calendarRef.current) {
      const interval = setInterval(() => {
        const currentTimeIndicator = document.querySelector(
          ".rbc-current-time-indicator"
        );
        if (currentTimeIndicator) {
          currentTimeIndicator.scrollIntoView({
            block: "center",
            inline: "nearest",
          });
          clearInterval(interval); // Stop checking once the current time indicator is found
        }
      }); // Check every second

      return () => {
        clearInterval(interval); // Clean up the interval when component unmounts
      };
    }
  };

  const getMeetingDataByWeek = async () => {
    const today = new Date().toISOString();
    console.log("date format today", today);
    const meetingResponse = await Axios.post(
      `${ENDPOINTURL}${apiRoutes.get_meeting_by_week}`,

      {
        meetingDate: today,
        getAll: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (meetingResponse.status == 200) {
      console.log(meetingResponse.data);
      setMeetingData("");
      setMeetingData(meetingResponse.data);

      // Extract specific data from apiData and store it in a new array
      const newArray = meetingResponse.data.map((meeting) => ({
        title: meeting.meeting_title,
        start: new Date(meeting.start_time),
        end: new Date(meeting.end_time),
        roomName: meeting.room_name,
        // Add other properties you want to extract
      }));

      // Log the new array to the console
      console.log("New Array:", newArray);
      setNewArray(newArray);
    }
  };

  const getMeetingDataByDay = async () => {
    const today = new Date().toISOString();
    console.log("date format today", today);
    const meetingResponse = await Axios.post(
      `${ENDPOINTURL}${apiRoutes.get_meeting_by_date}`,

      {
        meetingDate: today,
        getAll: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (meetingResponse.status == 200) {
      console.log(meetingResponse.data);
      setMeetingData("");
      setMeetingData(meetingResponse.data);

      // Extract specific data from apiData and store it in a new array
      const newArray = meetingResponse.data.map((meeting) => ({
        title: meeting.meeting_title,
        start: new Date(meeting.start_time),
        end: new Date(meeting.end_time),
        roomName: meeting.room_name,
        // Add other properties you want to extract
      }));

      // Log the new array to the console
      console.log("New Array:", newArray);
      setNewArray(newArray);
    }
  };

  const getMeetingDataByMonth = async () => {
    const today = new Date().toISOString();
    console.log("date format today", today);
    const meetingResponse = await Axios.post(
      `${ENDPOINTURL}${apiRoutes.get_meeting_by_month}`,

      {
        meetingDate: today,
        getAll: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (meetingResponse.status == 200) {
      console.log(meetingResponse.data);
      setMeetingData("");
      setMeetingData(meetingResponse.data);

      // Extract specific data from apiData and store it in a new array
      const newArray = meetingResponse.data.map((meeting) => ({
        title: meeting.meeting_title,
        start: new Date(meeting.start_time),
        end: new Date(meeting.end_time),
        roomName: meeting.room_name,
        // Add other properties you want to extract
      }));

      // Log the new array to the console
      console.log("New Array:", newArray);
      setNewArray(newArray);
    }
  };

  const handleViewChange = (view) => {
    // console.log("view ", view)
    // Handle view change
    scrollToCurrentTime();
  };

  const CustomToolbar = (toolbarProps) => {
    const handleViewChange = (view) => {
      console.log("view ", view);
      if (view === "week") {
        console.log("select week", view);
        getMeetingDataByWeek();
      }
      if (view === "day") {
        console.log("select day", view);
        getMeetingDataByDay();
      }
      if (view === "month") {
        getMeetingDataByMonth();
      }
      setSelectedView(view);
      toolbarProps.onView(view);
    };

    return (
      <div className="custom-toolbar">
        <div className="left-section">
          <span className="current-date">
            {moment(toolbarProps.date).format("MMMM YYYY")}
          </span>
          <img
            className="calendar-icon"
            src={calendarDark}
            alt="Calendar Icon"
          />
        </div>

        <div className="center-section">
          <button
            type="button"
            className={selectedView === "month" ? "selected" : ""}
            onClick={() => handleViewChange("month")}
          >
            Month
          </button>
          <button
            type="button"
            className={selectedView === "week" ? "selected" : ""}
            onClick={() => handleViewChange("week")}
          >
            Week
          </button>
          <button
            type="button"
            className={selectedView === "day" ? "selected" : ""}
            onClick={() => handleViewChange("day")}
          >
            Day
          </button>
        </div>

        <div className="right-section">
          <button
            className="today-btn"
            type="button"
            onClick={() => toolbarProps.onNavigate("TODAY")}
          >
            Today
          </button>
          <button
            className="left-arrow-icon"
            type="button"
            onClick={() => toolbarProps.onNavigate("PREV")}
          >
            <img src={leftArrow} alt="Calendar Icon" />
          </button>
          <button
            className="right-arrow-icon"
            type="button"
            onClick={() => toolbarProps.onNavigate("NEXT")}
          >
            <img src={rightArrow} alt="Calendar Icon" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="classroom_list flex-row">
        <NewNavbar />
        <div className="meeting_calendar">
          <div className="new_meeting">
            <h3> Calender </h3>

            {
              <button
                className="cl_button"
                onClick={toggle}
                style={{ whiteSpace: "nowrap", marginLeft: "20px" }}
              >
                + {constant.new_meeting}
              </button>
            }
          </div>
          {/* <div ref={calendarRef} className="calendar-container"> */}
          <Calendar
            ref={calendarRef}
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            defaultView="week"
            onSelectEvent={handleEventClick}
            onSelectSlot={handleSlotSelect} // Handle slot selection
            onView={handleViewChange} // Handle view change event
            selectable={true} // Make slots selectable
            components={{
              toolbar: CustomToolbar,
            }}
          />
          {/* </div> */}
        </div>
      </div>
      <Modal
        isOpen={modal}
        toggle={toggle}
        unmountOnClose={unmountOnClose}
        onClosed={onClose}
      >
        <ModalHeader toggle={toggle}>{constant.create_meeting}</ModalHeader>
        <ModalBody>
          <ScheduleMeeting toggle={toggle} isEdit={isEdit} />
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
    </>
  );
};

export default MyCalendar;
