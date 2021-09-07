import React, {Component} from "react";
import {Table, Switch, Input, Space, Button} from "antd";
import SidebarNav from "../sidebar";
import {
    itemRender,
    onShowSizeChange,
} from "../../components/paginationfunction";
import {fetchApi} from "../../../_utils/http-utils";
import {
    getColumnSearchProps,
    renderAppointment,
    renderDate, renderDropDown,
    renderName,
    renderText,
    sorterDate,
    sorterNumber,
    sorterText
} from "../../../_utils/data-table-utils";
import toast from "react-hot-toast";
import {changeCaseFirstLetter} from "../../../_utils/common-utils";

const statusArray = ['pending','scheduled', 'cancelled', 'rejected', 'ongoing', 'completed']

class Appointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showMenu: {},
            searchText: '',
            searchedColumn: '',
        };
    }

    async componentDidMount() {
        let appointments = await fetchApi({url: "v1/appointments", method: "GET"})
        this.setState({data: appointments.data});
    }

    async handleItemClick(record, dropdownItem) {
        let index = this.state.data.indexOf(record)
        let data = this.state.data
        data[index].status = dropdownItem
        this.setState({showMenu: {[record._id]: false}})
        // toast("Functionality in development")
        try {
            let result = await fetchApi({
                url: "v1/appointment/changeStatus",
                method: "POST",
                body: {appointment_id: record._id, status: dropdownItem}
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

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({searchText: ''});
    };

    getColumnSearchProps = (dataIndex, handleSearch, handleReset, recordValueToCompare) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Reset
                    </Button>

                </Space>
            </div>
        ),
        onFilter: (value, record) => {
            let childern = recordValueToCompare.split(".")
            let finalVal = record
            childern.forEach(child => {
                finalVal = finalVal[child]
            })
            return finalVal
                ? finalVal.toString().toLowerCase().includes(value.toLowerCase())
                : ''
        },
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
    });
    getColumnFilterProps = (filterArray, recordValueToCompare) => {
        filterArray = filterArray.map(filter => {
            return {
                text: changeCaseFirstLetter(filter),
                value: filter
            }
        })
        return ({
            filters: filterArray,
            onFilter: (value, record) => {
                let childern = recordValueToCompare.split(".")
                let finalVal = record
                childern.forEach(child => {
                    finalVal = finalVal[child]
                })
                return finalVal
                    ? finalVal.toString().toLowerCase().includes(value.toLowerCase())
                    : ''
            },
        });
    }

    render() {
        const {data} = this.state;

        const columns = [
            {
                title: "Appointment Time",
                render: (text, record) => renderAppointment(record.time.utc_time, record.time.slot),
                sorter: (a, b) => sorterDate(a.time.utc_time, b.time.utc_time),
            },
            {
                title: "Patient",
                render: (text, record) => renderName(record.patient),
                sorter: (a, b) => sorterText(a.patient.user_id.first_name, b.patient.user_id.first_name),
                ...this.getColumnSearchProps("Patient", this.handleSearch, this.handleReset,
                    "patient.user_id.first_name"),

            },
            {
                title: "Doctor",
                render: (text, record) => renderName(record.doctor, "Dr"),
                sorter: (a, b) => sorterText(a.doctor.first_name, b.doctor.first_name),
                ...this.getColumnSearchProps("Doctor", this.handleSearch, this.handleReset,
                    "doctor.first_name"),

            },
            {
                title: "Reason",
                render: (text, record) => renderText(record.reason),
                sorter: (a, b) => sorterText(a.reason, b.reason)
            },
            {
                title: "Consulting type",
                dataIndex: "consulting_type",
                render: (text) => renderText(text),
                sorter: (a, b) => sorterText(a.consulting_type, b.consulting_type)
            },
            {
                title: "Fees (Rupees)",
                render: (text, record) => renderText(record.fee),
                sorter: (a, b) => sorterNumber(a.fee, b.fee)

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
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (text) => renderText(text),
                sorter: (a, b) => sorterText(a.status, b.status),
                ...this.getColumnFilterProps(statusArray, "status"),
            },
            {
                title: 'Actions',
                render: (text, record) => renderDropDown("Change Status", statusArray.filter(item => item !== record.status),
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
                                    <h3 className="page-title">Appointments</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="/admin">Dashboard</a>
                                        </li>
                                        <li className="breadcrumb-item active">Appointments</li>
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

export default Appointments;
