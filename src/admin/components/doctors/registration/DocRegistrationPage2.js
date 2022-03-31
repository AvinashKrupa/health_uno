import React,{ useEffect, useState } from "react";
import { Row, Col, Image, Form } from "react-bootstrap";
import Input from "../../../commons/Input";
import { fetchApi } from "../../../../_utils/http-utils";
import KeyValueSelector from "../../../commons/KeyValueSelector";
import moment from "moment";
import Dropzone from 'react-dropzone';
import upload from "../../../assets/images/uploadIcon.svg";
import toast from "react-hot-toast";
import { getValidDate } from "../../../../_utils/utilities";

const DocRegistrationPage2 = (props) => {
     
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [medicalCertError, setMedicalCertError] = useState(false);
  const [signatureError, setSignatureError] = useState(false);  
  const [medicalCertFiles, setMedicalCertFiles] = useState([]);
  const [signatureFiles, setSignatureFiles] = useState([]);

  const {councilRegistrationNo, department, specialization, qualification, dateOfRegistration, dateOfRenewal,fee, medicalCertificate, signature, setDepartment,
    setCouncilRegistrationNo, setDateOfRegistration, setDateOfRenewal,
    setSpecialization, setQualification, setFee, setMedicalCertificate, setSignature} = props;

  let unmounted = false;
  // Get departments, specializations and qualifications from server
  useEffect( () => {
    if(!unmounted){
      getDepartment();
      getSpecialization();
      getQualification();
    
      if(medicalCertificate){
        setMedicalCertFiles([medicalCertificate])      
      }
      if(signature){
        if(signature?.path!==undefined){
          setSignatureFiles([signature]) 
        }
      }
    }
    return () => {
      unmounted = true;
    };
  },[]) // eslint-disable-line react-hooks/exhaustive-deps


  const setDepartmentValue = (value) => {
    const departmentInfo = value.split('|');
    setDepartment(departmentInfo[0]);
  }

  const getDepartmentValue = value => {
    if(value){
      const selectedDepartment = departments.find(department => department.id === value)
      return selectedDepartment ? `${selectedDepartment.id}|${selectedDepartment.value}` : ''
    }else{
      return ''
    }
  }

  const getSpecializationValue = value => {
    if(value){
      const selectedSpecialization = specializations.find(specialization => specialization.id === value)
      return selectedSpecialization ? `${selectedSpecialization.id}|${selectedSpecialization.value}` : ''
    }else{
      return ''
    }
  }

  const getQualificationValue = value => {
    if(value){
      const selectedQualification = qualifications.find(qualification => qualification.id === value)
      return selectedQualification ? `${selectedQualification.id}|${selectedQualification.value}` : ''
    }else{
      return ''
    }
  }

  const setSpecializationValue = (value) => {
    const specializationInfo = value.split('|');
    setSpecialization(specializationInfo[0]);
  }

  const setQualificationValue = (value) => {
    const specializationInfo = value.split('|');
    setQualification(specializationInfo[0]);
  }

  // Get department from server
  function getDepartment() {
    fetchApi({
      url: "v1/departments",
      method: "GET"
    })
      .then(response => {
        if (response.status === 200) {
          let data = response.data.map((info) => {
            return {value: info.title, id: info._id};
          });
          setDepartments(data);
        } else {
          toast.error(response.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        toast.error(error.response.message, { appearance: 'error' });
      });
  }

  function getSpecialization() {
    fetchApi({
      url: "v1/specialities",
      method: "GET"
    })
      .then(response => {
        if (response.status === 200) {
          let data = response.data.map((info) => {
            return {value: info.title, id: info._id};
          });
          setSpecializations(data);
        } else {
          toast.error(response.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        toast.error(error.response.message, { appearance: 'error' });
      });
  }

  function getQualification() {
    fetchApi({
      url: "v1/qualifications",
      method: "GET"
    })
      .then(response => {
        if (response.status === 200) {
          let data = response.data.map((info) => {
            return {value: info.name, id: info._id};
          });
          setQualifications(data);
        } else {
          toast.error(response.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        toast.error(error.response.message, { appearance: 'error' });
      });
  }
  
  return (
    <>
      <Row>
        <Col lg='1'></Col>
        <Col lg='10'>
          <Row>
            <Col>
              <KeyValueSelector
                label="Department"
                id="department"
                value={getDepartmentValue(department)}
                defaultValue="Select department"
                options={departments}
                handleSelect={setDepartmentValue}
              />
            </Col>
            <Col>
              <Input
                label="Medical Council Registration Number"
                placeholder="Type your registration Number"
                type="text"
                value={councilRegistrationNo}                
                onChange={(value) => {
                  setCouncilRegistrationNo(value.slice(0, 24));
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col> 
                <Form.Label>Date of Registration</Form.Label>
                <br />
                <Form.Control type="date" value={dateOfRegistration} onChange={(e) => setDateOfRegistration(getValidDate(e.target.value))}
                              min={moment(new Date()).subtract(100, 'years').format('YYYY-MM-DD')}
                              max={moment(new Date()).format('YYYY-MM-DD')}/>
            </Col>
            <Col> 
                <Form.Label>Date of Renewal</Form.Label>
                <br />
                <Form.Control type="date" value={dateOfRenewal} onChange={(e) => setDateOfRenewal(getValidDate(e.target.value))}
                              min={moment(new Date()).format('YYYY-MM-DD')}
                              max={moment(new Date()).add(100, 'years').format('YYYY-MM-DD')}
                />
            </Col>
          </Row>

          <Row>
            <Col>
              <br/>
              <KeyValueSelector
                  label="Specialization"
                  id="specialization"
                  value={getSpecializationValue(specialization)}
                  defaultValue="Select specialization"
                  options={specializations}
                  handleSelect={setSpecializationValue}
                />
            </Col>
            <Col>
              <br/>
                <KeyValueSelector
                  label="Highest Qualification"
                  value={getQualificationValue(qualification)}
                  id="qualification"
                  defaultValue="Select qualification"
                  options={qualifications}
                  handleSelect={setQualificationValue}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Input
                label="Consulting Fee"
                placeholder="120 per hour"
                type="text"
                value={fee}               
                pattern="[0-9]*"
                onChange={(value) => {
                  setFee(value.replace(/\D/, "").slice(0, 5));
                }}
              />
            </Col>
            <Col>
            </Col>
          </Row>
          <Row>          
            <Col> 
              <label className="form-label">Upload Medical Certificate</label>
              <div className="upload-file" style={{marginTop: 0}}>
                {medicalCertFiles.map((fileName) => (
                  <div className="uploaded" key={fileName.name}>
                    <div>
                      <p className="file-name" key={fileName}>
                        {fileName.name}{" "}
                      </p>
                      <p>{moment(fileName.lastModifiedDate).format("ll")}</p>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => {
                      setMedicalCertFiles([]);
                      setMedicalCertificate("");
                      }}>
                      Delete
                    </button>
                  </div>
                ))}                
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    setMedicalCertError(false);
                    setMedicalCertFiles(
                      acceptedFiles.map((file) =>
                        Object.assign(file, {
                          preview: URL.createObjectURL(file),
                        })
                      )
                    );
                    setMedicalCertificate(acceptedFiles[0]);
                  }}
                  accept="image/jpeg,.pdf"
                  maxFiles={1}
                  onDropRejected={(fileRejections, event) => {
                    setMedicalCertError(true);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      {medicalCertFiles.length === 0 && (
                        <div className="upload-text">
                          <Image src={upload} alt="upload" />
                          <p>Drag and Drop file here</p>
                        </div>
                      )}
                    </div>
                  )}
                </Dropzone>
              </div>
              <div className="note">
                Please upload report in pdf or jpeg format
              </div>
              {medicalCertError && (
                <div className="note" style={{ color: "red", fontSize: "18px" }}>
                  Please upload single report file
                </div>
              )}
            </Col>
            <Col>
              <div> 
                <label className="form-label">Add Signature</label>
              </div>
              <>
                  <div className="upload-file" style={{marginTop: 0}}>
                    {signatureFiles.map((fileName) => (
                      <div className="uploaded" key={fileName.name}>
                        <div>
                          <p className="file-name" key={fileName}>
                            {fileName.name}{" "}
                          </p>
                          <p>{moment(fileName.lastModifiedDate).format("ll")}</p>
                        </div>
                        <button className="btn btn-danger btn-sm" onClick={() => {
                          setSignatureFiles([]);
                          setSignature("");
                          }}>
                          Delete
                        </button>
                      </div>
                    ))}
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        setSignatureError(false);
                        setSignatureFiles(
                          acceptedFiles.map((file) =>
                            Object.assign(file, {
                              preview: URL.createObjectURL(file),
                            })
                          )
                        );
                        setSignature(acceptedFiles[0])
                      }}
                      accept="image/jpeg"
                      maxFiles={1}
                      onDropRejected={(fileRejections, event) => {
                        setSignatureError(true);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          {signatureFiles.length === 0 && (
                            <div className="upload-text">
                              <Image src={upload} alt="upload" />
                              <p>Drag and Drop file here</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Dropzone>
                  </div>
                  <div className="note">
                    Please upload report in jpeg format
                  </div>
                  {signatureError && (
                    <div className="note" style={{ color: "red", fontSize: "18px" }}>
                      Please upload single signature file
                    </div>
                  )} 
                </>             
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default DocRegistrationPage2;
