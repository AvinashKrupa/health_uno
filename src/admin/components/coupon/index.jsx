import React, { Component } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import SidebarNav from "../sidebar";
import { Modal } from "react-bootstrap";
import {
  itemRender,
  onShowSizeChange,
} from "../../components/paginationfunction";
import { fetchApi } from "../../../_utils/http-utils";
import {
  renderBoolean,
  renderDate,
  renderEditDisableActions,
  getColumnFilterProps,
  getColumnSearchProps,
  renderText,
  renderTextWithImage,
  sorterBoolean,
  sorterDate,
  sorterNumber,
  sorterText,
  renderStatus,
} from "../../../_utils/data-table-utils";

import toast from "react-hot-toast";

class CouponScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: { id: null, record: null },
      data: [],
      searchText: "",
      searchedColumn: "",
      addDataSource: {
        code: "",
        desc: "",
        discount_pct: "",
        start_date: "",
        end_date: "",
        max_usages: "",
        coupon_type: "user",
      },
    };
  }

  async componentDidMount() {
    await this.reloadData();
  }
  async reloadData() {
    let result = await fetchApi({
      url: "v1/coupons",
      method: "GET",
    });
    this.setState({ data: result.data });
  }
  handleClose = () => {
    this.setState({
      show: { id: null, record: null },
    });
  };

  handleShow = (id, record) => {
    this.setState({
      show: { id: id, record: { ...record } },
    });
  };

  async changeCouponStatus(record) {
    let body = {
      _id: record._id,
      status: record.status == "active" ? "inactive" : "active",
    };
    try {
      let result = await fetchApi({
        url: "v1/coupon/changeStatus",
        method: "POST",
        body: body,
      });
      if (result) {
        toast.success(result.message);
        this.reloadData();
      }
    } catch (e) {}
    this.handleClose();
    await this.reloadData();
  }

  handleTitleChange = (e, key) => {
    let addDataSource = this.state.addDataSource;
    if(key=='code'){
      addDataSource[key] = e.target.value.toUpperCase();
    }else{
      addDataSource[key] = e.target.value;
    }    
    this.setState({
      addDataSource: addDataSource,
    });
  };

  isValidForm() {
    if (this.state.addDataSource.code.length == 0) {
      toast.error("Please enter coupon code");
      return false;
    } else if (this.state.addDataSource.start_date.length == 0) {
      toast.error("Please select start date");
      return false;
    } else if (this.state.addDataSource.end_date.length == 0) {
      toast.error("Please select end date");
      return false;
    } else if (this.state.addDataSource.discount_pct.length == 0) {
      toast.error("Please enter discount percentage");
      return false;
    } else if (this.state.addDataSource.max_usages.length == 0) {
      toast.error("Please enter max usage");
      return false;
    } else if (this.state.addDataSource.desc.length == 0) {
      toast.error("Please enter description");
      return false;
    }
    return true;
  }

  handleAddCouponCode = async (record) => {
    if (this.isValidForm()) {
      let result;
      result = await fetchApi({
        url: "v1/coupon/addNew",
        method: "POST",
        body: this.state.addDataSource,
      });

      if (result) {
        toast.success(result.message);
        this.setState({
          addDataSource: {
            code: "",
            desc: "",
            discount_pct: "",
            start_date: "",
            end_date: "",
            max_usages: "",
            couponType: "",
          },
        });
        await this.reloadData();
      }
      this.handleClose();
    }
  };

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

  changeStatus = async (record) => {
    let body = { _id: record._id, enabled: !record.enabled };
    try {
      let result = await fetchApi({
        url: "v1/language/changeStatus",
        method: "POST",
        body: body,
      });
      if (result) {
        toast.success(result.message);
      }
    } catch (e) {}
    this.handleClose();
    await this.reloadData();
  };
  deleteRecord = async (record) => {
    let body = { _id: record._id };
    try {
      let result = await fetchApi({
        url: "v1/coupon/deleteRecord",
        method: "POST",
        body: body,
      });
      if (result) {
        toast.success(result.message);
      }
    } catch (e) {}
    this.handleClose();
    await this.reloadData();
  };

  render() {
    const { data } = this.state;

    const columns = [
      {
        title: "Coupon Name",
        dataIndex: "code",
        render: (text, record) => renderText(record.code),
        sorter: (a, b) => sorterText(a.code, b.code),
        ...getColumnSearchProps(
          this,
          "Coupon",
          this.handleSearch,
          this.handleReset,
          "code"
        ),
      },
      {
        title: "Discount %",
        dataIndex: "discount_pct",
        render: (text, record) => renderText(`${record.discount_pct}%`),
        sorter: (a, b) => sorterNumber(a.discount_pct, b.discount_pct),
      },
      {
        title: "Coupon Tyoe",
        dataIndex: "coupon_type",
        render: (text, record) => renderText(record.coupon_type),
        sorter: (a, b) => sorterText(a.coupon_type, b.coupon_type),
      },
      {
        title: "Max Usages",
        dataIndex: "max_usages",
        render: (text, record) => renderText(record.max_usages),
        sorter: (a, b) => sorterNumber(a.max_usages, b.max_usages),
      },
      {
        title: "Description",
        dataIndex: "desc",
        render: (text, record) => renderText(record.desc),
        sorter: (a, b) => sorterText(a.desc, b.desc),
      },
      {
        title: "Start At",
        dataIndex: "start_date",
        render: (text) => renderDate(text),
        sorter: (a, b) => sorterDate(a.created_at, b.start_date),
      },
      {
        title: "End At",
        dataIndex: "end_date",
        render: (text) => renderDate(text),
        sorter: (a, b) => sorterDate(a.updated_at, b.end_date),
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (text, record) => renderStatus(record.status),
        sorter: (a, b) => sorterText(a.status, b.status),
      },
      {
        title: "Actions",
        align: "right",
        render: (text, record) =>
          renderEditDisableActions(
            (elem, records) => {
              if (elem == "disable") {
                this.changeCouponStatus(record);
              } else {
                this.handleShow(elem, record);
              }
            },
            record,
            1,
            true
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
                <div className="col-sm-7 col-auto">
                  <h3 className="page-title">Coupons</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/admin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Coupons</li>
                  </ul>
                </div>
                <div className="col-sm-5 col">
                  <a
                    href="#0"
                    className="btn btn-primary float-right mt-2"
                    onClick={() => this.handleShow("add")}
                  >
                    Add New
                  </a>
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
                        // bordered
                        dataSource={data}
                        ascend={true}
                        rowKey={(record) => record.id}
                        showSizeChanger={true}
                        pagination={{
                          total: data.length,
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
          {/* Edit Modal */}
          {this.state.show.id && (
            <Modal
              show={this.state.show.id === "add"}
              onHide={this.handleClose}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  <h5 className="modal-title">
                    {this.state.show.record._id
                      ? "Edit Coupon"
                      : "Add New Coupon"}
                  </h5>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div className="row form-row">
                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>Coupon Code</label>
                        <input
                          value={this.state.addDataSource.code}
                          type="text"
                          onChange={(e) => {
                            this.handleTitleChange(e, "code");
                          }}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>Coupon Type</label>
                        <select
                          value={this.state.addDataSource.coupon_type}
                          onChange={(e) => {
                            this.handleTitleChange(e, "coupon_type");
                          }}
                          className="form-control"
                          name="CouponType"
                        >
                          <option value={"user"}>User</option>
                          <option value={"clinic"}>Clinic</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>Discount</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={this.state.addDataSource.discount_pct}
                          type="text"
                          onChange={(e) => {
                            this.handleTitleChange(e, "discount_pct");
                          }}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          value={this.state.addDataSource.start_date}
                          type="date"
                          onChange={(e) => {
                            this.handleTitleChange(e, "start_date");
                          }}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          value={this.state.addDataSource.end_date}
                          type="date"
                          onChange={(e) => {
                            this.handleTitleChange(e, "end_date");
                          }}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>Max Usage</label>
                        <input
                          value={this.state.addDataSource.max_usages}
                          type="number"
                          min="1"
                          max="100"
                          onChange={(e) => {
                            this.handleTitleChange(e, "max_usages");
                          }}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>Description</label>
                        <input
                          value={this.state.addDataSource.desc}
                          type="text"
                          onChange={(e) => {
                            this.handleTitleChange(e, "desc");
                          }}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    onClick={(event) => {
                      event.preventDefault();
                      this.handleAddCouponCode();
                    }}
                    className="btn btn-primary btn-block"
                  >
                    Save Changes
                  </button>
                </form>
              </Modal.Body>
            </Modal>
          )}
          {/* Edit Modal */}
          {/* Delete Modal */}
          {this.state.show.id && (
            <Modal
              show={this.state.show.id === "disable"}
              onHide={this.handleClose}
              centered
            >
              <Modal.Body className="text-center">
                <div className="form-content p-2">
                  <h4 className="modal-title">
                    {this.state.show.record.enabled ? "Disable" : "Enable"}
                  </h4>
                  <p className="mb-4">{`Are you sure want to ${
                    this.state.show.record.enabled ? "disable" : "enable"
                  } "${this.state.show.record.name}" ?`}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => this.changeStatus(this.state.show.record)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={this.handleClose}
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </Modal.Body>
            </Modal>
          )}
          <Modal
            show={this.state.show.id === "delete"}
            onHide={this.handleClose}
            centered
          >
            {this.state.show.record && (
              <Modal.Body className="text-center">
                <div className="form-content p-2">
                  <h4 className="modal-title">Delete</h4>
                  <p className="mb-4">{`Are you sure want to delete "${this.state.show.record.code}"?`}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => this.deleteRecord(this.state.show.record)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={this.handleClose}
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    No
                  </button>
                </div>
              </Modal.Body>
            )}
          </Modal>
          {/* Delete Modal */}
        </div>
      </>
    );
  }
}

export default CouponScreen;
