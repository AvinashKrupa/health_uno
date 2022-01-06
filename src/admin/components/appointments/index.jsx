import React, { Component } from "react";
import { Table, ExportTableButton } from "ant-table-extensions";
import moment from "moment";
import SidebarNav from "../sidebar";
import {
  itemRender,
  onShowSizeChange,
} from "../../components/paginationfunction";
import { fetchApi } from "../../../_utils/http-utils";
import {
  getColumnFilterProps,
  getColumnSearchProps,
  renderAppointment,
  renderDate,
  renderDropDown,
  renderName,
  renderNameForAppointment,
  renderTagStatus,
  renderText,
  sorterDate,
  sorterNumber,
  sorterText,
} from "../../../_utils/data-table-utils";
import toast from "react-hot-toast";

const statusArray = [
  "pending",
  "scheduled",
  "cancelled",
  "reserved",
  "ongoing",
  "completed",
  "reschedule",
];

const statusHasNoOption = ["pending", "completed"];

class Appointments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: null,
      data: [],
      exportingData: [],
      showMenu: {},
      searchText: "",
      searchedColumn: "",
      appointmentStats: {
        pending: 0,
        completed: 0,
        scheduled: 0,
        ongoing: 0,
        cancelled: 0,
      },
    };
  }

  async componentDidMount() {
    let appointments = await fetchApi({
      url: "v1/appointments",
      method: "GET",
    });
    let appointmentStats = this.getStats(appointments.data);
    let apnts = appointments.data;
    this.setState({
      data: apnts,
      exportingData: apnts,
      appointmentStats: appointmentStats,
    });
  }

  componentDidUpdate() {
    $(".wrapper1").scroll(function () {
      $(".table-responsive").scrollLeft($(".wrapper1").scrollLeft());
    });
    $(".table-responsive").scroll(function () {
      $(".wrapper1").scrollLeft($(".table-responsive").scrollLeft());
    });
  }

  getStats(appointments) {
    let appointmentStats = {
      pending: 0,
      completed: 0,
      scheduled: 0,
      ongoing: 0,
      cancelled: 0,
    };
    appointments.forEach((appointment) => {
      if (appointmentStats.hasOwnProperty(appointment.status))
        appointmentStats[appointment.status] =
          appointmentStats[appointment.status] + 1;
      else {
        appointmentStats[appointment.status] = 1;
      }
    });
    return appointmentStats;
  }

  async handleItemClick(record, dropdownItem) {
    let index = this.state.data.indexOf(record);
    let data = this.state.data;
    if (dropdownItem !== "reschedule") {
      data[index].status = dropdownItem;
      this.setState({ showMenu: { [record._id]: false } });
      try {
        let result = await fetchApi({
          url: "v1/appointment/changeStatus",
          method: "POST",
          body: { appointment_id: record._id, status: dropdownItem },
        });
        if (result) {
          toast.success(result.message);
          this.setState({ data: data });
        }
      } catch (e) {}
    } else {
      const { history } = this.props;
      history.push(`/slotBooking/${record.doctor._id}/${record._id}`);
    }
  }

  handleDropdownClick(record) {
    let isShown = this.state.showMenu[record._id];
    this.setState({ showMenu: { [record._id]: !isShown } });
  }

  showDropDownMenu(record) {
    return this.state.showMenu[record._id];
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  handleDataChange = (pagination, filters, sorter, extra) => {
    let appointmentStats = this.getStats(extra.currentDataSource);
    this.setState({
      appointmentStats: appointmentStats,
      total: extra.currentDataSource.length,
      exportingData: extra.currentDataSource,
    });
  };
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  getCompletionPercent(currentVal) {
    let val = this.state.appointmentStats[currentVal];
    return `${(val * 100) / this.state.data.length}%`;
  }

  handleChangeOption = (status) => {
    // const optionData = statusArray.filter((item) => item !== status);
    // if (status === "scheduled") {
    //   return optionData;
    // } else {
    //   const index = optionData.findIndex((option) => option === "reschedule");
    //   if (index > -1) {
    //     optionData.splice(index, 1);
    //   }
    //   return optionData;
    // }
    let optionData;
    switch (status) {
      case "scheduled":
        optionData = [
          "cancelled",
          // "reserved",
          "completed",
          "reschedule",
        ];
        break;
      case "cancelled":
        optionData = [""];
        break;
      case "reserved":
        optionData = ["cancelled"];
        break;
      case "ongoing":
        optionData = ["completed"];
        break;
      case "reschedule":
        optionData = [
          "cancelled",
          // "reserved",
          "completed",
          "reschedule",
        ];
        break;

      default:
        optionData = statusArray;
        break;
    }
    return optionData;
  };

  render() {
    const { data, exportingData } = this.state;

    const columns = [
      {
        title: "Appointment Time",
        render: (text, record) =>
          renderAppointment(record.time.utc_time, record.time.slot),
        sorter: (a, b) => sorterDate(a.time.utc_time, b.time.utc_time),
      },
      {
        title: "Patient",
        render: (text, record) => renderNameForAppointment(
          record.patient,
          "",
          "",
          false,
          "patient"
        ),
        sorter: (a, b) =>
          sorterText(
            a.patient.user_id.first_name,
            b.patient.user_id.first_name
          ),

        ...getColumnSearchProps(
          this,
          "Patient",
          this.handleSearch,
          this.handleReset,
          "patient.user_id.first_name"
        ),
      },
      {
        title: "Doctor",
        render: (text, record) => renderNameForAppointment(
          record.doctor,
          "Dr",
          "",
          false,
          "doctor"
        ),
        sorter: (a, b) => sorterText(a.doctor.first_name, b.doctor.first_name),
        ...getColumnSearchProps(
          this,
          "Doctor",
          this.handleSearch,
          this.handleReset,
          "doctor.first_name"
        ),
      },
      {
        title: "Reason",
        render: (text, record) => renderText(record.reason),
        sorter: (a, b) => sorterText(a.reason, b.reason),
      },
      {
        title: "Consulting type",
        dataIndex: "consulting_type",
        render: (text) => renderText(text),
        sorter: (a, b) => sorterText(a.consulting_type, b.consulting_type),
      },
      {
        title: "Fees (Rupees)",
        render: (text, record) => renderText(record.fee),
        sorter: (a, b) => sorterNumber(a.fee, b.fee),
      },
      {
        title: "Created At",
        dataIndex: "created_at",
        render: (text) => renderDate(text),
        sorter: (a, b) => sorterDate(a.created_at, b.created_at),
      },
      {
        title: "Updated At",
        dataIndex: "updated_at",
        render: (text) => renderDate(text),
        sorter: (a, b) => sorterDate(a.updated_at, b.updated_at),
      },
      {
        title: "Created by",
        dataIndex: "created_by",
        render: (text, record) => <span>{record.created_by.first_name + ' ' + record.created_by.first_name}</span>,
      },
      {
        title: "Updated by",
        dataIndex: "updated_by",
        render: (text, record) => <span>{record.updated_by.first_name + ' ' + record.updated_by.first_name}</span>,
      },
      {
        title: "Appointment Status",
        dataIndex: "appointment_status",
        render: (text, record) => <span>{record.adtnl_status}</span>,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text) => renderText(text),
        sorter: (a, b) => sorterText(a.status, b.status),
        ...getColumnFilterProps(statusArray, "status"),
      },
      {
        title: "Actions",
        align: "center",
        render: (text, record) =>
          statusHasNoOption.includes(record.status)
            ? renderTagStatus(record.status)
            : renderDropDown(
                "Change Status",
                this.handleChangeOption(record.status),
                (elem, index) => this.handleItemClick(record, elem),
                () => this.handleDropdownClick(record),
                this.showDropDownMenu(record)
              ),
      },
    ];
    const fields = {
      appointment_time: {
        header: "Appointment Time",
        formatter: (_fieldValue, record) => {
          return record?.time.utc_time;
        },
      },
      patient: {
        header: "Patient",
        formatter: (_fieldValue, record) => {
          return (
            record?.patient?.user_id?.first_name +
            " " +
            record?.patient?.user_id?.last_name
          );
        },
      },
      Doctor: {
        header: "Doctor",
        formatter: (_fieldValue, record) => {
          return record?.doctor?.first_name + " " + record?.doctor?.last_name;
        },
      },
      reason: {
        header: "Reason",
        formatter: (_fieldValue, record) => {
          return record?.reason;
        },
      },
      consulting_type: {
        header: "Consulting type",
        formatter: (_fieldValue, record) => {
          return record?.consulting_type;
        },
      },

      fees: {
        header: "Fees (Rupees)",
        formatter: (_fieldValue, record) => {
          return record?.fee;
        },
      },
      created_at: {
        header: "Created At",
        formatter: (_fieldValue, record) => {
          return moment(record?.created_at).format("DD/MM/YYYY");
        },
      },
      updated_at: {
        header: "Updated At",
        formatter: (_fieldValue, record) => {
          return moment(record?.updated_at).format("DD/MM/YYYY");
        },
      },
      status: {
        header: "Status",
        formatter: (_fieldValue, record) => {
          return record?.status;
        },
      },
    };

    return (
      <>
        <SidebarNav />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">Appointments</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/admin">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item active">Appointments</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon text-primary border-primary">
                        <i className="fe fe-users"></i>
                      </span>
                      <div className="dash-count">
                        <h3>{this.state.appointmentStats.scheduled}</h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Scheduled</h6>
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-primary"
                          style={{
                            width: this.getCompletionPercent("scheduled"),
                          }}
                        ></div>
                      </div>
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
                        <h3>{this.state.appointmentStats.ongoing}</h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">In Progress</h6>
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-success"
                          style={{
                            width: this.getCompletionPercent("ongoing"),
                          }}
                        ></div>
                      </div>
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
                        <h3>{this.state.appointmentStats.cancelled}</h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Cancelled</h6>
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-danger"
                          style={{
                            width: this.getCompletionPercent("cancelled"),
                          }}
                        ></div>
                      </div>
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
                        <h3>{this.state.appointmentStats.completed}</h3>
                      </div>
                    </div>
                    <div className="dash-widget-info">
                      <h6 className="text-muted">Completed</h6>
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-success"
                          style={{
                            width: this.getCompletionPercent("completed"),
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div>
                      <ExportTableButton
                        dataSource={exportingData}
                        columns={columns}
                        btnProps={{ type: "primary" }}
                        fileName="appointments-data"
                        fields={fields}
                      >
                        Export
                      </ExportTableButton>
                      <Table
                        className="table-striped"
                        columns={columns}
                        scroll={{ x: 1300 }}
                        // bordered
                        onChange={this.handleDataChange}
                        dataSource={data}
                        rowKey={(record) => record._id}
                        showSizeChanger={true}
                        pagination={{
                          position: ["topRight", "bottomRight"],
                          total:
                            this.state.total >= 0
                              ? this.state.total
                              : data.length,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Appointments;
