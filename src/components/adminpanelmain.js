import React, { useState, useEffect } from "react";

import Adminmeetings from "./Adminmeetings";
import Adminpanel from "./adminpanel";
import Sidebar from "./common/sidebar";
import $ from "jquery";
import NewNavbar from "./common/newNavbar";
import "../css/mdb.min.css";
import { useNavigate } from "react-router-dom";

function Adminpanelmain(props) {
  const [handler, setHandler] = useState("users");
  const navigate = useNavigate();
  function contenHandler(value) {
    setHandler(value);
  }

  useEffect(() => {
    let role = localStorage.getItem("user_role");

    if (role !== "ADMIN") {
      navigate("/");
    }
  }, []);

  return (
    <div className="classroom_list flex-row">
      <NewNavbar />
      <div className="cl_attendance_list">
        <div className="wrapper">
          <div className="row">
            <div className="col-12">
              <div className="left_cl_menu_call">
                <Sidebar contenHandler={contenHandler} />
              </div>
            </div>
            <div className="right_sec_cl_menu_call">
              <div className="col-12">
                {handler && handler === "users" ? (
                  <Adminpanel history={props.history} />
                ) : (
                  <Adminmeetings history={props.history} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adminpanelmain;
