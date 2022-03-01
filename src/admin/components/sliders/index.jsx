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
import { changeCaseFirstLetter } from "../../../_utils/common-utils";
import { some } from "lodash";
import MultiSelect from "../MultiSelect/MultiSelect";

const sliderTypes = ["promo"];
const userTypes = {
  1: "Patient",
  2: "Doctor",
};

class Sliders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: { id: null, record: null },
      title: "",
      edited: false,
      data: [],
      specialitiesData: [],
      selectedSpeciality: "",
    };
  }

  async componentDidMount() {
    this.fetchSpeciality();
    await this.reloadData();
  }

  async reloadData() {
    let result = await fetchApi({
      url: "v1/sliders?showAll=true",
      method: "GET",
    });
    this.setState({ data: result.data });
  }

  async fetchSpeciality() {
    let specialities = await fetchApi({
      url: "v1/specialities?showAll=true",
      method: "GET",
    });
    console.log("specialities", specialities);
    let data = [];

    if (Array.isArray(specialities.data)) {
      data = specialities.data.map((info) => {
        return { name: info.title, _id: info._id };
      });
    }
    this.setState({ specialitiesData: data });
  }

  handleClose = () => {
    this.setState({
      show: { id: null, record: null },
      edited: false,
    });
  };

  handleShow = (id, record) => {
    if (id == "edit") {
      let showRecord = { ...record };
      showRecord["selectedUserType"] = showRecord.user_type || "1";
      showRecord["selectedType"] = showRecord.type || sliderTypes[0];
      this.setState({
        show: { id: id, record: showRecord },
        title: showRecord.title,
        edited: true,
      });

      if (record.speciality_id && record.speciality_id != "") {
        this.setState({ selectedSpeciality: record.speciality_id._id });
      }
    } else {
      let showRecord = { ...record };
      showRecord["selectedUserType"] = showRecord.user_type || "1";
      showRecord["selectedType"] = showRecord.type || sliderTypes[0];
      this.setState({
        show: { id: id, record: showRecord },
        title: showRecord.title,
      });
    }
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
  // validateImageDimentions = async (e, type) => {
  //   var reader = new FileReader();
  //   //Read the contents of Image File.
  //   reader.readAsDataURL(e.target.files[0]);
  //   const dim = await new Promise(function (resolve, reject) {
  //     reader.onload = async function (e) {
  //       //Initiate the JavaScript Image object.
  //       var image = new Image();
  //       //Set the Base64 string return from FileReader as source.
  //       image.src = e.target.result;
  //       const dimensions = await new Promise(function (resolve, reject) {
  //         image.onload = function () {
  //           resolve({ width: image.width, height: image.height });
  //         };
  //       });
  //       //console.log("dimensions are ", dimensions);
  //       resolve(dimensions);
  //     };
  //   });
  //   //console.log("dimensions are in outer promise ", dim);
  //   if (type === "web") {
  //     if (dim.width !== 1200 || dim.height !== 320) {
  //       toast.error(
  //         "Selected invalid Web Banner expecting 1200*320 width and height"
  //       );
  //       return false;
  //     }
  //   } else {
  //     if (dim.width !== 400 || dim.height !== 200) {
  //       toast.error(
  //         "Selected invalid Mobile Banner, expecting 400*200 width and height "
  //       );
  //       return false;
  //     }
  //   }
  //   return true;
  // };
  handleWebFileSelection = async (e) => {
    const targetFile = e.target.files[0];
    const type = "web";
    // let valid = await this.validateImageDimentions(e, type);
    this.newMethod(true, targetFile, type);
  };
  handleMobileFileSelection = async (e) => {
    const targetFile = e.target.files[0];
    const type = "mobile";
    // let valid = await this.validateImageDimentions(e, type);
    this.newMethod(true, targetFile, type);
  };
  newMethod(valid, targetFile, type) {
    if (valid) {
      let show = this.state.show;
      const fileName = targetFile.name;
      if (type === "web") {
        show.record["webfile"] = targetFile;
        show.record["device_type_web"] = "web";
      } else {
        show.record["mobilefile"] = targetFile;
        show.record["device_type_mobile"] = "mobile";
      }
      this.setState({
        show: show,
      });
    } else {
      type === "web"
        ? (this.fileInput.value = "")
        : (this.fileMobileInput.value = "");
    }
  }

  checkFields() {
    if (this.state.edited) {
      if (this.state.title === "") {
        toast.error("Please enter Title ");
        return false;
      }
    } else {
      if (
        this.state.title === "" ||
        this.fileInput.value === "" ||
        this.fileMobileInput.value === ""
      ) {
        toast.error("Title, Mobile Banner and Web Banner is Mandatory ");
        return false;
      }
    }
    return true;
  }
  handleRecordUpdate = async (record) => {
    const valid = this.checkFields();
    if (valid) {
      let result;
      if (record && record._id) {
        let data = new FormData();
        if (record.mobilefile) {
          data.append("file", record.mobilefile);
          data.append("device_type", record.device_type_mobile);
        }
        if (record.webfile) {
          data.append("file", record.webfile);
          data.append("device_type", record.device_type_web);
        }
        // data.append('file', record.mobilefile)
        data.append("title", record.title);
        data.append("desc", record.desc || "");

        if (this.state.selectedSpeciality != "") {
          data.append("speciality_id", this.state.selectedSpeciality || "");
        } else {
          data.append("speciality_id", "");
        }

        data.append("type", record.selectedType);
        data.append("user_type", record.selectedUserType);
        data.append("_id", record._id);
        result = await fetchApiWithFileUpload({
          url: "v1/slider/update",
          method: "POST",
          formData: data,
        });
      } else {
        let data = new FormData();
        // if (!record.file) {
        //     toast.error("Please select valid file")
        //     return
        // }
        data.append("file", record.mobilefile);
        data.append("device_type", record.device_type_mobile);
        data.append("file", record.webfile);
        data.append("device_type", record.device_type_web);
        data.append("title", record.title);
        data.append("desc", record.desc ? record.desc : "");
        data.append("type", record.selectedType);
        if (this.state.selectedSpeciality != "") {
          data.append("speciality_id", this.state.selectedSpeciality || "");
        }
        // data.append("speciality_id", this.state.selectedSpeciality || "");
        data.append("user_type", record.selectedUserType);
        result = await fetchApiWithFileUpload({
          url: "v1/slider/addNewMulti",
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
    let body = { _id: record._id, enabled: !record.enabled };
    try {
      let result = await fetchApi({
        url: "v1/slider/changeStatus",
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
        url: "v1/slider/deleteRecord",
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
        title: "Mobile Banner",
        dataIndex: "mob_image",
        ellipsis: true,
        render: (text, record) => renderTextWithImage("", record.mob_image),
        //sorter: (a, b) => sorterText(a.mob_image, b.mob_image),
      },
      {
        title: "Web Banner",
        dataIndex: "image",
        ellipsis: true,
        render: (text, record) => renderTextWithImage("", record.image),
        //sorter: (a, b) => sorterText(a.image, b.image),
      },
      {
        title: "Speciality",
        dataIndex: "speciality_id",
        render: (text, record) =>
          renderText(record.speciality_id ? record.speciality_id.title : ""),
      },
      {
        title: "Type",
        dataIndex: "type",
        render: (text, record) => renderText(record.type),
      },
      {
        title: "User Type",
        dataIndex: "user_type",
        render: (text, record) => renderText(userTypes[record.user_type]),
      },
      // {
      //   title: "Description",
      //   dataIndex: "title",
      //   ellipsis: true,
      //   render: (text, record) => renderText(record.desc),
      // },
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
                  <h3 className="page-title">Sliders</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/admin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Sliders</li>
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
                      ? "Edit Slider"
                      : "Add New Slider"}
                  </h5>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div className="row form-row">
                    <div className="col-12 col-sm-6">
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

                    <div className="col-12 col-sm-6">
                      <div className="form-group">
                        <label>Speciality</label>
                        <select
                          value={this.state.selectedSpeciality}
                          name="speciality"
                          onChange={(e) =>
                            this.setState({
                              selectedSpeciality: event.target.value,
                            })
                          }
                          className="form-control"
                        >
                          <option value={""}>{"Select speciality"}</option>
                          {this.state.specialitiesData.map((info) => {
                            return (
                              <option value={info._id}>{info.name}</option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}></div>
                  <div className="row form-row">
                    <div className="col-12 col-sm-6">
                      <div className="form-group">
                        <label>Type</label>
                        <select
                          value={this.state.show.record.selectedType}
                          name="selectedType"
                          onChange={(e) => this.handleChange(e)}
                          className="form-control"
                        >
                          {sliderTypes?.map((type) => {
                            return (
                              <option value={type}>
                                {changeCaseFirstLetter(type)}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-group">
                        <label>User Type</label>
                        <select
                          value={this.state.show.record.selectedUserType}
                          name="selectedUserType"
                          onChange={(e) => this.handleChange(e)}
                          className="form-control"
                        >
                          {Object.keys(userTypes)?.map((key) => {
                            return (
                              <option value={key}>
                                {changeCaseFirstLetter(userTypes[key])}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row form-row">
                    <div className="col-12 col-sm-6">
                      <div className="form-group">
                        <label>Mobile Banner</label>
                        <input
                          type="file"
                          className="form-control"
                          ref={(ref) => (this.fileMobileInput = ref)}
                          onChange={(e) => this.handleMobileFileSelection(e)}
                        />
                        <p>
                          <em>800w * 400h (2 : 1 aspect ration) </em>
                        </p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-group">
                        <label>Web Banner</label>
                        <input
                          type="file"
                          className="form-control"
                          ref={(ref) => (this.fileInput = ref)}
                          onChange={(e) => this.handleWebFileSelection(e)}
                        />
                        <p>
                          <em>2400w * 600h (4 : 1 aspect ration) </em>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* <div className="row form-row">
                    <div className="col-12 col-sm-12">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={
                            this.state.show.record
                              ? this.state.show.record.desc
                              : ""
                          }
                          name="desc"
                          onChange={(e) => {
                            this.handleChange(e);
                          }}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div> */}
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
          {/* Delete Modal */}
        </div>
      </>
    );
  }
}

export default Sliders;
