// import "./RegistrationPage1";
import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import patientIcon from "../../assets/images/patient-form-icon.png";
import RegistrationComponent from "../RegistrationComponent/index";
import { Link } from "react-router-dom";
import UploadImage from "../../commons/Upload";
import { useState } from "react";
import SidebarNav from "../sidebar";
import "./registration.scss";


const Registration = () => {
  const [image, setImage] = useState();
  const handleImage = (file) => {
    setImage(file);
  };

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* <Container className="registration-container"> */}
            <Row className="heading">
              <Link to="/patient-list/1">
                <i className="fas fa-arrow-left"></i>
                <span>Complete Profile</span>
              </Link>
            </Row>
            <Row>
              <Col className="col-md-3">
                <Image
                  style={{
                    display: "block",
                    margin: "0 auto",
                    position: "relative",
                    height: "210px",
                    width: "210px",
                  }}
                  src={image ? image : patientIcon}
                  alt="Icon"
                ></Image>
                <UploadImage getImage={handleImage} />

                <div className="text-center">
                  <p>Upload your profile picture.</p>
                  <p style={{ fontSize: "10px" }}>Dimensions 120px x 120px</p>
                </div>
              </Col>
              <Col className="col-md-8">
                <RegistrationComponent image={image} />
              </Col>
            </Row>
          {/* </Container> */}
        </div>
      </div>
    </>
  );
};
export default Registration;
