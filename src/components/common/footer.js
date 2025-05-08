import React from "react";
import { constant } from "../common/constant";
import "../../css/new-style.css";
import LoginLogo from "../../images/company_logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="bottom-section">
        {/* <img src={LoginLogo} alt="Logo" /> */}
        <span>
          {constant.copy_right} &copy; {new Date().getFullYear()}{" "}
          {constant.company_name} | {constant.all_rights_reserved} |{" "}
          {constant.terms_and_conditions} | {constant.privacy_policy}{" "}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
