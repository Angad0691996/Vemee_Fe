import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import Logo from "../../images/logo.svg";
import VoiceActive from "../../images/voice-active.svg";
import kick from "../../images/kick-participant.svg";
import pin from "../../images/pin.svg";
import muteUser from "../../images/mute-participant.svg";
let initialName = localStorage.getItem("initial_name");
let userProfileImage = localStorage.getItem("user_profile_image");
let userRole = localStorage.getItem("user_role");
let userName = localStorage.getItem("user_name");

const UserVideoBox = ({
  role,
  localUserId,
  participant,
  participantName,
  idx,
  parentRef,
  focusedUser,
  setFocusedUser,
  handleMuteParticipant,
  kickParticipant,
  pinToMe,
  track,
}) => {
  let userBoxRef = useRef(null);
  const getMeetingRole = () => {
    return localStorage.getItem("meeting_role");
  };
  const isOrganiser = () => {
    return getMeetingRole() == "Organiser";
  };
  const toggleFullScreenAttendee = (participant) => {
    const removeAllFocus = () => {
      for (let child of parentRef.current.children) {
        child.classList.remove("focus");
      }
    };
    document.querySelector(".cl_user_list").classList.add("focus-view");
    setFocusedUser((oldFocusedUser) => {
      if (oldFocusedUser == participant) {
        userBoxRef.current.parentNode.classList.remove("focus");
        return null;
      } else {
        removeAllFocus();
        userBoxRef.current.parentNode.classList.add("focus");
        return participant;
      }
    });
  };

  if (role == "MODERATOR") {
    return (
      <>
        <div
          ref={userBoxRef}
          // onClick={() => toggleFullScreenAttendee(participant)}
          className="cl_user_list_box_videos"
        >
          <div className="cl_user_list_box_control">
            <div className={`audio-img-${participant} mute_icon`}>
              {/* <svg
              className={`audio-img-${participant}`}
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className={`audio-status-${participant}`}
                d="M9.89962 9.83939L7.43401 7.21961C7.64144 6.67252 7.74743 6.08824 7.74618 5.49868V4.46791C7.75476 4.38776 7.73371 4.30719 7.68745 4.24311C7.64119 4.17903 7.57331 4.1364 7.49803 4.12415H7.24988C7.17454 4.13628 7.10659 4.17887 7.06031 4.24298C7.01402 4.3071 6.99303 4.38773 7.00173 4.46791V5.49868C7.00166 5.86533 6.94499 6.2295 6.83398 6.57678L6.41908 6.13629C6.47179 5.92828 6.49947 5.71404 6.50146 5.49868V2.06206C6.50146 0.92353 5.82997 0 5.00115 0C4.17233 0 3.50084 0.92353 3.50084 2.06206V3.03659L0.710644 0.0725381C0.686564 0.0454728 0.656577 0.0250719 0.623317 0.0131537C0.590056 0.00123562 0.554539 -0.00185039 0.51989 0.0041707C0.48524 0.0101918 0.452517 0.0251566 0.424596 0.0477064C0.396675 0.0702562 0.374412 0.0997308 0.35976 0.133527L0.0530455 0.675974C0.0118838 0.751084 -0.00603723 0.83794 0.0017957 0.924388C0.00962862 1.01084 0.0428248 1.09253 0.0967223 1.15798L9.29066 10.9253C9.31471 10.9524 9.34466 10.9729 9.3779 10.9848C9.41113 10.9968 9.44663 10.9999 9.48128 10.9939C9.51592 10.988 9.54866 10.9731 9.5766 10.9506C9.60454 10.9281 9.62684 10.8987 9.64154 10.8649L9.94876 10.3225C9.98942 10.2466 10.0066 10.1592 9.99774 10.0725C9.98892 9.98585 9.9546 9.90428 9.89962 9.83939V9.83939ZM6.24587 9.96608H5.37089V9.2407C5.55256 9.20442 5.72927 9.14437 5.89697 9.06197L5.11331 8.23043C5.00768 8.24329 4.90109 8.24469 4.79518 8.23463C3.92269 8.11794 3.25219 7.18966 3.05814 6.04745L2.2452 5.18332V5.33048C2.2452 7.25536 3.24475 8.97209 4.62049 9.23281V9.96871H3.74551C3.67018 9.98084 3.60222 10.0234 3.55594 10.0875C3.50966 10.1517 3.48866 10.2323 3.49736 10.3125V10.6562C3.48879 10.7364 3.50983 10.817 3.55609 10.881C3.60235 10.9451 3.67023 10.9877 3.74551 11H6.24587C6.32115 10.9877 6.38903 10.9451 6.43529 10.881C6.48155 10.817 6.5026 10.7364 6.49402 10.6562V10.3125C6.50341 10.2319 6.48273 10.1506 6.43639 10.0859C6.39004 10.0212 6.32169 9.97821 6.24587 9.96608V9.96608Z"
                style={{ fill: "lightgreen" }}
              />
            </svg> */}
              <img src={VoiceActive} />
            </div>
            <h4>{participantName[1]}</h4>
            <button className="kick-btn" onClick={() => pinToMe(participant)}>
              <img src={pin} />
            </button>
          </div>
          <span className="profile initialName" id={`${participant}img`}>
            <p>{participantName[2]}</p>
          </span>
          <span
            className={
              participantName[3] !== (null || "null")
                ? `profile`
                : `profile d-none`
            }
            id={`${participant}profile_image`}
          >
            <img src={participantName[3]} alt={`Profile of ${participant}`} />
          </span>
          <video
            autoPlay="1"
            className={`${participant}video video`}
            id={`video${participant}`}
          />
          <img className="brand-logo" src={Logo} alt="Wvmee" />
        </div>
      </>
    );
  } else if (role == "ATTENDEE") {
    return (
      <>
        <div
          ref={userBoxRef}
          className="cl_user_list_box_videos"
          // onClick={() => {
          //   toggleFullScreenAttendee(participant);
          // }}
        >
          <div className="cl_user_list_box_control">
            <div className={`audio-img-${participant} mute_icon`}>
              {/* <a
              href="#."
              className="handle_remote_participant_audio"
              data-participantid={localUserId}
            >
              <svg
                className={`audio-img-${participant}`}
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className={`audio-status-${participant}`}
                  d="M9.89962 9.83939L7.43401 7.21961C7.64144 6.67252 7.74743 6.08824 7.74618 5.49868V4.46791C7.75476 4.38776 7.73371 4.30719 7.68745 4.24311C7.64119 4.17903 7.57331 4.1364 7.49803 4.12415H7.24988C7.17454 4.13628 7.10659 4.17887 7.06031 4.24298C7.01402 4.3071 6.99303 4.38773 7.00173 4.46791V5.49868C7.00166 5.86533 6.94499 6.2295 6.83398 6.57678L6.41908 6.13629C6.47179 5.92828 6.49947 5.71404 6.50146 5.49868V2.06206C6.50146 0.92353 5.82997 0 5.00115 0C4.17233 0 3.50084 0.92353 3.50084 2.06206V3.03659L0.710644 0.0725381C0.686564 0.0454728 0.656577 0.0250719 0.623317 0.0131537C0.590056 0.00123562 0.554539 -0.00185039 0.51989 0.0041707C0.48524 0.0101918 0.452517 0.0251566 0.424596 0.0477064C0.396675 0.0702562 0.374412 0.0997308 0.35976 0.133527L0.0530455 0.675974C0.0118838 0.751084 -0.00603723 0.83794 0.0017957 0.924388C0.00962862 1.01084 0.0428248 1.09253 0.0967223 1.15798L9.29066 10.9253C9.31471 10.9524 9.34466 10.9729 9.3779 10.9848C9.41113 10.9968 9.44663 10.9999 9.48128 10.9939C9.51592 10.988 9.54866 10.9731 9.5766 10.9506C9.60454 10.9281 9.62684 10.8987 9.64154 10.8649L9.94876 10.3225C9.98942 10.2466 10.0066 10.1592 9.99774 10.0725C9.98892 9.98585 9.9546 9.90428 9.89962 9.83939V9.83939ZM6.24587 9.96608H5.37089V9.2407C5.55256 9.20442 5.72927 9.14437 5.89697 9.06197L5.11331 8.23043C5.00768 8.24329 4.90109 8.24469 4.79518 8.23463C3.92269 8.11794 3.25219 7.18966 3.05814 6.04745L2.2452 5.18332V5.33048C2.2452 7.25536 3.24475 8.97209 4.62049 9.23281V9.96871H3.74551C3.67018 9.98084 3.60222 10.0234 3.55594 10.0875C3.50966 10.1517 3.48866 10.2323 3.49736 10.3125V10.6562C3.48879 10.7364 3.50983 10.817 3.55609 10.881C3.60235 10.9451 3.67023 10.9877 3.74551 11H6.24587C6.32115 10.9877 6.38903 10.9451 6.43529 10.881C6.48155 10.817 6.5026 10.7364 6.49402 10.6562V10.3125C6.50341 10.2319 6.48273 10.1506 6.43639 10.0859C6.39004 10.0212 6.32169 9.97821 6.24587 9.96608V9.96608Z"
                  style={{ fill: "lightgreen" }}
                />
              </svg>
            </a> */}
              <img src={VoiceActive} />
            </div>
            <h4>
              {participantName[1]}
              {participantName[5] == "Organiser"
                ? "(Organiser)"
                : participantName[5] == "Attendee"
                ? "(Attendee)"
                : ""}
            </h4>
            <button className="kick-btn" onClick={() => pinToMe(participant)}>
              <img src={pin} />
            </button>
            {isOrganiser() && (
              <>
                <button
                  onClick={() => kickParticipant(participant)}
                  className="kick-btn"
                >
                  <img src={kick} />
                </button>
                <button
                  onClick={() => handleMuteParticipant(participant)}
                  className="mute-btn"
                >
                  <img src={muteUser} />
                </button>
              </>
            )}
          </div>
          <span className=" profile initialName" id={`${participant}img`}>
            <p>{participantName[2]}</p>
          </span>
          <span
            className={
              participantName[3] !== (null || "null")
                ? `profile`
                : `profile d-none`
            }
            id={`${participant}profile_image`}
          >
            <img src={participantName[3]} />
          </span>
          <video
            autoPlay="1"
            className={`${participant}video video`}
            id={`video${participant}`}
          />
          <img className="brand-logo" src={Logo} alt="Wvmee" />
        </div>
      </>
    );
  } else if (role == "PRESENTEE") {
    return (
      <>
        <div
          className="cl_user_list_box_videos"
          ref={userBoxRef}
          onClick={() => {
            pinToMe(participant);
          }}
        >
          <div className="cl_user_list_box_control">
            <div className={`audio-img-${participant} mute_icon`}>
              {/* <svg
              className={`audio-img-${participant}`}
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.89962 9.83939L7.43401 7.21961C7.64144 6.67252 7.74743 6.08824 7.74618 5.49868V4.46791C7.75476 4.38776 7.73371 4.30719 7.68745 4.24311C7.64119 4.17903 7.57331 4.1364 7.49803 4.12415H7.24988C7.17454 4.13628 7.10659 4.17887 7.06031 4.24298C7.01402 4.3071 6.99303 4.38773 7.00173 4.46791V5.49868C7.00166 5.86533 6.94499 6.2295 6.83398 6.57678L6.41908 6.13629C6.47179 5.92828 6.49947 5.71404 6.50146 5.49868V2.06206C6.50146 0.92353 5.82997 0 5.00115 0C4.17233 0 3.50084 0.92353 3.50084 2.06206V3.03659L0.710644 0.0725381C0.686564 0.0454728 0.656577 0.0250719 0.623317 0.0131537C0.590056 0.00123562 0.554539 -0.00185039 0.51989 0.0041707C0.48524 0.0101918 0.452517 0.0251566 0.424596 0.0477064C0.396675 0.0702562 0.374412 0.0997308 0.35976 0.133527L0.0530455 0.675974C0.0118838 0.751084 -0.00603723 0.83794 0.0017957 0.924388C0.00962862 1.01084 0.0428248 1.09253 0.0967223 1.15798L9.29066 10.9253C9.31471 10.9524 9.34466 10.9729 9.3779 10.9848C9.41113 10.9968 9.44663 10.9999 9.48128 10.9939C9.51592 10.988 9.54866 10.9731 9.5766 10.9506C9.60454 10.9281 9.62684 10.8987 9.64154 10.8649L9.94876 10.3225C9.98942 10.2466 10.0066 10.1592 9.99774 10.0725C9.98892 9.98585 9.9546 9.90428 9.89962 9.83939V9.83939ZM6.24587 9.96608H5.37089V9.2407C5.55256 9.20442 5.72927 9.14437 5.89697 9.06197L5.11331 8.23043C5.00768 8.24329 4.90109 8.24469 4.79518 8.23463C3.92269 8.11794 3.25219 7.18966 3.05814 6.04745L2.2452 5.18332V5.33048C2.2452 7.25536 3.24475 8.97209 4.62049 9.23281V9.96871H3.74551C3.67018 9.98084 3.60222 10.0234 3.55594 10.0875C3.50966 10.1517 3.48866 10.2323 3.49736 10.3125V10.6562C3.48879 10.7364 3.50983 10.817 3.55609 10.881C3.60235 10.9451 3.67023 10.9877 3.74551 11H6.24587C6.32115 10.9877 6.38903 10.9451 6.43529 10.881C6.48155 10.817 6.5026 10.7364 6.49402 10.6562V10.3125C6.50341 10.2319 6.48273 10.1506 6.43639 10.0859C6.39004 10.0212 6.32169 9.97821 6.24587 9.96608V9.96608Z"
                style={{ fill: "lightgreen" }}
              />
            </svg> */}
              <img src={VoiceActive} />
            </div>
            <h4>{participantName[1]}</h4>
          </div>
          <span className="profile initialName" id={`${participant}img`}>
            <p>{participantName[2]}</p>
          </span>
          <span
            className={
              participantName[3] !== (null || "null")
                ? `profile`
                : `profile d-none`
            }
            id={`${participant}profile_image`}
          >
            <img src={participantName[3]} />
          </span>
          <video
            autoPlay="1"
            className={`${participant}video video`}
            id={`video${participant}`}
          />
          <img className="brand-logo" src={Logo} alt="Wvmee" />
        </div>
      </>
    );
  } else if (role == "DUMMY_TILE") {
    return (
      <div className="cl_user_list_box">
        <div className="cl_user_list_box_videos">
          <span className="circle_remote_participant d-none"></span>
          <span className="circle_remote_participant d-none"></span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="cl_user_list_box">
        <div className="cl_user_list_box_videos">
          <span className="circle_remote_participant d-none"></span>
          <h5>Hello</h5>
          <span className="circle_remote_participant d-none"></span>
        </div>
      </div>
    );
  }
};

export default UserVideoBox;
