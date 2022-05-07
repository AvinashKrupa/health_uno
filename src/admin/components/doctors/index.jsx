import React, { Component } from "react";
import { Table } from "ant-table-extensions";
import { CSVLink } from "react-csv";
import { Button } from "react-bootstrap";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import SidebarNav from "../sidebar";
import {
  itemRender,
  onShowSizeChange,
} from "../../components/paginationfunction";
import { fetchApi } from "../../../_utils/http-utils";
import {
  getColumnFilterProps,
  getUpdatedColumnSearchProps,
  getDynamicSearchProps,
  renderChips,
  renderDate,
  renderDropDown,
  renderName,
  renderText,
  sorterDate,
  sorterNumber,
  sorterText,
  renderDeleteButton,
} from "../../../_utils/data-table-utils";
import toast from "react-hot-toast";

const doctorStatus = ["pending", "active", "inactive"];

class Doctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: null,
      data: [],
      exportingData: [],
      showMenu: {},
      searchText: "",
      searchDept: "",
      searchStatus: "",
      searchSpecialities: "",
      departments: [],
      specialities: [],
      dataFromList: [],
      searchedColumn: "",
      loadingCsv: false,
      filter: {
        name: "",
        mobile_number: "",
        dept_name: "",
        status: "",
        specialities: "",
      },
      pagination: {
        page: parseInt(props.match.params.page) ?? 1,
        limit: 10,
      },
      loading: false,
      isConfirmation: false,
      page: parseInt(props.match.params.page) ?? 1,
      selectedRecord: null,
    };
    this.csvLinkEl = React.createRef();
  }

  componentDidUpdate(prevProps) {
    console.log("prevProps", prevProps, "location", this.props.location);
    if (this.props.location !== prevProps.location) {
      this.setState({
        pagination: {
          page: parseInt(this.props.match.params.page),
        },
      });
      const { pagination } = this.state;
      this.fetchDoctors({
        ...pagination,
        sort_key: "created_at",
        sort_order: "descend",
        filter: this.state.filter,
      });
    }
  }

  async fetchDoctors(params = {}, changeRoute = false) {
    let currentPage = this.state.pagination.page;
    if (changeRoute) {
      if (params.page != currentPage) {
        this.setState(
          {
            pagination: {
              page: parseInt(params.page),
              limit: params.limit,
            },
            filter: params.filter || {},
          },
          () => {
            this.props.history.push(
              "/doctor-list/" + this.state.pagination.page
            );
          }
        );
        return;
      }
    }
    global.doctorFilter = params.filter;
    this.setState({ loading: true });
    const body = {
      ...params,
    };
    let doctors = await fetchApi({
      url: "v2/doctors",
      method: "POST",
      body: body,
    });
    let doctorsData = doctors.data.docs;

    this.setState({
      data: doctorsData,
      exportingData: doctorsData,
      loading: false,
      total: doctors.data.total,
      pagination: {
        page: parseInt(doctors.data.page),
        limit: doctors.data.limit,
        total: doctors.data.total,
      },
      filter: params.filter,
    });
  }

  async componentDidMount() {
    const { pagination } = this.state;
    this.fetchDoctors(
      {
        ...pagination,
        sort_key: "created_at",
        sort_order: "descend",
        filter: global.doctorFilter,
      },
      true
    );
    let speclData = await fetchApi({ url: "v1/specialities", method: "GET" });
    let specialities = speclData.data.map((ele) => {
      return { name: ele.title, value: ele._id };
    });
    this.setState({ specialities: specialities, filter: global.doctorFilter });
  }

  async handleItemClick(record, dropdownItem) {
    let index = this.state.data.indexOf(record);
    let data = this.state.data;
    data[index].status = dropdownItem;
    this.setState({ showMenu: { [record._id]: false } });
    try {
      let result = await fetchApi({
        url: "v1/doctor/changeStatus",
        method: "POST",
        body: { doctor_id: record._id, status: dropdownItem },
      });
      if (result) {
        toast.success(result.message);
        this.setState({ data: data });
      }
    } catch (e) {}
  }

  handleSearch = (selectedKeys, confirm, dataIndex, fieldName) => {
    // confirm();
    if (fieldName === "name") {
      this.setState({ searchText: selectedKeys[0] });
    } else if (fieldName === "dept_name") {
      this.setState({ searchDept: selectedKeys });
    } else if (fieldName === "user_id.mobile_number") {
      this.setState({ searchMobile: selectedKeys[0] });
    }

    const filter = {
      ...{
        name: fieldName == "name" ? selectedKeys[0] : this.state.searchText,
      },
      ...{
        mobile_number:
          fieldName == "user_id.mobile_number"
            ? selectedKeys[0]
            : this.state.searchMobile,
      },
      ...{
        dept_name:
          fieldName == "dept_name" ? selectedKeys : this.state.searchDept,
      },
      ...{ specialities: this.state.searchSpecialities },
      ...{ status: this.state.searchStatus },
    };
    this.setState(
      {
        filters: {
          ...filter,
        },
      },
      () => confirm()
    );
  };

  handleReset = (clearFilters) => {
    this.setState(
      {
        searchText: "",
        page: 1,
        limit: this.state.pagination.limit,
        filter: {
          dept_name: this.state.searchDept,
          status: this.state.searchStatus,
          specialities: this.state.searchSpecialities,
        },
      },
      () => clearFilters()
    );
  };
  handleDropdownClick(record) {
    let isShown = this.state.showMenu[record._id];
    this.setState({ showMenu: { [record._id]: !isShown } });
  }

  showDropDownMenu(record) {
    return this.state.showMenu[record._id];
  }

  handleDataChange = (pagination, filters, sorter, extra) => {
    this.setState({
      searchStatus: filters.status,
      searchSpecialities: filters.specialities,
    });
    const obj = {
      sort_key: sorter.field,
      sort_order: sorter.order,
      page: pagination.current,
      limit: pagination.pageSize,
      filter: {
        name: this.state.searchText,
        mobile_number: this.state.searchMobile,
        dept_name: this.state.searchDept,
        status: filters.status,
        specialities: filters.specialities,
      },
    };
    this.fetchDoctors(obj, true);
  };

  async deleteDoctor(record) {
    if (record.user_id && record.user_id.mobile_number)
      try {
        let result = await fetchApi({
          url: "v1/admin/deleteDoctor",
          method: "POST",
          body: { mobile_number: record.user_id.mobile_number },
        });
        if (result) {
          toast.success(result.message);
          const { pagination } = this.state;
          this.fetchDoctors(pagination);
        }
        this.setState({ isConfirmation: false });
      } catch (e) {
        this.setState({ isConfirmation: false });
      }
  }

  handleExportData = async (event, done) => {
    const { searchStatus, searchSpecialities, filters } = this.state;
    this.setState({
      loadingCsv: true,
    });
    const obj = {
      pagination: {
        page: null,
        limit: null,
      },
      filter: {
        ...filters,
        specialities: searchSpecialities,
        status: searchStatus,
      },
    };
    const body = {
      ...obj,
    };
    let doctors = await fetchApi({
      url: "v2/doctors",
      method: "POST",
      body: body,
    });
    if (doctors.status == 200) {
      if (doctors?.data?.docs?.length > 0) {
        let finalData = [];
        doctors?.data?.docs.forEach((element) => {
          const dataObj = {
            doctor_name:
              `${element?.first_name + " " + element?.last_name}` || "",
            med_reg_num: `${element?.qualif.med_reg_num}` || "",
            department: `${element?.qualif?.dept_id?.title}` || "",
            exp: element?.qualif.exp || "",
            fees: element?.qualif.fee || "",
            highest_qual: element?.qualif.highest_qual.name || "",
            specl: element?.qualif.specl.map((item) => item.title) || "",
            created_at: moment(element?.created_at).format("DD/MM/YYYY") || "",
            updated_at: moment(element?.updated_at).format("DD/MM/YYYY") || "",
            created_by:
              `${
                element && element.created_by && element.created_by.first_name
              } ${
                element && element.created_by && element.created_by.last_name
              }` || "",
            updated_by:
              `${
                element && element.updated_by && element.updated_by.first_name
              } ${
                element && element.updated_by && element.updated_by.last_name
              }` || "",
            account_status: element.status || "",
            mobile:
              `${element?.user_id?.country_code} ${element?.user_id?.mobile_number}` ||
              "",
            email: element?.user_id?.email || "",
            dob: element?.user_id?.dob || "",
            language: element?.user_id?.language
              ? element?.user_id?.language?.map((item) => item.name)
              : "",
            gender: element?.user_id?.gender || "",
            state: element?.address?.state || "",
            city: element?.address?.city || "",
          };
          finalData.push(dataObj);
        });
        this.setState(
          {
            dataFromList: finalData,
            loadingCsv: false,
          },
          () => {
            setTimeout(() => {
              this.csvLinkEl.current.link.click();
            });
          }
        );
      } else {
        this.setState(
          {
            loadingCsv: false,
          },
          () => toast.success("No data found")
        );
      }
    }
  };

  render() {
    const { data, specialities, dataFromList, loadingCsv, exportingData } =
      this.state;

    const columns = [
      {
        title: "Doctor Name",
        render: (text, record) => renderName(record, "Dr", "", true),
        dataIndex: "first_name",
        sorter: (a, b) => sorterText(a.first_name, b.first_name),
        ...getUpdatedColumnSearchProps(
          this,
          "Doctor",
          this.handleSearch,
          this.handleReset,
          "first_name"
        ),
      },
      {
        title: "Mobile Number",
        render: (text, record) => renderText(record.user_id.mobile_number),
        sorter: (a, b) =>
          sorterText(a.user_id.mobile_number, b.user_id.mobile_number),
        ...getDynamicSearchProps(
          this,
          "Mobile Number",
          this.handleSearch,
          this.handleReset,
          "user_id.mobile_number"
        ),
      },
      {
        title: "Experience (Years)",
        render: (text, record) => renderText(record.qualif.exp),
        dataIndex: "qualif.exp",
        sorter: (a, b) => sorterNumber(a.qualif.exp, b.qualif.exp),
      },
      {
        title: "Fees (Rupees)",
        render: (text, record) => renderText(record.qualif.fee),
        dataIndex: "qualif.fee",
        sorter: (a, b) => sorterNumber(a.qualif.fee, b.qualif.fee),
      },
      {
        title: "Highest Qualification",
        render: (text, record) => renderText(record.qualif.highest_qual.name),
        dataIndex: "qualif.highest_qual.name",
        sorter: (a, b) =>
          sorterText(a.qualif.highest_qual.name, b.qualif.highest_qual.name),
      },
      {
        title: "Specialities",
        render: (text, record) => renderChips(record.qualif.specl),
        dataIndex: "specialities",
        sorter: (a, b) => {
          if (
            a.qualif.specl &&
            a.qualif.specl.length > 0 &&
            b.qualif.specl &&
            b.qualif.specl.length > 0
          ) {
            return sorterText(a.qualif.specl[0].title, b.qualif.specl[0].title);
          }
        },
        ...getColumnFilterProps(specialities, "specialities", false),
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
        ...getColumnFilterProps(doctorStatus, "status"),
      },
      {
        title: "Actions",
        render: (text, record) => {
          return (
            <>
              <div>
                {renderDropDown(
                  "Change Status",
                  doctorStatus.filter((item) => item !== record.status),
                  (elem, index) => this.handleItemClick(record, elem),
                  () => this.handleDropdownClick(record),
                  this.showDropDownMenu(record)
                )}
                {record.appointment_stats &&
                  record.appointment_stats.completed < 1 &&
                  renderDeleteButton(() => {
                    this.setState({
                      isConfirmation: true,
                      selectedRecord: record,
                    });
                  })}
              </div>
            </>
          );
        },
      },
    ];

    const fields = {
      doctorname: {
        header: "Doctor Name",
        dataIndex: "first_name",
        formatter: (_fieldValue, record) => {
          return record?.first_name + " " + record?.last_name;
        },
      },
      med_reg_num: {
        header: "Med Reg No.",
        dataIndex: "qualif.med_reg_num",
        formatter: (_fieldValue, record) => {
          return record?.qualif.med_reg_num;
        },
      },
      dept: {
        header: "Department",
        dataIndex: "qualif.dept_id.title",
        formatter: (_fieldValue, record) => {
          return record?.qualif.dept_id.title;
        },
      },
      exp: {
        header: "Experience (Years)",
        dataIndex: "qualif.exp",
        formatter: (_fieldValue, record) => {
          return record?.qualif.exp;
        },
      },

      fees: {
        header: "Fees (Rupees)",
        dataIndex: "qualif.fee",
        formatter: (_fieldValue, record) => {
          return record?.qualif.fee;
        },
      },
      highest_qualify: {
        header: "Highest Qualification",
        dataIndex: "qualif.highest_qual.name",
        formatter: (_fieldValue, record) => {
          return record?.qualif.highest_qual.name;
        },
      },
      specialities: {
        header: "Specialities",
        dataIndex: "specialities",
        formatter: (_fieldValue, record) => {
          return record?.qualif.specl.map((item) => item.title);
        },
      },

      created_at: {
        header: "Created At",
        dataIndex: "created_at",
        formatter: (_fieldValue, record) => {
          return moment(record?.created_at).format("DD/MM/YYYY");
        },
      },
      updated_at: {
        header: "Updated At",
        dataIndex: "updated_at",
        formatter: (_fieldValue, record) => {
          return moment(record?.updated_at).format("DD/MM/YYYY");
        },
      },
      status: {
        header: "Account Status",
        dataIndex: "status",
        formatter: (_fieldValue, record) => {
          return record?.status;
        },
      },
    };

    const headers = [
      { label: "Doctor Name", key: "doctor_name" },
      { label: "Med Reg No.", key: "med_reg_num" },
      { label: "Department", key: "department" },
      { label: "Experience (Years)", key: "exp" },
      { label: "Fees (Rupees)", key: "fees" },
      { label: "Highest Qualification", key: "highest_qual" },
      { label: "Mobile No", key: "mobile" },
      { label: "Email ID", key: "email" },
      { label: "DoB", key: "dob" },
      { label: "Specialities", key: "specl" },
      { label: "Language", key: "language" },
      { label: "Gender", key: "gender" },
      { label: "State", key: "state" },
      { label: "City", key: "city" },
      { label: "Created At", key: "created_at" },
      { label: "Updated At", key: "updated_at" },
      { label: "Created By", key: "created_by" },
      { label: "Updated By", key: "updated_by" },
      { label: "Account Status", key: "account_status" },
    ];

    return (
      <>
        <SidebarNav />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">List of Doctors</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/admin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#0">Users</Link>
                    </li>
                    <li className="breadcrumb-item active">Doctor</li>
                  </ul>
                </div>
              </div>
            </div>

            <Modal
              show={this.state.isConfirmation}
              onHide={this.handleClose}
              centered
            >
              <Modal.Body>
                <div className="form-content p-2">
                  <h4 className="modal-title">Delete</h4>
                  <p className="mb-4">{`Are you sure want to delete this user permanently?`}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      this.deleteDoctor(this.state.selectedRecord);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      this.setState({ isConfirmation: false });
                    }}
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    No
                  </button>
                </div>
              </Modal.Body>
            </Modal>

            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <Button onClick={this.handleExportData}>
                        {loadingCsv ? "Loading csv..." : "Export to CSV"}
                      </Button>
                      <CSVLink
                        data={dataFromList}
                        filename={"Doctors.csv"}
                        headers={headers}
                        ref={this.csvLinkEl}
                      ></CSVLink>
                      <button
                        type="primary"
                        className="btn btn-primary float-right"
                        onClick={() =>
                          this.props.history.push("/doctor-registration")
                        }
                      >
                        Add Doctor
                      </button>
                      <Table
                        className="table-striped"
                        style={{ overflowX: "auto" }}
                        columns={[...columns]}
                        onChange={this.handleDataChange}
                        loading={this.state.loading}
                        // bordered
                        dataSource={[...data]}
                        rowKey={(record) => record._id}
                        showSizeChanger={true}
                        pagination={{
                          current: parseInt(this.props.match.params.page) ?? 1,
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

export default Doctors;
