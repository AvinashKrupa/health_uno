import React, { Component } from 'react';
import BlogDetails from '../Blog/blogdetails';
import toast from "react-hot-toast";
import SidebarNav from "../sidebar";
import { fetchApi } from "../../../_utils/http-utils";

class VersionSettings extends Component{
    constructor(props) {
        super(props);

        this.state = {
            iosMandVer: "",
            iosLatVer: "",
            andriodMandVer: "",
            andriodLatVer: "",
            invalid: false,
            data: []
        }
    }
    async componentDidMount() {
        await this.reloadData()
       
    }

    async reloadData() {
        let result = await fetchApi({url: "v1/config/getCurrentVersions", method: "GET"})
        this.setState({data: result.data});
        this.setState({iosMandVer:this.state.data.ios_ver_mandatory})
        this.setState({iosLatVer:this.state.data.ios_ver_latest})
        this.setState({andriodMandVer:this.state.data.android_ver_mandatory})
        this.setState({andriodLatVer:this.state.data.android_ver_latest})
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
        console.log("andrio madna >>>", e.target.value )
        this.setState({andriodMandVer: e.target.value})
    }

    handleAndriodLatVerChange(e) {
        console.log("andrio latest >>>", e.target.value )
        this.setState({andriodLatVer: e.target.value})
    }

    validation(iosMandVer,iosLatVer,andriodMandVer,andriodLatVer) {
        let errorMessage = "Mandatory version should be less than and equal to optional version"
        console.log( " values are ",iosMandVer,iosLatVer,andriodMandVer,andriodLatVer)

        if (iosMandVer === '' || iosLatVer === '' || andriodMandVer === '' || andriodLatVer === '' ) {
          let errorMessage = `All fields are required `
                toast.error(errorMessage)
                return false;
        }

        if (iosMandVer && iosMandVer !== '' && iosLatVer && iosLatVer !== '') {
            if(iosMandVer > iosLatVer){
                toast.error(errorMessage)
                return false;
            }
            
        }
        if (andriodMandVer && andriodMandVer !== '' && andriodLatVer && andriodLatVer !== '') {
            if(andriodMandVer > andriodLatVer){
                toast.error(errorMessage)
                return false;
            } 
        } 

        return true;
        
      }

    async handleItemClick() {
        
        let iosMandVer = this.state.iosMandVer;
        let iosLatVer = this.state.iosLatVer;
        let andriodMandVer = this.state.andriodMandVer;
        let andriodLatVer = this.state.andriodLatVer;
        
        const isValid = this.validation(iosMandVer,iosLatVer,andriodMandVer,andriodLatVer)
        console.log("isvalid is ",isValid)
        if(isValid){
            try {
                let result = await fetchApi({
                  url: "v1/config/updateVersion",
                  method: "POST",
                  body: { android_ver_mandatory: andriodMandVer, ios_ver_mandatory: iosMandVer,android_ver_latest: andriodLatVer, ios_ver_latest: andriodLatVer },
                });
                if (result) {
                   toast.success(result.message);
                 
                }
              } catch (e) {
                console.log("error>>", e);
              }
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
                                                <input type="text" placeholder="version number" className="form-control" value={this.state.iosMandVer} onChange={(e) => this.handleIosMandVerChange(e)}/>
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
                                                <input type="text" placeholder="version number" className="form-control" value={this.state.iosLatVer} onChange={(e) => this.handleIosLatVerChange(e)}/>
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
                                                <input type="text" placeholder="version number" className="form-control" value={this.state.andriodMandVer} onChange={(e) => this.handleAndriodMandVerChange(e)}/>
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
                                                <input type="text" placeholder="version number" className="form-control" value={this.state.andriodLatVer}  onChange={(e) => this.handleAndriodLatVerChange(e)}/>
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
                                            this.handleItemClick()
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