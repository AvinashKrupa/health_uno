import React, {Component} from "react";
import {Table, Switch} from "antd";
import SidebarNav from "../sidebar";
import {
    itemRender,
    onShowSizeChange,
} from "../../components/paginationfunction";
import {fetchApi} from "../../../_utils/http-utils";
import {
    renderDate,
    renderName,
    renderText,
    sorterDate,
    sorterNumber,
    sorterText
} from "../../../_utils/data-table-utils";

class Appointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    async componentDidMount() {
        let appointments = await fetchApi({url: "v1/appointments", method: "GET"})
        this.setState({data: appointments.data});
    }

    render() {
        const {data} = this.state;

        const columns = [
            {
                title: "Appointment Time",
                render: (text, record) => renderText(record.time.slot),
            },
            {
                title: "Date",
                render: (text, record) => renderDate(record.time.utc_time),
                sorter: (a, b) => sorterDate(a.time.utc_time, b.time.utc_time),
            },
            {
                title: "Patient",
                render: (text, record) => renderName(record.patient),
                sorter: (a, b) => sorterText(a.patient.user_id.first_name, b.patient.user_id.first_name)
            },
            {
                title: "Doctor",
                render: (text, record) => renderName(record.doctor, "Dr"),
                sorter: (a, b) => sorterText(a.doctor.first_name, b.doctor.first_name)
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
                sorter: (a, b) => sorterText(a.status, b.status)
            },
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
                                                rowKey={(record) => record.id}
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
