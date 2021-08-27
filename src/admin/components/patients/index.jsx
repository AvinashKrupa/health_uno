import React, {Component} from "react";
import {Table} from "antd";
import {Link} from "react-router-dom";
import SidebarNav from "../sidebar";
import {itemRender, onShowSizeChange,} from "../../components/paginationfunction";
import {fetchApi} from "../../../_utils/http-utils";
import {
    renderDate, renderDropDown,
    renderName,
    renderText,
    sorterDate,
    sorterNumber,
    sorterText
} from "../../../_utils/data-table-utils";
import toast from "react-hot-toast";

const patientStatus = ['active', 'inactive', 'suspended', 'banned']

class Patients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showMenu: {}
        };
    }

    async componentDidMount() {
        let patients = await fetchApi({url: "v1/patients", method: "GET"})
        this.setState({data: patients.data});
    }

    async handleItemClick(record, dropdownItem) {
        let index = this.state.data.indexOf(record)
        let data = this.state.data
        data[index].status = dropdownItem
        this.setState({showMenu: {[record._id]: false}})
        try {
            let result = await fetchApi({
                url: "v1/patient/changeStatus",
                method: "POST",
                body: {patient_id: record._id, status: dropdownItem}
            })
            if (result) {
                toast.success(result.message)
                this.setState({data: data})
            }
        } catch (e) {
            console.log("error>>", e)

        }
    }

    handleDropdownClick(record) {
        let isShown = this.state.showMenu[record._id]
        this.setState({showMenu: {[record._id]: !isShown}})
    }

    showDropDownMenu(record) {
        return this.state.showMenu[record._id]
    }

    render() {
        const {data} = this.state;

        const columns = [
            {
                title: "Patient Name",
                render: (text, record) => renderName(record, "", "", true),
                // sorter: (a, b) => sorterText(a.user.first_name, b.user.first_name)
            },
            {
                title: "Height (Feet)",
                dataIndex: "height",
                sorter: (a, b) => sorterText(a.height, b.height)
            },
            {
                title: "Weight (Kg)",
                dataIndex: "weight",
                sorter: (a, b) => sorterNumber(a.weight, b.weight)
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
                sorter: (a, b) => sorterText(a.status, b.status)
            },
            {
                title: 'Actions',
                render: (text, record) => renderDropDown("Change Status", patientStatus.filter(item => item !== record.status),
                    (elem, index) => this.handleItemClick(record, elem),
                    () => this.handleDropdownClick(record),
                    this.showDropDownMenu(record))

            }
        ];

        return (
            <>
                <SidebarNav/>
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="page-header">
                            <div className="row">
                                <div className="col-sm-12">
                                    <h3 className="page-title">List of Patient</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/admin">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="#0">Users</Link>
                                        </li>
                                        <li className="breadcrumb-item active">Patient</li>
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
                                                style={{overflowX: "auto"}}
                                                columns={columns}
                                                // bordered
                                                dataSource={data}
                                                rowKey={(record) => record._id}
                                                showSizeChanger={true}
                                                pagination={{
                                                    total: data.length,
                                                    showTotal: (total, range) =>
                                                        `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                                    showSizeChanger: true,
                                                    onShowSizeChange: onShowSizeChange,
                                                    itemRender: itemRender,
                                                    position: ["topRight", "bottomRight"]
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

export default Patients;
