import React, { Component } from "react";
import { Table, ExportTableButton } from "ant-table-extensions";
import { CSVLink } from "react-csv";
import { Button } from "react-bootstrap";
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
  getUpdatedColumnSearchProps,
  getColumnSearchProps,
  getColumnDropDownSearchProps,
  renderChips,
  renderDate,
  renderDropDown,
  renderName,
  renderText,
  sorterDate,
  sorterNumber,
  sorterText,
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
      pagination: {
        page: 1,
        limit: 10,
      },
      loading: false,
      page: 1,
    };
    this.csvLinkEl = React.createRef();
  }

  fetchDoctors = async (params = {}) => {
    const body = {
      ...params,
    };
    this.setState({ loading: true });
    let doctors = await fetchApi({
      url: "v2/doctors",
      method: "POST",
      body: body,
    });
    let doctorsData = doctors.data.docs;
    this.setState({
      data: JSON.parse(JSON.stringify(doctorsData)),
      exportingData: JSON.parse(JSON.stringify(doctorsData)),
      loading: false,
      total: doctors.data.total,
      pagination: {
        page: doctors.data.page,
        limit: doctors.data.limit,
        total: doctors.data.total,
      },
    });

    this.forceUpdate();
  };

  async componentDidMount() {
    const { pagination } = this.state;
    this.fetchDoctors(pagination);
    let speclData = await fetchApi({ url: "v1/specialities", method: "GET" });
    let specialities = speclData.data.map((ele) => {
      return { name: ele.title, value: ele._id };
    });
    this.setState({ specialities: specialities });
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
    }
    const filter = {
      ...{
        name: fieldName == "name" ? selectedKeys[0] : this.state.searchText,
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
    if (filters.status) {
      this.setState({ searchStatus: filters.status });
    } else if (filters.specialities) {
      this.setState({ searchSpecialities: filters.specialities });
    } else {
      this.setState({ searchStatus: "", searchSpecialities: "" });
    }
    const obj = {
      sort_key: sorter.field,
      sort_order: sorter.order,
      page: pagination.current,
      limit: pagination.pageSize,
      filter: {
        name: this.state.searchText,
        dept_name: this.state.searchDept,
        status: filters.status,
        specialities: filters.specialities,
      },
    };
    this.fetchDoctors(obj);
  };

  handleExportData = async (event, done) => {
    const { pagination, filters } = this.state;
    this.setState({
      loadingCsv: true,
    });
    const obj = {
      pagination: {
        ...pagination,
        page: null,
        limit: null,
      },
      filter: {
        ...filters,
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
          if (a.qualif.specl && a.qualif.specl.length > 0) {
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
        render: (text, record) =>
          renderDropDown(
            "Change Status",
            doctorStatus.filter((item) => item !== record.status),
            (elem, index) => this.handleItemClick(record, elem),
            () => this.handleDropdownClick(record),
            this.showDropDownMenu(record)
          ),
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
      { label: "Specialities", key: "specl" },
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
                        filename={"appointments.csv"}
                        headers={headers}
                        ref={this.csvLinkEl}
                      ></CSVLink>
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
