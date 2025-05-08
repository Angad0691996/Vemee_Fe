import React, { useState, useEffect } from "react";
import "../../css/new-style.css";
import "../../css/mobile-style.css";
import LoginLogo from "../../images/logo.svg";
import LoginPage from "../../images/login_bg.svg";
import { json, Link, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { ENDPOINTURL } from "../common/endpoints";
import Axios from "axios";
import { apiRoutes, constant, routes } from "../common/constant";

import AppLogo from "../../images/logo.svg";

function ResetPassword({ location, history }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [componentStatus, setComponentStatus] = useState("");
  const navigate = useNavigate();
  const search = useLocation();

  const submitHandler = async () => {
    setComponentStatus({
      status: "processing",
      message: "Processing...",
    });
    try {
      if (!password || !confirmPassword) {
        if (!password) {
          setComponentStatus({
            status: "error",
            message: "Please enter a new password",
          });
        } else {
          setComponentStatus({
            status: "error",
            message: "Confirm password is required",
          });
        }
      } else {
        if (password === confirmPassword) {
          try {
            const data = await Axios.get(
              `${ENDPOINTURL}${apiRoutes.reset_password}?password=${password}&oldPassword=${token}`
            );
            if (data.data.success === false) {
              setComponentStatus({
                status: "error",
                message: "Something went Wrong.",
              });
            } else {
              setComponentStatus({
                status: "OK",
                message: "Password reset done successfully. please login!",
              });
              setTimeout(() => {
                navigate("/");
              }, [1000]);
            }
          } catch (error) {
            console.log("in catch");
            setComponentStatus({
              status: "error",
              message: "A problem has occurred.",
            });
          }
        } else {
          setComponentStatus({
            status: "error",
            message: "Password does not match",
          });
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    try {
      console.log(search);
      const searchParam=new URLSearchParams(search.search);
      const token=searchParam.get('token');
      //const { token } = queryString.parse(location.search);
      // if (!email || !token) {
      //   navigate("/");
      // } else {
      //   setEmail(email);
      //   setToken(token);
      // }
      console.log(token);
      if (!token) {
        navigate("/");
      } else {
        //setEmail(email);
        setToken(token);
      }
    } catch (error) {
      console.log(error);
      navigate(routes.error);
    }
  }, []);
  return (
    <div className="client_login_main client_select_main ">
      <div className="client_login">
        <div className="client_login_left">
          <div className="client_login_right_img">
            <img src={LoginPage} alt="" />
          </div>
        </div>
        <div className="client_login_right">
          <div className="client_login_header">
            {/* <div className="client_login_logo">
              <svg
                width="436"
                height="234"
                viewBox="0 0 436 234"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M150.341 99.6027L135.977 145.887H125.897L116.573 111.699L107.249 145.887H97.1689L82.7209 99.6027H92.4649L102.125 136.815L111.953 99.6027H121.949L131.357 136.647L140.933 99.6027H150.341Z"
                  fill="#ffffff"
                />
                <path
                  d="M220.073 137.319L233.177 99.6027H243.341L225.701 145.887H214.277L196.721 99.6027H206.969L220.073 137.319ZM306.607 98.8467C310.247 98.8467 313.495 99.6027 316.351 101.115C319.263 102.627 321.531 104.867 323.155 107.835C324.835 110.803 325.675 114.387 325.675 118.587V145.887H316.183V120.015C316.183 115.871 315.147 112.707 313.075 110.523C311.003 108.283 308.175 107.163 304.591 107.163C301.007 107.163 298.151 108.283 296.023 110.523C293.951 112.707 292.915 115.871 292.915 120.015V145.887H283.423V120.015C283.423 115.871 282.387 112.707 280.315 110.523C278.243 108.283 275.415 107.163 271.831 107.163C268.247 107.163 265.391 108.283 263.263 110.523C261.191 112.707 260.155 115.871 260.155 120.015V145.887H250.579V99.6027H260.155V104.895C261.723 102.991 263.711 101.507 266.119 100.443C268.527 99.3787 271.103 98.8467 273.847 98.8467C277.543 98.8467 280.847 99.6307 283.759 101.199C286.671 102.767 288.911 105.035 290.479 108.003C291.879 105.203 294.063 102.991 297.031 101.367C299.999 99.6867 303.191 98.8467 306.607 98.8467ZM380.281 121.611C380.281 123.347 380.169 124.915 379.945 126.315H344.581C344.861 130.011 346.233 132.979 348.697 135.219C351.161 137.459 354.185 138.579 357.769 138.579C362.921 138.579 366.561 136.423 368.689 132.111H379.021C377.621 136.367 375.073 139.867 371.377 142.611C367.737 145.299 363.201 146.643 357.769 146.643C353.345 146.643 349.369 145.663 345.841 143.703C342.369 141.687 339.625 138.887 337.609 135.303C335.649 131.663 334.669 127.463 334.669 122.703C334.669 117.943 335.621 113.771 337.525 110.187C339.485 106.547 342.201 103.747 345.673 101.787C349.201 99.8267 353.233 98.8467 357.769 98.8467C362.137 98.8467 366.029 99.7987 369.445 101.703C372.861 103.607 375.521 106.295 377.425 109.767C379.329 113.183 380.281 117.131 380.281 121.611ZM370.285 118.587C370.229 115.059 368.969 112.231 366.505 110.103C364.041 107.975 360.989 106.911 357.349 106.911C354.045 106.911 351.217 107.975 348.865 110.103C346.513 112.175 345.113 115.003 344.665 118.587H370.285ZM432.124 121.611C432.124 123.347 432.012 124.915 431.788 126.315H396.424C396.704 130.011 398.076 132.979 400.54 135.219C403.004 137.459 406.028 138.579 409.612 138.579C414.764 138.579 418.404 136.423 420.532 132.111H430.864C429.464 136.367 426.916 139.867 423.22 142.611C419.58 145.299 415.044 146.643 409.612 146.643C405.188 146.643 401.212 145.663 397.684 143.703C394.212 141.687 391.468 138.887 389.452 135.303C387.492 131.663 386.512 127.463 386.512 122.703C386.512 117.943 387.464 113.771 389.368 110.187C391.328 106.547 394.044 103.747 397.516 101.787C401.044 99.8267 405.076 98.8467 409.612 98.8467C413.98 98.8467 417.872 99.7987 421.288 101.703C424.704 103.607 427.364 106.295 429.268 109.767C431.172 113.183 432.124 117.131 432.124 121.611ZM422.128 118.587C422.072 115.059 420.812 112.231 418.348 110.103C415.884 107.975 412.832 106.911 409.192 106.911C405.888 106.911 403.06 107.975 400.708 110.103C398.356 112.175 396.956 115.003 396.508 118.587H422.128Z"
                  fill="#ffffff"
                />
                <mask
                  id="mask0_980_2440"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="-1"
                  width="117"
                  height="118"
                >
                  <path
                    d="M116.672 62.9297C116.672 62.9297 95.4587 61.5155 78.4881 78.486C61.5175 95.4566 62.9318 116.67 62.9318 116.67L-0.000741899 53.7373C-0.000741899 53.7373 16.3759 37.3607 26.8693 26.8672C37.3627 16.3738 53.7394 -0.00281495 53.7394 -0.00281495L116.672 62.9297Z"
                    fill="#D9D9D9"
                  />
                </mask>
                <g mask="url(#mask0_980_2440)">
                  <path
                    d="M49.4976 103.236C41.6871 95.4254 41.6871 82.7621 49.4976 74.9516L74.9534 49.4958C82.7639 41.6853 95.4272 41.6853 103.238 49.4958L116.673 62.9308L62.9326 116.671L49.4976 103.236Z"
                    fill="#F76721"
                  />
                  <circle
                    cx="41.0128"
                    cy="41.0117"
                    r="20"
                    transform="rotate(-45 41.0128 41.0117)"
                    fill="#F76721"
                  />
                </g>
                <mask
                  id="mask1_980_2440"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="116"
                  y="0"
                  width="118"
                  height="117"
                >
                  <path
                    d="M170.41 116.672C170.41 116.672 171.824 95.4587 154.854 78.4881C137.883 61.5175 116.67 62.9318 116.67 62.9318L179.603 -0.000741899C179.603 -0.000741899 195.979 16.3759 206.473 26.8693C216.966 37.3627 233.343 53.7394 233.343 53.7394L170.41 116.672Z"
                    fill="#D9D9D9"
                  />
                </mask>
                <g mask="url(#mask1_980_2440)">
                  <path
                    d="M130.106 49.4976C137.916 41.6871 150.58 41.6871 158.39 49.4976L183.846 74.9534C191.657 82.7639 191.657 95.4272 183.846 103.238L170.411 116.673L116.671 62.9326L130.106 49.4976Z"
                    fill="#F76721"
                  />
                  <circle
                    cx="192.332"
                    cy="41.0108"
                    r="20"
                    transform="rotate(45 192.332 41.0108)"
                    fill="#F76721"
                  />
                </g>
                <mask
                  id="mask2_980_2440"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="116"
                  y="116"
                  width="118"
                  height="118"
                >
                  <path
                    d="M116.672 170.414C116.672 170.414 137.885 171.828 154.856 154.858C171.826 137.887 170.412 116.674 170.412 116.674L233.344 179.606C233.344 179.606 216.968 195.983 206.474 206.477C195.981 216.97 179.604 233.347 179.604 233.347L116.672 170.414Z"
                    fill="#D9D9D9"
                  />
                </mask>
                <g mask="url(#mask2_980_2440)">
                  <path
                    d="M183.846 130.108C191.657 137.918 191.657 150.582 183.846 158.392L158.39 183.848C150.58 191.658 137.917 191.658 130.106 183.848L116.671 170.413L170.411 116.673L183.846 130.108Z"
                    fill="#F76721"
                  />
                  <circle
                    cx="192.331"
                    cy="192.332"
                    r="20"
                    transform="rotate(135 192.331 192.332)"
                    fill="#F76721"
                  />
                </g>
                <mask
                  id="mask3_980_2440"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="116"
                  width="117"
                  height="118"
                >
                  <path
                    d="M62.9336 116.672C62.9336 116.672 61.5194 137.885 78.4899 154.856C95.4605 171.826 116.674 170.412 116.674 170.412L53.7412 233.344C53.7412 233.344 37.3646 216.968 26.8711 206.474C16.3777 195.981 0.0010913 179.604 0.0010913 179.604L62.9336 116.672Z"
                    fill="#D9D9D9"
                  />
                </mask>
                <g mask="url(#mask3_980_2440)">
                  <path
                    d="M103.238 183.846C95.4274 191.657 82.7641 191.657 74.9536 183.846L49.4977 158.39C41.6872 150.58 41.6872 137.917 49.4977 130.106L62.9328 116.671L116.673 170.411L103.238 183.846Z"
                    fill="#F76721"
                  />
                  <circle
                    cx="41.0117"
                    cy="192.333"
                    r="20"
                    transform="rotate(-135 41.0117 192.333)"
                    fill="#F76721"
                  />
                </g>
              </svg>
            </div> */}
            <div className="client_login_logo">
                  <img src={AppLogo} alt="" />
            </div>
          </div>
          <div className="client_login_content">
            <div className="client_content_login_box">
              <h2>Reset your password</h2>
              {componentStatus && componentStatus.status === "OK" && (
                <p className="text-success">{componentStatus.message}</p>
              )}
              {componentStatus && componentStatus.status === "error" && (
                <p className="text-danger">{componentStatus.message}</p>
              )}
              {componentStatus && componentStatus.status === "processing" && (
                <p className="text-warning">{componentStatus.message}</p>
              )}
              <div className="client_login_content_form_box">
                <label>{constant.password}</label>
                <input
                  type="password"
                  value={password}
                  placeholder={constant.password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="client_login_content_form_box">
                <label>{constant.confirm_password}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder={constant.confirm_password}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="submit_btn_box">
                <input
                  type="submit"
                  className="cl_save_btn"
                  value={constant.save}
                  onClick={submitHandler}
                />
                <Link to="/" className="cl_save_btn">
                  {constant.cancel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
