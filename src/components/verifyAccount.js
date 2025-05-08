import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Logo from "../images/logo.svg";
import Axios from "axios";
import { ENDPOINTURL } from "./common/endpoints";
import ErrorComponent from "./errorPage/errorPopup";
import { useNavigate } from "react-router-dom";
import { apiRoutes } from "./common/constant";
// import { useLocation } from "react-router-dom";

function VerifyNewAccount(props) {
  // const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [errorText, setErrorText] = useState("");
  const [message, setMessage] = useState({
    value: "Please wait, verifying your account.",
    color: "text-warning",
  });

  //For Making Changes During User Action EntirePage
  useEffect(() => {
    try {
      const { email, token } = queryString.parse(window.location.search);
      if (!email || !token) {
        navigate("/");
      } else {
        setEmail(email);
        setToken(token);
      }

      if (token && email) {
        verifyUsersAccount();
      } else {
        setErrorText("Verification failed");
      }
    } catch (error) {
      setErrorText(error.message);
    }
  }, [token, email]);

  //For Verifing User Account
  const verifyUsersAccount = async () => {
    try {
      const { email, token } = queryString.parse(window.location.search);
      const data = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.verifyUser}?email=${email}&token=${token}`
      );
      if (data.status === 200) {
        setMessage({
          value: "Account Verified Successfully.",
          color: "text-success",
        });

        setTimeout(() => {
          navigate("/");
        }, [1000]);
      } else {
        setMessage({
          value: "Account Verification Failed.",
          color: "text-danger",
        });
      }
    } catch (error) {
      setErrorText(error.message);
    }
  };

  return (
    <>
      <div className="verify-account-wrapper">
        {email && (
          <div>
            <img src={Logo} className="mb-3" />
            <h4 className="mt-2">Hi {email}, </h4>
            <p className={`mt-4 f-16 ${message.color}`}>{message.value}</p>
          </div>
        )}
        {errorText && <ErrorComponent>{errorText}</ErrorComponent>}
      </div>
    </>
  );
}

export default VerifyNewAccount;
