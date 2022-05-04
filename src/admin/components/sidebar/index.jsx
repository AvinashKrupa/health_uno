import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import DashboardIcon from "../../assets/images/dashboard.svg";
import AppointmentsIcon from "../../assets/images/appointment.svg";
import CategoriesIcon from "../../assets/images/category.svg";
import DepartmentsIcon from "../../assets/images/department.svg";
import DoctorsIcon from "../../assets/images/doctor.svg";
import LanguagesIcon from "../../assets/images/language.svg";
import PatientsIcon from "../../assets/images/patient.svg";
import QualificationsIcon from "../../assets/images/qualification.svg";
import SlidersIcon from "../../assets/images/sliders.svg";
import SpecialitiesIcon from "../../assets/images/specialist.svg";
import UsersIcon from "../../assets/images/specialist.svg";
import { Scrollbars } from "react-custom-scrollbars";

class SidebarNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: null,
    };
  }

  handleShow(id) {
    this.setState({
      show: id,
    });
  }

  render() {
    const { location } = this.props;
    let pathname = location.pathname;

    return (
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className={pathname === "/admin" ? "active" : ""}>
                <Link to="/admin">
                  <img
                    src={DashboardIcon}
                    className="navigation_icon"
                    alt="dashboard"
                  />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li
                className={
                  pathname.includes("appointment-list") ? "active" : ""
                }
              >
                <Link to="/appointment-list">
                  <img
                    src={AppointmentsIcon}
                    className="navigation_icon"
                    alt="appoinments"
                  />
                  <span>Appointments</span>
                </Link>
              </li>
              <li className={pathname.includes("categories") ? "active" : ""}>
                <Link to="/categories">
                  <img
                    src={CategoriesIcon}
                    className="navigation_icon"
                    alt="categories"
                  />
                  <span>Categories</span>
                </Link>
              </li>
              <li className={pathname.includes("chat") ? "active" : ""}>
                <Link to="/chat">
                  <i className="fe fe-messanger navigation_icon" />
                  <span>Chat</span>
                </Link>
              </li>
              <li className={pathname.includes("departments") ? "active" : ""}>
                <Link to="/departments">
                  <img
                    src={DepartmentsIcon}
                    className="navigation_icon"
                    alt="Departments"
                  />
                  <span>Departments</span>
                </Link>
              </li>
              <li className={pathname.includes("doctor-list") ? "active" : ""}>
                <Link to="/doctor-list/1">
                  <img
                    src={DoctorsIcon}
                    className="navigation_icon"
                    alt="Doctors"
                  />
                  <span>Doctors</span>
                </Link>
              </li>
              <li className={pathname.includes("languages") ? "active" : ""}>
                <Link to="/languages">
                  <img
                    src={LanguagesIcon}
                    className="navigation_icon"
                    alt="Languages"
                  />
                  <span>Languages</span>
                </Link>
              </li>

              <li className={pathname.includes("coupon") ? "active" : ""}>
                <Link to="/coupon">
                  <i className="fe fe-money" /> <span>Coupon</span>
                </Link>
              </li>

              <li className={pathname.includes("patient-list") ? "active" : ""}>
                <Link to="/patient-list/1">
                  <img
                    src={PatientsIcon}
                    className="navigation_icon"
                    alt="Patients"
                  />
                  <span>Patients</span>
                </Link>
              </li>
              <li
                className={pathname.includes("qualifications") ? "active" : ""}
              >
                <Link to="/qualifications">
                  <img
                    src={QualificationsIcon}
                    className="navigation_icon"
                    alt="Qualifications"
                  />
                  <span>Qualifications</span>
                </Link>
              </li>
              <li className={pathname.includes("sliders") ? "active" : ""}>
                <Link to="/sliders">
                  <img
                    src={SlidersIcon}
                    className="navigation_icon"
                    alt="Sliders"
                  />
                  <span>Sliders</span>
                </Link>
              </li>
              <li className={pathname.includes("specialities") ? "active" : ""}>
                <Link to="/specialities">
                  <img
                    src={SpecialitiesIcon}
                    className="navigation_icon"
                    alt="Specialities"
                  />
                  <span>Specialities</span>
                </Link>
              </li>
              <li className={pathname.includes("users") ? "active" : ""}>
                <Link to="/users">
                  &nbsp;<i className="fe fe-user"></i> <span>Users</span>
                </Link>
              </li>
              <li className={pathname.includes("logs") ? "active" : ""}>               
                <Link to="/logs">
                  &nbsp;<i className="fe fe-clock"></i> <span>Logs</span>
                </Link>
              </li>
              <li className={pathname.includes("notification") ? "active" : ""}>               
                <Link to="/notification">
                  &nbsp;<i className="fe fe-bell"></i> <span>Notification</span>
                </Link>
              </li>
              {/* <li className={pathname.includes("revenue") ? "active" : ""}>
                <Link to="/revenue">
                  <i className="fe fe-money" /> <span>Revenue</span>
                </Link>
              </li> */}
              <li
                className={pathname.includes("versionsettings") ? "active" : ""}
              >
                <Link to="/versionsettings">
                  <i className="fas fa-cog" /> <span>Settings</span>
                </Link>
              </li>
              <li className={pathname.includes("about-us") ? "active" : ""}>
                <Link to="/about-us">
                  <i className="fe fe-question"></i> <span>About Us</span>
                </Link>
              </li>
              <li className={pathname.includes("videos") ? "active" : ""}>
                <Link to="/videos">
                  <i className="fe fe-camera"></i> <span>Videos</span>
                </Link>
              </li>
              {/*<li className={pathname.includes('reviews') ?"active" :""}> */}
              {/*  <Link to="/reviews"><i className="fe fe-star-o" /> <span>Reviews</span></Link>*/}
              {/*</li>*/}
              {/*<li className={pathname.includes('transactions-list') ?"active" :""}> */}
              {/*  <Link to="/transactions-list"><i className="fe fe-activity" /> <span>Transactions</span></Link>*/}
              {/*</li>*/}
              {/*<li className={pathname.includes('settings') ?"active" :""}> */}
              {/*  <Link to="/settings"><i className="fe fe-vector" /> <span>Settings</span></Link>*/}
              {/*</li>*/}
              {/*<li className="submenu">*/}
              {/*  <a href="#"><i className="fe fe-document" /> <span> Reports</span> <span className="menu-arrow" /></a>*/}
              {/*  <ul style={{display: 'none'}}>*/}
              {/*    <li><Link to="/invoice-report" className={pathname.includes('invoice-report') ?"active" :""}>Invoice Reports</Link></li>*/}
              {/*  </ul>*/}
              {/*</li>*/}
              {/*<li className="menu-title"> */}
              {/*  <span>Pages</span>*/}
              {/*</li>*/}
              {/*<li className="submenu">*/}
              {/*  <a href="#"><i className="fe fe-document" /> <span> Blog </span> <span className="menu-arrow" /></a>*/}
              {/*  <ul style={{display: 'none'}}>*/}
              {/*    <li><Link to="/blog" className={pathname === '/blog' ?"active" :""}> Blog </Link></li>*/}
              {/*    <li><Link to="/blog-details" className={pathname.includes('blog-details') ?"active" :""}> Blog Details</Link></li>*/}
              {/*    <li><Link to="/add-blog" className={pathname.includes('add-blog') ?"active" :""}> Add Blog </Link></li>*/}
              {/*    <li><Link to="/edit-blog" className={pathname.includes('edit-blog') ?"active" :""}> Edit Blog </Link></li>*/}
              {/*  </ul>*/}
              {/*</li>*/}
              {/*<li className={pathname.includes('product-list') ?"active" :""}><Link to="/product-list"><i className="fe fe-layout" /> <span>Product List</span></Link></li>*/}
              {/*<li className={pathname.includes('pharmacy-list') ?"active" :""}><Link to="/pharmacy-list"><i className="fe fe-vector" /> <span>Pharmacy List</span></Link></li>*/}
              {/*<li className={pathname.includes('profile') ?"active" :""}> */}
              {/*  <Link to="/profile"><i className="fe fe-user-plus" /> <span>Profile</span></Link>*/}
              {/*</li>*/}
              {/*<li className="submenu">*/}
              {/*  <a href="#"><i className="fe fe-document" /> <span> Authentication </span> <span className="menu-arrow" /></a>*/}
              {/*  <ul style={{display: 'none'}}>*/}
              {/*    <li><Link to="/login"> Login </Link></li>*/}
              {/*    <li><Link to="/register"> Register </Link></li>*/}
              {/*    <li><Link to="/forgotPassword"> Forgot Password </Link></li>*/}
              {/*    <li><Link to="/lockscreen"> Lock Screen </Link></li>*/}
              {/*  </ul>*/}
              {/*</li>*/}
              {/*<li className="submenu">*/}
              {/*  <a href="#"><i className="fe fe-warning" /> <span> Error Pages </span> <span className="menu-arrow" /></a>*/}
              {/*  <ul style={{display: 'none'}}>*/}
              {/*    <li><Link to="/404">404 Error </Link></li>*/}
              {/*    <li><Link to="/500">500 Error </Link></li>*/}
              {/*  </ul>*/}
              {/*</li>*/}
              {/*<li> */}
              {/*  <Link to="/blank-page"><i className="fe fe-file" /> <span>Blank Page</span></Link>*/}
              {/*</li>*/}
              {/*<li className="menu-title"> */}
              {/*  <span>UI Interface</span>*/}
              {/*</li>*/}
              {/*<li>*/}
              {/*  <Link to="/components"><i className="fe fe-vector" /> <span>Components</span></Link>*/}
              {/*</li>*/}
              {/*<li className="submenu">*/}
              {/*  <a href="#"><i className="fe fe-layout" /> <span> Forms </span> <span className="menu-arrow" /></a>*/}
              {/*  <ul style={{display: 'none'}}>*/}
              {/*    <li><Link to="/basic-input">Basic Inputs </Link></li>*/}
              {/*    <li><Link to="/form-input-group">Input Groups </Link></li>*/}
              {/*    <li><Link to="/form-horizontal">Horizontal Form </Link></li>*/}
              {/*    <li><Link to="/form-vertical"> Vertical Form </Link></li>*/}
              {/*    <li><Link to="/form-mask"> Form Mask </Link></li>*/}
              {/*    <li><Link to="/form-validation"> Form Validation </Link></li>*/}
              {/*  </ul>*/}
              {/*</li>*/}
              {/*<li className="submenu">*/}
              {/*  <a href="#"><i className="fe fe-table" /> <span> Tables </span> <span className="menu-arrow" /></a>*/}
              {/*  <ul style={{display: 'none'}}>*/}
              {/*    <li><Link to="/tables-basic">Basic Tables </Link></li>*/}
              {/*    <li><Link to="/data-tables">Data Table </Link></li>*/}
              {/*  </ul>*/}
              {/*</li>*/}
              {/*<li className="submenu">*/}
              {/*  <a href=""><i className="fe fe-code" /> <span>Multi Level</span> <span className="menu-arrow" /></a>*/}
              {/*  <ul style={{display: 'none'}}>*/}
              {/*    <li className="submenu">*/}
              {/*      <a href=""> <span>Level 1</span> <span className="menu-arrow" /></a>*/}
              {/*      <ul style={{display: 'none'}}>*/}
              {/*        <li><a href=""><span>Level 2</span></a></li>*/}
              {/*        <li className="submenu">*/}
              {/*          <a href=""> <span> Level 2</span> <span className="menu-arrow" /></a>*/}
              {/*          <ul style={{display: 'none'}}>*/}
              {/*            <li><a href="">Level 3</a></li>*/}
              {/*            <li><a href="">Level 3</a></li>*/}
              {/*          </ul>*/}
              {/*        </li>*/}
              {/*        <li><a href=""> <span>Level 2</span></a></li>*/}
              {/*      </ul>*/}
              {/*    </li>*/}
              {/*    <li>*/}
              {/*      <a href=""> <span>Level 1</span></a>*/}
              {/*    </li>*/}
              {/*  </ul>*/}
              {/*</li>*/}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SidebarNav);
