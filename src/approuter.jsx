import React from 'react';
import AppContainer from './appcontainer.jsx';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import config from 'config';
import  { Toaster } from 'react-hot-toast';

const AppRouter = (props) => {
    return(
        <Router basename={`${config.publicPath}`}>
            <Route render={(props)=> <AppContainer {...props}/>} />
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
        </Router>

    );
    
}


export default AppRouter;
