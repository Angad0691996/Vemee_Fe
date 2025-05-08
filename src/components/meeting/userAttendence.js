import React, { useEffect, useState } from "react";
import NewNavbar from "../common/newNavbar";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { ENDPOINTURL } from "../common/endpoints";
import CheckLoginStatus from "../common/loginStatus";
import { Link } from "react-router-dom";
import back from "../../images/go-back.svg";
import moment from "moment";
import { apiRoutes, constant, routes } from "../common/constant";
function UserAttendence(props) {
  // const { id } = useParams();
  const [data, setData] = useState([]);
  const [myMeetingId, setMyMeetingId] = useState("");
  const [componentStatus, setComponentStatus] = useState("");
  const navigate = useNavigate();
  let meetingId = "";
  let userId = "";

  useEffect(() => {
    const res = CheckLoginStatus();
    const user_role = localStorage.getItem("user_role");
    // if (res && (user_role === "Teacher" || user_role === "Admin")) {
    //   let urldata = id;
    //   urldata = urldata.split("MID");
    //   setMyMeetingId(urldata[1]);
    //   userId = urldata[0];
    //   meetingId = urldata[1];
    //   getAttendenceData();
    // }
    if (res) {
      let urldata;
      urldata = window.location.pathname.split("/").pop().toLowerCase();
      setMyMeetingId(urldata);
      // userId = urldata[0];
      // meetingId = urldata[1];
      getAttendenceData(urldata);
    } else {
      navigate("/");
    }
  }, []);

  const getAttendenceData = async (meetingId) => {
    if (!meetingId) {
      return;
    }
    setComponentStatus({
      status: "processing",
      message: constant.processing,
    });
    try {
      const token = localStorage.getItem("auth_token");
      const { data } = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.attendance_get_by_meeting}?meetingId=${meetingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(data);
      setComponentStatus({
        status: "",
        message: "",
      });
    } catch (error) {
      setComponentStatus({
        status: "error",
        message: constant.something_went_wrong,
      });
    }
  };

  function calculateDuration(startTimeString, endTimeString) {
    // Convert start_time and end_time strings to Date objects
    const startTime = new Date(startTimeString);
    const endTime = new Date(endTimeString);
    console.log(startTime, endTime);
    // Calculate the difference in milliseconds between end_time and start_time
    const durationInMilliseconds = endTime - startTime;
    console.log(durationInMilliseconds);
    // Convert milliseconds to hours and minutes
    const durationHours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
      (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );
    const durationSeconds = Math.floor(
      (durationInMilliseconds % (1000 * 60)) / 1000
    );
    // Return the duration as an object
    return durationHours + ":" + durationMinutes + ":" + durationSeconds;
  }
  return (
    <>
      <div className="classroom_list flex-row">
        <NewNavbar />
        <div className="cl_attendance_list">
          <div className="wrapper">
            <div className="cl_attendance_list_box">
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
                <div className="cl_attendance_header">
                  <Link to={routes.attendance}>
                    <span>
                      <img
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "10px",
                          marginTop: "5px",
                        }}
                        src={back}
                        alt=""
                      />
                    </span>
                  </Link>

                  <h3>{constant.attendance}</h3>
                </div>
              )}
              <div className="attendance_table_box">
                {data.length > 0 ? (
                  <table>
                    <tr>
                      <th>{constant.title}</th>
                      <th>{constant.email_address}</th>
                      <th>{constant.start_time}</th>
                      <th>{constant.end_time}</th>
                      <th>{constant.duration}</th>
                    </tr>
                    {data &&
                      data.map((attendence) => (
                        <tr key={attendence.id}>
                          <td>{attendence.user.user_name}</td>
                          <td>{attendence.user.email}</td>
                          <td>
                            {attendence.checkin_time != null
                              ? moment(attendence.checkin_time).format(
                                  "DD MMM YY hh:mm"
                                )
                              : null}
                          </td>
                          <td>
                            {attendence.checkout_time != null
                              ? moment(attendence.checkout_time).format(
                                  "DD MMM YY hh:mm"
                                )
                              : null}
                          </td>
                          <td>
                            {calculateDuration(
                              attendence.checkin_time,
                              attendence.checkout_time
                            )}
                          </td>
                        </tr>
                      ))}
                  </table>
                ) : (
                  <div className="attendance_table_box">
                    <h2>{constant.no_records}</h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserAttendence;
