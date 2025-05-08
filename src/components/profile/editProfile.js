import React, { useEffect, useState, useRef } from "react";
import NewNavbar from "../common/newNavbar";
import "../../css/new-style.css";
import "../../css/mobile-style.css";
import userprofile from "../../images/user-icon.png";
import CheckLoginStatus from "../common/loginStatus";
import queryString from "query-string";
import Axios from "axios";
import { ENDPOINTURL } from "../common/endpoints";
import back from "../../images/go-back.svg";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "../errorPage/errorPopup";
import { apiRoutes, routes } from "../common/constant";

let user_role = localStorage.getItem("user_role");

function EditProfile() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [componentStatus, setComponentStatus] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [errorText, setErrorText] = useState("");
  const token = localStorage.getItem("auth_token");
  const fileInputRef = useRef(null);
  var formData = new FormData();
  let { editprofile } = queryString.parse(window.location.search);
  const navigate = useNavigate();

  const handleSvgClick = () => {
    fileInputRef.current.click();
  };
  //Manage user profile Details
  const submitHandler = async () => {
    try {
      setComponentStatus({
        status: "processing",
        message: "Processing...",
      });
      // let api_url = `${ENDPOINTURL}/user/editUserAPI?
      // ${id ? `userId=${id}&` : ""}
      // ${name ? `userName=${name}&` : ""}
      // ${role ? `role=${role}&` : ""}
      // ${password ? `password=${password}&` : ""}
      // ${email ? `email=${email}` : ""}`;
      const editUserResponse = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.edit_profile}`,
        // api_url,
        {
          id: id,
          name: name,
          role: role,
          password: password,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (editUserResponse.status === 200) {
        setComponentStatus({
          status: "OK",
          message: editUserResponse.data.message,
        });
        console.log("SUCCESS");
        if (user_role === "ADMIN") {
          navigate(routes.admin);
        } else {
          navigate(-1);
        }
        localStorage.setItem("user_name", name);
      } else {
        setComponentStatus({
          status: "error",
          message: editUserResponse.data.message,
        });
      }
    } catch (error) {
      setErrorText(error.message);
    }
  };

  // Getting User Details.
  const getUserDetails = async (email) => {
    const token = localStorage.getItem("auth_token");
    try {
      setComponentStatus({
        status: "processing",
        message: "Processing...",
      });
      const userProfileResponse = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.get_user_by_email}?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userProfileResponse.status === 200) {
        setComponentStatus({
          status: "",
          message: "",
        });

        setName(userProfileResponse.data.user_name);
       // setPassword(userProfileResponse.data.password);
        setEmail(userProfileResponse.data.email);
        setRole(userProfileResponse.data.role);
        setId(userProfileResponse.data.id);
        if (userProfileResponse.data.url) {
          localStorage.setItem(
            "user_profile_image",
            userProfileResponse.data.url
          );
          setProfileImg(userProfileResponse.data.url);
        }
        // localStorage.setItem(
        //   "user_profile_image",
        //   userProfileResponse.data.data.url
        //     ? userProfileResponse.data.data.url
        //     : null
        // );
        //update user profile from loaclstorage
      } else {
        setComponentStatus({
          status: "error",
          message: userProfileResponse.data.message,
        });
      }
    } catch (error) {
      setErrorText(error.message);
    }
  };
  const handleGoBack = () => {
    // Navigate back to the previous page
    navigate(-1);
  };
  useEffect(() => {});
  // Save Profile Picture code
  const getsaveuserprofileHandler = async (e) => {
    try {
      setComponentStatus({
        status: "processing",
        message: "Processing...",
      });
      const updateProfileResponse = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.upload_photo}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updateProfileResponse.status === 200) {
        setComponentStatus({
          status: "OK",
          message: updateProfileResponse.data.message,
        });
        console.log("Setting image", updateProfileResponse.data.url);
        if (updateProfileResponse.data.url) {
          localStorage.setItem(
            "user_profile_image",
            updateProfileResponse.data.url
          );
          setProfileImg(localStorage.getItem("user_profile_image"));
        }
        // localStorage.setItem(
        //   "user_profile_image",
        //   updateProfileResponse.data.data[0].url
        //     ? updateProfileResponse.data.data[0].url
        //     : null
        // );
        // const t = updateProfileResponse.data.data[0].url;
        // setProfileImg(t);
      } else {
        setComponentStatus({
          status: "error",
          message: updateProfileResponse.data.message,
        });
      }
    } catch (error) {
      setErrorText(error.message);
    }
  };

  // Upload Profile Picture Code...
  const uploadHandler = (e) => {
    formData = new FormData();
    formData.append("profile", e.target.files[0]);
    getsaveuserprofileHandler();
  };

  useEffect(() => {
    //update user profile from loaclstorage
    setProfileImg(localStorage.getItem("user_profile_image"));

    //ValidateUser is loggedIn
    const login_status = CheckLoginStatus();
    if (login_status === false) {
      navigate("/");
    }
    console.log("edit profile", queryString.parse(window.location.search));
    let { editprofile } = queryString.parse(window.location.search);
    if (!editprofile) {
      return;
    }
    //Get User Details to display EditProfile page
    console.log("edit profile222", editprofile);
    if (editprofile === "true") {
      let localUserRole = localStorage.getItem("user_role");
      if (localUserRole === "ADMIN") {
        let { email } = queryString.parse(window.location.search);
        getUserDetails(email);
      } else {
        navigate("/");
      }
    } else {
      let email = localStorage.getItem("user_email");
      getUserDetails(email);
    }
  }, [editprofile, navigate]);
  useEffect(() => {
    let email = localStorage.getItem("user_email");
    getUserDetails(email);
  }, []);

  return (
    <>
      {errorText && <ErrorComponent>{errorText}</ErrorComponent>}
      <div className="classroom_list   flex-row">
        <NewNavbar />
        <div className="cl_meeting_content">
          <div className="wrapper">
            <div className="cl_meeting_title pofile_main_box">
              <div className="profile_header">
                <button className="back_btn" onClick={handleGoBack}>
                  <span>
                    <img
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                      src={back}
                      alt=""
                    />
                  </span>
                </button>
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
                  <h2>Profile</h2>
                )}
              </div>
              <div className="pofile_inr_page_box">
                <div className="cl_list_pofile_img">
                  <img
                    src={profileImg != null ? profileImg : userprofile}
                    alt="Image"
                  />
                  <input
                    type="file"
                    name="img"
                    className="profile_uploder_img"
                    accept="image/*"
                    onChange={uploadHandler}
                    ref={fileInputRef}
                    style={{ display: "none" }} // Hide the file input
                  />

                  <span onClick={handleSvgClick} className="cl_list_pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34px"
                      height="34px"
                      viewBox="0 0 34 34"
                      version="1.1"
                    >
                      <title>Icon/Profile_Camera</title>
                      <desc>Created with Sketch.</desc>
                      <g id="Ali-Meets" stroke="none" fill="none">
                        <g
                          id="Edit-Profile"
                          transform="translate(-419.000000, -335.000000)"
                        >
                          <g
                            id="Group-32"
                            transform="translate(325.000000, 190.000000)"
                          >
                            <g
                              id="Profile"
                              transform="translate(35.000000, 103.000000)"
                            >
                              <g
                                id="Icon-/-Profile_Camera"
                                transform="translate(59.000000, 42.000000)"
                              >
                                <g>
                                  <circle
                                    id="Oval-11"
                                    fill="#5EBBB6"
                                    cx="17"
                                    cy="17"
                                    r="17"
                                  />
                                  <g
                                    id="Group"
                                    transform="translate(6.375000, 8.500000)"
                                    stroke="#FFFFFF"
                                  >
                                    <path
                                      d="M12.5428932,0.5 L8.70710678,0.5 L5.87377345,3.33333333 L2,3.33333333 C1.17157288,3.33333333 0.5,4.00490621 0.5,4.83333333 L0.5,15 C0.5,15.8284271 1.17157288,16.5 2,16.5 L19.25,16.5 C20.0784271,16.5 20.75,15.8284271 20.75,15 L20.75,4.83333333 C20.75,4.00490621 20.0784271,3.33333333 19.25,3.33333333 L15.3762266,3.33333333 L12.5428932,0.5 Z"
                                      id="Rectangle-34"
                                    />
                                    <circle
                                      id="Oval-12"
                                      cx="10.625"
                                      cy="9.20833333"
                                      r="3.04166667"
                                    />
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                </div>
                <span>
                  {name}
                  {/* : <small>{role}</small> */}
                </span>
              </div>
              <div className="pofile_upload_details">
                <div className="client_login_content_form_box client_login_content_form_box_col_6">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Full Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {localStorage.getItem("user_role") === "ADMIN" && (
                  <div className="client_login_content_form_box client_login_content_form_box_col_6">
                    <label>Email Address</label>
                    <input
                      type="text"
                      value={email}
                      placeholder="Email Address"
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                  </div>
                )}
                <div className="client_login_content_form_box client_login_content_form_box_col_6">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {/* {(localStorage.getItem("user_role") === "Teacher" ||
                  localStorage.getItem("user_role") === "Student") && (
                  <div className="client_login_content_form_box client_login_content_form_box_col_6">
                    <label>Select Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled
                    >
                      <option value="Select Your Role">Select Your Role</option>
                      <option value={role}>
                        {role === "Teacher" ? "Teacher" : "Student"}
                      </option>
                    </select>
                  </div>
                )} */}
                {localStorage.getItem("user_role") === "ADMIN" && (
                  <div className="client_login_content_form_box client_login_content_form_box_col_6">
                    <label>Select Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      {/* <option value="Select Your Role">Select Your Role</option> */}
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                )}
                <div className="submit_btn_box">
                  <input
                    type="submit"
                    className="cl_save_btn"
                    id="ClientButton"
                    value="Save Profile"
                    onClick={submitHandler}
                  />
                  {/* <Link to='/user/meeting/meetinglist' className="cl_save_btn">뒤</Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
