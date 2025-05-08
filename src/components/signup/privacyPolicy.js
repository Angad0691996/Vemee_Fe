import React, { useEffect, useState } from "react";
import { ENDPOINTURL } from "../../components/common/endpoints";
import Axios from "axios";
import { apiRoutes } from "../common/constant";
function PrivacyPolicy(props) {
  const [pdfUrl, setpdfUrl] = useState("");
  const getTnc = async () => {
    const meetingResponse = await Axios.get(
      `${ENDPOINTURL}${apiRoutes.getTnC}`
    );
    setpdfUrl(meetingResponse.data.url);
  };
  useEffect(() => {
    getTnc();
  }, []);

  return (
    <>
      <div className="policy-wrapper container" id="policy-page">
        <div>
          <div className="policy-pdf">
            {pdfUrl && <iframe src={pdfUrl} width="100%" title="description" />}
          </div>
          {/* <div className="text-center" style={{ marginTop: "20px" }}>
            <button
              className="blue_btn mr-1"
              onClick={() => props.setPolicy(false)}
            >
              Agree
            </button>
            <button
              className="gray_btn ml-1"
            >
              Deny
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default PrivacyPolicy;
