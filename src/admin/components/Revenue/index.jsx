import React from "react";
import SidebarNav from "../sidebar";
import {
  DatePicker,
  Menu,
  Dropdown,
  Input,
  Table,
  Collapse,
  Button,
} from "antd";
import { DownOutlined } from "@ant-design/icons";

const menu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          Cardiology
        </a>
      </Menu.Item>
      <Menu.Item icon={<DownOutlined />} disabled>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item (disabled)
        </a>
      </Menu.Item>
      <Menu.Item disabled>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item (disabled)
        </a>
      </Menu.Item>
      <Menu.Item danger>a danger item</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Doctor's Name",
    },
    {
      title: "Start Date",
    },
    {
      title: "End Date",
    },
    {
      title: "Department",
    },
    {
      title: "Revenue",
    },
  ];

const RevenuePage = (props) => {
  const { RangePicker } = DatePicker;
//   const { Panel } = Collapse;
  

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Revenue Filter</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/admin">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Revenue Filter</li>
                </ul>
              </div>
            </div>
          </div>
          <Collapse>
            <Collapse.Panel key="filter" header="Filters">
              <div className="row">
                <div className="col-xl-4 col-sm-6 col-12">
                  <RangePicker style={{ width: "100%" }} />
                </div>
                <div className="col-xl-4 col-sm-6 col-12">
                  <Dropdown overlay={menu}>
                    <Button style={{ width: "100%", textAlign: "left" }}>
                      Button <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
                <div className="col-xl-4 col-sm-6 col-12">
                  <Input placeholder="Search Doctor's Name" />
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
          <div className="page-header">
            <div className="row" style={{ marginTop: "15px" }}>
              <div className="col-sm-12">
                <h3 className="page-title">Content</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div>
                    <Table className="table-striped" columns={columns} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RevenuePage;
