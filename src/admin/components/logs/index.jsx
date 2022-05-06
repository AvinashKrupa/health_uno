import React, { Component } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import SidebarNav from "../sidebar";
import {
  itemRender,
  onShowSizeChange,
} from "../../components/paginationfunction";
import { fetchApi } from "../../../_utils/http-utils";
import {
  renderDate,
  renderText,
  renderTextWithImage,
  sorterDate,
  sorterText,
} from "../../../_utils/data-table-utils";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
      },
      total: 0,
      loading: false,
      data: [],
    };
  }

  async componentDidMount() {
    const { pagination } = this.state;
    await this.reloadData(pagination);
  }
  async reloadData(params = {}) {
    const body = {
      ...params,
    };
    let response = await fetchApi({
      url: "v1/admin/logs",
      method: "POST",
      body: body,
    });

    this.setState({
      data: response.data.docs,
      total: response.data.total,
      loading: false,
      pagination: {
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
      },
    });
  }

  render() {
    const { data } = this.state;

    const columns = [
      {
        title: "Name",
        width: 200,
        dataIndex: "actioner.name",
        render: (text, record) =>
          renderText(record.actioner.name, record.actioner.avatar),
        sorter: (a, b) => sorterText(a.actioner.name, b.actioner.name),
      },
      {
        title: "Title",
        width: 200,
        dataIndex: "title",
        render: (text, record) => renderText(record.title),
        sorter: (a, b) => sorterText(a.title, b.title),
      },
      {
        title: "Message",
        dataIndex: "message",
        render: (text, record) => renderText(record.message),
        sorter: (a, b) => sorterText(a.message, b.message),
        width: 300,
      },
      {
        title: "Updated time",
        dataIndex: "updated_at",
        render: (text) => renderDate(text),
        sorter: (a, b) => sorterDate(a.updated_at, b.updated_at),
      },
      {
        title: "Change Type",
        dataIndex: "module_name",
        render: (text) => renderText(text),
        sorter: (a, b) => sorterText(a.module_name, b.module_name),
      },
      {
        title: "Actions",
        width: 100,
        render: (text, record) => {
          return (
            <>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (record.module_name == "Patient") {
                      this.props.history.push(
                        `/profile/${record.record_id}/1`,
                        {
                          profile_type: 1,
                        }
                      );
                    } else if (record.module_name == "Doctor") {
                      this.props.history.push(
                        `/profile/${record.record_id}/2`,
                        {
                          profile_type: 2,
                        }
                      );
                    } else if (record.module_name == "Coupon") {
                      this.props.history.push(`/coupon`, {});
                    } else if (record.module_name == "Appointment") {
                      this.props.history.push(`/appointment-list`, {});
                    }
                  }}
                  className="btn btn-primary book-btn"
                >
                  View
                </button>
              </div>
            </>
          );
        },
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
                  <h3 className="page-title">Logs</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/admin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Logs</li>
                  </ul>
                </div>
                <div className="col-sm-5 col"></div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <Table
                        className="table-striped"
                        scroll={{ x: 1000 }}
                        columns={columns}
                        rowKey={(record) => record._id}
                        dataSource={this.state.data}
                        pagination={{
                          position: ["topRight", "bottomRight"],
                          total:
                            this.state.total >= 0
                              ? this.state.total
                              : this.state.length,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        loading={this.state.loading}
                        onChange={this.handleDataChange}
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

export default Users;
