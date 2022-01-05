import React, { Component } from "react";
import SidebarNav from "../sidebar";
import { Col, Form, Modal, Tab, Tabs } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { fetchApi } from "../../../_utils/http-utils";
import {
  assign,
  changeCaseFirstLetter,
  constants,
  getAddress,
  getFullName,
} from "../../../_utils/common-utils";
import cameraIco from "../../assets/images/camera.svg";
import whiteBgIco from "../../assets/images/white_background.png";
import moment from "moment";
import {
  getTextClassForStatus,
  renderButton,
  renderDropDown,
} from "../../../_utils/data-table-utils";
import toast from "react-hot-toast";
import Radio from "../../commons/Radio";
import Selector from "../../commons/Select";
import TextArea from "../../commons/TextArea";
import Input from "../../commons/Input";
import UpdateSchedule from "../UpdateSchedule";
import MultiSelect from "../MultiSelect/MultiSelect";
import UploadImage from "../UploadImage";
import Spinner from "../spinner/customSpinner";
import { isEmpty } from "../../../_utils/Validators";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingQual: false,
      loadingDept: false,
      loadingSpec: false,
      loadingLang: false,
      loadingCountry: false,
      diabeticValueSelected: false,
      hypertensiveValueSelected: false,
      vaccineDateSelected: false,
      doseSelected: false,
      vaccineNameSelected: false,
      key: 1,
      show: "",
      data: null,
      updatedModel: null,
      user_id: props.match.params.user_id,
      type: props.match.params.type || constants.USER_TYPE_PATIENT,
      countryStateCity: { country: {}, state: {}, city: {} },
      countries: [],
      states: [],
      qualification: [],
      specialities: [],
      department: [],
      selectedDepartment: "",
      selectedQualification: "",
      selectedSpecialities: "",
      profileDescription: "",
      cities: [],
      languages: [],
      height: "",
      weight: "",
      dosages: ["First", "Second"],
      vaccineNames: [
        "Covishield",
        "Covaxin",
        "Sputnik",
        "J&J",
        "Pfizer",
        "Others",
      ],
      isDiabetic: false,
      diabetics: [
        { id: "yes", value: "Yes", checked: false },
        { id: "no", value: "No", checked: false },
      ],
      diabeticValue: "",
      hypertensiveValue: "",
      hypertensives: [
        { id: "yes", value: "Yes", checked: false },
        { id: "no", value: "No", checked: false },
      ],
      isHypertensive: false,
      surgerys: [
        { id: "yes", value: "Yes", checked: false },
        { id: "no", value: "No", checked: false },
      ],
      isSurgery: false,
      surgeryValue: "",
      allergieValue: "",
      allergies: [
        { id: "yes", value: "Yes", checked: false },
        { id: "no", value: "No", checked: false },
      ],
      isAllergie: false,
      covids: [
        { id: "yes", value: "Yes", checked: false },
        { id: "no", value: "No", checked: false },
      ],
      isCovid: false,
      otherMedical: "",
      vaccinated: [
        { id: "yes", value: "Yes", checked: false },
        { id: "no", value: "No", checked: false },
      ],
      isVaccinated: false,
      vaccineDate: "",
      dose: "",
      vaccineName: "",
      covidDetails: "",
      selectedLanguage: [],
      experience: "",
      fees: "",
    };
  }

  getDropdownData = async () => {
    this.setState({
      loadingQual: true,
      loadingSpec: true,
      loadingDept: true,
      loadingLang: true,
      loadingCountry: true,
    });
    const { data } = this.state;
    let countries = await fetchApi({
      url: "v1/country",
      method: "GET",
    });
    let languages = await fetchApi({
      url: "v1/languages",
      method: "GET",
    });
    let qualification = await fetchApi({
      url: "v1/qualifications?showAll=true",
      method: "GET",
    });
    let department = await fetchApi({ url: "v1/departments", method: "GET" });
    let specialities = await fetchApi({
      url: "v1/specialities?showAll=true",
      method: "GET",
    });
    let selectedCountry = countries.data.find(
      (country) => data.additional_info.address.country == country.name
    );
    if (!selectedCountry) selectedCountry = countries.data[0];
    let states;
    if (selectedCountry) {
      states = await fetchApi({
        url: "v1/state",
        method: "POST",
        body: { countryId: selectedCountry.id },
      });
    }
    let selectedState = states.data.find(
      (state) => data.additional_info.address.state == state.name
    );
    if (!selectedState) selectedState = states.data[0];
    let cities;
    if (selectedState) {
      cities = await fetchApi({
        url: "v1/city",
        method: "POST",
        body: { countryId: selectedCountry.id, stateId: selectedState.id },
      });
    }
    let selectedCity = cities.data.find(
      (city) => data.additional_info.address.city == city.name
    );
    if (!selectedCity) selectedCity = cities.data[0];

    const selectedLanguage = data.user.language.map((lang) => lang._id);

    this.setState({
      countries: countries.data,
      selectedDepartment:
        data &&
        data.additional_info &&
        data.additional_info.qualif &&
        data.additional_info.qualif.dept_id &&
        data.additional_info.qualif.dept_id._id,
      selectedQualification:
        data &&
        data.additional_info &&
        data.additional_info.qualif &&
        data.additional_info.qualif.highest_qual &&
        data.additional_info.qualif.highest_qual._id,
      selectedSpecialities:
        data &&
        data.additional_info &&
        data.additional_info.qualif &&
        data.additional_info.qualif.specl[0] &&
        data.additional_info.qualif.specl[0]._id,
      states: states.data,
      cities: cities.data,
      department: department.data,
      specialities: specialities.data,
      qualification: qualification.data,
      profileDescription: data.additional_info.desc,
      fees:
        data.additional_info &&
        data.additional_info.qualif &&
        data.additional_info.qualif.fee,
      experience:
        data.additional_info &&
        data.additional_info.qualif &&
        data.additional_info.qualif.exp,
      languages: languages.data,
      selectedLanguage: selectedLanguage,
      countryStateCity: {
        country: { id: selectedCountry.id, name: selectedCountry.name },
        state: { id: selectedState.id, name: selectedState.name },
        city: { id: selectedCity.id, name: selectedCity.name },
      },
      loadingQual: false,
      loadingDept: false,
      loadingSpec: false,
      loadingCountry: false,
      loadingLang: false,
    });
  };

  async componentDidMount() {
    let profile = await fetchApi({
      url: "v1/user/getUserProfile",
      method: "POST",
      body: { user_id: this.state.user_id, type: this.state.type },
    });
    if (this.state.type === constants.USER_TYPE_PATIENT) {
      profile.data.additional_info.med_cond.map((info) => {
        if (info.name === "diabetic") {
          if (info.selected) {
            this.setState({
              diabetics: [
                { id: "yes", value: "Yes", checked: true },
                { id: "no", value: "No", checked: false },
              ],
              isDiabetic: true,
              diabeticValue: moment(info.diag_at).format("YYYY-MM-DD"),
            });
          } else {
            this.setState({
              diabetics: [
                { id: "yes", value: "Yes", checked: false },
                { id: "no", value: "No", checked: true },
              ],
            });
          }
        } else if (info.name === "hypertensive") {
          if (info.selected) {
            this.setState({
              hypertensives: [
                { id: "yes", value: "Yes", checked: true },
                { id: "no", value: "No", checked: false },
              ],
              isHypertensive: true,
              hypertensiveValue: moment(info.diag_at).format("YYYY-MM-DD"),
            });
          } else {
            this.setState({
              hypertensives: [
                { id: "yes", value: "Yes", checked: false },
                { id: "no", value: "No", checked: true },
              ],
            });
          }
        } else if (info.name === "diagnosed_with_covid") {
          if (info.selected) {
            this.setState({
              covids: [
                { id: "yes", value: "Yes", checked: true },
                { id: "no", value: "No", checked: false },
              ],
              covidDetails: info?.desc,
              isCovid: true,
            });
          } else {
            this.setState({
              covids: [
                { id: "yes", value: "Yes", checked: false },
                { id: "no", value: "No", checked: true },
              ],
            });
          }
        } else if (info.name === "past_surgeries") {
          if (info.selected) {
            this.setState({
              surgerys: [
                { id: "yes", value: "Yes", checked: true },
                { id: "no", value: "No", checked: false },
              ],
              surgeryValue: info?.desc,
              isSurgery: true,
            });
          } else {
            this.setState({
              surgerys: [
                { id: "yes", value: "Yes", checked: false },
                { id: "no", value: "No", checked: true },
              ],
            });
          }
        } else if (info.name === "allergy_to_meds") {
          if (info.selected) {
            this.setState({
              allergies: [
                { id: "yes", value: "Yes", checked: true },
                { id: "no", value: "No", checked: false },
              ],
              isAllergie: true,
              allergieValue: info?.desc,
            });
          } else {
            this.setState({
              allergies: [
                { id: "yes", value: "Yes", checked: false },
                { id: "no", value: "No", checked: true },
              ],
            });
          }
        } else if (info.name === "covid_vaccinated") {
          //covid_vaccinated
          if (info.selected) {
            this.setState({
              vaccinated: [
                { id: "yes", value: "Yes", checked: true },
                { id: "no", value: "No", checked: false },
              ],
              isVaccinated: true,
              vaccineDate: moment(info.diag_at).format("YYYY-MM-DD"),
            });
            info.meta.map((dataInfo) => {
              if (dataInfo.name === "dose_type") {
                this.setState({
                  dose: dataInfo.desc,
                });
              } else if (dataInfo.name === "vaccine_name") {
                this.setState({
                  vaccineName: dataInfo?.desc,
                });
              }
            });
          } else {
            this.setState({
              vaccinated: [
                { id: "yes", value: "Yes", checked: false },
                { id: "no", value: "No", checked: true },
              ],
            });
          }
        }
      });
    }

    this.setState({
      data: profile.data,
      otherMedical: profile.data.additional_info.other_med_cond || "",
    });
  }


  handleBookAppointment = (record) => {
    localStorage.setItem("SELECTED_PATIENT_ID", record._id);
    this.props.history.push("/patient/topConsultants");
  };

  handleDiabetic = (id) => {
    this.setState({
      isDiabetic: id === "yes",
    });
    if (id === "no") {
      this.setState({ diabeticValue: "" });
    }
    const newDiabetic = this.state.diabetics.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });
    this.setState({
      diabetics: newDiabetic,
    });
  };

  handleHypertensive = (id) => {
    this.setState({
      isHypertensive: id === "yes",
    });
    if (id === "no") {
      this.setState({ hypertensiveValue: "" });
    }
    const newHypertensives = this.state.hypertensives.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });
    this.setState({
      hypertensives: newHypertensives,
    });
  };

  handleSurgerys = (id) => {
    this.setState({
      isSurgery: id === "yes",
    });
    if (id === "no") {
      this.setState({ surgeryValue: "" });
    }
    const newSurgerys = this.state.hypertensives.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });
    this.setState({
      surgerys: newSurgerys,
    });
  };

  handleAllergies = (id) => {
    this.setState({
      isAllergie: id === "yes",
    });
    if (id === "no") {
      this.setState({ allergieValue: "" });
    }
    const newAllergies = this.state.allergies.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });
    this.setState({
      allergies: newAllergies,
    });
  };

  handleCovids = (id) => {
    this.setState({
      isCovid: id === "yes",
    });
    if (id === "no") {
      this.setState({ covidDetails: "" });
    }

    const newCovids = this.state.covids.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });

    this.setState({
      covids: newCovids,
    });
  };

  handleVaccinated = (id) => {
    this.setState({
      isVaccinated: id === "yes",
    });
    if (id === "no") {
      this.setState({ vaccineDate: "",dose:"",vaccineName:"" });
    }
    

    const newVaccinatedList = this.state.vaccinated.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });

    this.setState({
      vaccinated: newVaccinatedList,
    });
  };

  handleSelect = (key) => {
    this.setState({ key });
  };
  handleClose = () => {
    this.setState({
      show: "",
      updatedModel: null,
    });
  };

  handleChangeDetails = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleShow = (activeTab) => {
    const { show } = this.state;
    if (show == "") {
      this.getDropdownData();
    }
    this.setState({
      show: activeTab,
      updatedModel: {
        user: { ...this.state.data.user },
        additional_info: { ...this.state.data.additional_info },
      },
    });
  };
  handleDateChange = (date) => {
    if (date) {
      let data = this.state.updatedModel;
      data.user.dob = moment(date).format("YYYY-MM-DD");
      this.setState({
        updatedModel: data,
      });
    }
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

  validateData = () => {
    if (this.state.isVaccinated) {
      if (!moment(this.state.vaccineDate, "YYYY-MM-DD", true).isValid()) {
        toast.error("Please Select Date");
        return false;
      }
      if (isEmpty(this.state.dose)) {
        toast.error("Please Select Dose Type");
        return false;
      }
      if (isEmpty(this.state.vaccineName)) {
        toast.error("Please Select Vaccine Name");
        return false;
      }
    }
    if (this.state.isDiabetic) {
      if (!moment(this.state.diabeticValue, "YYYY-MM-DD", true).isValid()) {
        toast.error("Please Select Date of Diabetic");
        return false;
      }
    }
    if (this.state.isHypertensive) {
      if (!moment(this.state.hypertensiveValue, "YYYY-MM-DD", true).isValid()) {
        toast.error("Please Select Date of Hypertensive");
        return false;
      }
    }
    if (this.state.isSurgery) {
      if (isEmpty(this.state.surgeryValue.trim())) {
        toast.error("Please Mention about surgery");
        return false;
      }
    }
    if (this.state.isAllergie) {
      if (isEmpty(this.state.allergieValue.trim())) {
        toast.error("Please Mention about allergies");
        return false;
      }
    }
    if (this.state.isCovid) {
      if (isEmpty(this.state.covidDetails.trim())) {
        toast.error("Please Mention about covidDetails");
        return false;
      }
    }
    return true;
  };

  updateProfile = async (e) => {
    const {
      isDiabetic,
      diabeticValue,
      hypertensiveValue,
      isHypertensive,
      isSurgery,
      surgeryValue,
      allergieValue,
      isAllergie,
      isCovid,
      otherMedical,
      isVaccinated,
      vaccineDate,
      dose,
      vaccineName,
      covidDetails,
      selectedQualification,
      selectedDepartment,
      selectedSpecialities,
      selectedLanguage,
      profileDescription,
    } = this.state;
    e.preventDefault();

    if (this.validateData()) {
      let data = this.state.updatedModel;
      let countryStateCity = this.state.countryStateCity;
      data.additional_info.address = {
        ...data.additional_info.address,
        city: countryStateCity.city.name,
        state: countryStateCity.state.name,
        country: countryStateCity.country.name,
      };
      if (this.state.type === constants.USER_TYPE_DOCTOR) {
        if (
          selectedQualification !== data.additional_info.qualif.highest_qual._id
        ) {
          const QualificationData = this.state.qualification.find(
            (qual) => qual._id === selectedQualification
          );
          data.additional_info.qualif["highest_qual"]["name"] =
            QualificationData.name;
          data.additional_info.qualif["highest_qual"]["_id"] =
            QualificationData._id;
        }
        if (selectedDepartment !== data.additional_info.qualif.dept_id._id) {
          const DepartmentData = this.state.department.find(
            (depart) => depart._id === selectedDepartment
          );
          data.additional_info.qualif["dept_id"]["title"] =
            DepartmentData.title;
          data.additional_info.qualif["dept_id"]["_id"] = DepartmentData._id;
        }
        if (
          selectedSpecialities !== data.additional_info &&
          data.additional_info.qualif &&
          data.additional_info.qualif.specl[0] &&
          data.additional_info.qualif.specl[0]._id
        ) {
          const SpecialitiesData = this.state.specialities.find(
            (specl) => specl._id === selectedSpecialities
          );
          data.additional_info.qualif["specl"][0]["title"] =
            SpecialitiesData.title;
          data.additional_info.qualif["specl"][0]["_id"] = SpecialitiesData._id;
        } else if (
          selectedSpecialities &&
          data.additional_info &&
          data.additional_info.qualif &&
          data.additional_info.qualif.specl.length === 0
        ) {
          const SpecialitiesData = this.state.specialities.find(
            (specl) => specl._id === selectedSpecialities
          );
          const speclData = {
            title : SpecialitiesData.title,
            _id : SpecialitiesData._id
          }
          data.additional_info.qualif.specl.push(speclData);
        }
      }
      if (this.state.type === constants.USER_TYPE_PATIENT) {
        (data.additional_info.med_cond = [
          {
            name: "diabetic",
            selected: isDiabetic,
            diag_at: isDiabetic ? diabeticValue : "",
            desc: "",
          },
          {
            name: "hypertensive",
            selected: isHypertensive,
            diag_at: isHypertensive ? hypertensiveValue : "",
            desc: "",
          },
          {
            name: "diagnosed_with_covid",
            selected: isCovid,
            diag_at: "",
            desc: isCovid ? covidDetails : "",
          },
          {
            name: "past_surgeries",
            selected: isSurgery,
            diag_at: "",
            desc: isSurgery ? surgeryValue : "",
          },
          {
            name: "allergy_to_meds",
            selected: isAllergie,
            diag_at: "",
            desc: isAllergie ? allergieValue : "",
          },
          {
            name: "covid_vaccinated",
            selected: isVaccinated,
            diag_at: isVaccinated ? vaccineDate : "",
            desc: "",
            meta: isVaccinated
              ? [
                  {
                    name: "dose_type",
                    selected: true,
                    diag_at: "",
                    desc: dose,
                  },
                  {
                    name: "vaccine_name",
                    selected: true,
                    diag_at: "",
                    desc: vaccineName,
                  },
                ]
              : [],
          },
        ]),
          (data.additional_info.other_med_cond = otherMedical);
      }

      try {
        let requestBody = {
          ...data.user,
          ...data.additional_info,
          user_id: data.user._id,
          type: this.state.type,
        };
        if (this.state.type === constants.USER_TYPE_DOCTOR) {
          requestBody = {
            ...data.user,
            user_id: data.user._id,
            type: this.state.type,
            language: selectedLanguage,
            address: data.additional_info.address,
            desc: profileDescription,
            qualif: {
              ...data.additional_info.qualif,
              exp: this.state.experience,
              fee: this.state.fees,
              //   address: data.additional_info.address,
            },
          };
        }
        let result = await fetchApi({
          url: "v1/user/updateProfile",
          method: "POST",
          body: requestBody,
        });

        if (result) {
          toast.success(result.message);
          this.setState({ data: result.data });
        }
      } catch (e) {}
      this.setState({ showMenu: false, show: "" });
    }
  };

  async handleItemClick(dropdownItem) {
    let data = this.state.data;
    this.setState({ showMenu: false });
    try {
      let result;
      if (this.state.type === constants.USER_TYPE_PATIENT)
        result = await fetchApi({
          url: "v1/patient/changeStatus",
          method: "POST",
          body: { patient_id: data.additional_info._id, status: dropdownItem },
        });
      else {
        result = await fetchApi({
          url: "v1/doctor/changeStatus",
          method: "POST",
          body: { doctor_id: data.additional_info._id, status: dropdownItem },
        });
      }
      if (result) {
        toast.success(result.message);
        let profile = await fetchApi({
          url: "v1/user/getUserProfile",
          method: "POST",
          body: { user_id: this.state.user_id, type: this.state.type },
        });
        this.setState({ data: profile.data });
      }
    } catch (e) {}
  }

  async getStateForCountry(dropdownItem) {
    let countryId = dropdownItem.target.value;
    let name = this.state.countries[dropdownItem.target.selectedIndex].name;

    try {
      let result = await fetchApi({
        url: "v1/state",
        method: "POST",
        body: { countryId: countryId },
      });

      if (result) {
        this.setState({
          states: result.data,
          countryStateCity: {
            ...this.state.countryStateCity,
            country: { id: countryId, name: name },
          },
        });
      }
    } catch (e) {}
  }

  async getCityForState(dropdownItem) {
    let countryStateCity = this.state.countryStateCity;
    let stateId = dropdownItem.target.value;
    let name = this.state.states[dropdownItem.target.selectedIndex].name;
    try {
      let result = await fetchApi({
        url: "v1/city",
        method: "POST",
        body: { countryId: countryStateCity.country.id, stateId: stateId },
      });

      if (result) {
        this.setState({
          cities: result.data,
          countryStateCity: {
            ...countryStateCity,
            state: { id: stateId, name: name },
          },
        });
      }
    } catch (e) {}
  }

  renderLanguage = (language) => {
    if (language.length > 0) {
      const languageName = language.map((lang) => lang.name);
      return languageName.join(", ");
    }
  };

  async selectCity(dropdownItem) {
    let countryStateCity = this.state.countryStateCity;
    let city = dropdownItem.target.value;
    let name = this.state.cities[dropdownItem.target.selectedIndex].name;
    this.setState({
      countryStateCity: { ...countryStateCity, city: { id: city, name: name } },
    });
  }

  handleLanguage = async (e) => {
    const value = e.target.value;
    this.setState({
      selectedLanguage: value,
    });
  };

  handleDropdownClick() {
    let isShown = this.state.showMenu;
    this.setState({ showMenu: !isShown });
  }

  showDropDownMenu() {
    return this.state.showMenu;
  }

  updateUserProfile = async (file) => {
    let params = {
      dp: file,
      user_id: this.state.user_id,
      type: this.state.type,
    };
    try {
      let result = await fetchApi({
        url: "v1/user/updateProfile",
        method: "POST",
        body: params,
      });

      if (result) {
        toast.success(result.message);
        this.setState({ data: result.data });
      }
    } catch (e) {}
  };

  handleImage = (file) => {
    this.updateUserProfile(file);
  };

  renderPatientMoreFields = () => {
    return (
      <div className="row form-row">
        <div className="col-12 col-sm-6">
          <div className="form-group">
            <label>Height</label>
            <input
              type="number"
              step=".01"
              className="form-control"
              name="additional_info.height"
              onChange={this.handleChange}
              value={this.state.updatedModel.additional_info.height}
            />
          </div>
        </div>
        <div className="col-12 col-sm-6">
          <div className="form-group">
            <label>Weight</label>
            <input
              type="number"
              className="form-control"
              name="additional_info.weight"
              onChange={this.handleChange}
              value={this.state.updatedModel.additional_info.weight}
            />
          </div>
        </div>
      </div>
    );
  };
  // handleSave = (e) => {
  //   e.preventDefault();

  //   if (this.state.isVaccinated) {
  //     if (!moment(this.state.vaccineDate, "YYYY-MM-DD", true).isValid()) {
  //       toast.error("Please Select Date");
  //     }
  //     if (isEmpty(this.state.vaccineName)) {
  //       toast.error("Please Select Vaccine Name");
  //     }
  //     if (isEmpty(this.state.dose)) {
  //       toast.error("Please Select Dose Type");
  //     }
  //   }

  //   if (
  //     this.state.vaccinated &&
  //     moment(this.state.vaccineDate, "YYYY-MM-DD", true).isValid() &&
  //     this.state.vaccineName &&
  //     this.state.dose
  //   ) {
  //     this.updateProfile(e);
  //   }
  // };

  render() {
    return (
      <div>
        <SidebarNav />
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
                        {this.state.data.user.dp ? (
                          <img
                            className="rounded-circle"
                            alt="User"
                            src={this.state.data.user.dp}
                          />
                        ) : (
                          <img
                            className="rounded-circle"
                            alt="User"
                            src={whiteBgIco}
                          />
                        )}
                        <UploadImage
                          className="camera-icon-custom"
                          getImage={this.handleImage}
                        />
                        {/* <img className="profile_camera_icon" src={cameraIco} alt="camera-icon" /> */}
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
                          <i className="fa fa-map-marker" aria-hidden="true" />{" "}
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
                        {this.state.type == constants.USER_TYPE_PATIENT && renderButton(() =>
                          this.handleBookAppointment(
                            this.state.data.additional_info
                          )
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
              unmountOnExit={true}
              mountOnEnter={true}
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
                            <a
                              className="edit-link"
                              onClick={() => this.handleShow("1")}
                            >
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
                          {this.state.type === constants.USER_TYPE_DOCTOR && (
                            <div className="row">
                              <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                Language
                              </p>
                              <p className="col-sm-10">
                                {this.renderLanguage(
                                  this.state.data.user.language
                                )}
                              </p>
                            </div>
                          )}
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
                          {this.state.type === constants.USER_TYPE_DOCTOR && (
                            <div className="row">
                              <p className="col-sm-2 text-muted text-sm-right mb-0">
                                Profile Description
                              </p>
                              <p className="col-sm-10 mb-0">
                                {this.state.data.additional_info.desc}
                              </p>
                            </div>
                          )}
                          {this.state.type === constants.USER_TYPE_PATIENT && (
                            <>
                              <div className="row">
                                <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                  Height
                                </p>
                                <p className="col-sm-10 mb-0">
                                  {this.state.data.additional_info.height}
                                </p>
                              </div>
                              <div className="row">
                                <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                  Weight
                                </p>
                                <p className="col-sm-10 mb-0">
                                  {this.state.data.additional_info.weight}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Tab>
              {this.state.type == constants.USER_TYPE_DOCTOR && (
                <Tab
                  className="nav-link"
                  eventKey={2}
                  title="Additional Details"
                >
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card">
                        {this.state.data && (
                          <div className="card-body">
                            <h5 className="card-title d-flex justify-content-between">
                              <span>Additional Details</span>
                              <a
                                className="edit-link"
                                onClick={() => this.handleShow("2")}
                              >
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
                            {this.state.data.additional_info.qualif.exp && (
                              <div className="row">
                                <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                  Experience
                                </p>
                                <p className="col-sm-10">
                                  {this.state.data.additional_info.qualif.exp}
                                </p>
                              </div>
                            )}
                            <div className="row">
                              <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                Specialities
                              </p>
                              <p className="col-sm-10">
                                {this.state.data.additional_info &&
                                  this.state.data.additional_info.qualif &&
                                  this.state.data.additional_info.qualif
                                    .specl[0] &&
                                  this.state.data.additional_info.qualif
                                    .specl[0].title}
                              </p>
                            </div>
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
                </Tab>
              )}
              {this.state.type == constants.USER_TYPE_PATIENT && (
                <Tab
                  className="nav-link"
                  eventKey={2}
                  title="Additional Details"
                >
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card">
                        {this.state.data && (
                          <div className="card-body">
                            <h5 className="card-title d-flex justify-content-between">
                              <span>Additional Details</span>
                              <a
                                className="edit-link"
                                onClick={() => this.handleShow("2")}
                              >
                                <i className="fa fa-edit mr-1"></i>Edit
                              </a>
                            </h5>
                            {/**/}
                            {this.state.type ===
                              constants.USER_TYPE_PATIENT && (
                              <>
                                <div className="row">
                                  <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                    Are you Diabetic?
                                  </p>
                                  <p className="col-sm-10 mb-0">
                                    {this.state.data.additional_info &&
                                      this.state.data.additional_info.med_cond.map(
                                        (info) => {
                                          if (
                                            info.name === "diabetic" &&
                                            info.selected === true
                                          ) {
                                            return `YES, since ${moment(
                                              info.diag_at
                                            )?.format("DD-MM-YYYY")}`;
                                          } else if (info.name === "diabetic") {
                                            return "NO";
                                          }
                                        }
                                      )}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                    Are you Hypertensive?
                                  </p>
                                  <p className="col-sm-10 mb-0">
                                    {this.state.data.additional_info &&
                                      this.state.data.additional_info.med_cond.map(
                                        (info) => {
                                          if (
                                            info.name === "hypertensive" &&
                                            info.selected === true
                                          ) {
                                            return `YES, since ${moment(
                                              info.diag_at
                                            )?.format("DD-MM-YYYY")}`;
                                          } else if (
                                            info.name === "hypertensive"
                                          ) {
                                            return "NO";
                                          }
                                        }
                                      )}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                    Any past surgery?
                                  </p>
                                  <p className="col-sm-10 mb-0">
                                    {this.state.data.additional_info &&
                                      this.state.data.additional_info.med_cond.map(
                                        (info) => {
                                          if (
                                            info.name === "past_surgeries" &&
                                            info.selected === true
                                          ) {
                                            return `YES, ${info.desc}`;
                                          } else if (
                                            info.name === "past_surgeries"
                                          ) {
                                            return "NO";
                                          }
                                        }
                                      )}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                    Any allergies to medications?
                                  </p>
                                  <p className="col-sm-10 mb-0">
                                    {this.state.data.additional_info &&
                                      this.state.data.additional_info.med_cond.map(
                                        (info) => {
                                          if (
                                            info.name === "allergy_to_meds" &&
                                            info.selected === true
                                          ) {
                                            return `YES, ${info.desc}`;
                                          } else if (
                                            info.name === "allergy_to_meds"
                                          ) {
                                            return "NO";
                                          }
                                        }
                                      )}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                    Have you been diagnosed with Covid?
                                  </p>
                                  <p className="col-sm-10 mb-0">
                                    {this.state.data.additional_info &&
                                      this.state.data.additional_info.med_cond.map(
                                        (info) => {
                                          if (
                                            info.name ===
                                              "diagnosed_with_covid" &&
                                            info.selected === true
                                          ) {
                                            return `YES, ${info.desc}`;
                                          } else if (
                                            info.name === "diagnosed_with_covid"
                                          ) {
                                            return "NO";
                                          }
                                        }
                                      )}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                    Have you been vaccinated against Covid?
                                  </p>
                                  <p className="col-sm-10 mb-0">
                                    {this.state.data.additional_info &&
                                      this.state.data.additional_info.med_cond.map(
                                        (info) => {
                                          if (
                                            info.name === "covid_vaccinated" &&
                                            info.selected === true
                                          ) {
                                            return `YES, since ${moment(
                                              info.diag_at
                                            )?.format("DD-MM-YYYY")} with ${
                                              info.meta.length > 0 &&
                                              info.meta[0].desc
                                            }
                                             dose of ${
                                               info.meta.length > 0 &&
                                               info.meta[1].desc
                                             }`;
                                          } else if (
                                            info.name === "covid_vaccinated"
                                          ) {
                                            return "NO";
                                          }
                                        }
                                      )}
                                  </p>
                                </div>
                                <div className="row">
                                  <p className="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">
                                    Other medical conditions
                                  </p>
                                  <p className="col-sm-10 mb-0">
                                    {this.state.otherMedical}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Tab>
              )}
              {this.state.type == constants.USER_TYPE_DOCTOR && (
                <Tab className="nav-link" eventKey={3} title="Update Slots">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card">
                        {this.state.data && (
                          <div className="card-body">
                            <h5 className="card-title d-flex justify-content-between">
                              <span>Update Slots</span>
                            </h5>
                            <UpdateSchedule data={this.state.data} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Tab>
              )}
            </Tabs>
          </div>
        </div>
        {/* modal */}
        <Modal show={this.state.show === "1"} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h5 className="modal-title">Personal Details</h5>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.updatedModel && (
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
                          maxlength="20"
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
                          maxlength="20"
                          value={this.state.updatedModel.user.last_name}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>Date of Birth</label>
                        <div className="cal-icon-modal">
                          <DatePicker
                            className="form-control"
                            dateFormat={"yyyy-MM-dd"}
                            minDate={
                              new Date(
                                moment(new Date())
                                  .subtract(100, "years")
                                  .format("DD-MM-YYYY")
                              )
                            }
                            maxDate={
                              new Date(moment(new Date()).format("DD-MM-YYYY"))
                            }
                            selected={
                              new Date(this.state.updatedModel.user.dob)
                            }
                            placeholderText="yyyy-mm-dd"
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
                    {this.state.type === constants.USER_TYPE_DOCTOR && (
                      <div className="col-12 col-sm-6">
                        {this.state.loadingLang && (
                          <div
                            style={{
                              position: "absolute",
                              marginTop: "15%",
                              marginLeft: "40%",
                            }}
                          >
                            <Spinner
                              type="Oval"
                              showLoader={this.state.loadingLang}
                              width={40}
                              height={40}
                            />
                          </div>
                        )}
                        <MultiSelect
                          className="languageRegistration"
                          label="Language"
                          selected={this.state.selectedLanguage}
                          options={this.state.languages}
                          handleChange={this.handleLanguage}
                        />
                      </div>
                    )}
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
                      {this.state.loadingCountry && (
                        <div
                          style={{
                            position: "absolute",
                            marginTop: "7%",
                            marginLeft: "40%",
                          }}
                        >
                          <Spinner
                            type="Oval"
                            showLoader={this.state.loadingCountry}
                            width={40}
                            height={40}
                          />
                        </div>
                      )}
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

                  {this.state.type === constants.USER_TYPE_DOCTOR && (
                    <div className="form-group">
                      <label htmlFor="profile_description">
                        Profile Description
                      </label>
                      <textarea
                        className="form-control"
                        id="profile_description"
                        rows="5"
                        style={{ minHeight: 80 }}
                        onChange={(e) =>
                          this.setState({ profileDescription: e.target.value })
                        }
                        value={this.state.profileDescription}
                      />
                    </div>
                  )}

                  <div className="patient-more-fields">
                    {this.state.type === constants.USER_TYPE_PATIENT &&
                      this.renderPatientMoreFields()}
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
        {this.state.type === constants.USER_TYPE_DOCTOR && (
          <Modal show={this.state.show === "2"} onHide={this.handleClose}>
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
                        {this.state.loadingQual && (
                          <div
                            style={{
                              position: "absolute",
                              marginTop: "15%",
                              marginLeft: "40%",
                            }}
                          >
                            <Spinner
                              type="Oval"
                              showLoader={this.state.loadingQual}
                              width={40}
                              height={40}
                            />
                          </div>
                        )}
                        <div className="form-group">
                          <label>Qualification</label>
                          <select
                            value={this.state.selectedQualification}
                            name="selectedQualification"
                            onChange={(e) => this.handleChangeDetails(e)}
                            className="form-control"
                          >
                            {this.state.qualification?.map((qual) => {
                              return (
                                <option value={qual._id}>
                                  {changeCaseFirstLetter(qual.name)}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        {this.state.loadingDept && (
                          <div
                            style={{
                              position: "absolute",
                              marginTop: "15%",
                              marginLeft: "40%",
                            }}
                          >
                            <Spinner
                              type="Oval"
                              showLoader={this.state.loadingDept}
                              width={40}
                              height={40}
                            />
                          </div>
                        )}
                        <div className="form-group">
                          <label>Department</label>
                          <select
                            value={this.state.selectedDepartment}
                            name="selectedDepartment"
                            onChange={(e) => this.handleChangeDetails(e)}
                            className="form-control"
                          >
                            {this.state.department?.map((depart) => {
                              return (
                                <option value={depart._id}>
                                  {changeCaseFirstLetter(depart.title)}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      {this.state.data.additional_info.qualif.exp && (
                        <div className="col-12 col-sm-6">
                          <div className="form-group">
                            <label>Experience</label>
                            <input
                              type="number"
                              className="form-control"
                              onChange={(e) => {
                                this.setState({ experience: e.target.value });
                              }}
                              name="additional_info.qualif.exp"
                              value={this.state.experience}
                            />
                          </div>
                        </div>
                      )}
                      <div className="col-12 col-sm-6">
                        <div className="form-group">
                          <label>Fee</label>
                          <input
                            type="text"
                            name="additional_info.qualif.fee"
                            onChange={(e) => {
                              this.setState({ fees: e.target.value });
                            }}
                            value={this.state.fees}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-12">
                        {this.state.loadingSpec && (
                          <div
                            style={{
                              position: "absolute",
                              marginTop: "7%",
                              marginLeft: "40%",
                            }}
                          >
                            <Spinner
                              type="Oval"
                              showLoader={this.state.loadingSpec}
                              width={40}
                              height={40}
                            />
                          </div>
                        )}
                        <div className="form-group">
                          <label>Specialities</label>
                          <select
                            value={this.state.selectedSpecialities}
                            name="selectedSpecialities"
                            onChange={(e) => this.handleChangeDetails(e)}
                            className="form-control"
                          >
                            {this.state.specialities?.map((spec) => {
                              return (
                                <option value={spec._id}>
                                  {changeCaseFirstLetter(spec.title)}
                                </option>
                              );
                            })}
                          </select>
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
          </Modal>
        )}
        {/* Addition Details Modal for Patient */}
        {this.state.type === constants.USER_TYPE_PATIENT && (
          <Modal show={this.state.show === "2"} onHide={this.handleClose}>
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
                          {/*<Col md>*/}
                          <div className="form-group">
                            <Radio
                              labelStyle={{ paddingLeft: "15px", fontSize: "16px" }}
                              inputRowStyle={{
                                paddingLeft: "15px",
                                marginLeft: "5px",
                              }}
                              label="Are you Diabetic?"
                              id="radioDiabetes"
                              options={this.state.diabetics}
                              handleSelect={this.handleDiabetic}
                            />
                          </div>
                          {this.state.isDiabetic && (
                            <div className="form-group">
                              <Col className="no-padding">
                                <br />
                                <br />{" "}
                                <Form.Control
                                  type="date"
                                  value={this.state.diabeticValue}
                                  min={moment(new Date())
                                    .subtract(50, "years")
                                    .format("YYYY-MM-DD")}
                                  max={moment(new Date()).format("YYYY-MM-DD")}
                                  onChange={(e) =>
                                    this.setState({
                                      diabeticValue: e.target.value,
                                      diabeticValueSelected: true,
                                    })
                                  }
                                />
                              </Col>
                            </div>
                          )}
                          {/*</Col>*/}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-group">
                          <Radio
                            labelStyle={{ paddingLeft: "15px", fontSize: "16px" }}
                            inputRowStyle={{
                              paddingLeft: "15px",
                              marginLeft: "5px",
                            }}
                            label="Are you Hypertensive?"
                            id="radioHypertensive"
                            options={this.state.hypertensives}
                            handleSelect={this.handleHypertensive}
                          />
                        </div>
                        <div className="form-group">
                          {this.state.isHypertensive && (
                            <Col className="no-padding">
                              <br />
                              <br />{" "}
                              <Form.Control
                                type="date"
                                value={this.state.hypertensiveValue}
                                min={moment(new Date())
                                  .subtract(50, "years")
                                  .format("YYYY-MM-DD")}
                                max={moment(new Date()).format("YYYY-MM-DD")}
                                onChange={(e) =>
                                  this.setState({
                                    hypertensiveValue: e.target.value,
                                    hypertensiveValueSelected: true,
                                  })
                                }
                              />
                            </Col>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-group">
                          <Col md className="no-padding">
                            <div className="form-group">
                              <Radio
                                labelStyle={{ paddingLeft: "15px", fontSize: "16px" }}
                                inputRowStyle={{
                                  paddingLeft: "15px",
                                  marginLeft: "5px",
                                }}
                                label="Any past surgery?"
                                id="radioSurgery"
                                options={this.state.surgerys}
                                handleSelect={this.handleSurgerys}
                              />
                            </div>
                            {this.state.isSurgery && (
                              <div className="form-group">
                                <TextArea
                                  noPadding
                                  id={"surgery"}
                                  value={this.state.surgeryValue}
                                  placeholder="Please mention in brief"
                                  onChange={(value) =>
                                    this.setState({
                                      surgeryValue: value,
                                    })
                                  }
                                  rows={4}
                                  cols={35}
                                ></TextArea>
                              </div>
                            )}
                          </Col>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-group">
                          <Col md className="no-padding">
                            <div className="form-group">
                              <Radio
                                labelStyle={{ paddingLeft: "15px", fontSize: "16px" }}
                                inputRowStyle={{
                                  paddingLeft: "15px",
                                  marginLeft: "5px",
                                }}
                                label="Any allergies to medications?"
                                id="radioAllergies"
                                options={this.state.allergies}
                                handleSelect={this.handleAllergies}
                              />
                            </div>
                            {/*<div className="form-group">*/}
                            {this.state.isAllergie && (
                              <TextArea
                                noPadding
                                id={"textareaSurgery"}
                                value={this.state.allergieValue}
                                placeholder="Please mention in brief"
                                onChange={(value) =>
                                  this.setState({
                                    allergieValue: value,
                                  })
                                }
                                // rows={4}
                                // cols={35}
                              ></TextArea>
                            )}
                            {/*</div>*/}
                          </Col>
                        </div>
                      </div>
                      {/*</div>*/}
                      <div className="form-group">
                        <Col md>
                          <div className="form-group">
                            <Radio
                              label="Have you been diagnosed with Covid?"
                              id="diagCovid"
                              options={this.state.covids}
                              handleSelect={this.handleCovids}
                              labelStyle={{fontSize: "16px" }}
                            />
                          </div>
                        </Col>
                        <Col md className="no-padding">
                          <div className="form-group">
                            {this.state.isCovid && (
                              <Col md className="no-padding">
                                <Input
                                  required={true}
                                  type="text"
                                  labelStyle={{ fontSize: "16px" }}
                                  inputStyle={{paddingLeft: "15px"}}
                                  placeholder="Enter additional details"
                                  label="Provide additional details of Covid illness"
                                  value={this.state.covidDetails}
                                  onChange={(value) =>
                                    this.setState({
                                      covidDetails: value,
                                    })
                                  }
                                />
                              </Col>
                            )}
                          </div>
                        </Col>
                        <Col md>
                          <div className="form-group">
                            <Radio
                              labelStyle={{ fontSize: "16px" }}
                              label="Have you been vaccinated against Covid?"
                              id="vaccinated"
                              options={this.state.vaccinated}
                              handleSelect={this.handleVaccinated}
                            />
                          </div>
                          <div className="form-group">
                            {this.state.isVaccinated && (
                              <Col md>
                                <Form.Control
                                  type="date"
                                  value={this.state.vaccineDate}
                                  min={moment(new Date())
                                    .subtract(50, "years")
                                    .format("YYYY-MM-DD")}
                                  max={moment(new Date()).format("YYYY-MM-DD")}
                                  onChange={(e) => {
                                    this.setState({
                                      vaccineDate: e.target.value,
                                      vaccineDateSelected: true,
                                    });
                                  }}
                                />
                                <div className="p-10" />
                                <Selector
                                  required={true}
                                  defaultValue="Choose dose type"
                                  id="dose"
                                  options={this.state.dosages}
                                  // handleSelect={this.setDose}
                                  handleSelect={(item) => {
                                    this.setState({
                                      dose: item,
                                      doseSelected: true,
                                    });
                                  }}
                                  value={this.state.dose}
                                />

                                <Selector
                                  id="v-name"
                                  defaultValue="Choose vaccine name"
                                  options={this.state.vaccineNames}
                                  // handleSelect={setVaccineName}
                                  handleSelect={(item) => {
                                    this.setState({
                                      vaccineName: item,
                                      vaccineNameSelected: true,
                                    });
                                  }}
                                  value={this.state.vaccineName}
                                />
                              </Col>
                            )}
                          </div>
                        </Col>
                      </div>
                      {/*<div className="col-12 col-sm-6">*/}
                      <div
                        style={{ marginLeft: "3%", width: "100%" }}
                        className="form-group"
                      >
                        <Col md className="no-padding">
                          <div className="form-group">
                            <TextArea
                              labelStyle={{ fontSize: "16px" }}
                              noPadding
                              label="Other medical conditions"
                              id={"other-condition"}
                              value={this.state.otherMedical}
                              placeholder="Add conditions"
                              onChange={(value) =>
                                this.setState({
                                  otherMedical: value,
                                })
                              }
                              // onChange={setOtherMedical}
                              rows={1}
                              cols={20}
                            ></TextArea>
                          </div>
                        </Col>
                        {/*<Col md></Col>*/}
                      </div>
                      {/*</div>*/}
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={this.updateProfile}
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
            </Modal.Body>
          </Modal>
        )}
      </div>
    );
  }
}

export default Profile;
