import React, { useState } from "react";
import Axios from "axios";
import { apiRoutes, routes } from "../common/constant";
import { BASEURL, ENDPOINTURL } from "../common/endpoints";
import "./document.css";
function UploadDocuments({ closeModal, addLinkToChat }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);
    formData.append("source", "Documents");
    formData.append("meetingId", localStorage.getItem("meeting_id"));
    try {
      const response = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.document_upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      console.log("File uploaded successfully:", response.data);
      addLinkToChat(response.data.url);
      closeModal(false);
      // Add any success handling logic here
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
      closeModal(false);
      // Add error handling logic here
    }
  };

  return (
    <div className="upload-container">
      <div className="header">
        <h3 className="title">Upload Documents</h3>
        <button onClick={() => closeModal(false)}>x</button>
      </div>
      <input className="document-input" type="text" placeholder="Enter title" />
      <div
        className="drop-zone"
        onClick={() => document.querySelector(".drop-zone__input").click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {!file && (
          <span className="drop-zone__prompt">
            Drop file here or click to upload
          </span>
        )}
        {file && (
          <div className="drop-zone__thumb" data-label={file.name}>
            {file.type.startsWith("image/") && (
              <img src={URL.createObjectURL(file)} alt="Thumbnail" />
            )}
            {!file.type.startsWith("image/") && <span>{file.name}</span>}
          </div>
        )}
        <input
          type="file"
          name="myFile"
          className="drop-zone__input"
          onChange={handleFileChange}
        />
      </div>

      <button className="copy-btn" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}

export default UploadDocuments;
