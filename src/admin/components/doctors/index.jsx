import React, { Component } from "react";
import { Table } from "antd";
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
      showMenu: {},
      searchText: "",
      searchedColumn: "",
    };
  }

  async componentDidMount() {
    let doctors = await fetchApi({ url: "v1/doctors", method: "GET" });
    this.setState({ data: doctors.data });
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
      console.log("error>>", e);
    }
  }
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
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
      total: extra.currentDataSource.length,
    });
  };

  render() {
    const { data } = this.state;
    const arr = ['Medical','Surgical'];
    const columns = [
      {
        title: "Doctor Name",
        render: (text, record) => renderName(record, "Dr", "", true),
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
        sorter: (a, b) =>
          sorterText(a.qualif.med_reg_num, b.qualif.med_reg_num),
      },
      {
        title: "Department",
        render: (text, record) => renderText(record.qualif.dept_id.title),
        sorter: (a, b) =>
          sorterText(a.qualif.dept_id.title, b.qualif.dept_id.title),
        ...getColumnDropDownSearchProps(
            this,
            arr,
            "Department",
            this.handleSearch,
            this.handleReset,
            "qualif.dept_id.title"
          ),    
      },
      {
        title: "Experience (Years)",
        render: (text, record) => renderText(record.qualif.exp),
        sorter: (a, b) => sorterNumber(a.qualif.exp, b.qualif.exp),
      },
      {
        title: "Fees (Rupees)",
        render: (text, record) => renderText(record.qualif.fee),
        sorter: (a, b) => sorterNumber(a.qualif.fee, b.qualif.fee),
      },
      {
        title: "Highest Qualification",
        render: (text, record) => renderText(record.qualif.highest_qual.name),
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

export default Doctors;
