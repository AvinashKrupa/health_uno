import React, { Component } from "react";
import { Link } from "react-router-dom";
import SidebarNav from "../sidebar";


class BlankPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <>
        <SidebarNav />
        <div className="page-wrapper">
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                <div className="row">
                    <div className="col-sm-12">
                    <h3 className="page-title">Blank Page</h3>
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Blank Page</li>
                    </ul>
                    </div>
                </div>
                </div>
                {/* /Page Header */}
                <div className="row">
                    <div className="col-sm-12">
                        Contents here
                    </div>			
                </div>
            </div>			
        </div>
      </>
    );
  }
}

export default BlankPage;
