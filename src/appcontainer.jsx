import React from "react";
import config from 'config';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
//blog
//pages
import AppUniversal from "./admin/app-universal";
//pharmacy

const AppContainer = function (props) {
    if (props) {
        const url = props.location.pathname.split("/")[1];

        return (
            <Router basename={`${config.publicPath}`}>
                <div>
                    <Switch>
                        <Route path="/" component={AppUniversal}/>
                    </Switch>
                </div>
            </Router>
        );
    }
    return null;
};

export default AppContainer;
