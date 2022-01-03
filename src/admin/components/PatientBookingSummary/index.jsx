import React from "react";
import { Col, Container, Form, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ColorCard from "../ColorCard";
import { useEffect, useState } from "react";
// import {API, post} from '../../../api/config/APIController';
// import {useToasts} from 'react-toast-notifications';
import CustomButton from "../../commons/Button";
import Input from "../../commons/Input";
import TextArea from "../../commons/TextArea";
import patientSlotBookingStore from "../patientSlotBookingStore";
import moment from "moment";
// import {getData} from "../../../storage/LocalStorage/LocalAsyncStorage";
import { isEmpty } from "../../../_utils/Validators";
import back_icon from "../../assets/images/icon-back.svg";
import discount from "../../assets/images/discount.svg";
import SidebarNav from "../sidebar";
import { fetchApi } from "../../../_utils/http-utils";
import toast from "react-hot-toast";
import Selector from "../../commons/Select";
import "./PatientBookingSummary.scss";

const PatientBookingSummary = (props) => {
  useEffect(() => {
    getDoctorDetails();
    return () => {};
  }, [props.match.params.doctor_id]);

  //   const { addToast } = useToasts();
  const [showLoader, setShowLoader] = useState(false);
  const [showCouponLoader, setShowCouponLoader] = useState(false);
  const date = patientSlotBookingStore((state) => state.date);
  const startTime = patientSlotBookingStore((state) => state.startTime);
  const [doctorDetails, setDoctorDetails] = useState("");
  const [couponDetails, setCouponDetails] = useState("");
  const [complaints, setComplaints] = useState("");
  const [purpose, setPurpose] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [payment, setPayment] = useState("");
  const Patient_ID = localStorage.getItem('SELECTED_PATIENT_ID')
  let transactionID = "";
  const slot_id = patientSlotBookingStore((state) => state.slot_id);

  const paymentOption = ["cash", "online"];

  useEffect(() => {
    if (!startTime) {
      props.history.goBack();
      return;
    }
  }, []);

  function getDoctorDetails() {
    // post(API.GETDOCTORDETAILS, {
    //   doctor_id: props.match.params.doctor_id,
    //   include_similar: true,
    // })
    fetchApi({
      url: "v1/doctor/getDoctorDetails",
      method: "POST",
      body: {
        doctor_id: props.match.params.doctor_id,
        include_similar: true,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setDoctorDetails(response.data);
        } else {
          toast.error(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message, { appearance: "error" });
      });
  }

  function applyCoupon(e) {
    e.preventDefault();
    setShowCouponLoader(true);
    // post(API.APPLY_COUPON, { code: couponCode, fee: doctorDetails.fee })
    fetchApi({
      url: "v1/coupon/checkDiscount",
      method: "POST",
      body: { code: couponCode, fee: doctorDetails.fee, patient_id: Patient_ID },
    })
      .then((response) => {
        if (response.status === 200) {
          setCouponDetails(response);
          setShowCouponLoader(false);
          toast.success(response.message, { appearance: "success" });
        } else {
          toast.error(response.message, { appearance: "error" });
          setShowCouponLoader(false);
        }
      })
      .catch((error) => {
        console.log('error :>> ', error);
        // toast.error(error.message, { appearance: "error" });
        setShowCouponLoader(false);
      });
  }

  function removeCoupon() {
    setCouponDetails("");
    setCouponCode('')
    toast.success("Coupon removed successfully", { appearance: "success" });
  }

  const setCoupon = (value) => {
    setCouponCode(value.toUpperCase());
  };

  function validation() {
    if (isEmpty(purpose)) {
      toast.error("Please enter the purpose", { appearance: "error" });
      return false;
    } else if (isEmpty(slot_id)) {
      toast.error("Please go back and select the time", {
        appearance: "error",
      });
      return false;
    } else if (isEmpty(complaints)) {
      toast.error("Please enter the complaints", {
        appearance: "error",
      });
      return false;
    } else if (isEmpty(date)) {
      toast.error("Please go back and select the date", {
        appearance: "error",
      });
      return false;
    } else if (isEmpty(startTime)) {
      toast.error("Please go back and select the time", {
        appearance: "error",
      });
      return false;
    } else if (isEmpty(payment)) {
      toast.error("Please select payment method", {
        appearance: "error",
      });
      return false;
    } else {
      return true;
    }
  }

  function bookSlots() {
    const isValid = validation();
    
    if (isValid) {
      let params = {
        reason: purpose,
        doctor_id: props.match.params.doctor_id,
        patient_id: Patient_ID,
        complaints: complaints,
        slot_id: slot_id,
        slot: startTime,
        date: moment(date).format("YYYY-MM-DD"),
        code: couponCode,
        payment_mode: payment,
      };
      setShowLoader(true);
      //   post(API.BOOKAPPOINTMENT, params)
      fetchApi({
        url: "v1/admin/bookAppointment",
        method: "POST",
        body: params,
      }).then((response) => {
        if (response.status === 200) {
          toast.success(response.message)
          setTimeout(() => {
            props.history.push("/patient-list");
          }, 1000);
        }
      }).catch((error) => {
        console.log('error :>> ', error);
        // toast.error(error.message, { appearance: "error" });
        setShowLoader(false);
      });;
    }
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  function processRazorPayment(transaction_id, transactionID) {
    loadScript("https://checkout.razorpay.com/v1/checkout.js").then((res) => {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    });

    const userInfo1 = JSON.parse(getData("userInfo"));
    const options = {
      description: "Video Consultation",
      image:
        "https://healthuno-dev-public.s3.ap-south-1.amazonaws.com/images/logo/patient.png",
      currency: "INR",
      key: "rzp_test_B0gfA1BIUTnr5L", // Your api key
      amount: `${doctorDetails.fee}00`,
      name: `${doctorDetails.first_name} ${doctorDetails.last_name}`,
      prefill: {
        email: `${userInfo1.email}`,
        contact: `${userInfo1.mobile_number}`,
        name: `${userInfo1.first_name} ${doctorDetails.last_name}`,
      },
      theme: { color: "#28A3DA" },
      redirect: false,
      order_id: transaction_id,
      modal: {
        escape: false,
        ondismiss: function () {
          setShowLoader(false);
        },
      },
      handler: async function (response) {
        const data = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          transaction_id: transactionID,
        };

        // post(API.CONFIRMPAYENT, data)
        fetchApi({
          url: "v1/transaction/confirmPayment",
          method: "POST",
          body: data,
        })
          .then((result) => {
            if (result.status === 200) {
              setShowLoader(false);
              toast.success("Slot is successfully booked", {
                appearance: "success",
              });
              props.history.push("/patient-list");
            } else {
              setShowLoader(false);
              toast.error(result.data.message, { appearance: "error" });
            }
          })
          .catch((error) => {
            setShowLoader(false);
            toast.error(error.response.data.message, { appearance: "error" });
          });
      },
    };
  }

  let amount;
  if (couponDetails?.data?.final_amount === 0) {
    amount = "0";
  } else if (couponDetails?.data?.final_amount) {
    amount = couponDetails?.data?.final_amount;
  } else {
    amount = doctorDetails.fee;
  }
  const discountAmount = couponDetails?.data?.discount
    ? couponDetails?.data?.discount
    : "0";
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
                                    <Link to={`/patient/slotBooking/${props.match.params.doctor_id}`}><i class="fas fa-arrow-left"></i><span>Summary</span></Link>
                                </Row> */}
                    <button className="back-nav-container back-navigation">
                      <img
                        src={back_icon}
                        className="back-button"
                        alt="back_icon-img"
                        onClick={() => props.history.goBack()}
                      ></img>
                      <span>Summary</span>
                    </button>
                  </Row>
                  <Row>
                    <Col>
                      <Row>
                        <Col
                          lg={
                            window.screen.availWidth > 768 &&
                            window.screen.availWidth < 1300
                              ? "3"
                              : "3"
                          }
                          md="12"
                        >
                          <Image
                            src={doctorDetails.dp}
                            className="doctor-detail-image"
                            style={{
                              height: "150px",
                              width: "150px",
                              borderRadius: "78px",
                              border: "1px solid #000000",
                              marginLeft: "20px",
                            }}
                          />
                          <Col
                            className="slot-summary-doc-details"
                            style={{ padding: "20px" }}
                          >
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
                            <Row>
                              <span
                                className="doctor-card-doctor-details"
                                style={{ marginTop: "10px" }}
                              >
                                {`${doctorDetails.city}, ${doctorDetails.country} | ${doctorDetails.exp} Y Exp`}
                              </span>
                            </Row>
                          </Col>
                        </Col>
                        <Col lg="7" md="12" style={{ marginLeft: "20px" }}>
                          <Row>
                            <Col
                              lg={
                                window.screen.availWidth > 768 &&
                                window.screen.availWidth < 1300
                                  ? "12"
                                  : "12"
                              }
                              md="10"
                            >
                              <Row
                                style={{
                                  marginTop: "20px",
                                  marginBottom: "48px",
                                }}
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
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      <Row className="patient-booking-detail">
                        <Col lg="4" style={{ paddingTop: "5px" }}>
                          <Container>
                            <Input
                              type="text"
                              placeholder="Purpose"
                              id="purpose"
                              label="Purpose"
                              value={purpose}
                              onChange={setPurpose}
                            />
                          </Container>
                        </Col>
                        <Col
                          lg={
                            window.screen.availWidth > 768 &&
                            window.screen.availWidth < 1300
                              ? "4"
                              : "4"
                          }
                        >
                          <TextArea
                            label="Complaints"
                            type="textarea"
                            row="3"
                            value={complaints}
                            placeholder="Describe your complaints here"
                            onChange={setComplaints}
                          />
                        </Col>

                        <Col
                          lg={
                            window.screen.availWidth > 768 &&
                            window.screen.availWidth < 1300
                              ? "4"
                              : "4"
                          }
                        >
                          <Container className="slot-appointment-container">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span className="textarea-label">
                                {" "}
                                Appointment Details
                              </span>
                              <Link
                                to={`/patient/slotBooking/${props.match.params.doctor_id}`}
                              >
                                <i className="fas fa-pen"></i>
                              </Link>
                            </div>
                            <div className="slot-appointment-detail">
                              <div>Date : {date}</div>
                              <div>Time : {startTime}</div>
                              <div>Type : Video</div>
                            </div>
                          </Container>
                        </Col>
                      </Row>
                      <div className="payment-section">
                        <div className="slot-appointment-container">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className="coupon-summary">
                              Appointment Summary
                            </span>
                          </div>
                          <div className="coupon-detail-container">
                            <div className="coupon-detail">
                              <div className="coupon-detail-item">
                                Consultation Fees :
                              </div>
                              <div className="coupon-detail-item-last">
                                ₹{doctorDetails.fee}
                              </div>
                            </div>
                            {!!couponDetails && (
                              <div className="coupon-detail">
                                <div className="coupon-detail-item">
                                  Discount :
                                </div>
                                <div className="coupon-detail-item-last">
                                  ₹{discountAmount}
                                </div>
                              </div>
                            )}
                            <div className="coupon-detail">
                              <div className="coupon-detail-item">
                                Total Amount :
                              </div>
                              <div className="coupon-detail-item-last">
                                ₹{amount}
                              </div>
                            </div>
                            {!couponDetails && (
                              <div>
                                <Form.Label>
                                  <div style={{ marginTop: "10px" }}>
                                    <img
                                      src={discount}
                                      className="coupon-image"
                                      alt="discount-img"
                                    />
                                    <span className="coupon-detail-item">
                                      Coupon Code
                                    </span>
                                  </div>
                                </Form.Label>
                                <div className="coupon-label-container">
                                  <div>
                                    <Input
                                      type="text"
                                      placeholder="Apply coupon here"
                                      id="coupon"
                                      label=""
                                      value={couponCode}
                                      onChange={setCoupon}
                                    />
                                    <div className="remove-coupon">
                                      {showCouponLoader && (
                                        <CustomButton
                                          type="submit"
                                          className={"login-btn"}
                                          disabled
                                          onClick={(e) => applyCoupon(e)}
                                          importantStyle={{
                                            backgroundColor: "#e2e9e9",
                                          }}
                                          showLoader={showCouponLoader}
                                        ></CustomButton>
                                      )}
                                      {!showCouponLoader && (
                                        <CustomButton
                                          type="submit"
                                          className={"login-btn"}
                                          onClick={(e) => applyCoupon(e)}
                                          text={"Apply"}
                                        ></CustomButton>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {couponDetails && (
                              <>
                                <div>
                                  <Form.Label>
                                    <div style={{ marginTop: "10px" }}>
                                      <img
                                        src={discount}
                                        className="coupon-image"
                                        alt="discount-img"
                                      ></img>
                                      <span className="coupon-detail-item">
                                        Coupon Code
                                      </span>
                                    </div>
                                  </Form.Label>
                                  <div className="coupon-label-container">
                                    <Container>
                                      <Input
                                        disabled
                                        type="text"
                                        placeholder="Apply coupon here"
                                        id="coupon"
                                        label=""
                                        value={couponCode}
                                        onChange={setCouponCode}
                                      />
                                      <div className="remove-coupon">
                                        <div className="coupon-applied">
                                          Applied
                                        </div>
                                        <i
                                          className="fas fa-times-circle"
                                          style={{
                                            fontSize: "1.75em",
                                            color: "red",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => removeCoupon()}
                                        ></i>
                                      </div>
                                    </Container>
                                  </div>
                                </div>
                                <div className="coupon-description">
                                  {couponDetails.data.desc}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="slot-appointment-container">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className="coupon-summary">
                              Payment Method
                            </span>
                          </div>
                          <div className="coupon-detail-container">
                            <Col md>
                              <Selector
                                label="Select Payment Method"
                                defaultValue="Select Payment"
                                id="payement"
                                options={paymentOption}
                                handleSelect={setPayment}
                              />
                            </Col>
                          </div>
                        </div>
                      </div>

                      {/*    <div className='slot-appointment-detail'>
                                                    <div>Date : {date}</div>
                                                    <div>Time : {startTime}</div>
                                                    <div>Type : Video</div>
                                                </div>*/}
                    </Col>
                  </Row>
                </>
              )}
              <div style={{ textAlign: "center" }}>
                {showLoader && (
                  <CustomButton
                    className={"patient-order-booking-btn"}
                    disabled
                    onClick={bookSlots}
                    importantStyle={{ backgroundColor: "#e2e9e9" }}
                    showLoader={showLoader}
                  ></CustomButton>
                )}
                {!showLoader && (
                  <CustomButton
                    className={"patient-order-booking-btn"}
                    onClick={bookSlots}
                    text={amount === "0" ? "Book Appointment" : `Pay & Book`}
                  ></CustomButton>
                )}
              </div>
            </Col>
            <Col lg="1" md="1" />
          </Row>
        </div>
      </div>
    </>
  );
};
export default PatientBookingSummary;
