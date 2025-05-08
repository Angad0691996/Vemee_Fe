import React, { useState, useEffect } from "react";
import "../../css/new-style.css";
import "../../css/mobile-style.css";
import LoginLogo from "../../images/logo-color.svg";
import userprofile from "../../images/Userprofile.png";
import DropdownComponent from "../common/dropdown";
import CheckLoginStatus from "../common/loginStatus";
import { Link, useNavigate } from "react-router-dom";
import { Buffer } from "buffer";

import calendarDark from "../../images/calendar-dark.svg";
import dashboard from "../../images/dashboard.svg";
import recordDark from "../../images/record-dark.svg";
import attendance from "../../images/Attendance.svg";
import meetingPageIcon from "../../images/meeting-page-icon.svg";
import { constant, routes } from "./constant";
import Tooltip from "./tooltip";

function NewNavbar(props) {
  let dropdown_items = [
    {
      name: constant.edit_profile,
      link: routes.edit_profile,
    },
    {
      name: constant.translate,
      link: "",
    },
    {
      name: constant.log_out,
      link: "/",
    },
  ];

  // Make Page Active based on selected page
  let meetingPage,
    attendencePage,
    ViewRecording,
    calendar,
    profileImage = "";
  const pageName = window.location.pathname.split("/");
  if ("/" + pageName[1] == routes.record) {
    ViewRecording = "active";
  } else if ("/" + pageName[1] == routes.attendance) {
    attendencePage = "active";
  } else if ("/" + pageName[1] == routes.meeting_list) {
    meetingPage = "active";
  } else if ("/" + pageName[1] == routes.calendar) {
    calendar = "active";
  } else if ("/" + pageName[1] == routes.edit_profile) {
    meetingPage = "";
    attendencePage = "";
    ViewRecording = "";
    calendar = "";
    profileImage = "active";
  } else {
    meetingPage = "active";
  }
  const navigate = useNavigate();
  const [dropdownHandler, setDropdownHandler] = useState(false);
  let user_name = localStorage.getItem("user_name");
  let user_role = localStorage.getItem("user_role");
  let initialName = localStorage.getItem("initial_name");

  // console.log(localStorage.getItem("user_profile_image") ? "Yes" : "No");

  useEffect(() => {
    // validate user is logged in to access
    const isUserLoggedIn = CheckLoginStatus();
    if (isUserLoggedIn === false) {
      // window.location.href = "/";
      navigate("/");
    }
  }, []);

  //For redirecting Home page From any other Page
  const loginstatus = (e) => {
    e.preventDefault();
    //Validate user is logged in to access the website
    const login_status = CheckLoginStatus();
    if (login_status === true) {
      if (user_role == "ADMIN") {
        navigate(routes.admin);
      } else {
        navigate(routes.meeting_list);
      }
    } else {
      // window.location.href = "/";
      navigate("/");
    }
  };
  const getImage = () => {
    if (localStorage.getItem("user_profile_image")) {
      return Buffer.from(localStorage.getItem("user_profile_image")).toString(
        "base64"
      );
    }
  };

  return (
    <div className="cl_list_header">
      <div className="wrapper">
        <div className="cl_list_head">
          <div className="cl_logo">
            <img src={LoginLogo} alt="" />
            {/* <svg
              width="336"
              height="234"
              viewBox="0 0 336 234"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M117.192 137.432L130.296 99.716H140.46L122.82 146H111.396L93.84 99.716H104.088L117.192 137.432Z"
                fill="#F76721"
              />
              <path
                d="M258.209 98.8486C261.849 98.8486 265.097 99.6046 267.953 101.117C270.865 102.629 273.133 104.869 274.757 107.837C276.437 110.805 277.277 114.389 277.277 118.589V145.889H267.785V120.017C267.785 115.873 266.749 112.709 264.677 110.525C262.605 108.285 259.777 107.165 256.193 107.165C252.609 107.165 249.753 108.285 247.625 110.525C245.553 112.709 244.517 115.873 244.517 120.017V145.889H235.025V120.017C235.025 115.873 233.989 112.709 231.917 110.525C229.845 108.285 227.017 107.165 223.433 107.165C219.849 107.165 216.993 108.285 214.865 110.525C212.793 112.709 211.757 115.873 211.757 120.017V145.889H202.181V99.6046H211.757V104.897C213.325 102.993 215.313 101.509 217.721 100.445C220.129 99.3806 222.705 98.8486 225.449 98.8486C229.145 98.8486 232.449 99.6326 235.361 101.201C238.273 102.769 240.513 105.037 242.081 108.005C243.481 105.205 245.665 102.993 248.633 101.369C251.601 99.6886 254.793 98.8486 258.209 98.8486ZM331.882 121.613C331.882 123.349 331.77 124.917 331.546 126.317H296.182C296.462 130.013 297.834 132.981 300.298 135.221C302.762 137.461 305.786 138.581 309.37 138.581C314.522 138.581 318.162 136.425 320.29 132.113H330.622C329.222 136.369 326.674 139.869 322.978 142.613C319.338 145.301 314.802 146.645 309.37 146.645C304.946 146.645 300.97 145.665 297.442 143.705C293.97 141.689 291.226 138.889 289.21 135.305C287.25 131.665 286.27 127.465 286.27 122.705C286.27 117.945 287.222 113.773 289.126 110.189C291.086 106.549 293.802 103.749 297.274 101.789C300.802 99.8286 304.834 98.8486 309.37 98.8486C313.738 98.8486 317.63 99.8006 321.046 101.705C324.462 103.609 327.122 106.297 329.026 109.769C330.93 113.185 331.882 117.133 331.882 121.613ZM321.886 118.589C321.83 115.061 320.57 112.233 318.106 110.105C315.642 107.977 312.59 106.913 308.95 106.913C305.646 106.913 302.818 107.977 300.466 110.105C298.114 112.177 296.714 115.005 296.266 118.589H321.886Z"
                fill="#06202e"
              />
              <mask
                id="mask0_1_2"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="117"
                height="117"
              >
                <path
                  d="M116.673 62.9325C116.673 62.9325 95.4594 61.5183 78.4888 78.4889C61.5183 95.4594 62.9325 116.673 62.9325 116.673L-1.84774e-06 53.7401C-1.84774e-06 53.7401 16.3766 37.3635 26.8701 26.8701C37.3635 16.3766 53.7401 2.98023e-07 53.7401 2.98023e-07L116.673 62.9325Z"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask0_1_2)">
                <path
                  d="M49.4975 103.238C41.687 95.4271 41.687 82.7638 49.4975 74.9533L74.9533 49.4975C82.7638 41.687 95.4271 41.687 103.238 49.4975L116.673 62.9325L62.9325 116.673L49.4975 103.238Z"
                  fill="#F76721"
                />
                <circle
                  cx="41.0122"
                  cy="41.0122"
                  r="20"
                  transform="rotate(-45 41.0122 41.0122)"
                  fill="#F76721"
                />
              </g>
              <mask
                id="mask1_1_2"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="116"
                y="0"
                width="118"
                height="117"
              >
                <path
                  d="M170.411 116.674C170.411 116.674 171.825 95.4612 154.855 78.4907C137.884 61.5201 116.671 62.9343 116.671 62.9343L179.604 0.00183105C179.604 0.00183105 195.98 16.3785 206.474 26.8719C216.967 37.3653 233.344 53.7419 233.344 53.7419L170.411 116.674Z"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask1_1_2)">
                <path
                  d="M130.106 49.4993C137.917 41.6888 150.58 41.6888 158.39 49.4993L183.846 74.9551C191.657 82.7656 191.657 95.4289 183.846 103.239L170.411 116.674L116.671 62.9343L130.106 49.4993Z"
                  fill="#F76721"
                />
                <circle
                  cx="192.331"
                  cy="41.014"
                  r="20"
                  transform="rotate(45 192.331 41.014)"
                  fill="#F76721"
                />
              </g>
              <mask
                id="mask2_1_2"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="116"
                y="116"
                width="118"
                height="118"
              >
                <path
                  d="M116.671 170.415C116.671 170.415 137.884 171.829 154.855 154.859C171.825 137.888 170.411 116.675 170.411 116.675L233.344 179.607C233.344 179.607 216.967 195.984 206.474 206.477C195.98 216.971 179.604 233.347 179.604 233.347L116.671 170.415Z"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask2_1_2)">
                <path
                  d="M183.846 130.11C191.657 137.92 191.657 150.584 183.846 158.394L158.39 183.85C150.58 191.66 137.917 191.66 130.106 183.85L116.671 170.415L170.411 116.675L183.846 130.11Z"
                  fill="#F76721"
                />
                <circle
                  cx="192.332"
                  cy="192.335"
                  r="20"
                  transform="rotate(135 192.332 192.335)"
                  fill="#F76721"
                />
              </g>
              <mask
                id="mask3_1_2"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="116"
                width="117"
                height="118"
              >
                <path
                  d="M62.9326 116.673C62.9326 116.673 61.5184 137.886 78.489 154.857C95.4595 171.827 116.673 170.413 116.673 170.413L53.7402 233.346C53.7402 233.346 37.3636 216.969 26.8702 206.476C16.3768 195.982 0.000114739 179.605 0.000114739 179.605L62.9326 116.673Z"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask3_1_2)">
                <path
                  d="M103.238 183.848C95.4272 191.659 82.7639 191.659 74.9534 183.848L49.4976 158.392C41.6871 150.582 41.6871 137.918 49.4976 130.108L62.9326 116.673L116.673 170.413L103.238 183.848Z"
                  fill="#F76721"
                />
                <circle
                  cx="41.0123"
                  cy="192.333"
                  r="20"
                  transform="rotate(-135 41.0123 192.333)"
                  fill="#F76721"
                />
              </g>
            </svg> */}
          </div>
          <div className="cl_list_middle_box">
            <ul>
              {localStorage.getItem("user_role") == "ADMIN" && (
                <li>
                  <div className="tooltip-container">
                    <Link
                      id="tooltip-admin"
                      to={routes.admin}
                      className={meetingPage}
                    >
                      <img src={meetingPageIcon} alt="" />
                    </Link>
                    <span className="nav-icon-name">Admin Dashboard</span>
                    {/* <Tooltip text="Dashboard" /> */}
                  </div>
                </li>
              )}
              {
                <li>
                  <div className="tooltip-container">
                    <Link to={routes.meeting_list} className={meetingPage}>
                      <img src={dashboard} alt="" />
                    </Link>
                    <span className="nav-icon-name">Dashboard</span>
                    {/* <Tooltip text="Dashboard" /> */}
                  </div>
                </li>
              }

              {/* <div className="icon_name">dashboard</div> */}

              {
                <li>
                  <div className="tooltip-container">
                    <Link
                      to={routes.calendar}
                      className={calendar}
                      title={constant.calendar}
                    >
                      <img src={calendarDark} alt="" />
                    </Link>
                    <span className="nav-icon-name">Calendar</span>
                    {/* <Tooltip text="Dashboard" /> */}
                  </div>
                  {/* <a href="/user/meeting/attendence" className={attendencePage}>
                    <img src={calendarDark} alt="" />
                  </a> */}
                </li>
              }
              {
                <li>
                  <div className="tooltip-container">
                    <Link
                      to={routes.record}
                      className={ViewRecording}
                      title={constant.ViewRecording}
                    >
                      <img src={recordDark} alt="" />
                    </Link>
                    <span className="nav-icon-name">Recording</span>
                    {/* <Tooltip text="Dashboard" /> */}
                  </div>
                  {/* <a href="/ViewRecording" className={ViewRecording}>
                    <img src={recordDark} alt="" />
                  </a> */}
                </li>
              }

              {
                <li>
                  <div className="tooltip-container">
                    <Link
                      to={routes.attendance}
                      className={attendencePage}
                      title={constant.attendance}
                    >
                      <img src={attendance} alt="" />
                    </Link>
                    <span className="nav-icon-name">Attendance</span>
                    {/* <Tooltip text="Dashboard" /> */}
                  </div>
                  {/* <a href="/user/meeting/attendence" className={attendencePage}>
                    <img src={calendarDark} alt="" />
                  </a> */}
                </li>
              }
            </ul>
          </div>
          
          {/* <div className="cl_list_pofile">
            <div className={`cl_list_pofile_img ${profileImage}`}>
              {localStorage.getItem("user_profile_image") != null ? (
                <img
                  id="tooltip-profile"
                  src={localStorage.getItem("user_profile_image")}
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdownHandler(!dropdownHandler);
                  }}
                  style={{
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    maxWidth: "unset",
                    position: "relative",
                    padding: "10px",
                    // right: "20px",
                  }}
                  alt=""
                />
              ) : (
                <span
                  id="tooltip-profile"
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdownHandler(!dropdownHandler);
                  }}
                  style={{
                    width: "65px",
                    height: "65px",
                    background: "#3e97e5",
                    borderRadius: "100%",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "solid",
                  }}
                >
                  {initialName}
                </span>
              )}
            </div> */}
            {/* <span>
              {user_name}
              <small>{user_role}</small>
            </span> */}
            <a
            // onClick={(e) => {
            //   e.preventDefault();
            //   setDropdownHandler(!dropdownHandler);
            // }}
            >
              {/* {dropdownHandler && <DropdownComponent items={dropdown_items} />}
              */}
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="9"
                viewBox="0 0 15 9"
              >
                <g fill="none">
                  <g fill="#CFECF8">
                    <g>
                      <g>
                        <g>
                          <path
                            d="M303.817 20.182c-.245-.243-.64-.243-.884 0l-6.433 6.395-6.433-6.395c-.244-.243-.64-.243-.884 0s-.244.636 0 .879l6.875 6.834c.122.121.282.182.442.182.16 0 .32-.061.442-.182l6.875-6.834c.244-.243.244-.636 0-.879z"
                            transform="translate(-829 -533) translate(496 129) translate(43 359) translate(1 25)"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg> */}
            </a>
          {/* </div>
          <span className="nav-icon-name" style={{ marginTop: "-15px" }}>
            Profile
          </span> */}
        </div>
      </div>
    </div>
  );
}
export default NewNavbar;
