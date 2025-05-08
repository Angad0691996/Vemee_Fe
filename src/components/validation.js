const ValidateEmail = (email) => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    return { status: true };
  }
  return { status: false, error: "Please enter a valid email address." };
};

const ValidateUsername = (username) => {
  if (username.length >= 2) {
    return { status: true };
  } else {
    return { status: false, error: "Please enter a name." };
  }
};

const ValidatePassword = (password) => {
  if (password.length > 0) {
    return { status: true };
  } else {
    return { status: false, error: "Please enter a valid password." };
  }
};

const ValidateRole = (role) => {
  if (role.length > 0) {
    return { status: true };
  } else {
    return { status: false, error: "Please select a role." };
  }
};

const ValidateMeetingTitle = (MeetingTitle) => {
  if (MeetingTitle.length > 0) {
    return { status: true };
  } else {
    return { status: false, error: "Enter the meeting title." };
  }
};

const Validateinvites = (meetingInvites) => {
  if (meetingInvites > 0) {
    return { status: true };
  } else {
    return { status: false, error: "Add students." };
  }
};

export {
  ValidateEmail,
  ValidateUsername,
  ValidatePassword,
  ValidateRole,
  ValidateMeetingTitle,
  Validateinvites,
};
