import React from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import { switchLanguage } from "./constant";
// function switchLanguage(lang) {
//   return () => {
//     localStorage.setItem("lang", lang);
//     // window.location.reload();
//   };
// }
function DropdownComponent(props) {
  let items = props.items;
  return (
    <>
      <div className="popBar">
        <ul>
          <li key="EN">
            <button onClick={() => switchLanguage("EN")}>English</button>
          </li>

          <li key="JAP">
            <button onClick={() => switchLanguage("JAP")}>Japanese</button>
          </li>
        </ul>
      </div>
      <div
        className=""
        style={{
          position: "absolute",
          right: "0px",
          width: "180px",
          top: "42px",
          background: "white",
          zIndex: 9,
          borderRadius: "5px",
          left: "-170px",
          boxShadow: "10px 10px 20px 0px rgba(0,0,0,0.25)",
        }}
      >
        {items &&
          items.map((item, index) =>
            item.link ? (
              <Link
                to={item.link}
                state={item.link == "/" ? "logout" : ""}
                style={{
                  verticalAlign: "center",
                  color: "#000000",
                  padding: "1rem 1.4rem",
                  background: "#fff!important",
                }}
                className="dropdown-item"
                id={item.name}
                key={index}
              >
                {item.name}
              </Link>
            ) : (
              <button
                onClick={() => {
                  console.log("button was clicked");
                  $(".popBar").toggleClass("popOpenNav");
                }}
                style={{
                  verticalAlign: "center",
                  color: "#000000",
                  padding: "1rem 1.4rem",
                  background: "#fff!important",
                }}
                className="dropdown-item"
              >
                {item.name}
              </button>
            )
          )}
      </div>
    </>
  );
}

export default DropdownComponent;
