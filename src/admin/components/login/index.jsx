import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import {fetchApi} from "../../../_utils/http-utils";
import toast from 'react-hot-toast';
import {setJwtToken, setProfileData} from "../../../_utils/localStorage/SessionManager";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        let errorMessage = ""
        if (!this.state.email || this.state.email === "") {
            errorMessage += "The email field is required. "
        }
        if (!this.state.password || this.state.password === "") {
            errorMessage += "The password field is required."
        }
        if (errorMessage != "") {
            toast.error(errorMessage)
            return
        }
        try {
            let result = await fetchApi({
                url: "v1/auth/admin/login",
                method: "POST",
                body: {email: this.state.email, password: this.state.password}
            })
            if (result) {
                toast.success(result.message)
                await setJwtToken(result.data.session.access_token)
                localStorage.setItem("userData", JSON.stringify(result.data.user));
                await setProfileData(result.data.user._id)
                this.props.history.push("/dashboard")
            }
        } catch (e) {

        }

    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
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


                                        <form onSubmit={this.handleSubmit}>
                                            {/*<form action="/dashboard">*/}
                                            <div className="form-group">
                                                <input name="email" className="form-control" type="text"
                                                       placeholder="Email"
                                                       onChange={this.handleInputChange}/>
                                            </div>
                                            <div className="form-group">
                                                <input name="password" className="form-control" type="password"
                                                       placeholder="Password"
                                                       onChange={this.handleInputChange}/>
                                            </div>
                                            <div className="form-group">
                                                <button className="btn btn-primary btn-block" type="submit">Login
                                                </button>
                                            </div>
                                        </form>


                                        <div className="text-center forgotpass"><Link to="/forgotPassword">Forgot
                                            Password?</Link></div>

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
