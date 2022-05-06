import React, { Component } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import SidebarNav from "../sidebar";
import { Modal } from "react-bootstrap";
import {
  itemRender,
  onShowSizeChange,
} from "../../components/paginationfunction";
import { fetchApi, fetchApiWithFileUpload } from "../../../_utils/http-utils";
import {
  renderDate,
  renderEditDisableActions,
  renderEnabledStatus,
  renderTextWithLink,
  renderTextWithImage,
  sorterBoolean,
  sorterDate,
  sorterText,
} from "../../../_utils/data-table-utils";

import toast from "react-hot-toast";

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: { id: null, record: null },
      title: "",
      data: [],
    };
  }

  async componentDidMount() {
    await this.reloadData();
  }

  async reloadData() {
    let result = await fetchApi({
      url: "v1/videos?showAll=true",
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
    let showRecord = { ...record };
    this.setState({
      show: { id: id, record: showRecord },
      title: showRecord.title,
    });
  };

  handleChange = (e) => {
    const name = e.target.name;
    let show = this.state.show;
    show.record[name] = e.target.value;
    this.setState({
      show: show,
    });
  };
  handleTitleChange = (e) => {
    const name = e.target.name;
    let show = this.state.show;
    show.record[name] = e.target.value;
    this.setState({
      show: show,
      title: e.target.value,
    });
  };
  handleVideoFileSelection = async (e) => {
    const targetFile = e.target.files[0];
    const type = "file";
    this.newMethod(true, targetFile, type);
  };
  handleThumbnailFileSelection = async (e) => {
    const targetFile = e.target.files[0];
    const type = "thumb_file";
    this.newMethod(true, targetFile, type);
  };
  newMethod(valid, targetFile, type) {
    if (valid) {
      let show = this.state.show;
      const fileName = targetFile.name;
      if (type === "file") {
        show.record["file"] = targetFile;
      } else {
        show.record["thumb_file"] = targetFile;
      }
      this.setState({
        show: show,
      });
    } else {
      type === "file" ? (this.file.value = "") : (this.thumb_file.value = "");
    }
  }

  checkFields() {
    if (
      this.state.title === "" ||
      this.file.value === "" ||
      this.thumb_file.value === ""
    ) {
      toast.error("Title, Video and Video Thumbnail is Mandatory ");
      return false;
    }
    return true;
  }
  handleRecordUpdate = async (record) => {
    const valid = this.checkFields();
    if (valid) {
      let result;
      if (record) {
        let data = new FormData();
        data.append("title", record.title);
        data.append("file", record.file);
        data.append("thumb_file", record.thumb_file);

        result = await fetchApiWithFileUpload({
          url: "v1/video/addNew",
          method: "POST",
          formData: data,
        });
      }
      if (result) {
        toast.success(result.message);
      }
      this.handleClose();
      await this.reloadData();
    }
  };
  changeStatus = async (record) => {
    let body = {
      _id: record._id,
      status: record.status == "active" ? "inactive" : "active",
    };
    try {
      let result = await fetchApi({
        url: "v1/video/changeStatus",
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
        url: "v1/video/deleteRecord",
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
        title: "Title",
        dataIndex: "title",
        ellipsis: true,
        sorter: (a, b) => sorterText(a.title, b.title),
      },
      {
        title: "Video",
        dataIndex: "url",
        ellipsis: true,
        render: (text, record) => renderTextWithLink("view", record.url),
      },
      {
        title: "Thumb",
        dataIndex: "thumb_url",
        ellipsis: true,
        render: (text, record) => renderTextWithImage("", record.thumb_url),
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
        dataIndex: "status",
        render: (text) => renderEnabledStatus(text),
        sorter: (a, b) => sorterBoolean(a.status, b.status),
      },
      {
        title: "Actions",
        render: (text, record) =>
          renderEditDisableActions(
            (elem) => this.handleShow(elem, record),
            record,
            1,
            false
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
                  <h3 className="page-title">Videos</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/admin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Videos</li>
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
                      ? "Edit Video"
                      : "Add New Video"}
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
                          name="title"
                          onChange={(e) => {
                            this.handleTitleChange(e);
                          }}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row form-row">
                    <div className="col-12 col-sm-6">
                      <div className="form-group">
                        <label>Video</label>
                        <input
                          type="file"
                          className="form-control"
                          ref={(ref) => (this.file = ref)}
                          onChange={(e) => this.handleVideoFileSelection(e)}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-group">
                        <label>Video Thumbnail</label>
                        <input
                          type="file"
                          className="form-control"
                          ref={(ref) => (this.thumb_file = ref)}
                          onChange={(e) => this.handleThumbnailFileSelection(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      this.handleRecordUpdate(this.state.show.record);
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
                  } "${this.state.show.record.title}" ?`}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => this.changeStatus(this.state.show.record)}
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

export default Video;
