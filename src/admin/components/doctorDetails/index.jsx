import React, { useEffect, useState } from "react";
import { Row, Col, Image, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import SimilarDoctorsCard from "../SimilarDoctorsCard";
import ColorCard from "../ColorCard";
// import {API, post} from '../../../api/config/APIController';
// import { useToasts } from 'react-toast-notifications';
import CustomButton from "../../commons/Button";
// import  back_icon  from "../../../constants/DoctorImages";
import back_icon from "../../assets/images/icon-back.svg";

import { convert24hto12h } from "../../../_utils/utilities";
import SidebarNav from "../sidebar";
import { fetchApi } from "../../../_utils/http-utils";
import toast from "react-hot-toast";
import "./doctorDetails.scss"


const DoctorDetails = (props) => {
  useEffect(() => {
    getDoctorDetails();
    return () => {};
  }, [props.match.params.doctor_id]);

  // const { addToast } = useToasts();
  const [doctorDetails, setDoctorDetails] = useState();

  function getDoctorDetails() {
    // post(API.GET_DOCTOR_DETAILS, {doctor_id: props.match.params.doctor_id, include_similar: true })
    fetchApi({
      url: "v1/doctor/getDoctorDetails",
      method: "POST",
      body: { doctor_id: props.match.params.doctor_id, include_similar: true },
    })
    .then(response => {
        if (response.status === 200) {
        setDoctorDetails(response.data);
        } else {
        toast.error(response.data.message, { appearance: 'error' });
        }
    })
    .catch(error => {
        toast.error(error.response.data.message, { appearance: 'error' });
    });
  }

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Row>
            <Col
              lg="11"
              md="11"
              sm="11"
              xs="10"
              className="screen-768 doctor-detail-container"
            >
              {doctorDetails && (
                <>
                  <Row
                    style={{ marginBottom: "50px" }}
                    className="doctor-back-navigation"
                  >
                    {/* <Row className='back-navigation'>
                            <Link to='/patient/topConsultants'><i class="fas fa-arrow-left"></i><span>Doctor Details</span></Link>
                        </Row> */}
                    <button className="back-nav-container back-navigation">
                      <img
                        src={back_icon}
                        alt="back_icon-img"
                        className="back-button"
                        onClick={() =>
                          props.history.push(`/patient/topConsultants`)
                        }
                      ></img>
                      <span>Doctor Details</span>
                    </button>
                  </Row>
                  <Row>
                    <Col
                      lg={
                        window.screen.availWidth > 768 &&
                        window.screen.availWidth < 1300
                          ? "12"
                          : "12"
                      }
                      className="doctor-detail-card-main-container"
                    >
                      <Row>
                        <Col lg="3">
                          <Image
                            src={doctorDetails.dp}
                            className="doctor-detail-image"
                            style={{
                              height: "150px",
                              width: "150px",
                              borderRadius: "78px",
                              border: "1px solid #000000",
                            }}
                          />
                        </Col>
                        <Col
                          lg="9"
                          className="doctor-detail-text-container"
                          style={{ paddingRight: "70px" }}
                        >
                          <Row>
                            <Col>
                              <span
                                className="doctor_details_h3"
                                style={{ marginBottom: "6px" }}
                              >
                                {`Dr ${doctorDetails.first_name} ${doctorDetails.last_name}`}
                              </span>
                              <Row>
                                <span className="doctor_details_color_h5">
                                  {doctorDetails.specialities.map((s) => {
                                    return (
                                      <span
                                        key={s}
                                        style={{
                                          padding: "5px",
                                          marginRight: "10px",
                                        }}
                                        className="doctor-card-specialization-container"
                                      >
                                        {s}
                                      </span>
                                    );
                                  })}
                                </span>
                              </Row>
                            </Col>
                            <Col>
                              <Link
                                to={`/patient/slotBooking/${props.match.params.doctor_id}`}
                              >
                                <CustomButton
                                  className="doctor_details_button"
                                  text={"Book Appointment"}
                                ></CustomButton>
                              </Link>
                            </Col>
                          </Row>
                          <Row
                            style={{ marginTop: "20px", marginBottom: "48px" }}
                            className="color-card-container"
                          >
                            {doctorDetails && (
                              <ColorCard
                                fee={doctorDetails.fee}
                                exp={doctorDetails.exp}
                                total_consultations={
                                  doctorDetails.total_consultations
                                }
                              />
                            )}
                          </Row>
                          <Row>
                            <span
                              className="doctor_details_h4"
                              style={{ marginBottom: "10px" }}
                            >
                              Language
                            </span>
                          </Row>
                          <Row>
                            <span
                              className="doctor_details_h5"
                              style={{
                                marginBottom: "32px",
                                color: "rgba(143, 143, 143, 1)",
                              }}
                            >
                              {doctorDetails.language.map(function (
                                item,
                                index
                              ) {
                                return (
                                  <span>{(index ? ", " : "") + item}</span> ||
                                  "No Language Found"
                                );
                              })}
                            </span>
                          </Row>
                          <Row>
                            <span
                              className="doctor_details_h4"
                              style={{ marginBottom: "10px" }}
                            >
                              About Doctor
                            </span>
                          </Row>
                          <Row>
                            <span
                              className="doctor_details_h5"
                              style={{
                                marginBottom: "32px",
                                color: "rgba(143, 143, 143, 1)",
                              }}
                            >
                              {doctorDetails.desc}
                            </span>
                          </Row>
                          <Row>
                            <span
                              className="doctor_details_h4"
                              style={{ marginBottom: "10px" }}
                            >
                              Working Time
                            </span>
                          </Row>
                          <Row>
                            <span
                              className="doctor_details_h5 width_75"
                              style={{
                                fontSize: "14px",
                                marginBottom: "143px",
                                color: "rgba(143, 143, 143, 1)",
                              }}
                            >
                              <Table striped bordered hover>
                                <thead>
                                  <tr>
                                    <th>Days</th>
                                    <th>Morning</th>
                                    <th>Evening</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.keys(doctorDetails.day).map((key) => {
                                    return (
                                      <tr>
                                        <td style={{ fontWeight: "500" }}>
                                          {key.charAt(0).toUpperCase() +
                                            key.slice(1)}
                                        </td>
                                        {doctorDetails.day[key] ? (
                                          <>
                                            <td>{`${convert24hto12h(
                                              doctorDetails.shift.shift1.start
                                            )}  -
                                                                            ${convert24hto12h(
                                                                              doctorDetails
                                                                                .shift
                                                                                .shift1
                                                                                .end
                                                                            )}`}</td>
                                            <td>{`${convert24hto12h(
                                              doctorDetails.shift.shift2.start
                                            )}  -
                                                                            ${convert24hto12h(
                                                                              doctorDetails
                                                                                .shift
                                                                                .shift2
                                                                                .end
                                                                            )}`}</td>
                                          </>
                                        ) : (
                                          <>
                                            <td>N/A - N/A</td>{" "}
                                            <td>N/A - N/A</td>{" "}
                                          </>
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </span>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      lg={
                        window.screen.availWidth > 800 &&
                        window.screen.availWidth < 1100
                          ? "12"
                          : "4"
                      }
                    >
                      {!!doctorDetails.similar_doctors.length && (
                        <Row
                          className="doctor_details-doctor-card-remove-pad"
                          style={{
                            justifyContent:
                              window.screen.availWidth > 800 &&
                              window.screen.availWidth < 1100
                                ? "space-around"
                                : "",
                          }}
                        >
                          <span
                            className="doctor_details_h3"
                            style={{ marginBottom: "17px" }}
                          >
                            Similar Doctors
                          </span>
                          {doctorDetails.similar_doctors.map((doctor) => {
                            return (
                              <SimilarDoctorsCard
                                id={doctor._id}
                                image={doctor.dp}
                                name={`${doctor.first_name} ${doctor.last_name}`}
                                fees="2000"
                                details={`${doctor.city}, ${doctor.country} | ${doctor.exp} Y Exp`}
                                qualifications={doctor.specialities}
                                language={doctor.language}
                              />
                            );
                          })}
                        </Row>
                      )}
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
export default DoctorDetails;
