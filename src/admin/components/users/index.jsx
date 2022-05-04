import React, {Component} from 'react';
import {Table} from 'antd';
import {Link} from 'react-router-dom';
import SidebarNav from '../sidebar';
import {Modal} from 'react-bootstrap';
import {itemRender, onShowSizeChange} from "../../components/paginationfunction";
import {fetchApi} from "../../../_utils/http-utils";
import * as Validator from "../../../_utils/Validators";
import {
    renderBoolean,
    renderDate,
    renderEditDisableActions,
    renderText, sorterBoolean,
    sorterDate,
    sorterText
} from "../../../_utils/data-table-utils";

import toast from "react-hot-toast";

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 1000,
            page: 1,
            show: {id: null, record: null},
            data: []

        }
    }

    async componentDidMount() {
        await this.reloadData()
    }
    async reloadData() {
        let result = await fetchApi({url: "v1/admins", method: "POST", body: {"limit":this.state.limit, "page" : this.state.page}})
        this.setState({data: result?.data?.docs ?? []});
    }
    handleClose = () => {
        this.setState({
            show: {id: null, record: null}
        });
    }

    handleShow = (id, record) => {
        if(record){
            record.password = ""
        }     
        this.setState({
            show: {id: id, record: {...record}}
        });
    }

    handleFirstNameChange = (e) => {
        let show = this.state.show
        show.record["first_name"] = e.target.value
        this.setState({
            show: show
        });
    }

    handleLastNameChange = (e) => {
        let show = this.state.show
        show.record["last_name"] = e.target.value
        this.setState({
            show: show
        });
    }

    handleEmailChange = (e) => {
        let show = this.state.show
        show.record["email"] = e.target.value
        this.setState({
            show: show
        });
    }

    handleMobileNumberChange = (e) => {
        let show = this.state.show
        show.record["mobile_number"] = e.target.value
        this.setState({
            show: show
        });
    }

    handlePasswordChange = (e) => {        
        let show = this.state.show
        show.record["password"] = e.target.value
        this.setState({
            show: show
        });
        console.log(show.record)
    }
    handleConfirmPasswordChange = (e) => {
        let show = this.state.show
        show.record["confirm_password"] = e.target.value
        this.setState({
            show: show
        });
    }

    handleRecordUpdate = async (record) => {
        if (!this.state.show.record.first_name) {
            toast.error("First name is required.")
            return
        }
        if (!this.state.show.record.email) {
            toast.error("Email address is required.")
            return
        }
        if(!Validator.isEmailValid(this.state.show.record.email)){
            toast.error("Enter valid email address.")
            return
        }
        if (!this.state.show.record.mobile_number) {
            toast.error("Mobile number is required.")
            return
        }
        if(!Validator.isLength10(this.state.show.record.mobile_number)){
            toast.error("Enter valid mobile number.")
            return
        }      
        if (this.state.show.record.password) {
            if (!this.state.show.record.confirm_password) {
                toast.error("Confirm password is required.")
                return
            }
            if (this.state.show.record.password!=this.state.show.record.confirm_password) {
                toast.error("Password mismatched.")
                return
            }
        }

        let result
        if (record && record._id) {
            let body = {
                user_id: record._id,
                mobile_number: this.state.show.record.mobile_number,                
                first_name: this.state.show.record.first_name,
                last_name: this.state.show.record.last_name
            }
            if (this.state.show.record.password) {
                body.password = this.state.show.record.password
            }
            result = await fetchApi({url: "v1/admin/update", method: "POST", body: body})

        } else {
            if (!this.state.show.record.password) {
                toast.error("Password is required.")
                return
            }
            let body = {
                mobile_number: this.state.show.record.mobile_number,
                country_code: "+91",
                device_type: "web",
                device_token: "xyzabc",
                first_name: this.state.show.record.first_name,
                last_name: this.state.show.record.last_name,
                email: this.state.show.record.email,
                type: "3",
                password: this.state.show.record.password
            }
            console.log(body)
            result = await fetchApi({
                url: "v1/auth/admin/register", method: "POST",  body: body})
        }
        if (result) {
            toast.success(result.message)
        }
        this.handleClose()
        await this.reloadData()
    }
    changeStatus = async (record) => {

        let body = {_id: record._id, status: record.status ? 'inactive': 'active'}
        try {
            let result = await fetchApi({
                url: "v1/admin/changeStatus",
                method: "POST",
                body: body
            })
            if (result) {
                toast.success(result.message)
            }
        } catch (e) {

        }
        this.handleClose()
        await this.reloadData()

    }
    deleteRecord = async (record) => {

        let body = {user_id: record._id}
        try {
            let result = await fetchApi({
                url: "v1/admin/delete",
                method: "POST",
                body: body
            })
            if (result) {
                toast.success(result.message)
            }
        } catch (e) {

        }
        this.handleClose()
        await this.reloadData()
    }

    render() {

        const {data} = this.state

        const columns = [

            {
                title: 'First name',
                dataIndex: 'first_name',
                render: (text, record) => renderText(record.first_name),
                sorter: (a, b) => sorterText(a.first_name, b.first_name),
            },
            {
                title: 'Last name',
                dataIndex: 'last_name',
                render: (text, record) => renderText(record.last_name),
                sorter: (a, b) => sorterText(a.last_name, b.last_name),
            },
            {
                title: 'Email',
                dataIndex: 'email',
                render: (text, record) => renderText(record.email),
                sorter: (a, b) => sorterText(a.email, b.email),
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
                title: 'Actions',
                render: (text, record) => renderEditDisableActions((elem) => this.handleShow(elem, record), record,2),
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
                                    <h3 className="page-title">Users</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Users</li>
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
                            <Modal.Title><h5 className="modal-title">{this.state.show.record._id ? "Edit User" : "Add New User"}</h5></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="row form-row">
                                    <div className="col-6 col-sm-6">
                                        <div className="form-group">
                                            <label>First name</label>
                                            <input value={this.state.show.record ? this.state.show.record.first_name : ""}
                                                   type="text"
                                                   onChange={(e) => {
                                                       this.handleFirstNameChange(e)
                                                   }}
                                                   className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-6">
                                        <div className="form-group">
                                            <label>Last name</label>
                                            <input value={this.state.show.record ? this.state.show.record.last_name : ""}
                                                   type="text"
                                                   onChange={(e) => {
                                                       this.handleLastNameChange(e)
                                                   }}
                                                   className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Email</label>
                                            {
                                                this.state.show?.record?._id
                                                ?
                                                <input value={this.state.show.record ? this.state.show.record.email : ""}
                                                   type="email" 
                                                   readOnly
                                                   className="form-control"/>
                                                : <input value={this.state.show.record ? this.state.show.record.email : ""}
                                                type="email"
                                                onChange={(e) => {
                                                    this.handleEmailChange(e)
                                                }}
                                                className="form-control"/>

                                            }                                            
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3">
                                        <div className="form-group">
                                            <label>Mobile number</label>
                                            <input value="+91"
                                                   type="text" 
                                                   readOnly
                                                   className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-9 col-sm-9">
                                        <div className="form-group">
                                            <label>&nbsp;</label>
                                            <input value={this.state.show.record ? this.state.show.record.mobile_number : ""}
                                                   type="number"
                                                   onChange={(e) => {
                                                       this.handleMobileNumberChange(e)
                                                   }}
                                                   className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-6">
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input value= {this.state.show.record ? this.state.show.record.password : ""}
                                                   autoComplete="off"
                                                   type="password"
                                                   onChange={(e) => {
                                                       this.handlePasswordChange(e)
                                                   }}
                                                   className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-6">
                                        <div className="form-group">
                                            <label>Confirm password</label>
                                            <input value={this.state.show.record ? this.state.show.record.confirm_password : ""}
                                                   autoComplete="off"
                                                   type="password"
                                                   onChange={(e) => {
                                                       this.handleConfirmPasswordChange(e)
                                                   }}
                                                   className="form-control"/>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" onClick={() => this.handleRecordUpdate(this.state.show.record)}
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
                                <h4 className="modal-title">{this.state.show.record.status ? "Disable" : "Enable"}</h4>
                                <p className="mb-4">{`Are you sure want to ${this.state.show.record.status ? "inactive" : "active"} "${this.state.show.record.first_name}" ?`}</p>
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
                                <p className="mb-4">{`Are you sure want to delete "${this.state.show.record.first_name}"?`}</p>
                                <button type="button" className="btn btn-primary"
                                        onClick={() => this.deleteRecord(this.state.show.record)}>Yes
                                </button>
                                <button type="button" onClick={this.handleClose} className="btn btn-danger"
                                        data-dismiss="modal">No
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

export default Users;
