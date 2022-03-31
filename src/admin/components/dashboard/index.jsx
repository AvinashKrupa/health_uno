import React, { Component } from "react";
import SidebarNav from "../sidebar";
import StatusChart from "./status";
import RevenueChart from "./revenue";
import TableDoctor from "./tableDoctor";
import TablePatientsList from "./tablePatientList";
import TableAppointmentList from "./appointment";
import { fetchApi } from "../../../_utils/http-utils";
import Spinner from "../spinner";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      doctors: [],
      patients: [],
      headerData: [],
      loading: false,
    };
  }
  async componentDidMount() {
    this.setState({
      loading: true,
    });
    // let patients = await fetchApi({ url: "v1/patients", method: "GET" });
    let headerData = await fetchApi({
      url: "v1/dashboard/headerData",
      method: "GET",
    });
    // let doctors = await fetchApi({ url: "v1/doctors", method: "GET" });
    this.setState({
      // patients: patients.data,
      // doctors: doctors.data,
      headerData: headerData.data,
      loading: false,
    });
  }

  render() {
    return (
      <>
        <SidebarNav />

        <div className="page-wrapper">
          {this.state.loading && (
            <Spinner showLoader={this.state.loading} width={200} height={200} />
          )}
          <div className="content container-fluid">
            {!this.state.loading && (
              <>
                <div className="page-header">
                  <div className="row">
                    <div className="col-sm-12">
                      <h3 className="page-title">Welcome Admin!</h3>
                      <ul className="breadcrumb">
                        <li className="breadcrumb-item active">Dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* breadcrumb */}

                <div className="row">
                  <div className="col-xl-3 col-sm-6 col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="dash-widget-header">
                          <span className="dash-widget-icon text-primary border-primary">
                            <i className="fe fe-users"></i>
                          </span>
                          <div className="dash-count">
                            <h3>{this.state.headerData.doctors}</h3>
                          </div>
                        </div>
                        <div className="dash-widget-info">
                          <h6 className="text-muted">Doctors</h6>
                          {/* <div className="progress progress-sm">
                        <div className="progress-bar bg-primary w-50"></div>
                      </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-sm-6 col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="dash-widget-header">
                          <span className="dash-widget-icon text-success">
                            <i className="fe fe-credit-card"></i>
                          </span>
                          <div className="dash-count">
                            <h3>{this.state.headerData.patients}</h3>
                          </div>
                        </div>
                        <div className="dash-widget-info">
                          <h6 className="text-muted">Patients</h6>
                          {/* <div className="progress progress-sm">
                        <div className="progress-bar bg-success w-50"></div>
                      </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-sm-6 col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="dash-widget-header">
                          <span className="dash-widget-icon text-danger border-danger">
                            <i className="fe fe-money"></i>
                          </span>
                          <div className="dash-count">
                            <h3>{this.state.headerData.appointments}</h3>
                          </div>
                        </div>
                        <div className="dash-widget-info">
                          <h6 className="text-muted">Appointments</h6>
                          {/* <div className="progress progress-sm">
                        <div className="progress-bar bg-danger w-50"></div>
                      </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {}
                  <div className="col-xl-3 col-sm-6 col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="dash-widget-header">
                          <span className="dash-widget-icon text-warning border-warning">
                            <i className="fe fe-folder"></i>
                          </span>
                          <div className="dash-count">
                            <h3>₹{this.state.headerData.revenue}</h3>
                          </div>
                        </div>
                        <div className="dash-widget-info">
                          <h6 className="text-muted">Revenue</h6>
                          {/* <div className="progress progress-sm">
                        <div className="progress-bar bg-warning w-50"></div>
                      </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* </div>
            <div className="row">
              <div className="col-md-12 col-lg-6">
                Sales Chart
                <div className="card card-chart">
                  <div className="card-header">
                    <h4 className="card-title">Revenue</h4>
                  </div>
                  <div className="card-body">
                    <RevenueChart />
                  </div>
                </div>
                /Sales Chart
              </div>
              <div className="col-md-12 col-lg-6">
                Sales Chart
                <div className="card card-chart">
                  <div className="card-header">
                    <h4 className="card-title">Revenue</h4>
                  </div>
                  <div className="card-body">
                    <StatusChart />
                  </div>
                </div>
                /Sales Chart
              </div> */}
                </div>
                {/*  row */}
                {/* <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <div className="card card-table flex-fill">
                      <div className="card-header">
                        <h4 className="card-title">Doctors List</h4>
                      </div>
                      <div className="card-body">
                        <TableDoctor doctors={this.state.doctors} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <div className="card card-table flex-fill">
                      <div className="card-header">
                        <h4 className="card-title">Patients List</h4>
                      </div>
                      <div className="card-body">
                        <TablePatientsList patients={this.state.patients} />
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <div className="card card-table flex-fill">
                      <TableAppointmentList />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
