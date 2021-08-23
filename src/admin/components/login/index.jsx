import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';

class Login extends Component{
    render(){
        return(
            <div>
                  <div className="main-wrapper login-body">
            <div className="login-wrapper">
            	<div className="container">
                	<div className="loginbox">
                    	<div className="login-left">
							<img className="img-fluid" src={Logo} alt="Logo"/>
                        </div>
                        <div className="login-right">
							<div className="login-right-wrap">
								<h1>Login</h1>
								<p className="account-subtitle">Access to our dashboard</p>
								
								 
								<form action="/dashboard">
									<div className="form-group">
										<input className="form-control" type="text" placeholder="Email" />
									</div>
									<div className="form-group">
										<input className="form-control" type="password" placeholder="Password" />
									</div>
									<div className="form-group">
										<button className="btn btn-primary btn-block" type="submit">Login</button>
									</div>
								</form>
							 
								
								<div className="text-center forgotpass"><Link to="/forgotPassword">Forgot Password?</Link></div>

							</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            </div>
        );
    }
}

export default Login;
