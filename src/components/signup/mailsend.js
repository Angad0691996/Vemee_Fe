// React System Libraries
import React from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";

// Customised Libraries or components
import "../../css/new-style.css";
import "../../css/mobile-style.css";
import email_cert from "../../images/email_cert.png";
import LoginLogo from "../../images/login_logo.svg";

function MailSend() {
  const { email } = queryString.parse(window.location.search);

  return (
    <div className="client_login_main cliend_send_mail_main">
      <div className="client_login">
        <div className="client_login_left">
          <div className="client_login_right_img">
            <img src={email_cert} alt="" />
          </div>
        </div>
        <div className="client_login_right">
          <div className="client_login_header">
            {/* <div className="client_login_logo">
              <Link to="/">
                <img src={LoginLogo} alt="" />
              </Link>
            </div> */}
            <Link to="/" className="client_login_close">
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 1.8L14.2 1L8 7.2L1.8 1L1 1.8L7.2 8L1 14.2L1.8 15L8 8.8L14.2 15L15 14.2L8.8 8L15 1.8Z"
                  fill="#85939D"
                />
              </svg>
            </Link>
          </div>
          <div className="client_login_content">
            <div className="client_content_login_box">
              <div className="send_email_details">
                <h2>Send verification email</h2>
                <p>
                  I sent an email to <a href="#.">{email}</a>
                </p>
                <p>
                  To get started with <strong>VeMee</strong>
                </p>
                <p>Click the verification link in that email.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MailSend;
