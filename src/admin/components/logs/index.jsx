import React, {Component} from 'react';
import {Table} from 'antd';
import {Link} from 'react-router-dom';
import SidebarNav from '../sidebar';
import {itemRender, onShowSizeChange} from "../../components/paginationfunction";
import {fetchApi} from "../../../_utils/http-utils";
import {
    renderDate,
    renderText,
    renderTextWithImage,
    sorterDate,
    sorterText
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

        const {data} = this.state

        const columns = [

            {
                title: 'User',
                dataIndex: 'actioner.name',
                render: (text, record) => renderTextWithImage(record.actioner.name, record.actioner.avatar),
                sorter: (a, b) => sorterText(a.actioner.name, b.actioner.name),
            },
            {
                title: 'Title',
                dataIndex: 'title',
                render: (text, record) => renderText(record.title),
                sorter: (a, b) => sorterText(a.title, b.title),
            },
            {
                title: 'Message',
                dataIndex: 'message',
                render: (text, record) => renderText(record.message),
                sorter: (a, b) => sorterText(a.message, b.message),
            },
            {
                title: "Read Status",
                dataIndex: "is_read",
                render: (record) => renderText(record.is_read ? 'Read': 'Unread'),
                sorter:(a,b)=>sorterText(a.is_read ? 'Read': 'Unread',b.is_read ? 'Read': 'Unread')
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
            }
        ]

        return (
            <>
                <SidebarNav/>
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="page-header">
                            <div className="row">
                                <div className="col-sm-7 col-auto">
                                    <h3 className="page-title">Logs</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Logs</li>
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

                                            <Table 
                                                className="table-striped"
                                                scroll={{ x: 1300 }}
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
        )
    }
}

export default Users;
