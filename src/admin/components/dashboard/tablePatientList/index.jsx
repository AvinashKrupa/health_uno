import React, { Component } from "react";
import { Table } from "antd";
import "antd/dist/antd.css";
import {
  renderName,
  sorterNumber,
  sorterText,
} from "../../../../_utils/data-table-utils";

class TablePatientsList extends Component {
  render() {
    const columns = [
      {
        title: "Patient Name",
        dataIndex: "Name",
        render: (text, record) => renderName(record, "", "", true),
      },
      {
        title: "Phone",
        dataIndex: "Phone",
        render: (text, record) => {
          return <p>{record.user_id.mobile_number}</p>;
        },
      },
      {
        title: "Height (Feet)",
        dataIndex: "height",
        sorter: (a, b) => sorterText(a.height, b.height),
      },
      {
        title: "Weight (Kg)",
        dataIndex: "weight",
        sorter: (a, b) => sorterNumber(a.weight, b.weight),
      },
    ];
    return (
      <div>
        <Table
          className="table-striped"
          style={{ overflowX: "auto" }}
          columns={columns}
          // bordered
          dataSource={this.props.patients}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 5,
          }}
        />
      </div>
    );
  }
}

export default TablePatientsList;
