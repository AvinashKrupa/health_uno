import React, { Component } from 'react';
import BlogDetails from '../Blog/blogdetails';
import SidebarNav from "../sidebar";

class VersionSettings extends Component{
    render(){
        return(
            <>
            <SidebarNav />
            <div className="page-wrapper">
            <div className="content container-fluid">
            
            
                <div className="page-header">
                    <div className="row">
                        <div className="col-sm-12">
                            <h3 className="page-title">Settings</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
                                {/* <li className="breadcrumb-item"><a href="#0">Settings</a></li> */}
                                <li className="breadcrumb-item active">Version Settings</li>
                            </ul>
                        </div>
                    </div>
                </div>
           
                <div className="row">
                    <div className="col-4">
                            <div className="card">
                                <div className="card-body">
                                    <form action="#">
                                        <div className="form-group" style={{fontWeight:'bold'}}>
                                            <label>Ios Mandatroy Version</label>
                                            <input type="text" placeholder="2.04" className="form-control" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                    </div>
                    <div className="col-4">
                            <div className="card">
                                <div className="card-body">
                                    <form action="#">
                                        <div className="form-group" style={{fontWeight:'bold'}}>
                                            <label>Ios Latest Version</label>
                                            <input type="text" placeholder="2.04" className="form-control" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                    </div>
                    <div className="col-4">
                            <div className="card">
                                <div className="card-body">
                                    <form action="#">
                                        <div className="form-group" style={{fontWeight:'bold'}}>
                                            <label>Andriod Mandatroy Version</label>
                                            <input type="text" placeholder="2.05" className="form-control" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                    </div>
                    <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <form action="#">
                                        <div className="form-group" style={{fontWeight:'bold'}}>
                                            <label>Andriod Latest Version</label>
                                            <input type="text" placeholder="2.05" className="form-control" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                    </div>
                    <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <button type="button" class="btn btn-primary">Update</button>
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
export default VersionSettings;