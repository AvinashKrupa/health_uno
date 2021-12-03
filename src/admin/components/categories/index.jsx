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
  renderText,
  renderTextWithImage,
  sorterBoolean,
  sorterDate,
  sorterText,
} from "../../../_utils/data-table-utils";

import toast from "react-hot-toast";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: { id: null, record: null },
      data: [],
    };
  }

  async componentDidMount() {
    await this.reloadData();
  }

  async reloadData() {
    let result = await fetchApi({
      url: "v1/categories?showAll=true",
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
  handleTitleChange = (e) => {
    let show = this.state.show;
    show.record["title"] = e.target.value;
    this.setState({
      show: show,
    });
  };

  handleRecordUpdate = async (record) => {
    let result;
    if (record && record._id) {
      let body = { _id: record._id, title: this.state.show.record.title };
      result = await fetchApi({
        url: "v1/category/update",
        method: "POST",
        body: body,
      });
    } else {
      let body = { title: this.state.show.record.title };
      result = await fetchApi({
        url: "v1/category/addNew",
        method: "POST",
        body: body,
      });
    }
    if (result) {
      toast.success(result.message);
    }
    this.handleClose();
    await this.reloadData();
  };
  changeStatus = async (record) => {
    let body = { _id: record._id, enabled: !record.enabled };
    try {
      let result = await fetchApi({
        url: "v1/category/changeStatus",
        method: "POST",
        body: body,
      });
      if (result) {
        toast.success(result.message);
      }
    } catch (e) {
    }
    this.handleClose();
    await this.reloadData();
  };
  deleteRecord = async (record) => {
    let body = { _id: record._id };
    try {
      let result = await fetchApi({
        url: "v1/category/deleteRecord",
        method: "POST",
        body: body,
      });
      if (result) {
        toast.success(result.message);
      }
    } catch (e) {
    }
    this.handleClose();
    await this.reloadData();
  };

  render() {
    const { data } = this.state;

    const columns = [
      {
        title: "Title",
        dataIndex: "title",
        render: (text, record) => renderText(record.title),
        sorter: (a, b) => sorterText(a.title, b.title),
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
        title: "Status",
        dataIndex: "enabled",
        render: (text) => renderBoolean(text),
        sorter: (a, b) => sorterBoolean(a.enabled, b.enabled),
      },
      {
        title: "Actions",
        render: (text, record) =>
          renderEditDisableActions(
            (elem) => this.handleShow(elem, record),
            record
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
                  <h3 className="page-title">Categories</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/admin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Categories</li>
                  </ul>
                </div>
                <div className="col-sm-5 col">
                  <a
                    href="#0"
                    className="btn btn-primary float-right mt-2"
                    onClick={() => this.handleShow("edit")}
                  >
                    Add
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
              show={this.state.show.id === "edit"}
              onHide={this.handleClose}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  <h5 className="modal-title">
                    {this.state.show.record._id
                      ? "Edit Category"
                      : "Add New Category"}
                  </h5>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div className="row form-row">
                    <div className="col-12 col-sm-12">
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          value={
                            this.state.show.record
                              ? this.state.show.record.title
                              : ""
                          }
                          type="text"
                          onChange={(e) => {
                            this.handleTitleChange(e);
                          }}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={() =>
                      this.handleRecordUpdate(this.state.show.record)
                    }
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
                  } "${this.state.show.record.title}" ?`}</p>
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
                  <p className="mb-4">{`Are you sure want to delete "${this.state.show.record.title}"?`}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => this.deleteRecord(this.state.show.record)}
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
            )}
          </Modal>
          }{/* Delete Modal */}
        </div>
      </>
    );
  }
}

export default Categories;
