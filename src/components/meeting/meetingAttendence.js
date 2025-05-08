// React System Libraries
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
// Customised Libraries or components
import NewNavbar from "../common/newNavbar";
import { useParams } from "react-router-dom";
import { ENDPOINTURL } from "../common/endpoints";
import CheckLoginStatus from "../common/loginStatus";
import { apiRoutes, constant, routes } from "../common/constant";

function MeetingAttendence(props) {
  // Get Meeting Id if found
  let segment_str = window.location.pathname; // return segment1/segment2/segment3/segment4
  let segment_array = segment_str.split("/");
  let id = segment_array.pop();
  const [meetingAttendence, setMeetingAttendence] = useState([]);
  const [componentStatus, setComponentStatus] = useState("");
  const user_id = localStorage.getItem("user_id");
  const user_role = localStorage.getItem("user_role");
  let userAttendence = 0;
  let userAttendenceMeetingId = 0;
  let meetId = localStorage.getItem("active_meeting_id");
  const navigate = useNavigate();
  useEffect(() => {
    const res = CheckLoginStatus();
    if (res) {
      if (id && id != "attendence") {
        userAttendenceMeetingId = id;
      } else {
        userAttendence = user_id;
      }
      console.log(userAttendenceMeetingId);
      // Meeting Attendence Data
      getAttendenceData();
    } else {
      navigate("/");
    }
  }, []);

  const getAttendenceData = async () => {
    setComponentStatus({
      status: "processing",
      message: constant.processing,
    });
    try {
      const token = localStorage.getItem("auth_token");
      //const attendanceResponse = await Axios.get(`${ENDPOINTURL}/attendance/viewAttendanceAPI?meetingId=${userAttendenceMeetingId}&userId=${userAttendence}`, {
      const attendanceResponse = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.attendance_get}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("data", attendanceResponse.data);
      if (attendanceResponse.status === 200) {
        setMeetingAttendence(attendanceResponse.data);
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
        message: constant.something_went_wrong,
      });
    }
  };
  console.log("data3", meetingAttendence);
  return (
    <>
      <div className="classroom_list   flex-row">
        <NewNavbar />
        <div className="cl_meeting_list_wrapper cl_attendance_list">
          <div className="wrapper">
            <div className="cl_attendance_list_box">
              <h3>{constant.attendance}</h3>
              <p>{constant.attendance_caption}</p>
              <div className="attendance_table_box">
                {meetingAttendence.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>{constant.title}</th>
                        <th>{constant.email_address}</th>
                        <th>{constant.start_time}</th>
                        <th>{constant.end_time}</th>
                        <th>{constant.action}</th>
                        {/* <th>총 시간</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {meetingAttendence &&
                        meetingAttendence.map((attendence, i) => (
                          <tr key={i}>
                            <td>
                              {/* <Link
                                to={`/user/meeting/userAttendence/${attendence.user.id}MID${attendence.meetingId}`}
                              > */}
                              {attendence.meeting_title}
                              {/* {constant.view_attendance} */}
                              {/* </Link> */}
                            </td>

                            {/* <td>{attendence.userName}</td> */}
                            <td>{attendence.organiser.email}</td>
                            <td>
                              {moment(attendence.checkin_time).format(
                                "DD MMM YY"
                              )}{" "}
                              {moment(attendence.checkin_time).format("kk:mm")}
                            </td>
                            <td>
                              {moment(attendence.checkout_time).format(
                                "DD MMM YY"
                              )}{" "}
                              {moment(attendence.checkout_time).format("kk:mm")}
                            </td>
                            <td>
                              <Link
                                to={`${routes.attendance}/${attendence.id}`}
                              >
                                {constant.view_attendance}
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="attendance_table_box">
                    {componentStatus && componentStatus.status === "OK" && (
                      <h2 className="text-success">
                        {componentStatus.message}
                      </h2>
                    )}
                    {componentStatus && componentStatus.status === "error" && (
                      <h2 className="text-danger">{componentStatus.message}</h2>
                    )}
                    {componentStatus &&
                      componentStatus.status === "processing" && (
                        <h2 className="text-warning">
                          {componentStatus.message}
                        </h2>
                      )}
                    {componentStatus && componentStatus.status === "" && (
                      <h2>
                        <Link to={routes.meeting_list}>
                          {constant.attendance}
                        </Link>
                      </h2>
                    )}
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
export default MeetingAttendence;
