import React, {Component} from "react";
import SidebarNav from "../sidebar";
import {Col, Form, Row, Modal, Tab, Tabs} from "react-bootstrap";
import DatePicker from "react-datepicker";
import {fetchApi} from "../../../_utils/http-utils";
import {
    assign,
    changeCaseFirstLetter,
    constants,
    getAddress,
    getFullName,
} from "../../../_utils/common-utils";
import moment from "moment";
import {
    getTextClassForStatus,
    renderDropDown,
} from "../../../_utils/data-table-utils";
import toast from "react-hot-toast";
import Radio from "../../commons/Radio";
import Selector from "../../commons/Select";
import TextArea from "../../commons/TextArea";
import Input from "../../commons/Input";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            show: '',
            data: null,
            updatedModel: null,
            user_id: props.match.params.user_id,
            type: props.match.params.type || constants.USER_TYPE_PATIENT,
            countryStateCity: {country: {}, state: {}, city: {}},
            countries: [],
            states: [],
            cities: [],
            languages: [],
            height: '',
            weight: '',
            dosages : ["First", "Second"],
            vaccineNames : ["Covishield", "Covaxin", "Sputnik", "J&J", "Pfizer", "Others"],
            isDiabetic:false,
            diabetics: [{id: 'yes', value: 'Yes', checked: false}, {id: 'no', value: 'No', checked: false}],
            diabeticValue:'',
            hypertensiveValue:'',
            hypertensives:[{id: 'yes', value: 'Yes', checked: false}, {id: 'no', value: 'No', checked: false}],
            isHypertensive:false,
            surgerys:[{id: 'yes', value: 'Yes', checked: false}, {id: 'no', value: 'No', checked: false}],
            isSurgery:false,
            surgeryValue:'',
            allergieValue:'',
            allergies:[{id: 'yes', value: 'Yes', checked: false}, {id: 'no', value: 'No', checked: false}],
            isAllergie:false,
            covids:[{id: 'yes', value: 'Yes', checked: false}, {id: 'no', value: 'No', checked: false}],
            isCovid:false,
            otherMedical:'',
            vaccinated:[{id: 'yes', value: 'Yes', checked: false}, {id: 'no', value: 'No', checked: false}],
            isVaccinated:false,
            vaccineDate:'',
            dose:'',
            vaccineName:'',
            covidDetails:'',
        };
    }

    async componentDidMount() {
        let profile = await fetchApi({
            url: "v1/user/getUserProfile",
            method: "POST",
            body: {user_id: this.state.user_id, type: this.state.type},
        });
        let countries = await fetchApi({
            url: "v1/country",
            method: "GET",
        });
        let languages = await fetchApi({
            url: "v1/languages",
            method: "GET",
        });
        let selectedCountry = countries.data.find(
            (country) => profile.data.additional_info.address.country == country.name
        );
        if (!selectedCountry) selectedCountry = countries.data[0];
        let selectedState = {
            id: profile.data.additional_info.address.state,
            name: profile.data.additional_info.address.state,
        };
        let selectedCity = {
            id: profile.data.additional_info.address.city,
            name: profile.data.additional_info.address.city,
        };

        //diabetic
        if(profile.data.additional_info.med_cond[0].selected){
            this.setState({
                diabetics:[{id: 'yes', value: 'Yes', checked: true},
                    {id: 'no', value: 'No', checked: false}],
                isDiabetic:true,
                diabeticValue:moment(profile.data.additional_info.med_cond[0].diag_at).format('YYYY-MM-DD')
            })
        }else {
            this.setState({
                diabetics:[{id: 'yes', value: 'Yes', checked: false},
                    {id: 'no', value: 'No', checked: true}]
            })
        }
        //hypertensive
        if(profile.data.additional_info.med_cond[1].selected){
            this.setState({
                hypertensives:[{id: 'yes', value: 'Yes', checked: true},
                    {id: 'no', value: 'No', checked: false}],
                isHypertensive:true,
                hypertensiveValue:moment(profile.data.additional_info.med_cond[1].diag_at).format('YYYY-MM-DD')
            })
        }else {
            this.setState({
                hypertensives:[{id: 'yes', value: 'Yes', checked: false},
                    {id: 'no', value: 'No', checked: true}]
            });
        }

        //diagnosed_with_covid
        if(profile.data.additional_info.med_cond[2].selected){
            this.setState({
                covids:[{id: 'yes', value: 'Yes', checked: true},
                    {id: 'no', value: 'No', checked: false}],
                covidDetails:profile.data.additional_info.med_cond[2]?.desc,
                isCovid:true
            });
        }else {
            this.setState({
                covids: [{id: 'yes', value: 'Yes', checked: false},
                    {id: 'no', value: 'No', checked: true}]
            })
        }

        //past_surgeries
        if(profile.data.additional_info.med_cond[3].selected){
            this.setState({
                surgerys:[{id: 'yes', value: 'Yes', checked: true},
                    {id: 'no', value: 'No', checked: false}],
                surgeryValue:profile.data.additional_info.med_cond[3]?.desc,
                isSurgery:true
            })
        }else {
            this.setState({
                surgerys:[{id: 'yes', value: 'Yes', checked: false},
                    {id: 'no', value: 'No', checked: true}]
            })
        }

        //allergy_to_meds
        if(profile.data.additional_info.med_cond[4].selected){
            this.setState({
                allergies:[{id: 'yes', value: 'Yes', checked: true},
                    {id: 'no', value: 'No', checked: false}],
                isAllergie:true,
                allergieValue:profile.data.additional_info.med_cond[4]?.desc
            })
        }else {
            this.setState({
                allergies:[{id: 'yes', value: 'Yes', checked: false},
                    {id: 'no', value: 'No', checked: true}]
            })
        }

        //covid_vaccinated
        if(profile.data.additional_info.med_cond[5].selected){
            this.setState({
                vaccinated:[{id: 'yes', value: 'Yes', checked: true},
                    {id: 'no', value: 'No', checked: false}],
                isVaccinated:true,
                vaccineDate:moment(profile.data.additional_info.med_cond[5].diag_at).format('YYYY-MM-DD'),
                dose:profile.data.additional_info.med_cond[5].meta[0]?.desc,
                vaccineName:profile.data.additional_info.med_cond[5].meta[1]?.desc
            })
        }else {
            this.setState({
                vaccinated:[{id: 'yes', value: 'Yes', checked: false},
                    {id: 'no', value: 'No', checked: true}],

            })
        }
        this.setState({
            data: profile.data,
            countries: countries.data,
            states: [selectedState],
            cities: [selectedCity],
            languages: languages.data,
            countryStateCity: {
                country: {id: selectedCountry.id, name: selectedCountry.name},
                state: selectedState,
                city: selectedCity,
            },
            otherMedical:profile.data.additional_info.other_med_cond || ''
        });
    }

    handleDiabetic = (id) => {
        this.setState({
            isDiabetic: id === 'yes'
        })
       const newDiabetic = this.state.diabetics.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })
        this.setState({
            diabetics:newDiabetic
        })
    }

    handleHypertensive = (id) => {
        this.setState({
            isHypertensive: id === 'yes'
        })

       const newHypertensives = this.state.hypertensives.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })
        this.setState({
            hypertensives:newHypertensives
        })
    }

    handleSurgerys = (id) => {
        this.setState({
            isSurgery: id === 'yes'
        })

       const newSurgerys = this.state.hypertensives.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })
        this.setState({
            surgerys:newSurgerys
        })
    }

    handleAllergies = (id) => {
        this.setState({
            isAllergie: id === 'yes'
        })

       const newAllergies = this.state.allergies.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })
        this.setState({
            allergies:newAllergies
        })
    }

    handleCovids = (id) => {
        this.setState({
            isCovid: id === 'yes'
        })

       const newCovids = this.state.covids.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })

        this.setState({
            covids:newCovids
        })
    }

    handleVaccinated = (id) => {
        this.setState({
            isVaccinated: id === 'yes'
        })

       const newVaccinatedList = this.state.vaccinated.map((item) => {
            return Object.assign({}, item, {checked: item.id === id});
        })

        this.setState({
            vaccinated:newVaccinatedList
        })
    }

    handleSelect = (key) => {
        this.setState({key});
    };
    handleClose = () => {
        this.setState({
            show: '',
            updatedModel: null,
        });
    };

    handleShow = (activeTab) => {
        this.setState({
            show: activeTab,
            updatedModel: {
                user: {...this.state.data.user},
                additional_info: {...this.state.data.additional_info},
            },
        });
    };
    handleDateChange = (date) => {
        let data = this.state.updatedModel;
        data.user.dob = moment(date).format("YYYY-MM-DD");
        this.setState({
            updatedModel: data,
        });
    };
    handleChange = (e) => {
        e.preventDefault();
        let data = this.state.updatedModel;
        let name = e.target.name;
        let value = e.target.value;
        if (data.user.hasOwnProperty(name)) data.user[name] = value;
        else if (data.additional_info.hasOwnProperty(name)) {
            data.additional_info[name] = value;
        } else if (data.hasOwnProperty(`${name}`)) {
            data[name] = value;
        } else {
            //Find where this key belongs to by checking it's actual path
            let childern = name.split(".");
            assign(data, childern, value);
        }
        this.setState({
            updatedModel: data,
        });
    };
    updateProfile = async (e) => {
        e.preventDefault()
        let data = this.state.updatedModel;
        let countryStateCity = this.state.countryStateCity;
        data.additional_info.address = {
            ...data.additional_info.address,
            city: countryStateCity.city.name,
            state: countryStateCity.state.name,
            country: countryStateCity.country.name,
        };
        try {
            let result = await fetchApi({
                url: "v1/user/updateProfile",
                method: "POST",
                body: {
                    ...data.user,
                    qualif: {
                        ...data.additional_info.qualif
                    },
                    //   address: data.additional_info.address,
                    user_id: data.user._id,
                    type: this.state.type,
                },
            });

            if (result) {
                toast.success(result.message);
                this.setState({data: data});
            }
        } catch (e) {
            console.log("error>>", e);
        }
        this.setState({showMenu: false, show: ''});
    };

    async handleItemClick(dropdownItem) {
        let data = this.state.data;
        this.setState({showMenu: false});
        try {
            let result;
            if (this.state.type === constants.USER_TYPE_PATIENT)
                result = await fetchApi({
                    url: "v1/patient/changeStatus",
                    method: "POST",
                    body: {patient_id: data.additional_info._id, status: dropdownItem},
                });
            else {
                result = await fetchApi({
                    url: "v1/doctor/changeStatus",
                    method: "POST",
                    body: {doctor_id: data.additional_info._id, status: dropdownItem},
                });
            }
            if (result) {
                toast.success(result.message);
                let profile = await fetchApi({
                    url: "v1/user/getUserProfile",
                    method: "POST",
                    body: {user_id: this.state.user_id, type: this.state.type},
                });
                this.setState({data: profile.data});
            }
        } catch (e) {
            console.log("error>>", e);
        }
    }

    async getStateForCountry(dropdownItem) {
        let countryId = dropdownItem.target.value;
        let name = this.state.countries[dropdownItem.target.selectedIndex].name;

        try {
            let result = await fetchApi({
                url: "v1/state",
                method: "POST",
                body: {countryId: countryId},
            });

            if (result) {
                this.setState({
                    states: result.data,
                    countryStateCity: {
                        ...this.state.countryStateCity,
                        country: {id: countryId, name: name},
                    },
                });
            }
        } catch (e) {
            console.log("error>>", e);
        }
    }

    async getCityForState(dropdownItem) {
        let countryStateCity = this.state.countryStateCity;
        let stateId = dropdownItem.target.value;
        let name = this.state.states[dropdownItem.target.selectedIndex].name;
        try {
            let result = await fetchApi({
                url: "v1/city",
                method: "POST",
                body: {countryId: countryStateCity.country.id, stateId: stateId},
            });

            if (result) {
                this.setState({
                    cities: result.data,
                    countryStateCity: {
                        ...countryStateCity,
                        state: {id: stateId, name: name},
                    },
                });
            }
        } catch (e) {
            console.log("error>>", e);
        }
    }

    async selectCity(dropdownItem) {
        let countryStateCity = this.state.countryStateCity;
        let city = dropdownItem.target.value;
        let name = this.state.cities[dropdownItem.target.selectedIndex].name;
        this.setState({
            countryStateCity: {...countryStateCity, city: {id: city, name: name}},
        });
    }

    handleDropdownClick() {
        let isShown = this.state.showMenu;
        this.setState({showMenu: !isShown});
    }

    showDropDownMenu() {
        return this.state.showMenu;
    }

    renderPatientMoreFields = () => {
        return(
            <div className="row form-row">
                <div className="col-12 col-sm-6">
                    <div className="form-group">
                        <label>Height</label>
                        <input
                            type="text"
                            className="form-control"
                            name="additional_info.height"
                            onChange={this.handleChange}
                            value={
                                this.state.updatedModel.additional_info.height
                            }
                        />
                    </div>
                </div>
                <div className="col-12 col-sm-6">
                    <div className="form-group">
                        <label>Weight</label>
                        <input
                            type="text"
                            className="form-control"
                            name="additional_info.weight"
                            onChange={this.handleChange}
                            value={
                                this.state.updatedModel.additional_info.weight
                            }
                        />
                    </div>
                </div>
                {/*<Row className="g-2">*/}
                {/*    <Col md>*/}
                <div className="col-12 col-sm-6">
                    <div className="form-group">
                            <Radio
                                label="Are you Diabetic?"
                                id="radioDiabetes"
                                options={this.state.diabetics}
                                handleSelect={this.handleDiabetic}
                            />
                        </div>
                    <div className="form-group">
                            {this.state.isDiabetic &&
                            <Col>
                                <br/>
                                <br/> <Form.Control type="date"
                                                    value={this.state.diabeticValue}
                                                    max={moment(new Date()).format('YYYY-MM-DD')}
                                                    onChange={(e) => this.setState({
                                                        diabeticValue:e.target.value
                                                    })}/>
                            </Col>
                            }

                        </div>
                </div>
                    {/*</Col>*/}
                    {/*<Col md>*/}
                    <div className="col-12 col-sm-6">
                        <div className="form-group">
                            <Radio
                                label="Are you Hypertensive?"
                                id="radioHypertensive"
                                options={this.state.hypertensives}
                                handleSelect={this.handleHypertensive}
                            />
                        </div>
                        <div className="form-group">
                            {this.state.isHypertensive &&
                            <Col>
                                <br/>
                                <br/> <Form.Control type="date"
                                                    value={this.state.hypertensiveValue}
                                                    max={moment(new Date()).format('YYYY-MM-DD')}
                                                    onChange={(e) => this.setState({hypertensiveValue:e.target.value})}/>
                            </Col>
                            }
                        </div>
                    {/*</Col>*/}
                    </div>
                {/*</Row>*/}
                <div className="col-12 col-sm-6">

                    <div className="form-group">
                        <Col md>
                            <div className="form-group">
                                <Radio
                                    label="Any past surgery?"
                                    id="radioSurgery"
                                    options={this.state.surgerys}
                                    handleSelect={this.handleSurgerys}
                                />
                            </div>
                            {this.state.isSurgery &&
                            <div className="form-group">
                                <TextArea
                                    id={'surgery'}
                                    value={this.state.surgeryValue}
                                    placeholder="Please mention in brief"
                                    onChange={(value) => this.setState({
                                        surgeryValue:value
                                    })}
                                    rows={4}
                                    cols={35}
                                ></TextArea>
                            </div>
                            }
                        </Col>
                        <Col md>
                            <div className="form-group">
                                <Radio
                                    label="Any allergies to medications?"
                                    id="radioAllergies"
                                    options={this.state.allergies}
                                    handleSelect={this.handleAllergies}
                                />
                            </div>
                            <div className="form-group">
                                {this.state.isAllergie &&
                                <TextArea
                                    id={'textareaSurgery'}
                                    value={this.state.allergieValue}
                                    placeholder="Please mention in brief"
                                    onChange={(value) => this.setState({
                                        allergieValue:value
                                    })}
                                    rows={4}
                                    cols={35}
                                ></TextArea>
                                }
                            </div>
                        </Col>
                    </div>
                    <div className="form-group">
                        <Col md>
                            <div className="form-group">
                                <Radio
                                    label="Have you been diagnosed with Covid?"
                                    id="diagCovid"
                                    options={this.state.covids}
                                    handleSelect={this.handleCovids}
                                />
                            </div>
                            <div className="form-group">
                                {this.state.isCovid &&
                                <Col md>
                                    <Input
                                        type="text"
                                        placeholder="Enter additional details"
                                        label="Provide additional details of Covid illness"
                                        value={this.state.covidDetails}
                                        onChange={(value) => this.setState({
                                            covidDetails:value
                                        })}
                                    />
                                </Col>
                                }
                            </div>
                        </Col>
                        <Col md>
                            <div className="form-group">
                                <Radio
                                    label="Have you been vaccinated against Covid?"
                                    id="vaccinated"
                                    options={this.state.vaccinated}
                                    handleSelect={this.handleVaccinated}
                                />
                            </div>
                            <div className="form-group">
                                {this.state.isVaccinated &&
                                <Col md style={{paddingTop: '32px'}}>
                                    <br/> <Form.Control type="date"
                                                        value={this.state.vaccineDate}
                                                        onKeyDown={(e) => e.preventDefault()}
                                                        max={moment(new Date()).format('YYYY-MM-DD')}
                                                        onChange={(e) => this.setState({
                                                            vaccineDate:e.target.value
                                                        })}
                                />
                                    <Selector
                                        defaultValue="Choose dose type"
                                        id="dose"
                                        options={this.state.dosages}
                                        // handleSelect={this.setDose}
                                        handleSelect={(item) => this.setState({
                                            dose:item
                                        })}
                                        value={this.state.dose}
                                    />
                                    <Selector
                                        defaultValue="Choose vaccine name"
                                        id="v-name"
                                        options={this.state.vaccineNames}
                                        // handleSelect={setVaccineName}
                                        handleSelect={(item) => {
                                            this.setState({
                                                vaccineName: item
                                            })
                                        }}
                                        value={this.state.vaccineName}
                                    />
                                </Col>
                                }
                            </div>
                        </Col>
                    </div>
                    <div className="form-group">
                        <Col md>
                            <TextArea
                                label="Other medical conditions"
                                id={'other-condition'}
                                value={this.state.otherMedical}
                                placeholder="Add conditions"
                                onChange={(value) => this.setState({
                                    otherMedical:value
                                })}
                                // onChange={setOtherMedical}
                                rows={1}
                                cols={20}
                            ></TextArea>
                        </Col>
                        <Col md></Col>
                    </div>












                </div>
            </div>
        )
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
                                    <h3 className="page-title">{`${
                                        this.state.type === constants.USER_TYPE_PATIENT
                                            ? "Patient "
                                            : " Doctor"
                                        } Profile`}</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="/admin">Dashboard</a>
                                        </li>
                                        <li className="breadcrumb-item active">Profile</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* page header */}
                        {this.state.data && (
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="profile-header">
                                        <div className="row align-items-center">
                                            <div className="col-auto profile-image">
                                                <img
                                                    className="rounded-circle"
                                                    alt="User"
                                                    src={this.state.data.user.dp}
                                                />
                                            </div>
                                            <div className="col ml-md-n2 profile-user-info">
                                                <h4 className="user-name mb-0">
                                                    {getFullName(this.state.data.user)}
                                                </h4>
                                                <h6 className="text-muted">
                                                    {this.state.data.user.email}
                                                </h6>
                                                <h6
                                                    className={getTextClassForStatus(
                                                        this.state.data.additional_info.status
                                                    )}
                                                >
                                                    {changeCaseFirstLetter(
                                                        this.state.data.additional_info.status
                                                    )}
                                                </h6>
                                                <div className="user-Location">
                                                    <i className="fa fa-map-marker" aria-hidden="true"/>{" "}
                                                    {getAddress(this.state.data.additional_info.address)}
                                                </div>
                                            </div>
                                            <div className="col-auto profile-btn">
                                                {renderDropDown(
                                                    "Change Status",
                                                    (this.state.type === constants.USER_TYPE_PATIENT
                                                            ? constants.PATIENT_STATUSES
                                                            : constants.DOCTOR_STATUSES
                                                    ).filter(
                                                        (item) =>
                                                            item !== this.state.data.additional_info.status
                                                    ),
                                                    (elem, index) => this.handleItemClick(elem),
                                                    () => this.handleDropdownClick(),
                                                    this.showDropDownMenu()
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                            {this.state.data && (
                                                <div className="card-body">
                                                    <h5 className="card-title d-flex justify-content-between">
                                                        <span>Personal Details</span>
                                                        <a className="edit-link" onClick={() => this.handleShow('1')}>
                                                            <i className="fa fa-edit mr-1"></i>Edit
                                                        </a>
                                                    </h5>
                                                    <div className="row">
                                                        <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                                            Name
                                                        </p>
                                                        <p className="col-sm-10">
                                                            {getFullName(this.state.data.user)}
                                                        </p>
                                                    </div>
                                                    <div className="row">
                                                        <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                                            Date of Birth
                                                        </p>
                                                        <p className="col-sm-10">
                                                            {this.state.data.user.dob}
                                                        </p>
                                                    </div>
                                                    <div className="row">
                                                        <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                                            Language
                                                        </p>
                                                        <p className="col-sm-10">
                                                            {changeCaseFirstLetter(
                                                                this.state.data.user.language.name
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="row">
                                                        <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                                            Gender
                                                        </p>
                                                        <p className="col-sm-10">
                                                            {this.state.data.user.gender}
                                                        </p>
                                                    </div>
                                                    <div className="row">
                                                        <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                                            Email ID
                                                        </p>
                                                        <p className="col-sm-10">
                                                            {this.state.data.user.email}
                                                        </p>
                                                    </div>
                                                    <div className="row">
                                                        <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                                            Mobile
                                                        </p>
                                                        <p className="col-sm-10">
                                                            {this.state.data.user.mobile_number}
                                                        </p>
                                                    </div>
                                                    <div className="row">
                                                        <p className="col-sm-2 text-muted text-sm-right mb-0">
                                                            Address
                                                        </p>
                                                        <p className="col-sm-10 mb-0">
                                                            {getAddress(
                                                                this.state.data.additional_info.address
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            {this.state.type == constants.USER_TYPE_DOCTOR &&
                            <Tab className="nav-link" eventKey={2} title="Additional Details">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card">
                                            {this.state.data && (
                                                <div className="card-body">
                                                    <h5 className="card-title d-flex justify-content-between">
                                                        <span>Additional Details</span>
                                                        <a className="edit-link" onClick={() => this.handleShow('2')}>
                                                            <i className="fa fa-edit mr-1"></i>Edit
                                                        </a>
                                                    </h5>
                                                    <div className="row">
                                                        <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                                            Qualification
                                                        </p>
                                                        <p className="col-sm-10">
                                                            {
                                                                this.state.data.additional_info.qualif
                                                                    .highest_qual.name
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="row">
                                                        <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                                            Department
                                                        </p>
                                                        <p className="col-sm-10">
                                                            {
                                                                this.state.data.additional_info.qualif.dept_id
                                                                    .title
                                                            }
                                                        </p>
                                                    </div>
                                                    {this.state.data.additional_info.qualif.exp && <div className="row">
                                                        <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                                            Experience
                                                        </p>
                                                        <p className="col-sm-10">
                                                            {this.state.data.additional_info.qualif.exp}
                                                        </p>
                                                    </div>}
                                                    <div className="row">
                                                        <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                                            Fee
                                                        </p>
                                                        <p className="col-sm-10">
                                                            ₹{this.state.data.additional_info.qualif.fee}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Tab>}
                        </Tabs>
                    </div>
                </div>
                {/* modal */}
                <Modal show={this.state.show === '1'} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <h5 className="modal-title">Personal Details</h5>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.state.updatedModel && (
                                <div className="modal-body">
                                    <form>
                                        <div className="row form-row">
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label>First Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="first_name"
                                                        onChange={this.handleChange}
                                                        value={this.state.updatedModel.user.first_name}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label>Last Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="last_name"
                                                        onChange={this.handleChange}
                                                        value={this.state.updatedModel.user.last_name}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label>Date of Birth</label>
                                                    <div className="cal-icon">
                                                        <DatePicker
                                                            className="form-control"
                                                            dateFormat={"yyyy-MM-dd"}
                                                            selected={
                                                                new Date(this.state.updatedModel.user.dob)
                                                            }
                                                            onChange={this.handleDateChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label>Email ID</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        name="email"
                                                        onChange={this.handleChange}
                                                        value={this.state.updatedModel.user.email}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label>Mobile</label>
                                                    <input
                                                        type="text"
                                                        disabled={true}
                                                        value={this.state.updatedModel.user.mobile_number}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label>Gender</label>
                                                    <select
                                                        value={this.state.updatedModel.user.gender}
                                                        name="gender"
                                                        onChange={(e) => this.handleChange(e)}
                                                        className="form-control"
                                                    >
                                                        {constants.GENDER_DROPDOWN?.map((gender) => {
                                                            return (
                                                                <option value={gender}>
                                                                    {changeCaseFirstLetter(gender)}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label>Language</label>
                                                    <select
                                                        value={this.state.updatedModel.user.language._id}
                                                        name="language"
                                                        onChange={(e) => this.handleChange(e)}
                                                        className="form-control"
                                                    >
                                                        {this.state.languages?.map((lang) => {
                                                            return (
                                                                <option value={lang._id}>
                                                                    {changeCaseFirstLetter(lang.name)}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label>Address Line 1</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="additional_info.address.line1"
                                                        onChange={this.handleChange}
                                                        value={
                                                            this.state.updatedModel.additional_info.address
                                                                .line1
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label>Address Line 2</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="additional_info.address.line2"
                                                        onChange={this.handleChange}
                                                        value={
                                                            this.state.updatedModel.additional_info.address
                                                                .line2
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label>Country</label>
                                                    <select
                                                        value={this.state.countryStateCity.country.id}
                                                        onChange={(e) => this.getStateForCountry(e)}
                                                        className="form-control"
                                                    >
                                                        {this.state.countries?.map((country) => {
                                                            return (
                                                                <option value={country.id}>
                                                                    {changeCaseFirstLetter(country.name)}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label>State</label>
                                                    <select
                                                        value={this.state.countryStateCity.state.id}
                                                        onChange={(e) => this.getCityForState(e)}
                                                        disabled={this.state.states.length === 0}
                                                        className="form-control"
                                                    >
                                                        {this.state.states?.map((state) => {
                                                            return (
                                                                <option value={state.id}>
                                                                    {changeCaseFirstLetter(state.name)}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label>City</label>
                                                    <select
                                                        value={this.state.countryStateCity.city.id}
                                                        onChange={(e) => this.selectCity(e)}
                                                        disabled={this.state.cities.length === 0}
                                                        className="form-control"
                                                    >
                                                        {this.state.cities?.map((city) => {
                                                            return (
                                                                <option value={city.id}>
                                                                    {changeCaseFirstLetter(city.name)}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                            <div className="patient-more-fields">
                                                {this.state.type === constants.USER_TYPE_PATIENT && this.renderPatientMoreFields()}
                                            </div>
                                        <button
                                            type="submit"
                                            onClick={this.updateProfile}
                                            className="btn btn-primary btn-block"
                                        >
                                            Save Changes
                                        </button>
                                    </form>
                                </div>
                            )}
                    </Modal.Body>
                </Modal>

                {/* Addition Details Modal */}
                {this.state.type === constants.USER_TYPE_DOCTOR
                && <Modal show={this.state.show === '2'} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <h5 className="modal-title">Additional Details</h5>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.updatedModel && (
                            <div className="modal-body">
                                <form>
                                    <div className="row form-row">
                                        <div className="col-12 col-sm-6">
                                            <div className="form-group">
                                                <label>Qualification</label>
                                                <input
                                                    disabled={true}
                                                    type="text"
                                                    className="form-control"
                                                    name="qualification"
                                                    value={
                                                        this.state.data.additional_info.qualif.highest_qual
                                                            .name
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <div className="form-group">
                                                <label>Department</label>
                                                <input
                                                    type="text"
                                                    disabled={true}
                                                    className="form-control"
                                                    name="department"
                                                    value={
                                                        this.state.data.additional_info.qualif.dept_id.title
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {this.state.data.additional_info.qualif.exp && <div className="col-12 col-sm-6">
                                            <div className="form-group">
                                                <label>Experience</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="experience"
                                                    disabled={true}
                                                    value={this.state.data.additional_info.qualif.exp}
                                                />
                                            </div>
                                        </div>}
                                        <div className="col-12 col-sm-6">
                                            <div className="form-group">
                                                <label>Fee</label>
                                                <input
                                                    type="text"
                                                    name="additional_info.qualif.fee"
                                                    onChange={(e) => this.handleChange(e)}
                                                    value={this.state.updatedModel.additional_info.qualif.fee}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        onClick={this.updateProfile}
                                        className="btn btn-primary btn-block"
                                    >
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>}
            </div>
        );
    }
}

export default Profile;
