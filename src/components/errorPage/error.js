import React from "react";
import "../../css/new-style.css";
import "../../css/mobile-style.css";
import LoginLogo from "../../images/login_logo.svg";
import { Link } from "react-router-dom";
import NewNavbar from "../common/newNavbar";
import { routes } from "../common/constant";

function Error() {
  return (
    <>
      <div className="classroom_list flex-row">
        {/* <div className="cl_list_header">
          <div className="wrapper">
            <div className="cl_list_head">
              <div className="cl_logo">
                <a href="/">
                  <img src={LoginLogo} alt="" />
                </a>
              </div>
            </div>
          </div>
        </div> */}
        <NewNavbar />
        <div className="cl_preview_device">
          <div className="wrapper">
            <div className="error_page_content_box">
              <h1>
                Oops, Something went Wrong ! Please click{" "}
                <Link to={routes.meeting_list}>here</Link> to go back to Meeting
                List page{" "}
              </h1>

              <div className="error_icon">
                <a href="#.">
                  <svg
                    height="48"
                    viewBox="0 0 48 48"
                    width="48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h48v48H0z" fill="none" />
                    <path
                      fill="#03B3E5"
                      d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2 34h-4v-4h4v4zm4.13-15.49l-1.79 1.84C26.9 25.79 26 27 26 30h-4v-1c0-2.21.9-4.21 2.34-5.66l2.49-2.52C27.55 20.1 28 19.1 28 18c0-2.21-1.79-4-4-4s-4 1.79-4 4h-4c0-4.42 3.58-8 8-8s8 3.58 8 8c0 1.76-.71 3.35-1.87 4.51z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Error;
