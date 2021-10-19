import React, { Component } from "react";
import { Table } from "antd";
import "antd/dist/antd.css";
import {
  renderChips,
  renderName,
  renderText,
} from "../../../../_utils/data-table-utils";

class TableDoctor extends Component {
  render() {
    const columns = [
      {
        title: "Doctor Name",
        dataIndex: "Name",
        render: (text, record) => renderName(record, "Dr", "", true),
      },
      {
        title: "Speciality",
        dataIndex: "Speciality",
        render: (text, record) => renderChips(record.qualif.specl),
      },
      {
        title: "Fees (Rupees)",
        render: (text, record) => renderText(record.qualif.fee),
      },
      {
        title: "Department",
        render: (text, record) => renderText(record.qualif.dept_id.title),
      },
    ];
    return (
      <div>
        <Table
          className="table-striped"
          style={{ overflowX: "auto" }}
          columns={columns}
          // bordered
          dataSource={this.props.doctors}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 5,
          }}
        />
      </div>
    );
  }
}

export default TableDoctor;
