import React, {Component} from 'react';
import {Table} from 'antd';
import {Link} from 'react-router-dom';
import SidebarNav from '../sidebar';
import {Modal} from 'react-bootstrap';
import {itemRender, onShowSizeChange} from "../../components/paginationfunction";
import {fetchApi, fetchApiWithFileUpload} from "../../../_utils/http-utils";
import {
    renderBoolean,
    renderDate,
    renderEditDisableActions,
    renderText,
    renderTextWithImage,
    sorterDate,
    sorterText
} from "../../../_utils/data-table-utils";

import toast from "react-hot-toast";
import {changeCaseFirstLetter} from "../../../_utils/common-utils";

const sliderTypes = ["promo"]
const userTypes = {
    "1": "Patient",
    "2": "Doctor"
}

class Sliders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: {id: null, record: null},
            data: []
        }
    }

    async componentDidMount() {
        await this.reloadData()
    }

    async reloadData() {
        let result = await fetchApi({url: "v1/sliders", method: "GET"})
        this.setState({data: result.data});
    }

    handleClose = () => {
        this.setState({
            show: {id: null, record: null}
        });
    }

    handleShow = (id, record) => {
        let showRecord = {...record}
        showRecord["selectedUserType"] = showRecord.user_type || "1"
        showRecord["selectedType"] = showRecord.type || sliderTypes[0]
        this.setState({
            show: {id: id, record: showRecord}
        });
    }
    handleChange = (e) => {
        const name = e.target.name
        let show = this.state.show
        show.record[name] = e.target.value
        this.setState({
            show: show
        });
    }

    handleFileSelection = (e) => {
        let show = this.state.show
        show.record["file"] = e.target.files[0]
        this.setState({
            show: show
        });
    }
    handleRecordUpdate = async (record) => {
        let result
        if (record && record._id) {
            let data = new FormData()
            if (record.file)
                data.append('file', record.file)
            data.append('title', record.title)
            data.append('desc', record.desc)
            data.append('type', record.selectedType)
            data.append('user_type', record.selectedUserType)
            data.append('_id', record._id)
            result = await fetchApiWithFileUpload({url: "v1/slider/update", method: "POST", formData: data})

        } else {
            let data = new FormData()
            if (!record.file) {
                toast.error("Please select valid file")
                return
            }
            data.append('file', record.file)
            data.append('title', record.title)
            data.append('desc', record.desc)
            data.append('type', record.selectedType)
            data.append('user_type', record.selectedUserType)
            result = await fetchApiWithFileUpload({url: "v1/slider/addNew", method: "POST", formData: data})
        }
        if (result) {
            toast.success(result.message)
        }
        this.handleClose()
        await this.reloadData()
    }
    changeStatus = async (record) => {

        let body = {_id: record._id, enabled: !record.enabled}
        try {
            let result = await fetchApi({
                url: "v1/slider/changeStatus",
                method: "POST",
                body: body
            })
            if (result) {
                toast.success(result.message)
            }
        } catch (e) {
            console.log("error>>", e)

        }
        this.handleClose()

    }
    deleteRecord = async (record) => {

        let body = {_id: record._id}
        try {
            let result = await fetchApi({
                url: "v1/slider/deleteRecord",
                method: "POST",
                body: body
            })
            if (result) {
                toast.success(result.message)
            }
        } catch (e) {
            console.log("error>>", e)

        }
        this.handleClose()

    }

    render() {

        const {data} = this.state

        const columns = [

            {
                title: 'Title',
                dataIndex: 'title',
                render: (text, record) => renderTextWithImage(record.title, record.image),
                sorter: (a, b) => sorterText(a.title, b.title),
            },
            {
                title: 'Type',
                dataIndex: 'type',
                render: (text, record) => renderText(record.type),
            },
            {
                title: 'User Type',
                dataIndex: 'user_type',
                render: (text, record) => renderText(userTypes[record.user_type]),
            },
            {
                title: 'Description',
                dataIndex: 'title',
                render: (text, record) => renderText(record.desc),
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
            },
            {
                title: 'Actions',
                render: (text, record) => renderEditDisableActions((elem) => this.handleShow(elem, record), record),
            },
        ]

        return (
            <>
                <SidebarNav/>
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="page-header">
                            <div className="row">
                                <div className="col-sm-7 col-auto">
                                    <h3 className="page-title">Sliders</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Sliders</li>
                                    </ul>
                                </div>
                                <div className="col-sm-5 col">
                                    <a href="#0" className="btn btn-primary float-right mt-2"
                                       onClick={() => this.handleShow('edit')}>
                                        Add</a>

                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="table-responsive">

                                            <Table className="table-striped"

                                                   style={{overflowX: 'auto'}}
                                                   columns={columns}
                                                // bordered
                                                   dataSource={data}
                                                   ascend={true}
                                                   rowKey={record => record.id}
                                                   showSizeChanger={true}
                                                   pagination={{
                                                       total: data.length,
                                                       showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                                       showSizeChanger: true,
                                                       onShowSizeChange: onShowSizeChange,
                                                       itemRender: itemRender
                                                   }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    {/* Edit Modal */}
                    {this.state.show.id &&
                    <Modal show={this.state.show.id === 'edit'} onHide={this.handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title><h5
                                className="modal-title">{this.state.show.record._id ? "Edit Slider" : "Add New Slider"}</h5>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="row form-row">
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input value={this.state.show.record ? this.state.show.record.title : ""}
                                                   type="text"
                                                   name="title"
                                                   onChange={(e) => {
                                                       this.handleChange(e)
                                                   }}
                                                   className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>Image</label>
                                            <input type="file" className="form-control"
                                                   onChange={(e) => this.handleFileSelection(e)}/>
                                        </div>
                                    </div>

                                </div>
                                <div className="row form-row">
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>Type</label>
                                            <select value={this.state.show.record.selectedType}
                                                    name="selectedType"
                                                    onChange={(e) => this.handleChange(e)}
                                                    className="form-control">
                                                {sliderTypes?.map(type => {
                                                    return <option
                                                        value={type}>{changeCaseFirstLetter(type)}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-group">
                                            <label>User Type</label>
                                            <select value={this.state.show.record.selectedUserType}
                                                    name="selectedUserType"
                                                    onChange={(e) => this.handleChange(e)}
                                                    className="form-control">
                                                {Object.keys(userTypes)?.map(key => {
                                                    return <option
                                                        value={key}>{changeCaseFirstLetter(userTypes[key])}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                </div>
                                <div className="row form-row">
                                    <div className="col-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea value={this.state.show.record ? this.state.show.record.desc : ""}
                                                      name="desc"
                                                      onChange={(e) => {
                                                          this.handleChange(e)
                                                      }}
                                                      className="form-control"/>
                                        </div>
                                    </div>

                                </div>
                                <button type="submit" onClick={() => this.handleRecordUpdate(this.state.show.record)}
                                        className="btn btn-primary btn-block">Save Changes
                                </button>
                            </form>
                        </Modal.Body>
                    </Modal>}
                    {/* Edit Modal */}
                    {/* Delete Modal */}
                    {this.state.show.id &&
                    <Modal show={this.state.show.id === 'disable'} onHide={this.handleClose} centered>

                        <Modal.Body className="text-center">
                            <div className="form-content p-2">
                                <h4 className="modal-title">{this.state.show.record.enabled ? "Disable" : "Enable"}</h4>
                                <p className="mb-4">{`Are you sure want to ${this.state.show.record.enabled ? "disable" : "enable"} "${this.state.show.record.title}" ?`}</p>
                                <button type="button" className="btn btn-primary"
                                        onClick={() => this.changeStatus(this.state.show.record)}>Save
                                </button>
                                <button type="button" onClick={this.handleClose} className="btn btn-danger"
                                        data-dismiss="modal">Close
                                </button>
                            </div>

                        </Modal.Body>
                    </Modal>}
                    <Modal show={this.state.show.id === 'delete'} onHide={this.handleClose} centered>

                        {this.state.show.record && <Modal.Body className="text-center">
                            <div className="form-content p-2">
                                <h4 className="modal-title">Delete</h4>
                                <p className="mb-4">{`Are you sure want to delete "${this.state.show.record.title}"?`}</p>
                                <button type="button" className="btn btn-primary"
                                        onClick={() => this.deleteRecord(this.state.show.record)}>Save
                                </button>
                                <button type="button" onClick={this.handleClose} className="btn btn-danger"
                                        data-dismiss="modal">Close
                                </button>
                            </div>

                        </Modal.Body>}
                    </Modal>
                    {/* Delete Modal */}
                </div>
            </>
        )
    }
}

export default Sliders;
