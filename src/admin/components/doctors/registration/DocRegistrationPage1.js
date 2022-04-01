import React, { useEffect, useState } from "react";
import Input from "../../../commons/Input";
import TextArea from "../../../commons/TextArea";
import KeyValueSelector from "../../../commons/KeyValueSelector";
import Select from "../../../commons/Select";
import { Row, Col, Form } from "react-bootstrap";
import { fetchApi } from "../../../../_utils/http-utils";
import toast from "react-hot-toast";
import Spinner from "../../../components/spinner/customSpinner";
import ProfilePictureColumn from "./profilePictureColumn";
import moment from "moment";
import MultiSelect from "../../../commons/MultiSelect/MultiSelect";
import InputWithDropdown from "../../../commons/InputWithDropdown";
import { getValidDate } from "../../../../_utils/utilities";

const DocRegistrationPage1 = (props) => {
  // Get state and language from server
  let unmounted = false;
  useEffect(() => {
    setTimeout( () => {
      if(!unmounted){
        getState();
        getLanguage();
      }
    },3000);    
    return () => {
      unmounted = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    firstName,
    lastName,
    mobile,
    email,
    birthDate,
    gender,
    city,
    state,
    language,
    addressLine1,
    addressLine2,
    description,
    setFirstName,
    setLastName,
    setMobile,
    experience,
    setExperience,
    setBirthDate,
    setEmail,
    setGender,
    setCity,

    setState,
    setAddressLine1,
    setAddressLine2,
    setDescription,
    setLanguageValue,
    setRelationType,
    setRelativeName,
    relationType,
    relativeName,
  } = props;

  const [dataState, setDataState] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  let [loader, setLoader] = useState(false);
  const [dataLanguage, setDataLanguage] = useState([]);
  const relationTypes = ["S/o", "W/o", "D/o"];

  let genderOptions = ["Male", "Female", "Other"];

  useEffect(() => {
    if (props.state && dataCity.length === 0) {
      const stateData = dataState.find((state) => state.value === props.state);
      if (stateData) {
        getCity(stateData.id);
      }
    }
    return () => {};
  }, [dataState]); // eslint-disable-line react-hooks/exhaustive-deps

  const getStateValue = (value) => {
    if (value) {
      const selectedState = dataState.find((state) => state.value === value);
      return selectedState ? `${selectedState.id}|${selectedState.value}` : "";
    } else {
      return "";
    }
  };

  const getCityValue = (value) => {
    if (value) {
      const selectedCity = dataCity.find((city) => city.value === value);
      return selectedCity ? `${selectedCity.id}|${selectedCity.value}` : "";
    } else {
      return "";
    }
  };

  const setIdAndState = (value) => {
    const stateInfo = value.split("|");
    getCity(stateInfo[0]);
    setState(stateInfo[1]);
    stateInfo[1] === "Select state" && setCity("Select city");
  };

  const setCityValue = (value, id) => {
    const cityInfo = value.split("|");
    setCity(cityInfo[1]);
  };

  // Get city from server
  function getCity(id) {
    setLoader(true);
      fetchApi({
        url: "v1/city",
        method: "POST",
        body: { countryId: 101, stateId: id },
      })
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.map((info) => {
            return { value: info.name, id: info.id };
          });
          setLoader(false);
          setDataCity(data);
        } else {
          setLoader(false);
          toast.error(response.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        setLoader(false);
        toast.error(error.response.message, { appearance: "error" });
      });
  }

  // Get state from server
  function getState() {
      fetchApi({
        url: "v1/state",
        method: "POST",
        body: { countryId: 101 },
      })
      .then((response) => {
        if (response.status === 200) {
          let data = response.data?.map((info) => {
            return { value: info.name, id: info.id };
          });
          setDataState(data);
        } else {
          toast.error(response.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        toast.error(error.response.message, { appearance: "error" });
      });
  }

  // Get language from server
  function getLanguage() {
    fetchApi({ url: "v1/languages", method: "GET" })
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.map((info) => {
            return { value: info.name, id: info._id, name: info.name };
          });
          setDataLanguage(data);
        } else {
          toast.error(response.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        toast.error(error.message, { appearance: "error" });
      });
  }

  return (
    <div className="registration-page-1-container">
      <Row>
        <Col lg="3">
          <ProfilePictureColumn setImage={props.setImage} />
        </Col>
        <Col lg="8">
          <Row>          
            <Col className="registration-page-1-column" md>
              <Row>
                <Col md>
                  <Input
                    label="First Name"
                    type="text"
                    placeholder="eg John"
                    maxLength="20"
                    value={firstName}
                    onChange={setFirstName}
                  />
                </Col>
                <Col md>
                  <Input
                    label="Last Name"
                    type="text"
                    placeholder="eg Doe"
                    maxLength="20"
                    value={lastName}
                    onChange={setLastName}
                  />
                </Col>
              </Row>
            </Col>
            <Col className="registration-page-1-column" md>
              <InputWithDropdown
                type="text"
                placeholder="Enter Name"
                id="relativeName"
                label="Relative Name"
                maxLength="20"
                value={relativeName}
                selectedValue={relationType}
                onChange={setRelativeName}
                options={relationTypes}
                optionChange={setRelationType}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Input
                label="Mobile Number"
                type="number"
                value={mobile}
                pattern="[0-9]*"
                onChange={(value) => {
                  setMobile(value.replace(/\D/, "").slice(0, 10));
                }}
              />
            </Col>
            <Col>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={setEmail}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Date of Birth</Form.Label>
              <br />              
              <Form.Control
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(getValidDate(e.target.value))}
                min={moment(new Date())
                  .subtract(100, "years")
                  .format("YYYY-MM-DD")}
                max={moment(new Date()).format("YYYY-MM-DD")}
              />
            </Col>
            <Col>
              <Select
                label="Gender"
                defaultValue="Select Gender"
                id="gender"
                value={gender}
                options={genderOptions}
                handleSelect={setGender}
              />
            </Col>
          </Row>
          <Row className="form-wizard-text-area">
            <Col>
              <TextArea
                label="Profile Description"
                type="textarea"
                row="3"
                value={description}
                placeholder="Write here"
                onChange={setDescription}
                noPadding="true"
              />
            </Col>
          </Row>
          
          <Row>
            <Col>
              <br/>
              <Input
                type="text"
                placeholder="Enter address"
                id="addressLine1"
                label="Address Line 1"
                value={addressLine1}
                onChange={setAddressLine1}
              />
            </Col>
            <Col>
              <br/>
              <Input
                type="text"
                placeholder="Enter address (optional)"
                id="addressLine2"
                label="Address Line 2"
                value={addressLine2}
                onChange={setAddressLine2}
              />
            </Col>
          </Row>
          <Row className="g-2">
            <Col md>
              <Input
                disabled={true}
                type="text"
                placeholder="India"
                id="country"
                label="Country"
                readOnly={true}
              />
            </Col>
            <Col md>
              <Row className="g-2">
                <Col md>
                  <KeyValueSelector
                    value={getStateValue(state)}
                    label="State"
                    defaultValue="Select state"
                    id="state"
                    options={dataState}
                    handleSelect={setIdAndState}
                  />
                </Col>
                <Col md style={{ position: "relative" }}>
                  {loader && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 6,
                        top: "60px",
                        left: "60px",
                      }}
                    >
                      <Spinner showLoader={loader} width={40} height={40} />
                    </div>
                  )}
                  <KeyValueSelector
                    value={getCityValue(city)}
                    label="City"
                    defaultValue="Select city"
                    id="city"
                    options={dataCity}
                    handleSelect={setCityValue}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="g-2">
            <Col md>
              <MultiSelect
                className="languageRegistration"                
                label="Language"
                selected={language}
                options={dataLanguage}
                handleChange={setLanguageValue}
              />
            </Col>

            <Col md>
              <Input
                type="text"
                placeholder="Enter Your Experience"
                id="experienceField"
                label="Experience"
                value={experience}
                pattern="[0-9]*"
                onChange={(value) => {
                  setExperience(value.replace(/\D/, "").slice(0, 2));
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>     
    </div>
  );
};
export default DocRegistrationPage1;
