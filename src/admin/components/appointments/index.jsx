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
  getUpdatedColumnSearchProps,
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
import { Col, Row, Button } from "react-bootstrap";
import CSVButton from "../CSVButton";

const statusArray = [
  "pending",
  "scheduled",
  "cancelled",
  "reserved",
  "ongoing",
  "completed",
  "reschedule",
];

const statusHasNoOption = ["pending", "cancelled", "completed"];

class Appointments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        page: 1,
        limit: 10,
      },
      loading: false,
      total: null,
      data: [],
      exportingData: [],
      showMenu: {},
      searchText: "",
      searchedColumn: "",
      page: 1,
      filtered: false,
      dataFromList: [],
      fromDate: "",
      toDate: "",
      filters: {
        patient_name: "",
        doc_name: "",
        status: [],
      },
      appointmentStats: {
        pending: 0,
        completed: 0,
        scheduled: 0,
        ongoing: 0,
        cancelled: 0,
      },
    };
  }

  async fetchAppointment(params = {}) {
    const body = {
      ...params,
    };
    let appointments = await fetchApi({
      url: "v2/appointments",
      method: "POST",
      body: body,
    });
    let appointmentStats = this.getStats(appointments.data.docs);
    let apnts = appointments.data.docs;
    this.setState({
      data: apnts,
      total: appointments.data.total,
      loading: false,
      exportingData: apnts,
      appointmentStats: appointmentStats,
      pagination: {
        page: appointments.data.page,
        limit: appointments.data.limit,
        total: appointments.data.total,
      },
    });
  }

  async componentDidMount() {
    const { pagination } = this.state;
    this.fetchAppointment(pagination);
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
    this.setState(
      {
        filters: {
          ...this.state.filters,
          ...(dataIndex == "Doctor" && { doc_name: selectedKeys[0] }),
          ...(dataIndex == "Patient" && { patient_name: selectedKeys[0] }),
        },
      },
      () => {
        confirm();
        // const obj = {
        //   page: 1,
        //   limit: this.state.pagination.limit,
        //   filter: {
        //     ...this.state.filters,
        //   },
        // };
        // this.fetchAppointment(obj);
      }
    );
  };

  handleDataChange = (pagination, currentfilters, sorter, extra) => {
    this.setState(
      {
        pagination: { page: pagination.current, limit: pagination.pageSize },
        loading: true,
        filters: {
          ...this.state.filters,
          ...(currentfilters.hasOwnProperty("status") &&
          currentfilters.status == null
            ? { status: [] }
            : currentfilters.status &&
              currentfilters.status.length > 0 && {
                status: currentfilters.status,
              }),
        },
      },
      () => {
        const obj = {
          sort_key: sorter.field,
          sort_order: sorter.order,
          page: pagination.current,
          limit: pagination.pageSize,
          filter: {
            ...this.state.filters,
          },
        };
        this.fetchAppointment(obj);
      }
    );
  };
  handleReset = (clearFilters, dataIndex) => {
    this.setState(
      {
        searchText: "",
        filters: {
          ...this.state.filters,
          ...(dataIndex == "Doctor" && { doc_name: "" }),
          ...(dataIndex == "Patient" && { patient_name: "" }),
        },
      },
      () => {
        const { pagination } = this.state;
        const obj = {
          ...pagination,
          filter: {
            ...this.state.filters,
          },
        };
        this.fetchAppointment(obj);
        clearFilters();
      }
    );
  };

  handleDateChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleDateFilter = () => {
    const { fromDate, toDate } = this.state;
    this.setState(
      {
        filters: {
          ...this.state.filters,
          time: {
            start: fromDate,
            end: toDate,
          },
        },
      },
      () => {
        const filterValue = this.state.filters;
        if (this.state.fromDate == "" && this.state.toDate == "") {
          delete filterValue.time;
        }
        const obj = {
          filter: {
            ...filterValue,
          },
        };
        this.fetchAppointment(obj);
      }
    );
  };

  handleDateClear = () => {
    this.setState(
      {
        fromDate: "",
        toDate: "",
      },
      () => {
        this.handleDateFilter();
      }
    );
  };

  getCompletionPercent(currentVal) {
    let val = this.state.appointmentStats[currentVal];
    return `${(val * 100) / this.state.data.length}%`;
  }

  handleChangeOption = (status) => {
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

  handleExportData = async (event, done) => {
    const { pagination } = this.state;
    const obj = {
      pagination: {
        ...pagination,
        page: null,
        limit: null,
      },
      filter: {
        ...this.state.filters,
      },
    };
    const body = {
      ...obj,
    };
    let appointments = await fetchApi({
      url: "v2/appointments",
      method: "POST",
      body: body,
    });
    if(appointments.status == 200){

      if(appointments?.data?.docs?.length>0){
        let finalData = []
        appointments?.data?.docs.forEach(element => {
          const dataObj = {
            appointment_ID: element.huno_id || '',
            appointment_time: `${element.time.utc_time}`|| '',
            patient: `${element && element.patient && element.patient.first_name} ${element && element.patient && element.patient.last_name}`,
            doctor: `Dr ${element && element.doctor && element.doctor.first_name} ${element && element.doctor && element.doctor.last_name}` || '',
            reason: element.reason || '',
            consulting_type: element.consulting_type || '',
            fees: element.fee || '',
            created_at: element.created_at || '',
            updated_at: element.updated_at || '',
            created_by: `${element && element.created_by && element.created_by.first_name} ${element && element.created_by && element.created_by.last_name}` || '',
            updated_by: `${element && element.updated_by && element.updated_by.first_name} ${element && element.updated_by && element.updated_by.last_name}`|| '',
            appointment_status: element.adtnl_status || '',
            status: element.status || '',
          }
          finalData.push(dataObj);
        });
        this.setState(
          {
            dataFromList: finalData,
          },
          () => done(true)
        );
      }else{
        done(false)
      }
    }
  };

  render() {
    const { data, exportingData, dataFromList, fromDate, toDate } = this.state;
    const columns = [
      {
        title: "Appointment ID",
        dataIndex: "huno_id",
        sorter: true,
      },
      {
        title: "Appointment Time",
        dataIndex: "time.utc_time",
        render: (text, record) =>
          renderAppointment(record.time.utc_time, record.time.slot),
        sorter: true,
      },
      {
        title: "Patient",
        render: (text, record) =>
          renderNameForAppointment(record.patient, "", "", false, "patient"),
        sorter: true,

        ...getUpdatedColumnSearchProps(
          this,
          "Patient",
          this.handleSearch,
          this.handleReset,
          "patient.user_id.first_name"
        ),
      },
      {
        title: "Doctor",
        render: (text, record) =>
          renderNameForAppointment(record.doctor, "Dr", "", false, "doctor"),
        sorter: (a, b) => sorterText(a.doctor.first_name, b.doctor.first_name),
        ...getUpdatedColumnSearchProps(
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
        sorter: true,
        dataIndex: "reason",
      },
      {
        title: "Consulting type",
        dataIndex: "consulting_type",
        render: (text) => renderText(text),
        sorter: true,
      },
      {
        title: "Fees (Rupees)",
        render: (text, record) => renderText(record.fee),
        dataIndex: "fee",
        sorter: true,
      },
      {
        title: "Created At",
        dataIndex: "created_at",
        render: (text) => renderDate(text),
        sorter: true,
      },
      {
        title: "Updated At",
        dataIndex: "updated_at",
        render: (text) => renderDate(text),
        sorter: true,
      },
      {
        title: "Created by",
        dataIndex: "created_by",
        render: (text, record) => (
          <span>
            {record.created_by.first_name + " " + record.created_by.first_name}
          </span>
        ),
      },
      {
        title: "Updated by",
        dataIndex: "updated_by",
        render: (text, record) => (
          <span>
            {record.updated_by?.first_name +
              " " +
              record.updated_by?.first_name}
          </span>
        ),
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
        sorter: true,
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
      appointment_id: {
        header: "Appointment ID",
        formatter: (_fieldValue, record) => {
          return record?.huno_id;
        },
      },
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

    const headers = [
      { label: "Appointment ID", key: "appointment_ID" },
      { label: "Appointment Time", key: "appointment_time" },
      { label: "Patient", key: "patient" },
      { label: "Doctor", key: "doctor" },
      { label: "Reason", key: "reason" },
      { label: "Consulting type", key: "consulting_type" },
      { label: "Fees (Rupees)", key: "fees" },
      { label: "Created At", key: "created_at" },
      { label: "Updated At", key: "updated_at" },
      { label: "Created By", key: "created_by" },
      { label: "Updated By", key: "updated_by" },
      { label: "Appointment Status", key: "appointment_status" },
      { label: "Status", key: "status" },
    ];

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
                      <Row>
                        <Col>
                          <CSVButton
                            headers={headers}
                            filename="appointments.csv"
                            dataFromList={dataFromList}
                            asyncOnClick={true}
                            handleExportData={this.handleExportData}
                          />
                        </Col>
                        <Col>
                          <Row>
                            <Col>
                              <span>From</span>
                              <input
                                type="date"
                                name="fromDate"
                                value={fromDate}
                                onChange={this.handleDateChange}
                                className="form-control"
                              />
                            </Col>
                            <Col>
                              <span>To</span>
                              <input
                                type="date"
                                name="toDate"
                                value={toDate}
                                onChange={this.handleDateChange}
                                className="form-control"
                              />
                            </Col>
                            <Col>
                              <Button
                                disabled={!fromDate || !toDate}
                                onClick={this.handleDateFilter}
                                style={{ marginTop: "12%" }}
                              >
                                Apply Filter
                              </Button>
                              <Button
                                variant="secondary"
                                onClick={() => this.handleDateClear()}
                                style={{ marginTop: "12%" }}
                              >
                                Clear Filter
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Table
                        className="table-striped"
                        scroll={{ x: 1300 }}
                        columns={columns}
                        rowKey={(record) => record._id}
                        dataSource={data}
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
                        loading={this.state.loading}
                        onChange={this.handleDataChange}
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
