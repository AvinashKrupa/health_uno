import React from 'react';
import ReactDOM from 'react-dom';

import AppRouter from './approuter';
// boostrap
import 'bootstrap/dist/css/bootstrap.min.css';
//fontawesome
import '../node_modules/font-awesome/css/font-awesome.min.css';
import 'react-image-lightbox/style.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-datepicker/dist/react-datepicker.css";
//carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


ReactDOM.render(<AppRouter/>, document.getElementById('root'));

if (module.hot) { // enables hot module replacement if plugin is installed
    module.hot.accept();
}
