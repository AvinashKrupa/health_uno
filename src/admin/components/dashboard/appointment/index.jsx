import React, { Component } from "react";
import { Table } from "antd";
import {
  renderAppointment,
  renderName,
  renderNameForAppointment,
  renderText,
} from "../../../../_utils/data-table-utils";

class TableAppointmentList extends Component {
  render() {
    const columns = [
      {
        title: "Doctor Name",
        dataIndex: "Name",
        render: (text, record) => renderNameForAppointment(
          record.doctor,
          "Dr",
          "",
          false,
          "doctor"
        ),
      },
      {
        title: "Consulting type",
        dataIndex: "consulting_type",
        render: (text) => renderText(text),
      },
      {
        title: "Patient Name",
        dataIndex: "PatientName",
        render: (text, record) => renderNameForAppointment(
          record.patient,
          "",
          "",
          false,
          "patient"
        ),
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
          columns={columns}
          // bordered
          dataSource={this.props.appointments}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 10,
          }}
        />
      </div>
    );
  }
}

export default TableAppointmentList;
