import React, { Component } from "react";
import BlogDetails from "../Blog/blogdetails";
import toast from "react-hot-toast";
import SidebarNav from "../sidebar";
import { fetchApi } from "../../../_utils/http-utils";

class VersionSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        patient: {
          android_ver_mandatory: "2",
          ios_ver_mandatory: "1",
          android_ver_latest: "1",
          ios_ver_latest: "1",
        },
        doctor: {
          android_ver_mandatory: "1",
          ios_ver_mandatory: "1",
          android_ver_latest: "1",
          ios_ver_latest: "1",
        },
      },
      invalid: false,
    };
  }
  async componentDidMount() {
    await this.reloadData();
  }

  async reloadData() {
    let result = await fetchApi({
      url: "v1/config/getCurrentVersions",
      method: "GET",
    });
    this.setState({ data: result.data });
  }

  handleIosMandVerChange(e) {
    this.setState({ iosMandVer: e.target.value });
  }

  handleIosLatVerChange(e) {
    this.setState({ iosLatVer: e.target.value });
  }

  handleAndriodMandVerChange(e) {
    this.setState({ andriodMandVer: e.target.value });
  }

  handleAndriodLatVerChange(e) {
    this.setState({ andriodLatVer: e.target.value });
  }

  validation(iosMandVer, iosLatVer, andriodMandVer, andriodLatVer) {
    let errorMessage =
      "Mandatory version should be less than and equal to optional version";

    if (
      iosMandVer === "" ||
      iosLatVer === "" ||
      andriodMandVer === "" ||
      andriodLatVer === ""
    ) {
      let errorMessage = `All fields are required `;
      toast.error(errorMessage);
      return false;
    }

    if (iosMandVer && iosMandVer !== "" && iosLatVer && iosLatVer !== "") {
      if (iosMandVer > iosLatVer) {
        toast.error(errorMessage);
        return false;
      }
    }
    if (
      andriodMandVer &&
      andriodMandVer !== "" &&
      andriodLatVer &&
      andriodLatVer !== ""
    ) {
      if (andriodMandVer > andriodLatVer) {
        toast.error(errorMessage);
        return false;
      }
    }

    return true;
  }

  async handleItemClick(type) {
    // tpye = 1 => Patient, type 2=> Doctor

    const {
      ios_ver_latest,
      ios_ver_mandatory,
      android_ver_mandatory,
      android_ver_latest,
    } = type == 1 ? this.state.data.patient : this.state.data.doctor;
    let iosMandVer = ios_ver_mandatory;
    let iosLatVer = ios_ver_latest;
    let andriodMandVer = android_ver_mandatory;
    let andriodLatVer = android_ver_latest;

    const isValid = this.validation(
      iosMandVer,
      iosLatVer,
      andriodMandVer,
      andriodLatVer
    );
    let params = {};
    if (type == 1) {
      params = {
        patient: {
          android_ver_mandatory: andriodMandVer,
          ios_ver_mandatory: iosMandVer,
          android_ver_latest: andriodLatVer,
          ios_ver_latest: iosLatVer,
        },
      };
    } else {
      params = {
        doctor: {
          android_ver_mandatory: andriodMandVer,
          ios_ver_mandatory: iosMandVer,
          android_ver_latest: andriodLatVer,
          ios_ver_latest: iosLatVer,
        },
      };
    }
    if (isValid) {
      try {
        let result = await fetchApi({
          url: "v1/config/updateVersion",
          method: "POST",
          body: params,
        });
        if (result) {
          toast.success(result.message);
        }
      } catch (e) {
      }
    }
  }

  render() {
    return (
      <>
        <SidebarNav />
        <div className="page-wrapper">
          <div className="container-fluid">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">Settings</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/admin">Dashboard</a>
                    </li>
                    {/* <li className="breadcrumb-item"><a href="#0">Settings</a></li> */}
                    <li className="breadcrumb-item active">Version Settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div
                  className="page-header"
                  style={{ marginBottom: 8, marginLeft: 16 }}
                >
                  <div className="row">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item active">
                        Patient Application
                      </li>
                    </ul>
                  </div>
                </div>

                <form action="#">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12">
                          <div
                            className="form-group"
                            style={{ fontWeight: "bold" }}
                          >
                            <label>Ios Mandatory Version</label>
                            <input
                              type="text"
                              placeholder="version number"
                              className="form-control"
                              value={this.state.data.patient.ios_ver_mandatory}
                              onChange={(e) => {
                                this.state.data.patient.ios_ver_mandatory =
                                  e.target.value;
                                this.setState({
                                  data: JSON.parse(
                                    JSON.stringify(this.state.data)
                                  ),
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div
                            className="form-group"
                            style={{ fontWeight: "bold" }}
                          >
                            <label>Ios Latest Version</label>
                            <input
                              type="text"
                              placeholder="version number"
                              className="form-control"
                              value={this.state.data.patient.ios_ver_latest}
                              onChange={(e) => {
                                this.state.data.patient.ios_ver_latest =
                                  e.target.value;
                                this.setState({
                                  data: JSON.parse(
                                    JSON.stringify(this.state.data)
                                  ),
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div
                            className="form-group"
                            style={{ fontWeight: "bold" }}
                          >
                            <label>Android Mandatory Version</label>
                            <input
                              type="text"
                              placeholder="version number"
                              className="form-control"
                              value={
                                this.state.data.patient.android_ver_mandatory
                              }
                              onChange={(e) => {
                                this.state.data.patient.android_ver_mandatory =
                                  e.target.value;
                                this.setState({
                                  data: JSON.parse(
                                    JSON.stringify(this.state.data)
                                  ),
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div
                            className="form-group"
                            style={{ fontWeight: "bold" }}
                          >
                            <label>Android Latest Version</label>
                            <input
                              type="text"
                              placeholder="version number"
                              className="form-control"
                              value={this.state.data.patient.android_ver_latest}
                              onChange={(e) => {
                                this.state.data.patient.android_ver_latest =
                                  e.target.value;
                                this.setState({
                                  data: JSON.parse(
                                    JSON.stringify(this.state.data)
                                  ),
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <button
                            class="btn btn-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              this.handleItemClick(1);
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-md-6 col-sm-12">
                <div
                  className="page-header"
                  style={{ marginBottom: 8, marginLeft: 16 }}
                >
                  <div className="row">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item active">
                        Doctor Application
                      </li>
                    </ul>
                  </div>
                </div>
                <form action="#">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12">
                          <div
                            className="form-group"
                            style={{ fontWeight: "bold" }}
                          >
                            <label>Ios Mandatory Version</label>
                            <input
                              type="text"
                              placeholder="version number"
                              className="form-control"
                              value={this.state.data.doctor.ios_ver_mandatory}
                              onChange={(e) => {
                                this.state.data.doctor.ios_ver_mandatory =
                                  e.target.value;
                                this.setState({
                                  data: JSON.parse(
                                    JSON.stringify(this.state.data)
                                  ),
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div
                            className="form-group"
                            style={{ fontWeight: "bold" }}
                          >
                            <label>Ios Latest Version</label>
                            <input
                              type="text"
                              placeholder="version number"
                              className="form-control"
                              value={this.state.data.doctor.ios_ver_latest}
                              onChange={(e) => {
                                this.state.data.doctor.ios_ver_latest =
                                  e.target.value;
                                this.setState({
                                  data: JSON.parse(
                                    JSON.stringify(this.state.data)
                                  ),
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div
                            className="form-group"
                            style={{ fontWeight: "bold" }}
                          >
                            <label>Android Mandatory Version</label>
                            <input
                              type="text"
                              placeholder="version number"
                              className="form-control"
                              value={
                                this.state.data.doctor.android_ver_mandatory
                              }
                              onChange={(e) => {
                                this.state.data.doctor.android_ver_mandatory =
                                  e.target.value;
                                this.setState({
                                  data: JSON.parse(
                                    JSON.stringify(this.state.data)
                                  ),
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div
                            className="form-group"
                            style={{ fontWeight: "bold" }}
                          >
                            <label>Android Latest Version</label>
                            <input
                              type="text"
                              placeholder="version number"
                              className="form-control"
                              value={this.state.data.doctor.android_ver_latest}
                              onChange={(e) => {
                                this.state.data.doctor.android_ver_latest =
                                  e.target.value;
                                this.setState({
                                  data: JSON.parse(
                                    JSON.stringify(this.state.data)
                                  ),
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <button
                            class="btn btn-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              this.handleItemClick(2);
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default VersionSettings;
