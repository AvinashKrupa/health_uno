import React, { Component } from "react";
import { Table } from "antd";
import {
  renderAppointment,
  renderName,
  renderNameForAppointment,
  renderText,
} from "../../../../_utils/data-table-utils";
import { fetchApi } from "../../../../_utils/http-utils";
import {
  itemRender,
  onShowSizeChange,
} from "../../../components/paginationfunction";

class TableAppointmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      total: null,
      loading: false,
      pagination: {
        page: 1,
        limit: 10,
      },
    };
  }

  async fetchAppointment(params = {}) {
    this.setState({
      loading: true,
    });
    const body = {
      ...params,
    };
    let appointments = await fetchApi({
      url: "v2/appointments",
      method: "POST",
      body: body,
    });
    this.setState({
      appointments: appointments.data.docs,
      loading: false,
      total: appointments.data.total,
      pagination: {
        page: appointments.data.page,
        limit: appointments.data.limit,
        total: appointments.data.total,
      },
    });
  }

  componentDidMount() {
    this.fetchAppointment(this.state.pagination);
  }

  handleDataChange = (pagination, filters, sorter) => {
    this.setState({
      pagination: { page: pagination.current, limit: pagination.pageSize },
      loading: true,
    });
    const obj = {
      page: pagination.current,
      limit: pagination.pageSize,
    };
    this.fetchAppointment(obj);
  };

  render() {
    const columns = [
      {
        title: "Appointment ID",
        dataIndex: "huno_id",
      },
      {
        title: "Doctor Name",
        dataIndex: "Name",
        render: (text, record) =>
          renderNameForAppointment(record.doctor, "Dr", "", false, "doctor"),
      },
      {
        title: "Consulting Type",
        dataIndex: "consulting_type",
        render: (text) => renderText(text),
      },
      {
        title: "Patient Name",
        dataIndex: "PatientName",
        render: (text, record) =>
          renderNameForAppointment(record.patient, "", "", false, "patient"),
      },
      {
        title: "Appointment Time",
        dataIndex: "AppointmentTime",
        render: (text, record) =>
          renderAppointment(record.time.utc_time, record.time.slot),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text) => renderText(text),
      },
      {
        title: "Amount",
        dataIndex: "Amount",
        render: (text, record) => renderText(record.fee),
      },
    ];

    return (
      <div>
        <Table
          className="table-striped"
          style={{ overflowX: "auto" }}
          loading={this.state.loading}
          columns={columns}
          onChange={this.handleDataChange}
          // bordered
          dataSource={this.state.appointments}
          rowKey={(record) => record.id}
          total={this.state.total}
          pagination={{
            position: ["topRight", "bottomRight"],
            total:
              this.state.total >= 0
                ? this.state.total
                : this.state.appointments.length,
            showTotal: (total, range) =>
              `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            showSizeChanger: true,
            onShowSizeChange: onShowSizeChange,
            itemRender: itemRender,
          }}
        />
      </div>
    );
  }
}

export default TableAppointmentList;
