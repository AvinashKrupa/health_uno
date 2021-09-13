import React, {Component} from 'react';
import SidebarNav from '../sidebar';
import {Modal, Tab, Tabs} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import {fetchApi} from "../../../_utils/http-utils";
import {changeCaseFirstLetter, constants, getAddress, getFullName, assign} from "../../../_utils/common-utils";
import moment from "moment";
import {renderDropDown, renderText} from "../../../_utils/data-table-utils";
import toast from "react-hot-toast";


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            show: false,
            data: null,
            updatedModel: null,
            user_id: props.match.params.user_id,
            type: props.match.params.type,
            countryStateCity: {country: {}, state: {}, city: {}},
            countries: [],
            states: [],
            cities: []
        }

    }

    async componentDidMount() {

        let profile = await fetchApi({
            url: "v1/user/getUserProfile",
            method: "POST",
            body: {user_id: this.state.user_id, type: this.state.type}
        })
        let countries = await fetchApi({
            url: "v1/country",
            method: "GET",
        })
        this.setState({data: profile.data, countries: countries.data});
    }

    handleSelect = (key) => {

        this.setState({key})
    }
    handleClose = () => {
        this.setState({
            show: false,
            updatedModel: null
        });
    }

    handleShow = () => {
        this.setState({
            show: true,
            updatedModel: {user: {...this.state.data.user}, additional_info: {...this.state.data.additional_info}}
        });
    }
    handleDateChange = date => {
        let data = this.state.updatedModel
        data.user.dob = moment(date).format("YYYY-MM-DD")
        this.setState({
            updatedModel: data
        });
    };
    handleChange = e => {
        let data = this.state.updatedModel
        let name = e.target.name
        let value = e.target.value
        if (data.user.hasOwnProperty(name))
            data.user[name] = value
        else if (data.additional_info.hasOwnProperty(name)) {
            data.additional_info[name] = value
        } else {
            //Find where this key belongs to by checking it's actual path
            let childern = name.split(".")
            assign(data, childern, value);
        }
        this.setState({
            updatedModel: data
        });
    };
    updateProfile = async () => {
        let data = this.state.updatedModel
        let countryStateCity = this.state.countryStateCity
        data.additional_info.address = {
            ...data.additional_info.address,
            city: countryStateCity.city.name,
            state: countryStateCity.state.name,
            country: countryStateCity.country.name
        }
        console.log("additional_info>>>", data.additional_info)
        try {
            let result = await fetchApi({
                url: "v1/user/updateProfile",
                method: "POST",
                body: {
                    ...data.user,
                    address: data.additional_info.address,
                    user_id: data.user._id,
                    type: this.state.type
                }
            })

            if (result) {
                console.log("result>>>", result)
                toast.success(result.message)
                this.setState({data: data})
            }
        } catch (e) {
            console.log("error>>", e)

        }
        this.setState({showMenu: false, show: false})
    };

    async handleItemClick(dropdownItem) {
        let data = this.state.data
        this.setState({showMenu: false})
        try {
            let result
            if (this.state.type === constants.USER_TYPE_PATIENT)
                result = await fetchApi({
                    url: "v1/patient/changeStatus",
                    method: "POST",
                    body: {patient_id: data.additional_info._id, status: dropdownItem}
                })
            else {
                result = await fetchApi({
                    url: "v1/doctor/changeStatus",
                    method: "POST",
                    body: {doctor_id: data.additional_info._id, status: dropdownItem}
                })
            }
            if (result) {
                toast.success(result.message)
                this.setState({data: data})
            }
        } catch (e) {
            console.log("error>>", e)

        }
    }

    async getStateForCountry(dropdownItem) {
        let countryId = dropdownItem.target.value
        let name = this.state.countries[dropdownItem.target.selectedIndex].name

        try {
            let result = await fetchApi({
                url: "v1/state",
                method: "POST",
                body: {countryId: countryId}
            })

            if (result) {
                this.setState({
                    states: result.data,
                    countryStateCity: {...this.state.countryStateCity, country: {id: countryId, name: name}}
                })
            }
        } catch (e) {
            console.log("error>>", e)

        }
    }

    async getCityForState(dropdownItem) {
        let countryStateCity = this.state.countryStateCity
        let stateId = dropdownItem.target.value
        let name = this.state.states[dropdownItem.target.selectedIndex].name
        try {
            let result = await fetchApi({
                url: "v1/city",
                method: "POST",
                body: {countryId: countryStateCity.country.id, stateId: stateId}
            })

            if (result) {

                this.setState({
                    cities: result.data,
                    countryStateCity: {...countryStateCity, state: {id: stateId, name: name}}
                })
            }
        } catch (e) {
            console.log("error>>", e)

        }
    }

    async selectCity(dropdownItem) {
        let countryStateCity = this.state.countryStateCity
        let city = dropdownItem.target.value
        let name = this.state.cities[dropdownItem.target.selectedIndex].name
        this.setState({
            countryStateCity: {...countryStateCity, city: {id: city, name: name}}
        })

    }

    handleDropdownClick() {
        let isShown = this.state.showMenu
        this.setState({showMenu: !isShown})
    }

    showDropDownMenu() {
        return this.state.showMenu
    }


    render() {
        return (
            <div>
                <SidebarNav/>
                <div className="page-wrapper">
                    <div className="content container-fluid">

                        <div className="page-header">
                            <div className="row">
                                <div className="col">
                                    <h3 className="page-title">Profile</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
                                        <li className="breadcrumb-item active">Profile</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* page header */}
                        {this.state.data && <div className="row">
                            <div className="col-md-12">
                                <div className="profile-header">
                                    <div className="row align-items-center">
                                        <div className="col-auto profile-image">
                                            <img className="rounded-circle" alt="User"
                                                 src={this.state.data.user.dp}/>
                                        </div>
                                        <div className="col ml-md-n2 profile-user-info">
                                            <h4 className="user-name mb-0">{getFullName(this.state.data.user)}</h4>
                                            <h6 className="text-muted">{this.state.data.user.email}</h6>
                                            <div className="user-Location"><i className="fa fa-map-marker"
                                                                              aria-hidden="true"></i> {getAddress(this.state.data.additional_info.address)}
                                            </div>
                                        </div>
                                        <div className="col-auto profile-btn">
                                            {renderText(this.state.data.additional_info.status)}
                                            {renderDropDown("Change Status",
                                                (this.state.type === constants.USER_TYPE_PATIENT ? constants.PATIENT_STATUSES : constants.DOCTOR_STATUSES)
                                                    .filter(item => item !== this.state.data.additional_info.status)
                                                ,
                                                (elem, index) => this.handleItemClick(elem),
                                                () => this.handleDropdownClick(),
                                                this.showDropDownMenu())}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {/* row */}

                        <Tabs
                            className="profile tab-view"
                            activeKey={this.state.key}
                            onSelect={this.handleSelect}
                            id="controlled-tab-example"
                        >
                            <Tab className="nav-link" eventKey={1} title="About">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card">
                                            {this.state.data && <div className="card-body">
                                                <h5 className="card-title d-flex justify-content-between">
                                                    <span>Personal Details</span>
                                                    <a className="edit-link" onClick={this.handleShow}>
                                                        <i className="fa fa-edit mr-1"></i>Edit</a>
                                                </h5>
                                                <div className="row">
                                                    <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">Name</p>
                                                    <p className="col-sm-10">{getFullName(this.state.data.user)}</p>
                                                </div>
                                                <div className="row">
                                                    <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">Date
                                                        of Birth</p>
                                                    <p className="col-sm-10">{this.state.data.user.dob}</p>
                                                </div>
                                                <div className="row">
                                                    <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">Gender</p>
                                                    <p className="col-sm-10">{this.state.data.user.gender}</p>
                                                </div>
                                                <div className="row">
                                                    <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">Email
                                                        ID</p>
                                                    <p className="col-sm-10">{this.state.data.user.email}</p>
                                                </div>
                                                <div className="row">
                                                    <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">Mobile</p>
                                                    <p className="col-sm-10">{this.state.data.user.mobile_number}</p>
                                                </div>
                                                <div className="row">
                                                    <p className="col-sm-2 text-muted text-sm-right mb-0">Address</p>
                                                    <p className="col-sm-10 mb-0">{getAddress(this.state.data.additional_info.address)}</p>
                                                </div>
                                            </div>}
                                        </div>
                                    </div>
                                </div>

                            </Tab>

                        </Tabs>

                    </div>
                </div>
                {/* modal */}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title><h5 className="modal-title">Personal Details</h5></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.updatedModel && <div className="modal-body">
                            <form onSubmit={this.updateProfile}>
                                <div className="row form-row">
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input type="text" className="form-control"
                                                   name="user.first_name"
                                                   onChange={this.handleChange}
                                                   value={this.state.updatedModel.user.first_name}/>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input type="text" className="form-control"
                                                   name="user.last_name"
                                                   onChange={this.handleChange}
                                                   value={this.state.updatedModel.user.last_name}/>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Date of Birth</label>
                                            <div className="cal-icon">
                                                <DatePicker
                                                    className="form-control"
                                                    dateFormat={"yyyy-MM-dd"}
                                                    selected={new Date(this.state.updatedModel.user.dob)}
                                                    onChange={this.handleDateChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>Email ID</label>
                                            <input type="email" className="form-control"
                                                   name="user.email"
                                                   onChange={this.handleChange}
                                                   value={this.state.updatedModel.user.email}/>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>Mobile</label>
                                            <input type="text" disabled={true}
                                                   value={this.state.updatedModel.user.mobile_number}
                                                   className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>Address Line1</label>
                                            <input type="text" className="form-control"
                                                   name="additional_info.address.line1"
                                                   onChange={this.handleChange}
                                                   value={this.state.updatedModel.additional_info.address.line1}/>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>Address Line2</label>
                                            <input type="text" className="form-control"
                                                   name="additional_info.address.line2"
                                                   onChange={this.handleChange}
                                                   value={this.state.updatedModel.additional_info.address.line2}/>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Country</label>
                                            <select value={this.state.countryStateCity.country.id}
                                                    onChange={(e) => this.getStateForCountry(e)}
                                                    className="form-control">
                                                {this.state.countries?.map(country => {
                                                    return <option
                                                        value={country.id}>{changeCaseFirstLetter(country.name)}</option>
                                                })}
                                            </select>

                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>State</label>
                                            <select value={this.state.countryStateCity.state.id}
                                                    onChange={(e) => this.getCityForState(e)}
                                                    disabled={this.state.states.length === 0}
                                                    className="form-control">
                                                {this.state.states?.map(state => {
                                                    return <option
                                                        value={state.id}>{changeCaseFirstLetter(state.name)}</option>
                                                })}
                                            </select>

                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>City</label>
                                            <select value={this.state.countryStateCity.city.id}
                                                    onChange={(e) => this.selectCity(e)}
                                                    disabled={this.state.cities.length === 0}
                                                    className="form-control">
                                                {this.state.cities?.map(city => {
                                                    return <option
                                                        value={city.id}>{changeCaseFirstLetter(city.name)}</option>
                                                })}
                                            </select>

                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Save Changes
                                </button>
                            </form>
                        </div>}
                    </Modal.Body>
                </Modal>
                {/* modal */}
            </div>

        );
    }
}

export default Profile;
