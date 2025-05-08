import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { routes, apiRoutes } from "../common/constant";
import Axios from "axios";
import { ENDPOINTURL } from "../common/endpoints";
import Footer from "../common/footer";
import { jwtDecode } from "jwt-decode";

const GuestLogin = (props) => {
  const { roomName } = useParams();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("redirect_roomid", roomName);
  }, [roomName]);

  const processInitialName = (name) => {
    // return first name if one word or two letters two letters
    let nameArray = String(name).split(" ");
    if (nameArray.length > 1) {
      return nameArray[0].charAt(0) + nameArray[1].charAt(0);
    } else {
      return nameArray[0].charAt(0);
    }
  };

  const handleGuestLogin = async () => {
    console.log("cdjcmdicnsic");
    if (userName.length > 0 && userEmail.length > 0) {
      // generate dummy data
      let role = "Guest";
      let password = userName.trim().replace(" ", "") + Date.now();
      let conpassword = password;

      // TODO: CALL guest login API
      const signupResponse = await Axios.post(
        // `${ENDPOINTURL}/register/registerUser?action=addByAdmin`,
        `${ENDPOINTURL}${apiRoutes.guest_register}?action=addByAdmin`,
        {
          userName: userName.trim(),
          role: role,
          email: userEmail.trim(),
          password: password,
          // conpassword: conpassword,
        }
      );
      if (signupResponse.status === 200) {
        const loginResponse = await Axios.post(
          `${ENDPOINTURL}${apiRoutes.login}`,
          {
            email: userEmail.trim(),
            password: password,
          }
        );
        if (loginResponse.status == 200) {
          //Set email And auth_token
          localStorage.setItem("auth_token", loginResponse.data);
          localStorage.setItem("auth_token", loginResponse.data);
          let dcr_token = jwtDecode(loginResponse.data);
          console.log("decode token", dcr_token);
          localStorage.setItem("user_id", dcr_token.id);
          localStorage.setItem("user_name", dcr_token.user_name);
          localStorage.setItem("user_role", dcr_token.role);
          localStorage.setItem("user_email", dcr_token.email);
          localStorage.setItem(
            "initial_name",
            processInitialName(dcr_token.user_name)
          );
          if (dcr_token.url) {
            localStorage.setItem(
              "user_profile_image",
              dcr_token.url ? dcr_token.url : null
            );
          }
          window.location.href = `${routes.home}${roomName}`;
          // navigate(`${routes.home}${roomName}`);
        }
      }
      // // returns token, user_id, user_role, user_name
      // localStorage.setItem("auth_token", token);
      // localStorage.setItem("user_id", user_id);
      // localStorage.setItem("user_role", user_role);
      // localStorage.setItem("initial_name", generateInitalName(userName));
    }
  };

  return (
    <>
      <div className="guest_login">
        <h3 className="title">Enter username</h3>
        <input
          className="guest_name_input "
          type="text"
          value={userName}
          required
          placeholder="Enter username"
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          className="guest_name_input "
          type="email"
          value={userEmail}
          required
          placeholder="Enter email"
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <input
          type="submit"
          placeholder="Login"
          value="Join Meeting"
          id="ClientButton"
          className="guest_login_btn"
          onClick={handleGuestLogin}
        />
        <p>
          Already registered?{" "}
          <Link to={`${routes.home}?isRedirect=true&roomId=${roomName}`}>
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default GuestLogin;
