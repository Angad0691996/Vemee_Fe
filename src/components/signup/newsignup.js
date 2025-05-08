// React System Libraries
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { constant, routes, apiRoutes } from "../common/constant";

// Customised Libraries or components
import "../../css/new-style.css";
import "../../css/mobile-style.css";
import { ENDPOINTURL } from "../common/endpoints";
import LoginLogo from "../../images/logo.svg";
import SignUpPage from "../../images/signup.svg";
import {
  ValidateEmail,
  ValidatePassword,
  ValidateRole,
  ValidateUsername,
} from "../validation";

function NewSignup(props) {
  //State Variables
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConpassword] = useState("");
  const [role, setRole] = useState("Student");
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmpasswordErr, setConfirmpasswordErr] = useState("");
  const [roleErr, setRoleErr] = useState("");
  const [policy, setPolicy] = useState(false);
  const [componentStatus, setComponentStatus] = useState("");
  const navigate = useNavigate();

  // Set User Role to local storage
  useEffect(() => {
    if (localStorage.getItem("user_role") === "ADMIN") {
      setRole("ADMIN");
    }
  }, []);

  // When sending request for signup New user
  const submitHandler = async () => {
    const emailRes = ValidateEmail(email);
    const usernameRes = ValidateUsername(username);
    const passwordRes = ValidatePassword(password);
    const confirmpasswordRes = ValidatePassword(password);
    const roleRes = ValidateRole(role);
    if (
      emailRes.status &&
      usernameRes.status &&
      passwordRes.status &&
      confirmpasswordRes.status &&
      roleRes.status
    ) {
      setNameErr("");
      setEmailErr("");
      setPasswordErr("");
      setConfirmpasswordErr("");
      setRoleErr("");

      setComponentStatus({
        status: "processing",
        message: "Processing...",
      });
      try {
        let registerAction = "add";
        let signupResponse;
        if (localStorage.getItem("user_role") === "ADMIN") {
          registerAction = "addByAdmin";
          signupResponse = await Axios.post(
            `${ENDPOINTURL}${apiRoutes.admin_register}`,
            {
              userName: username,
              role: role,
              email: email,
              password: password,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              },
            }
          );
        } else {
          signupResponse = await Axios.post(
            `${ENDPOINTURL}${apiRoutes.register}`,
            {
              userName: username,
              role: role,
              email: email,
              password: password,
            }
          );
        }

        if (signupResponse.status === 200) {
          console.log("signUp done", signupResponse.data);
          setComponentStatus({
            status: "OK",
            message: signupResponse.data.message,
          });

          if (localStorage.getItem("user_role") === "ADMIN") {
            setTimeout(async () => {
              navigate(routes.admin);
            }, [1000]);
          } else {
            setTimeout(async () => {
              navigate(`${routes.mailsend}?email=${email}`);
            }, [1000]);
          }
        } else {
          setComponentStatus({
            status: "error",
            message: signupResponse.data.message,
          });
        }
      } catch (error) {
        console.log(error);
        setComponentStatus({
          status: "error",
          message: constant.something_went_wrong,
        });
      }
    } else {
      setNameErr(usernameRes.error);
      setEmailErr(emailRes.error);
      setPasswordErr(passwordRes.error);
      setConfirmpasswordErr(confirmpasswordRes.error);
      setRoleErr(roleRes.error);
    }
  };

  // for handling terms and condition check
  const handleCheckboxChange = () => {
    setPolicy(!policy);
  };
  //For Handling Error on fields
  const handleChange = (e) => {
    // e.preventDefault();
    console.log(e.target.name, e.target.value);
    switch (e.target.name) {
      case "username":
        e.preventDefault();
        if (e.target.value.length !== 0) {
          setNameErr("");
          setUsername(e.target.value);
        }
        break;
      case "email":
        e.preventDefault();
        if (e.target.value.length !== 0) {
          setEmailErr("");
          setEmail(e.target.value);
        }
        break;
      case "password":
        e.preventDefault();
        if (e.target.value.length !== 0) {
          setPasswordErr("");
          setPassword(e.target.value);
        }
        break;
      case "confirmpassword":
        e.preventDefault();
        if (e.target.value.length !== 0) {
          setConfirmpasswordErr("");
          setConpassword(e.target.value);
        }
        break;
      case "role":
        if (e.target.value.length !== 0) {
          setRoleErr("");
          setRole(e.target.value);
        }
        break;
      default:
        break;
    }
  };

  return (
    // policy && policy === true ? (
    //   <PrivacyPolicy setPolicy={setPolicy} history={props.history} />
    // ) : (
    <div className="client_login_main client_select_main ">
      <div className="client_login">
        <div className="client_login_right">
          <div className="client_login_header">
            <div className="client_login_logo">
              <img src={LoginLogo} alt="" />
            </div>
          </div>
          <div className="client_login_content">
            <div className="client_content_login_box">
              <h1>{constant.sign_up}</h1>
              {componentStatus && componentStatus.status === "OK" && (
                <p className="text-success">{componentStatus.message}</p>
              )}
              {componentStatus && componentStatus.status === "error" && (
                <p className="text-danger">{componentStatus.message}</p>
              )}
              {componentStatus && componentStatus.status === "processing" && (
                <p className="text-warning">{componentStatus.message}</p>
              )}
              <div className="login_form_box_container">
                <div className="client_login_content_form_box">
                  <input
                    type="text"
                    name="username"
                    placeholder={constant.name}
                    onChange={(e) => handleChange(e)}
                  />
                  <small className="error">{nameErr}</small>
                </div>
                <div className="client_login_content_form_box">
                  <input
                    type="text"
                    name="email"
                    placeholder={constant.email_address}
                    onChange={(e) => handleChange(e)}
                  />
                  <small className="error">{emailErr}</small>
                </div>
              </div>
              <div className="login_form_box_container">
                <div className="client_login_content_form_box">
                  <input
                    type="password"
                    name="password"
                    placeholder={constant.password}
                    onChange={(e) => handleChange(e)}
                  />
                  <small className="error">{passwordErr}</small>
                </div>
                <div className="client_login_content_form_box">
                  <input
                    type="password"
                    name="confirmpassword"
                    placeholder={constant.confirm_password}
                    onChange={(e) => handleChange(e)}
                  />
                  <small className="error">{confirmpasswordErr}</small>
                </div>
              </div>
              {localStorage.getItem("user_role") == "ADMIN" && (
                <div className="client_login_content_form_box select-box">
                  <label>{constant.select_role}</label>
                  <select name="role" onChange={(e) => handleChange(e)}>
                    {/* <option value="">Choose Role</option> */}
                    <option value="ADMIN">{constant.admin}</option>
                    <option value="User">{constant.user}</option>
                    {/* <option value="Guest">{constant.attendee}</option> */}
                  </select>
                  <small className="error">{roleErr}</small>
                </div>
              )}
              {/* {localStorage.getItem("user_role") !== "Admin" && (
                <div className="client_login_content_form_box select-box">
                  <label>{constant.select_role}</label>
                  <div className="custom-radio-container">
                    <label htmlFor="role-teacher" className="custom-radio">
                      <input
                        type="radio"
                        id="role-teacher"
                        name="role"
                        checked={role === "Teacher"}
                        value="User"
                        onChange={(e) => handleChange(e)}
                        className="hidden-radio"
                      />
                      <img
                        src={organiser}
                        alt=""
                        className="custom-radio-icon"
                      />
                      <span className="radio-label">{constant.organiser}</span>
                    </label>
                    <label htmlFor="role-student" className="custom-radio">
                      <input
                        type="radio"
                        name="role"
                        id="role-student"
                        checked={role === "Student"}
                        value="Student"
                        onChange={(e) => handleChange(e)}
                        className="hidden-radio"
                      />
                      <img
                        src={attendee}
                        alt=""
                        className="custom-radio-icon"
                      />
                      <span className="radio-label">{constant.attendee}</span>
                    </label>
                  </div>
                  <small className="error">{roleErr}</small>
                </div>
              )} */}
              <label>
                <input
                  type="checkbox"
                  checked={policy}
                  onChange={handleCheckboxChange}
                />
                {"  "}
                {constant.accept}{" "}
                <a
                  href="/terms-and-conditions"
                  target="_blank" // This opens the link in a new tab
                  rel="noopener noreferrer"
                >
                  {constant.tnc}
                </a>
              </label>
              {/* <p>Policy Accepted: {policy ? "Yes" : "No"}</p> */}
              <div className="client_login_content_form_box">
                <input
                  type="submit"
                  disabled={!policy}
                  value="Sign up"
                  id="ClientButton"
                  onClick={() => {
                    if (password === conpassword) {
                      submitHandler();
                    } else {
                      setPasswordErr("The passwords don't match");
                    }
                  }}
                />
                <small>
                  {constant.already_account}
                  <Link to="/"> {constant.login}</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="client_login_left">
          <div className="client_login_right_img">
            <img src={SignUpPage} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default NewSignup;
