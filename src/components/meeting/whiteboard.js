import React, { useEffect, useState } from "react";
import { BASEURL, ENDPOINSOCKETURL } from "../common/endpoints";
import Close from "../../images/close.svg";
function Whiteboard(props) {
  const [role, setRole] = useState("");

  useEffect(() => {
    // let role = localStorage.getItem("user_role");
    let role = localStorage.getItem("meeting_role");
    if (role) {
      setRole(role);
    } else {
    }
  }, []);

  return (
    <>
      {props.roomName && (
        <iframe
          width="100%"
          height="100%"
          src={`${ENDPOINSOCKETURL}?roomname=${props.roomName}&r=${
            // role == "Teacher" ? "mod24wvmee" : "att24wvmee"
            role == "Organiser" ? "mod24wvmee" : "att24wvmee"
          }`}
        ></iframe>
      )}

      <button
        className="whiteboard-btn gray_btn"
        onClick={() => props.whiteboardhandler(false)}
      >
        <img src={Close} alt="close" />
      </button>
    </>
  );
}

export default Whiteboard;
