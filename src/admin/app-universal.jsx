import React from 'react';
import config from 'config';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Header from './components/header/index';
import Dashboard from './components/dashboard';
import Appointments from './components/appointments';
import Specialities from './components/specialities';
import Categories from './components/categories';
import Languages from './components/languages';
import Departments from './components/departments';
import Doctors from './components/doctors';
import Patients from './components/patients';
import Chat from './components/chat';
import Reviews from './components/reviews';
import Transaction from './components/transaction';
import Settings from './components/settings';
import InvoiceReport from './components/invoicereport';
import Invoice from './components/invoicereport/invoice';
import ProductList from './components/productlist';
import PharmacyList from './components/pharmacylist';
import Blog from './components/Blog/blog'
import BlogDetails from './components/Blog/blogdetails'
import AddBlog from './components/Blog/addblog'
import EditBlog from './components/Blog/editblog'
import PendingBlog from './components/Blog/pendingblog'
import Profile from './components/profile';
import Login from './components/login';
import Register from './components/register';
import ForgotPassword from './components/forgotpassword';
import Lockscreen from './components/lockscreen';
import Error from './components/error404';
import ErrorPage from './components/error500';
import BasicInput from './components/forms/baiscinput';
import FormInput from './components/forminput';
import FormHorizontal from './components/formhorizontal';
import FormMask from './components/formask';
import FormValidation from './components/formvalidation';
import BlankPage from './components/blankpage';
import Components from './components/component';


const AppUniversal = function (props) {
    return (

        <Router basename={`${config.publicPath}`}>
            <div className="main-wrapper">
                <Route render={(props) => <Header {...props}/>}/>
                <Switch>
                    <Route path="/" exact component={Login}/>
                    <Route path="/dashboard" exact component={Dashboard}/>
                    <Route path="/admin" exact component={Dashboard}/>
                    <Route path="/appointment-list" exact component={Appointments}/>
                    <Route path="/specialities" exact component={Specialities}/>
                    <Route path="/categories" exact component={Categories}/>
                    <Route path="/languages" exact component={Languages}/>
                    <Route path="/departments" exact component={Departments}/>
                    <Route path="/doctor-list" exact component={Doctors}/>
                    <Route path="/patient-list" exact component={Patients}/>
                    <Route path="/chat" exact component={Chat}/>
                    <Route path="/reviews" exact component={Reviews}/>
                    <Route path="/profile" exact component={Profile}/>
                    <Route path="/transactions-list" exact component={Transaction}/>
                    <Route path="/settings" exact component={Settings}/>
                    <Route path="/invoice-report" exact component={InvoiceReport}/>
                    <Route path="/blog" exact component={Blog}/>
                    <Route path="/blog-details" exact component={BlogDetails}/>
                    <Route path="/add-blog" exact component={AddBlog}/>
                    <Route path="/edit-blog" exact component={EditBlog}/>
                    <Route path="/pending-blog" exact component={PendingBlog}/>
                    <Route path="/product-list" exact component={ProductList}/>
                    <Route path="/pharmacy-list" exact component={PharmacyList}/>
                    <Route path="/invoice" exact component={Invoice}/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/register" exact component={Register}/>
                    <Route path="/forgotPassword" exact component={ForgotPassword}/>
                    <Route path="/lockscreen" exact component={Lockscreen}/>
                    <Route path="/404" exact component={Error}/>
                    <Route path="/500" exact component={ErrorPage}/>
                    <Route path="/blank-page" exact component={BlankPage}/>
                    <Route path="/components" exact component={Components}/>
                    <Route path="/basic-input" exact component={BasicInput}/>
                    <Route path="/form-input-group" exact component={FormInput}/>
                    <Route path="/form-horizontal" exact component={FormHorizontal}/>
                    <Route path="/form-mask" exact component={FormMask}/>
                    <Route path="/form-validation" exact component={FormValidation}/>
                </Switch>
            </div>

        </Router>
    );
}

export default AppUniversal;

