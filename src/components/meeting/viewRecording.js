// React System Libraries
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import queryString from "query-string";

// Customised Libraries or components
import { ENDPOINTURL } from "../common/endpoints";
import NewNavbar from "../common/newNavbar";
import Time from "../../images/tdesign_time.svg";
import { apiRoutes, constant, routes } from "../common/constant";

function ViewRecording(props) {
  const [recordingList, setRecordingList] = useState([]);
  const [componentStatus, setComponentStatus] = useState("");
  const token = localStorage.getItem("auth_token");
  const navigate = useNavigate();
  let user_role = localStorage.getItem("user_role");
  let user_id = localStorage.getItem("user_id");
  let { meetingId } = queryString.parse(window.location.search);
  let userRecordingMeetingId = 0;
  let userRecording = 0;

  function formatDateTime(dateString) {
    // Create a Date object from the input date string
    const utcDate = new Date(dateString);

    // Convert the UTC time to IST (Indian Standard Time, UTC+5:30)
    const istOffsetMinutes = 330; // 5 hours 30 minutes
    const istDate = new Date(utcDate.getTime() + istOffsetMinutes * 60000);

    // Format the IST date and time
    const dateFormatter = new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });

    const formattedDateTime = dateFormatter.format(istDate);

    const day = istDate.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      istDate
    );
    const year = istDate.getFullYear();
    const formattedDay = `${day} ${month} ${year}`;

    // // Calculate days from today
    const currentDate = new Date();
    const timeDifference = istDate - currentDate;
    const daysFromToday = -Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // // Calculate the duration in terms of months and years
    // const currentDate = new Date();
    // const timeDifference = istDate - currentDate;
    // const millisecondsInMonth = 30 * 24 * 60 * 60 * 1000; // Approximate average month duration
    // const millisecondsInYear = 365 * 24 * 60 * 60 * 1000; // Approximate average year duration

    // let formattedDuration = "";
    // if (timeDifference >= millisecondsInYear) {
    //   const years = Math.floor(timeDifference / millisecondsInYear);
    //   formattedDuration = `${years} ${years === 1 ? "year" : "years"}`;
    // } else if (timeDifference >= millisecondsInMonth) {
    //   const months = Math.floor(timeDifference / millisecondsInMonth);
    //   formattedDuration = `${months} ${months === 1 ? "month" : "months"}`;
    // } else {
    //   const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    //   formattedDuration = `${days} ${days === 1 ? "day" : "days"}`;
    // }

    return {
      timeIST: formattedDateTime.split(" ")[1],
      day: formattedDay,
      date: formattedDateTime.split(" ")[0],
      daysFromToday: daysFromToday,
    };
  }

  // Example usage:
  // const dateString = "2023-08-17T09:49:09.516";
  // const formattedData = formatDateTime(dateString);
  // console.log("Time in 24hr IST:", formattedData.timeIST);
  // console.log("Day:", formattedData.day);
  // console.log("Date in dd:MM:yyyy:", formattedData.date);
  // console.log("Days from today:", formattedData.daysFromToday);
  const parseRecordingData = (data) => {
    data.map((doc) => {
      let dateTime = formatDateTime(doc.created_at);
      doc.time = dateTime.timeIST;
      doc.day = dateTime.day;
      doc.date = dateTime.date;
      doc.daysFromToday = dateTime.daysFromToday;
    });
    return data;
  };
  // Get Recording List
  const getRecordingList = async () => {
    setComponentStatus({
      status: "processing",
      message: constant.processing,
    });
    try {
      let isAdmin = user_role == "ADMIN";
      const recordingResponse = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.recording_get_by_user}?userId=${userRecording}&source=Recordings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
       console.log("response",recordingResponse)
      if (recordingResponse.status == 200) {
        // Set Recording List
        // console.log("parsing");
        let data = parseRecordingData(recordingResponse.data);
        console.log("Data", data);
        setRecordingList(data);

        // Set component status
        setComponentStatus({
          status: "",
          message: "",
        });
      } else {
        setComponentStatus({
          status: "error",
          message: recordingResponse.data.message,
        });
      }
    } catch (error) {
      setComponentStatus({
        status: "error",
        message: constant.something_went_wrong,
      });
    }
  };

  // Delete Specific Document of Meeting
  const deleteDocument = async (documentId) => {
    try {
      setComponentStatus({
        status: "processing",
        message: constant.processing,
      });

      const deleteDocumentResponse = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.document_delete}`,
        {
          documentId: documentId 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (deleteDocumentResponse.status == 200) {
        setComponentStatus({
          status: "OK",
          message: deleteDocumentResponse.data.message,
        });
      } else {
        setComponentStatus({
          status: "error",
          message: deleteDocumentResponse.data.message,
        });
      }
      navigate(routes.meeting_list);
    } catch (error) {
      setComponentStatus({
        status: "error",
        message: constant.something_went_wrong,
      });
    }
  };

  useEffect(() => {

    console.log("reording id",meetingId,user_id)
    if (meetingId) {
      userRecordingMeetingId = meetingId;
    } else {
      userRecording = user_id;
    }

    // Get Recording List
    getRecordingList();
  }, []);

  const myStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%!important",
    margin: "auto",
    paddingTop: "30px!important",
  };

  return (
    <div className="classroom_list   flex-row">
      <NewNavbar />

      <div className="cl_meeting_list_wrapper">
        <div className="cl_attendance_list">
          <div className="wrapper">
            <div className="cl_attendance_list_box">
              <h3> {constant.recordings}</h3>
              <p>{constant.recording_caption}</p>
              {componentStatus && componentStatus.status === "OK" && (
                <h2 className="text-success">{componentStatus.message}</h2>
              )}
              {componentStatus && componentStatus.status === "error" && (
                <h2 className="text-danger">{componentStatus.message}</h2>
              )}
              {componentStatus && componentStatus.status === "processing" && (
                <h2 className="text-warning">{componentStatus.message}</h2>
              )}
              {componentStatus && componentStatus.status === "" && (
                <h2>
                  {/* Recordings */}
                  {user_role === "ADMIN" && (
                    <Link to={routes.admin}>{constant.home}</Link>
                  )}
                </h2>
              )}
            </div>
          </div>
        </div>
        <div className="recording_list">
          {recordingList &&
            recordingList.map((doc, i) => (
              <div key={i} className="body_section">
                <div className="time">
                  <img src={Time} alt="" />
                  <div className="text">
                    <h3>{doc.time}</h3>
                    <p>
                      {doc.daysFromToday} {constant.days_ago}
                    </p>
                  </div>
                </div>
                <div className="title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="29"
                    height="29"
                    viewBox="0 0 29 29"
                    fill="none"
                  >
                    <path
                      d="M14.2687 0.0273438C16.1332 0.0273438 17.9212 0.767988 19.2396 2.08634C20.5579 3.4047 21.2986 5.19277 21.2986 7.05721C21.2986 8.92165 20.5579 10.7097 19.2396 12.0281C17.9212 13.3464 16.1332 14.0871 14.2687 14.0871C12.4043 14.0871 10.6162 13.3464 9.29785 12.0281C7.9795 10.7097 7.23885 8.92165 7.23885 7.05721C7.23885 5.19277 7.9795 3.4047 9.29785 2.08634C10.6162 0.767988 12.4043 0.0273438 14.2687 0.0273438ZM14.2687 3.54228C13.3365 3.54228 12.4425 3.9126 11.7833 4.57178C11.1241 5.23096 10.7538 6.12499 10.7538 7.05721C10.7538 7.98943 11.1241 8.88347 11.7833 9.54264C12.4425 10.2018 13.3365 10.5721 14.2687 10.5721C15.2009 10.5721 16.095 10.2018 16.7542 9.54264C17.4133 8.88347 17.7837 7.98943 17.7837 7.05721C17.7837 6.12499 17.4133 5.23096 16.7542 4.57178C16.095 3.9126 15.2009 3.54228 14.2687 3.54228ZM14.2687 15.8445C18.9612 15.8445 28.3285 18.182 28.3285 22.8744V28.1468H0.208984V22.8744C0.208984 18.182 9.57628 15.8445 14.2687 15.8445ZM14.2687 19.1837C9.04904 19.1837 3.54817 21.7496 3.54817 22.8744V24.8076H24.9893V22.8744C24.9893 21.7496 19.4884 19.1837 14.2687 19.1837Z"
                      fill="#999999"
                    />
                  </svg>
                  <div className="title-Right">
                    <h5>{doc.meeting_id}</h5>
                    <p>{doc.document_title}</p>
                  </div>
                </div>
                <div className="action">
                  <button onClick={() => deleteDocument(doc.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="31"
                      height="31"
                      viewBox="0 0 31 31"
                      fill="none"
                    >
                      <path
                        d="M20.386 11.9224V24.127H10.6223V11.9224H20.386ZM18.5553 4.59961H12.453L11.2326 5.82007H6.96094V8.261H24.0474V5.82007H19.7758L18.5553 4.59961ZM22.827 9.48146H8.1814V24.127C8.1814 25.4695 9.27982 26.5679 10.6223 26.5679H20.386C21.7285 26.5679 22.827 25.4695 22.827 24.127V9.48146Z"
                        fill="#595959"
                      />
                    </svg>
                  </button>
                </div>
                <div className="day_month">
                  <label>{doc.day}</label>
                  <h6>{doc.date}</h6>
                  {/* <button className="play_btn"> */}
                  <a
                    className="play_btn"
                    href={doc.document_url}
                    download={doc.document_title}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="18"
                      viewBox="0 0 26 22"
                      fill="none"
                    >
                      <path
                        d="M0.777344 12.5835H3.21827V18.6859H22.7457V12.5835H25.1866V18.6859C25.1866 20.0406 24.1004 21.1268 22.7457 21.1268H3.21827C2.5709 21.1268 1.95004 20.8696 1.49227 20.4118C1.03451 19.9541 0.777344 19.3332 0.777344 18.6859V12.5835ZM12.982 16.2449L19.7555 9.5812L18.0225 7.86034L14.2024 11.6682V0.378906H11.7615V11.6682L7.95367 7.86034L6.22061 9.5934L12.982 16.2449Z"
                        fill="#fff"
                      />
                    </svg>
                  </a>
                  {/* </button> */}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
export default ViewRecording;
