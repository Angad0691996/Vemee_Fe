import React from "react";
import $ from "jquery";

function Sidebar(props) {
  const listItem = {
    textAlign: "center",
    backgroundColor: "#EEEEEE",
    padding: "15px 0",
    cursor: "pointer",
  };

  return (
    <ul id="myTab" role="tablist" aria-orientation="vertical">
      <li
        id="users"
        className="active"
        onClick={() => {
          $("#users").addClass("active");
          $("#meeting").removeClass("active");
          props.contenHandler("users");
        }}
      >
        <a>Users</a>
        {/* <a className="nav-link active" id="User-tab" data-toggle="tab" href="#" role="tab" aria-controls="User" aria-selected="true" >User</a> */}
      </li>
      <li
        id="meeting"
        onClick={() => {
          $("#meeting").addClass("active");
          $("#users").removeClass("active");
          props.contenHandler("meetings");
        }}
      >
        <a> Meetings</a>
        {/* <a className="nav-link" id="Meetings-tab" data-toggle="tab" href="#" role="tab" aria-controls="Meetings" aria-selected="false" >Meetings</a> */}
      </li>
    </ul>
  );
}

export default Sidebar;
