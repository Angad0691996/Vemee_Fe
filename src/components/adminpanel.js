import React, { useState, useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import { ENDPOINTURL } from "../components/common/endpoints";
import Axios from "axios";
import $ from "jquery";
import { Link, useNavigate } from "react-router-dom";
import { apiRoutes, constant, routes } from "./common/constant";

function Adminpanel(props) {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [response, setResponse] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  let formdata = "";
  let pdfdata = "";
  useEffect(() => {
    getAllStudents();
    //getAllTeachers()
  }, []);
  const navigate = useNavigate();
  const getAllStudents = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const studentsResponse = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.all_users}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (studentsResponse.status === 200) {
        setStudents(studentsResponse.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*const getAllTeachers = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const teachersData = await Axios.get(`${ENDPOINTURL}/user/getAllUsers/Teacher`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (teachersData.data.Status === "200") {
                setTeachers(teachersData.data.data);
            }
        } catch (error) {
            console.log(error)
        }

    }*/

  const getSearchUsers = async (value) => {
    try {
      if (!value) {
        getAllStudents();
        ////getAllTeachers()
      } else {
        const token = localStorage.getItem("auth_token");
        const data = await Axios.get(
          `${ENDPOINTURL}${apiRoutes.get_user_by_email}/${value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudents([]);
        setTeachers([]);

        //console.log(data.data);
        setSearchResults(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userDeleteHandler = async (userId) => {
    localStorage.setItem("deleteUser", userId);
    $(".custom-alert").removeClass("d-none");
    $(".custom-alert").addClass("show");
  };

  const editHandler = (user) => {
    let email = user.email;
    navigate(`${routes.edit_profile}?editprofile=true&email=${email}`);
  };

  useEffect(() => {
    if (response) {
      setTimeout(() => {
        setResponse("");
      }, 5000);
    }
  }, [response]);

  const excelFileHandler = (e) => {
    setResponse("checking file format...");
    formdata = new FormData();
    const file = e.target.files[0];
    formdata.append("excel", e.target.files[0]);
    console.log("Files", e.target.files[0]);
    if (
      e.target.files[0].type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setResponse("invalid file format!");
      $("#excel-form-reset").click();
    } else {
      setResponse("uploading excel...");
      excelUploadHander();
    }
  };
  const pdfFileHandler = (e) => {
    pdfdata = new FormData();
    const file = e.target.files[0];
    pdfdata.append("file", e.target.files[0]);
    console.log(pdfdata);

    if (e.target.files[0].type === "application/pdf") {
      setResponse("uploading pdf...");
      pdfUploadHandler();
    } else {
      alert("Invalid File Format! Please Upload .pdf File Only.");
    }
  };

  const excelUploadHander = async (e) => {
    e && e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      const data = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.excel_add}`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("My data -------------------", data);

      if (data.status === 200) {
        setResponse("Excel Uploaded Successfully");
        $("#excel-form-reset").click();
        formdata = "";
      }

      // console.log(data)
    } catch (error) {
      setResponse(error.message);
    }
  };
  const pdfUploadHandler = async (e) => {
    e && e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      const data = await Axios.post(
        `${ENDPOINTURL}${apiRoutes.terms_and_conditions_upload}`,
        pdfdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(pdfdata);

      console.log("My data -------------------", data);

      if (data.status === 200) {
        setResponse("pdf Uploaded Successfully");
        $("#pdf-form-reset").click();
        pdfdata = "";
      }

      // console.log(data)
    } catch (error) {
      setResponse(error.message);
    }
  };

  async function deleteUser(){
      try{
      const token = localStorage.getItem("auth_token");
      let userId = localStorage.getItem("deleteUser");
      const data = await Axios.get(
        `${ENDPOINTURL}${apiRoutes.user_delete}?id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.data === "Meeting Successfully Deleted !") {
        $(".custom-alert").removeClass("show");
        $(".custom-alert").addClass("d-none");
        getAllStudents();
      }
    }catch(e)
    {
      console.log("error",e); 
    }
  }

  return (
    <>
      <div className="custom-alert d-none">
        <div className="custom-alert-wrapper">
          <div className="custom-alert-content">
            <h3>
              <b>Delete User</b>
            </h3>
            <br />
            <p style={{ fontSize: "16px" }}>
              Deleted user cannot be restored. <br />
              Do you want to proceed with deletion?{" "}
            </p>
            <div className="custom-alert-button">
              <button
                className="btn blue_btn"
                // onClick={async () => {
                //   const token = localStorage.getItem("auth_token");
                //   let userId = localStorage.getItem("deleteUser");
                //   const data = await Axios.get(
                //     `${ENDPOINTURL}${apiRoutes.user_delete}?id=${userId}`,
                //     {
                //       headers: {
                //         Authorization: `Bearer ${token}`,
                //       },
                //     }
                //   );
                //   if (data.data === "Meeting Successfully Deleted !") {
                //     $(".custom-alert").removeClass("show");
                //     $(".custom-alert").addClass("d-none");
                //     getAllStudents();
                //   }
                // }}
                onClick= {deleteUser}
              >
                Confirm
              </button>
              <button
                className="btn gray_btn"
                onClick={() => $(".custom-alert").addClass("d-none")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <form onSubmit={excelUploadHander} className="d-none">
            <input
              type="file"
              id="excel-file-input"
              onChange={excelFileHandler}
            />
            <input type="submit" />
            <input type="reset" id="excel-form-reset" />
          </form>
          <button
            className="blue_btn"
            onClick={() => $("#excel-file-input").click()}
          >
            Upload Excel File
          </button>
          <form onSubmit={pdfUploadHandler} className="d-none">
            <input
              type="file"
              id="pdf-file-input"
              accept=".pdf"
              onChange={pdfFileHandler}
            />
            <input type="submit" />
            <input type="reset" id="pdf-form-reset" />
          </form>
          <button
            className="blue_btn"
            onClick={() => $("#pdf-file-input").click()}
          >
            Upload Terms & Conditions
          </button>
          <Link
            to="/signup"
            className="blue_btn"
            style={{ marginLeft: "20px" }}
          >
            Add New Member
          </Link>
          <span style={{ paddingLeft: "20px" }}>{response}</span>
        </div>
        <div className="right_meeting_box">
          <div className="search_box" style={{ margin: "20px 0" }}>
            <input
              type="text"
              value={searchData}
              placeholder="Search"
              onChange={(e) => {
                setSearchData(e.target.value);
                getSearchUsers(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <table className="table table-bordered table-striped table-light">
        <thead>
          <tr className="text-center">
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {students &&
            students.map((student, index) => (
              <tr className="text-center" key={index}>
                <td> {student.user_name} </td>
                <td> {student.email} </td>
                <td> {student.role} </td>
                <td>
                  <button
                    className="btn btn-info"
                    style={{ marginRight: "10px" }}
                    onClick={() => editHandler(student)}
                  >
                    <i className="fa fa-pencil-square-o"></i>
                  </button>
                  <button
                    className="btn btn-info"
                    style={{ marginLeft: "10px" }}
                    onClick={() => userDeleteHandler(student.id)}
                  >
                    <i className="fa fa-trash-o"></i>
                  </button>
                </td>
              </tr>
            ))}
          {searchResults &&
            searchResults.map((searchResult, index) => (
              <tr className="text-center" key={index}>
                <td> {searchResult.user_name} </td>
                <td> {searchResult.email} </td>
                <td> {searchResult.role} </td>
                <td>
                  <button
                    className="btn btn-info"
                    style={{ marginRight: "10px" }}
                    onClick={() => editHandler(searchResult)}
                  >
                    <i className="fa fa-pencil-square-o"></i>
                  </button>
                  <button
                    className="btn btn-info"
                    style={{ marginLeft: "10px" }}
                    onClick={() => userDeleteHandler(searchResult.id)}
                  >
                    <i className="fa fa-trash-o"></i>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default Adminpanel;
