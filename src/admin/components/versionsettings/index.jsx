import React, { Component } from 'react';
import BlogDetails from '../Blog/blogdetails';
import toast from "react-hot-toast";
import SidebarNav from "../sidebar";

class VersionSettings extends Component{
    constructor(props) {
        super(props);

        this.state = {
            iosMandVer: "",
            iosLatVer: "",
            andriodMandVer: "",
            andriodLatVer: "",
            invalid: false,
        }
    }
    handleIosMandVerChange(e) {
        console.log("iso mandatory >>>", e.target.value )
        this.setState({iosMandVer: e.target.value})
    }
    handleIosLatVerChange(e) {
        console.log("iso latest >>>", e.target.value )
        this.setState({iosLatVer: e.target.value})
    }
    handleAndriodMandVerChange(e) {
        this.setState({andriodMandVer: e.target.value})
    }
    handleAndriodLatVerChange(e) {
        this.setState({andriodLatVer: e.target.value})
    }

    sendMessage() {
        let errorMessage = "Mandatory version should be less than and equal to optional version"
        
        if (this.state.iosMandVer && this.state.iosMandVer !== '' && this.state.iosLatVer && this.state.iosLatVer !== '') {
            if(this.state.iosMandVer > this.state.iosLatVer)
            toast.error(errorMessage)
        }
        if (this.state.andriodMandVer && this.state.andriodMandVer !== '' && this.state.andriodLatVer && this.state.andriodLatVer !== '') {
            if(this.state.andriodMandVer > this.state.andriodLatVer)
            toast.error(errorMessage)
        }

    }
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
                <form>
                    <div className="row">
                        <div className="col-3">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="#">
                                            <div className="form-group" style={{fontWeight:'bold'}}>
                                                <label>Ios Mandatroy Version</label>
                                                <input type="text" placeholder="2.04" className="form-control" onChange={(e) => this.handleIosMandVerChange(e)}/>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                        </div>
                        <div className="col-3">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="#">
                                            <div className="form-group" style={{fontWeight:'bold'}}>
                                                <label>Ios Latest Version</label>
                                                <input type="text" placeholder="2.04" className="form-control" onChange={(e) => this.handleIosLatVerChange(e)}/>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                        </div>
                        <div className="col-3">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="#">
                                            <div className="form-group" style={{fontWeight:'bold'}}>
                                                <label>Andriod Mandatroy Version</label>
                                                <input type="text" placeholder="2.05" className="form-control" onChange={(e) => this.handleAndriodMandVerChange(e)}/>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                        </div>
                        <div className="col-3">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="#">
                                            <div className="form-group" style={{fontWeight:'bold'}}>
                                                <label>Andriod Latest Version</label>
                                                <input type="text" placeholder="2.05" className="form-control" onChange={(e) => this.handleAndriodLatVerChange(e)}/>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                        </div>
                        <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <button class="btn btn-primary" onClick={(e) => {
                                            e.preventDefault();
                                            this.sendMessage()
                                        }}>Update
                                        </button>
                                    </div>
                                </div>
                        </div>
                        
                    </div>
                </form>
            </div>			
        </div>
        </>
        );
    }
}
export default VersionSettings;