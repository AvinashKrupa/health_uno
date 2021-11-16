import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getJwtAuthToken } from "../../_utils/localStorage/SessionManager";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLogin = () => {
    const token = getJwtAuthToken();
    return token;
  };
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default PrivateRoute;
