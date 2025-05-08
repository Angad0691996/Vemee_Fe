// React System Libraries
import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

// Customised Libraries or components
import "../../css/new-style.css";
import "../../css/mobile-style.css";
import { ENDPOINTURL } from "../common/endpoints";
import LoginLogo from "../../images/login_logo.svg";
import LoginBackGround from "../../images/login_bg.svg";
import { ValidateEmail } from "../validation";
import { apiRoutes, constant } from "../common/constant";
import ErrorComponent from "../errorPage/errorPopup";

function NewForgotPassword(props) {
  const [email, setEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");
  const [errorText, setErrorText] = useState("");

  // When sending request for ForgotPassword
  const submitHandler = async () => {
    const emailValidate = ValidateEmail(email);
    setForgotStatus({
      status: "processing",
      message: "Processing...",
    });

    try {
      if (!email) {
        setForgotStatus({
          status: "error",
          message: "Email is required",
        });
      } else {
        if (emailValidate.status) {
          try {
            const forgotPasswordResponse = await Axios.get(
              `${ENDPOINTURL}${apiRoutes.forgot_password}?email=${email}`
            );
            if (forgotPasswordResponse.data.Status === "200") {
              setForgotStatus({
                status: "OK",
                message: "Please check your email to reset your password.",
              });
            } else {
              setForgotStatus({
                status: "error",
                message: forgotPasswordResponse.data.message,
              });
            }
          } catch (error) {
            setForgotStatus({
              status: "error",
              message: constant.something_went_wrong,
            });
          }
        } else {
          setForgotStatus({
            status: "error",
            message: emailValidate.error,
          });
        }
      }
    } catch (error) {
      setErrorText(error.message);
    }
  };

  return (
    <div className="client_login_main client_forget_password">
      {errorText && <ErrorComponent>{errorText}</ErrorComponent>}
      <div className="client_login">
        <div className="client_login_left">
          <div className="client_login_right_img">
            <img src={LoginBackGround} alt="" />
          </div>
        </div>
        <div className="client_login_right">
          <div className="client_login_header">
            {/* <div className="client_login_logo">
                        <Link to="/">
                          <img src={LoginLogo} alt=""/>
                        </Link>
                    </div> */}
          </div>
          <div className="client_login_content ">
            <div className="client_forget_password_body client_content_login_box">
              <h1>Find Password</h1>
              {forgotStatus && forgotStatus.status === "OK" && (
                <p className="text-success">{forgotStatus.message}</p>
              )}
              {forgotStatus && forgotStatus.status === "error" && (
                <p className="text-danger">{forgotStatus.message}</p>
              )}
              {forgotStatus && forgotStatus.status === "processing" && (
                <p className="text-warning">{forgotStatus.message}</p>
              )}
              <div className="client_login_content_form_box">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="client_login_content_form_box">
                <div className="client_forget_box">
                  <div className="forget_icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="42.5"
                      height="42.5"
                      viewBox="0 0 42.5 42.5"
                    >
                      <g id="login" transform="translate(0 -0.001)">
                        <g
                          id="그룹_16852"
                          data-name="그룹 16852"
                          transform="translate(0 0.001)"
                        >
                          <g id="그룹_16851" data-name="그룹 16851">
                            <circle
                              id="타원_17561"
                              data-name="타원 17561"
                              cx="1.5"
                              cy="1.5"
                              r="1.5"
                              transform="translate(26 27)"
                              fill="#c2c2c2"
                            />
                            <path
                              id="패스_10581"
                              data-name="패스 10581"
                              d="M19.756,39.181H6.641a3.324,3.324,0,0,1-3.32-3.32V22.247a3.324,3.324,0,0,1,3.32-3.32H30.547a3.324,3.324,0,0,1,3.32,3.32v3.32a1.66,1.66,0,1,0,3.32,0v-3.32a6.648,6.648,0,0,0-6.641-6.641h-2V9.752A9.869,9.869,0,0,0,18.591,0,9.869,9.869,0,0,0,8.63,9.752v5.855H6.641A6.648,6.648,0,0,0,0,22.247V35.86A6.648,6.648,0,0,0,6.641,42.5H19.756a1.66,1.66,0,1,0,0-3.32ZM11.95,9.752a6.545,6.545,0,0,1,6.641-6.43,6.545,6.545,0,0,1,6.641,6.43v5.855H11.95V9.752Z"
                              transform="translate(0 -0.001)"
                              fill="#c2c2c2"
                            />
                            <path
                              id="패스_10582"
                              data-name="패스 10582"
                              d="M283.012,322.309a1.66,1.66,0,0,0-2.316.384l-8.183,11.43a.948.948,0,0,1-1.365.071l-5.288-5.161a1.66,1.66,0,0,0-2.319,2.376l5.3,5.17.015.014a4.28,4.28,0,0,0,2.945,1.177q.141,0,.282-.009a4.28,4.28,0,0,0,3.044-1.585q.029-.036.056-.074l8.216-11.477A1.66,1.66,0,0,0,283.012,322.309Z"
                              transform="translate(-241.206 -295.271)"
                              fill="#c2c2c2"
                            />
                            <circle
                              id="타원_17562"
                              data-name="타원 17562"
                              cx="1.5"
                              cy="1.5"
                              r="1.5"
                              transform="translate(20 27)"
                              fill="#c2c2c2"
                            />
                            <circle
                              id="타원_17563"
                              data-name="타원 17563"
                              cx="1.5"
                              cy="1.5"
                              r="1.5"
                              transform="translate(8 27)"
                              fill="#c2c2c2"
                            />
                            <circle
                              id="타원_17564"
                              data-name="타원 17564"
                              cx="1.5"
                              cy="1.5"
                              r="1.5"
                              transform="translate(14 27)"
                              fill="#c2c2c2"
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="forget_text_box">
                    You will receive a temporary password via email after
                    entering your email address.
                  </div>
                </div>
              </div>
              <div className="client_login_content_form_box">
                <input
                  type="submit"
                  id="ClientButton"
                  value="Forgot Password"
                  onClick={submitHandler}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NewForgotPassword;
