import React, { Component } from "react";
import { Table, ExportTableButton } from "ant-table-extensions";
import moment from "moment";
import { Link } from "react-router-dom";
import SidebarNav from "../sidebar";
import {
  itemRender,
  onShowSizeChange,
} from "../../components/paginationfunction";
import { fetchApi } from "../../../_utils/http-utils";
import {
  getColumnFilterProps,
  getColumnSearchProps,
  renderDate,
  renderDropDown,
  renderName,
  renderText,
  sorterDate,
  sorterNumber,
  sorterText,
  renderButton,
} from "../../../_utils/data-table-utils";
import toast from "react-hot-toast";

const patientStatus = ["active", "inactive", "suspended", "banned"];

class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: null,
      data: [],
      exportingData: [],
      showMenu: {},
      searchText: "",
      searchedColumn: "",
    };
  }

  async componentDidMount() {
    this.fetchPatientsList()
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  fetchPatientsList = async() => {
    let patients = await fetchApi({ url: "v1/patients", method: "GET" });
        let patientsData = patients.data;
        this.setState({ data: patientsData });
        this.setState({ exportingData: patientsData });
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  async handleItemClick(record, dropdownItem) {
    let index = this.state.data.indexOf(record);
    let data = this.state.data;
    data[index].status = dropdownItem;
    this.setState({ showMenu: { [record._id]: false } });
    try {
      let result = await fetchApi({
        url: "v1/patient/changeStatus",
        method: "POST",
        body: { patient_id: record._id, status: dropdownItem },
      });
      if (result) {
        toast.success(result.message);
        this.setState({ data: data });
        this.fetchPatientsList()
      }
    } catch (e) {}
  }

  handleDropdownClick(record) {
    let isShown = this.state.showMenu[record._id];
    this.setState({ showMenu: { [record._id]: !isShown } });
  }
  handleBookAppointment(record){
    localStorage.setItem('SELECTED_PATIENT_ID', record._id)
    this.props.history.push("/patient/topConsultants")
  }

  showDropDownMenu(record) {
    return this.state.showMenu[record._id];
  }

  handleDataChange = (pagination, filters, sorter, extra) => {
    this.setState({
      total: extra.currentDataSource.length,
      exportingData: extra.currentDataSource,
    });
  };

  render() {
    const { data, exportingData } = this.state;

    const columns = [
      {
        title: "Patient Name",
        render: (text, record) => renderName(record, "", "", true),
        sorter: (a, b) =>
          sorterText(a.user_id.first_name, b.user_id.first_name),
        ...getColumnSearchProps(
          this,
          "Patient",
          this.handleSearch,
          this.handleReset,
          "user_id.first_name"
        ),
      },
      {
        title: "Height (Feet)",
        dataIndex: "height",
        sorter: (a, b) => sorterText(a.height, b.height),
      },
      {
        title: "Weight (Kg)",
        dataIndex: "weight",
        sorter: (a, b) => sorterNumber(a.weight, b.weight),
      },
      {
        title: "Mobile Number",
        render: (text, record) => renderText(record.user_id.mobile_number),
        sorter: (a, b) =>
          sorterText(a.user_id.mobile_number, b.user_id.mobile_number),
        ...getColumnSearchProps(
          this,
          "Mobile Number",
          this.handleSearch,
          this.handleReset,
          "user_id.mobile_number"
        ),
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
        render: (text, record) => renderName(record.created_by),
      },
      {
        title: "Updated by",
        dataIndex: "updated_by",
        render: (text, record) => renderName(record.updated_by),
      },
      {
        title: "Account Status",
        dataIndex: "status",
        key: "status",
        render: (text) => renderText(text),
        sorter: (a, b) => sorterText(a.status, b.status),
        ...getColumnFilterProps(patientStatus, "status"),
      },
      {
        title: "Actions",
        render: (text, record) => {
          return (
            <>
              <div>
                {renderDropDown(
                  "Change Status",
                  patientStatus.filter((item) => item !== record.status),
                  (elem, index) => this.handleItemClick(record, elem),
                  () => this.handleDropdownClick(record),
                  this.showDropDownMenu(record)
                )}
                {renderButton(()=> this.handleBookAppointment(record))}
              </div>
            </>
          );
        },
      },
    ];
    const fields = {
      patientname: {
        header: "Patient Name",
        formatter: (_fieldValue, record) => {
          return record?.user_id.first_name + " " + record?.user_id.last_name;
        },
      },
      height: {
        header: "Height (Feet)",
        formatter: (_fieldValue, record) => {
          return record?.height;
        },
      },
      weight: {
        header: "Weight (Kg)",
        formatter: (_fieldValue, record) => {
          return record?.weight;
        },
      },
      mobileNumber: {
        header: "Mobile Number",
        formatter: (_fieldValue, record) => {
          return record?.user_id.mobile_number;
        },
      },

      createdAt: {
        header: "Created At",
        formatter: (_fieldValue, record) => {
          return moment(record?.created_at).format("DD/MM/YYYY");
        },
      },
      updatedAt: {
        header: "Updated At",
        formatter: (_fieldValue, record) => {
          return moment(record?.updated_at).format("DD/MM/YYYY");
        },
      },
      status: {
        header: "Account Status",
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
                  <h3 className="page-title">List of Patient</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/admin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#0">Users</Link>
                    </li>
                    <li className="breadcrumb-item active">Patient</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <ExportTableButton
                        dataSource={exportingData}
                        columns={columns}
                        btnProps={{ type: "primary" }}
                        fileName="patients-data"
                        fields={fields}
                      >
                        Export
                      </ExportTableButton>
                      {/* <div className="col-sm-5 col">
                        <a
                          href="#0"
                          className="btn btn-primary float-right mt-2"
                          // onClick={() => this.handleShow("edit")}
                        >
                          Add
                        </a>
                      </div> */}
                      <button
                        type="primary"
                        className="btn btn-primary float-right"
                        onClick={() =>
                          this.props.history.push("/patient-registration")
                        }
                      >
                        {" "}
                        Add Patient
                      </button>

                      <Table
                        className="table-striped"
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        onChange={this.handleDataChange}
                        // bordered
                        dataSource={data}
                        rowKey={(record) => record._id}
                        showSizeChanger={true}
                        pagination={{
                          total:
                            this.state.total >= 0
                              ? this.state.total
                              : data.length,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                          position: ["topRight", "bottomRight"],
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

export default Patients;
