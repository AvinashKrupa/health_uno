import React, { Component } from "react";
import { Table,ExportTableButton } from "ant-table-extensions";
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
import { setJwtToken } from "../../../_utils/localStorage/SessionManager";

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
      departments:[],
      searchedColumn: "",
      pagination: {
        page: 1,
        limit: 10,
      },
      loading: false,
      page: 1,
    };
  }

  async fetchDoctors(params = {}) {
    const body = {
      ...params
    };
    let doctors = await fetchApi({
      url: "v2/doctors",
      method: "POST",
      body: body,
    });
    let doctorsData = doctors.data.docs;
    this.setState({ data: doctorsData,
      exportingData: doctorsData,
      loading: false,
      total: doctors.data.total,
      pagination: {
        page: doctors.data.page,
        limit: doctors.data.limit,
        total: doctors.data.total,
      },
     });
  }

  async componentDidMount() {
    const { pagination } = this.state;
    this.fetchDoctors(pagination);
    let deptData = await fetchApi({ url: "v1/departments", method: "GET" });
    let departments = deptData.data.map((ele)=>{
      return ele.title
    })
    this.setState({departments:departments})
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
    } catch (e) {
    }
  }
 
  handleSearch = (selectedKeys, confirm, dataIndex, fieldName) => {
    // confirm();
    if(fieldName === "name") {
        this.setState({searchText: selectedKeys[0]})
    }
    else if(fieldName === "dept_name"){
        this.setState({searchDept: selectedKeys})
    }
    const filter = {
      ...({ name: fieldName == "name" ? selectedKeys[0] : this.state.searchText}),
      ...( { dept_name: fieldName == "dept_name" ? selectedKeys : this.state.searchDept }),
      ...({status: this.state.searchStatus})
    }
    const obj = {
      page: 1,
      limit: this.state.pagination.limit,
      filter: {
        ...filter,
      },
    };
    this.fetchDoctors(obj);
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
    const obj = {
      page: 1,
      limit: this.state.pagination.limit,
      filter: {
        dept_name: this.state.searchDept,
        status: this.state.searchStatus,
      }
    }
    this.fetchDoctors(obj);
  };
  handleDropdownClick(record) {
    let isShown = this.state.showMenu[record._id];
    this.setState({ showMenu: { [record._id]: !isShown } });
  }

  showDropDownMenu(record) {
    return this.state.showMenu[record._id];
  }

  handleDataChange = (pagination, filters, sorter, extra) => {
    if(filters.status) { this.setState({searchStatus: filters.status}) }
    else(this.setState({searchStatus: ""}))
      const obj = {
        sort_key: sorter.field,
        sort_order: sorter.order,
        page: pagination.current,
        limit: pagination.pageSize,
        filter: {name: this.state.searchText, dept_name: this.state.searchDept, status: filters.status}
      };
      this.fetchDoctors(obj);
  };

  render() {
    const { data,departments,exportingData } = this.state;
    
    const columns = [
      {
        title: "Doctor Name",
        render: (text, record) => renderName(record, "Dr", "", true),
        dataIndex: 'first_name',
        sorter: (a, b) => sorterText(a.first_name, b.first_name),
        ...getColumnSearchProps(
          this,
          "Doctor",
          this.handleSearch,
          this.handleReset,
          "first_name"
        ),
      },
      {
        title: "Med Reg No.",
        render: (text, record) => renderText(record.qualif.med_reg_num),
        dataIndex: "qualif.med_reg_num",
        sorter: (a, b) =>
          sorterText(a.qualif.med_reg_num, b.qualif.med_reg_num),
      },
      {
        title: "Department",
        render: (text, record) => renderText(record.qualif.dept_id.title),
        dataIndex: "qualif.dept_id.title",
        sorter: (a, b) =>
          sorterText(a.qualif.dept_id.title, b.qualif.dept_id.title),
        ...getColumnDropDownSearchProps(
            this,
            departments,
            "Department",
            this.handleSearch,
            this.handleReset,
            "qualif.dept_id.title"
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
        dataIndex: 'first_name',
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
          return  record?.qualif.highest_qual.name;
        },
      },
      specialities: {
        header: "Specialities",
        formatter: (_fieldValue, record) => {
          return record?.qualif.specl.map(item=>item.title);
        },
      },
      
      created_at: {
        header: "Created At",
        dataIndex: "created_at",
        formatter: (_fieldValue, record) => {
          return moment(record?.created_at).format('DD/MM/YYYY');
        },
      },
      updated_at: {
        header: "Updated At",
        dataIndex: "updated_at",
        formatter: (_fieldValue, record) => {
          return moment(record?.updated_at).format('DD/MM/YYYY');
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
                      <ExportTableButton
                        dataSource={exportingData}
                        columns={columns}
                        btnProps={{ type: "primary" }}
                        fileName= "doctors-data"
                        fields={fields}
                      >
                        Export
                      </ExportTableButton>
                      <Table
                        className="table-striped"
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        onChange={this.handleDataChange}
                        loading={this.state.loading}
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

export default Doctors;
