import React, {Component} from "react";
import logo from "../../assets/images/logo.png";
import logoicon from "../../assets/images/logo-small.png";
import avatar from "../../assets/images/avatar-01.jpg";
import Dropdown from "react-bootstrap/Dropdown";
import toast from "react-hot-toast";
import $ from "jquery";
import { fetchApi } from "../../../_utils/http-utils";


class Header extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }

    componentDidMount() {

        var Sidemenu = function () {
            this.$menuItem = $('#sidebar-menu a');
        };

        $('#toggle_btn').on('click', function (e) {
            if ($('body').hasClass('mini-sidebar')) {
                $('body').removeClass('mini-sidebar');
                $('.subdrop + ul').slideDown();
            } else {
                $('body').addClass('mini-sidebar');
                $('.subdrop + ul').slideUp();
            }
            return false;
        });

        // if(this.props.location.pathname.split("/")[1] === 'admin') {
        // require('../../assets/plugins/bootstrap-rtl/css/bootstrap.min.css')
        require('../..//assets/css/feathericon.min.css')
        require('../../assets/js/app.js');
        require('../../assets/js/jquery-3.2.1.min.js');
        require('../../assets/js/jquery.slimscroll.min.js');
        require('../../assets/plugins/fontawesome/css/fontawesome.min.css')
        require('../../assets/plugins/fontawesome/css/all.min.css')
        require('../../assets/css/font-awesome.min.css')
        require('../../assets/css/style.css')
        // }

    }

    handleLogout = async() => {
        try {
            let result = await fetchApi({
                url: "v1/auth/logout",
                method: "POST",
            })
            if (result.status === 200) {
                toast.success(result.message)
                localStorage.clear();
                this.props.history.push("/login")
            }else{
                toast.success(result.message)
            }
        } catch (e) {
            toast.error(e.response.message || 'Something went wrong')
        }

    }

    render() {
        const userDetails = localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData"))
        const exclusionArray = [
            "/login",
            "/register",
            "/forgotPassword",
            "/lockscreen",
            "/404",
            "/500",
            "/",
        ];
        if (exclusionArray.indexOf(this.props.location.pathname) >= 0) {
            return "";
        }
        return (
            <div className="header">
                {/* Logo */}
                <div className="header-left">
                    <a href="/dashboard" className="logo">
                        <img src={logo} alt="Logo"/>
                    </a>
                    <a href="/dashboard" className="logo logo-small">
                        <img src={logoicon} alt="Logo" width="30" height="30"/>
                    </a>
                </div>
                {/* /Logo */}
                <a id="toggle_btn" onClick={() => this.handlesidebar()}>
                    <i className="fe fe-text-align-left"/>
                </a>
                {/*<div className="top-nav-search">*/}
                {/*    <form>*/}
                {/*        <input type="text" className="form-control" placeholder="Search here"/>*/}
                {/*        <button className="btn" type="submit"><i className="fa fa-search"/></button>*/}
                {/*    </form>*/}
                {/*</div>*/}
                {/* Mobile Menu Toggle */}
                <a href="#0" className="mobile_btn" id="mobile_btn">
                    <i className="fa fa-bars"/>
                </a>
                {/* /Mobile Menu Toggle */}

                <ul className="nav user-menu">
                    {/*<li className="nav-item dropdown noti-dropdown">*/}
                    {/*    <Dropdown className="notify">*/}
                    {/*        <Dropdown.Toggle*/}
                    {/*            className="dropdown-toggle nav-link"*/}
                    {/*            id="dropdown-basic"*/}
                    {/*        >*/}
                    {/*            <i className="fe fe-bell"></i>{" "}*/}
                    {/*            <span className="badge badge-pill">3</span>*/}
                    {/*        </Dropdown.Toggle>*/}

                    {/*        <Dropdown.Menu className="notification-list">*/}
                    {/*            <Dropdown.Item*/}
                    {/*                href="#/action-1"*/}
                    {/*                className="notification-message"*/}
                    {/*            >*/}
                    {/*                <div className="media">*/}
                    {/*  <span className="avatar avatar-sm">*/}
                    {/*    <img*/}
                    {/*        className="avatar-img rounded-circle"*/}
                    {/*        alt="User"*/}
                    {/*        src={IMG01}*/}
                    {/*    />*/}
                    {/*  </span>*/}
                    {/*                    <div className="media-body">*/}
                    {/*                        <p className="noti-details">*/}
                    {/*                            <span className="noti-title">Dr. Ruby Perrin</span>{" "}*/}
                    {/*                            Schedule{" "}*/}
                    {/*                            <span className="noti-title">her appointment</span>*/}
                    {/*                        </p>*/}
                    {/*                        <p className="noti-time">*/}
                    {/*                            <span className="notification-time">4 mins ago</span>*/}
                    {/*                        </p>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </Dropdown.Item>*/}
                    {/*            <Dropdown.Item href="#/action-2">*/}
                    {/*                <div className="media">*/}
                    {/*  <span className="avatar avatar-sm">*/}
                    {/*    <img*/}
                    {/*        className="avatar-img rounded-circle"*/}
                    {/*        alt="User"*/}
                    {/*        src={IMG02}*/}
                    {/*    />*/}
                    {/*  </span>*/}
                    {/*                    <div className="media-body">*/}
                    {/*                        <p className="noti-details">*/}
                    {/*                            <span className="noti-title">Charlene Reed</span> has*/}
                    {/*                            booked her appointment to{" "}*/}
                    {/*                            <span className="noti-title">Dr. Ruby Perrin</span>*/}
                    {/*                        </p>*/}
                    {/*                        <p className="noti-time">*/}
                    {/*                            <span className="notification-time">6 mins ago</span>*/}
                    {/*                        </p>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </Dropdown.Item>*/}
                    {/*            <Dropdown.Item href="#/action-3">*/}
                    {/*                <div className="media">*/}
                    {/*  <span className="avatar avatar-sm">*/}
                    {/*    <img*/}
                    {/*        className="avatar-img rounded-circle"*/}
                    {/*        alt="User"*/}
                    {/*        src={IMG03}*/}
                    {/*    />*/}
                    {/*  </span>*/}
                    {/*                    <div className="media-body">*/}
                    {/*                        <p className="noti-details">*/}
                    {/*                            <span className="noti-title">Travis Trimble</span>{" "}*/}
                    {/*                            sent a amount of $210 for his{" "}*/}
                    {/*                            <span className="noti-title">appointment</span>*/}
                    {/*                        </p>*/}
                    {/*                        <p className="noti-time">*/}
                    {/*                            <span className="notification-time">8 mins ago</span>*/}
                    {/*                        </p>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </Dropdown.Item>*/}
                    {/*            <Dropdown.Item*/}
                    {/*                href="#/action-1"*/}
                    {/*                className="notification-message text-center"*/}
                    {/*            >*/}
                    {/*                <span className="text-center">View all</span>*/}
                    {/*            </Dropdown.Item>*/}
                    {/*        </Dropdown.Menu>*/}
                    {/*    </Dropdown>*/}
                    {/*</li>*/}

                    <li className="nav-item dropdown has-arrow">
                        <Dropdown className="user-dropdown">
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <span className="user-img">
                    <img
                        className="rounded-circle"
                        src={userDetails.dp || avatar}
                        width="31"
                        alt="Paramveer Singh"
                    />
                  </span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1" className="no-padding">
                                    <div className="user-header">
                                        <div className="avatar avatar-sm">
                                            <img
                                                src={userDetails.dp || avatar}
                                                alt="User"
                                                className="avatar-img rounded-circle"
                                            />
                                        </div>
                                        <div className="user-text">
                                            <h6>{userDetails.first_name} {userDetails.last_name}</h6>
                                            <p className="text-muted mb-0">Administrator</p>
                                        </div>
                                    </div>
                                </Dropdown.Item>
                                {/* <Dropdown.Item href="/profile"> My Profile</Dropdown.Item>
                                <Dropdown.Item href="/settings">Settings</Dropdown.Item> */}
                                <Dropdown.Item onClick={this.handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Header;
