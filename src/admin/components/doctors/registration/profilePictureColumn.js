import React, { useState } from "react";
import doctor from "../../../assets/images/patient-form-icon.png";
import { Image, Container, Row, Col } from "react-bootstrap";
import ImageUpload from "../../../commons/Upload";


const ProfilePictureColumn = (props) => {
  const[ image, setImage ]= useState();
 
  const handleImage = (file)=> {
     setImage(file)
     props.setImage(file)
  }

  return (
    <Container>
      <Row>
        <Col></Col>
        <Col md={10}>
          <div className="profile-picture">
            <ImageUpload classname="upload-image" getImage={handleImage}/>
            <Image width="100%" src={image? image :doctor} className="profile-picture-image" />
          </div>
        </Col>    
        <Col></Col>   
      </Row>
      <Row>
        <Col className="text-center">
          <span className="profile-picture-text">
            Upload your profile picture
          </span>
          <br/>
          <small>
            Dimensions 120px X 120px
          </small>
        </Col>     
      </Row>
    </Container>
  );
};

export default ProfilePictureColumn;
