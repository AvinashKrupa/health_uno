import React from "react";
import config from "config";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/header/index";
import Dashboard from "./components/dashboard";
import Users from "./components/users";
import Logs from "./components/logs";
import Notification from "./components/Notification";
import Appointments from "./components/appointments";
import Specialities from "./components/specialities";
import Sliders from "./components/sliders";
import Categories from "./components/categories";
import Languages from "./components/languages";
import Departments from "./components/departments";
import Qualifications from "./components/qualifications";
import Doctors from "./components/doctors";
import DoctorRegistration from "./components/doctors/registration/MultiStepFormRegistration";
import Patients from "./components/patients";
import Chat from "./components/chat";
import Reviews from "./components/reviews";
import Transaction from "./components/transaction";
import Settings from "./components/settings";
import InvoiceReport from "./components/invoicereport";
import Invoice from "./components/invoicereport/invoice";
import ProductList from "./components/productlist";
import PharmacyList from "./components/pharmacylist";
import Blog from "./components/Blog/blog";
import BlogDetails from "./components/Blog/blogdetails";
import AddBlog from "./components/Blog/addblog";
import EditBlog from "./components/Blog/editblog";
import PendingBlog from "./components/Blog/pendingblog";
import Profile from "./components/profile";
import Login from "./components/login";
import Register from "./components/register";
import ForgotPassword from "./components/forgotpassword";
import Lockscreen from "./components/lockscreen";
import Error from "./components/error404";
import ErrorPage from "./components/error500";
import BasicInput from "./components/forms/baiscinput";
import FormInput from "./components/forminput";
import FormHorizontal from "./components/formhorizontal";
import FormMask from "./components/formask";
import FormValidation from "./components/formvalidation";
import BlankPage from "./components/blankpage";
import Components from "./components/component";
import VersionSettings from "./components/versionsettings";
import SlotBooking from "./components/SlotBooking";
import PrivateRoute from "./HOC/privateRoute";
import CkEditor from "./components/CkEditor";
import RevenuePage from "./components/Revenue";
import CouponScreen from "./components/coupon";
import Registration from "./components/Registration";
import TopConsultants from "./components/TopConsultants"
import DoctorDetails from "./components/doctorDetails";
import PatientSlotBooking from "./components/PatientSlotBooking";
import PatientBookingSummary from "./components/PatientBookingSummary";
import Video from "./components/video";

const AppUniversal = function (props) {
  return (
    <Router basename={`${config.publicPath}`}>
      <div className="main-wrapper">
        <Route render={(props) => <Header {...props} />} />
        <Switch>
          <Route path="/" exact component={Login} />
          <PrivateRoute path="/dashboard" exact component={Dashboard} />
          <PrivateRoute path="/admin" exact component={Dashboard} />
          <PrivateRoute path="/logs" exact component={Logs} />
          <PrivateRoute path="/users" exact component={Users} />
          <PrivateRoute path="/notification" exact component={Notification} />
          <PrivateRoute
            path="/appointment-list"
            exact
            component={Appointments}
          />
          {/* <PrivateRoute path="/revenue" exact component={RevenuePage} /> */}
          <PrivateRoute
            path="/slotBooking/:doctor_id/:appoinment_id"
            exact
            component={SlotBooking}
          />
          <PrivateRoute path="/specialities" exact component={Specialities} />
          <PrivateRoute path="/sliders" exact component={Sliders} />
          <PrivateRoute path="/categories" exact component={Categories} />
          <PrivateRoute path="/languages" exact component={Languages} />
          <PrivateRoute path="/coupon" exact component={CouponScreen} />
          <PrivateRoute path="/departments" exact component={Departments} />
          <PrivateRoute
            path="/qualifications"
            exact
            component={Qualifications}
          />
          <PrivateRoute path="/doctor-list/:page" exact component={Doctors} />
          <PrivateRoute path="/doctor-registration" exact component={DoctorRegistration} />
          <PrivateRoute path="/patient-list/:page" exact component={Patients} />
          <PrivateRoute path="/patient/topConsultants" exact component={TopConsultants} />
          <PrivateRoute path="/patient-registration" exact component={Registration} />
          <PrivateRoute exact path='/patient/doctorDetails/:doctor_id' component={DoctorDetails}/>
          <PrivateRoute exact path='/patient/slotBooking/:doctor_id' component={PatientSlotBooking}/>
          <PrivateRoute exact path='/patient/bookingSummary/:doctor_id' component={PatientBookingSummary}/>

          <PrivateRoute path="/chat" exact component={Chat} />
          <PrivateRoute path="/reviews" exact component={Reviews} />
          <PrivateRoute
            path="/profile/:user_id/:type"
            exact
            component={Profile}
          />
          <PrivateRoute
            path="/transactions-list"
            exact
            component={Transaction}
          />
          <PrivateRoute path="/settings" exact component={Settings} />
          <PrivateRoute
            path="/invoice-report"
            exact
            component={InvoiceReport}
          />
          <Route path="/blog" exact component={Blog} />
          <Route path="/blog-details" exact component={BlogDetails} />
          <Route path="/add-blog" exact component={AddBlog} />
          <Route path="/edit-blog" exact component={EditBlog} />
          <Route path="/pending-blog" exact component={PendingBlog} />
          <Route path="/product-list" exact component={ProductList} />
          <Route path="/pharmacy-list" exact component={PharmacyList} />
          <Route path="/invoice" exact component={Invoice} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/forgotPassword" exact component={ForgotPassword} />
          <Route path="/lockscreen" exact component={Lockscreen} />
          <Route path="/500" exact component={ErrorPage} />
          <Route path="/blank-page" exact component={BlankPage} />
          <Route path="/components" exact component={Components} />
          <Route path="/versionsettings" exact component={VersionSettings} />
          <Route path="/basic-input" exact component={BasicInput} />
          <Route path="/form-input-group" exact component={FormInput} />
          <Route path="/form-horizontal" exact component={FormHorizontal} />
          <Route path="/form-mask" exact component={FormMask} />
          <Route path="/form-validation" exact component={FormValidation} />
          <Route path="/about-us" exact component={CkEditor} />
          <Route path="/videos" exact component={Video} />
          <Route path="*" exact component={Error} />
        </Switch>
      </div>
    </Router>
  );
};

export default AppUniversal;
