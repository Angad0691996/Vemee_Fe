export const BASEURL = "https://d3jqjgd381hleu.cloudfront.net/";

// export const ENDPOINTURL = "https://vmee-spring.awiki.org/wvmee";
export const ENDPOINTURL =
  process.env.NODE_ENV === "production"
    ? "https://vemeeapi.samsanlabs.com"
    : "http://localhost:3001";
// export const ENDPOINTURL = "http://localhost:9092";

// export const ENDPOINTURL = "http://15.207.88.125:9090/";

// export const ENDPOINSOCKETURL = "https://devmeet.alibiz.net";
//export const ENDPOINSOCKETURL = "https://vmee-socket.awiki.org/";
export const ENDPOINSOCKETURL = "https://vemeeapi.samsanlabs.com/";

// export const ENDPOINSOCKETURL =
//   process.env.NODE_ENV === "production"
//     ? "https://vmee-socket.awiki.org/"
// : "http://localhost:5000";
export const REDIRECTBASEPATH = "user/meeting/MeetingUI/";

export const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "wss://vemeeapi.samsanlabs.com/"
    : "ws://localhost:3001/";
export const FACE_AUTH_URL =
  process.env.NODE_ENV === "production"
    ? "https://api-vemee.awiki.org/face"
    : "http://localhost:5000";
