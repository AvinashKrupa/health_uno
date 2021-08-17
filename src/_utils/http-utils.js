import config from 'config';
import {decode as jwtDecode} from "jsonwebtoken";
import {getTimezone} from "./common-utils";

let jwtToken = null;

export const fetchApi = async (params) => {
    const {url, method} = params;

    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "timezone": getTimezone()
    };

    let body = params.body ? JSON.stringify(params.body) : null;

    const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
    const tokenExpiresAt = decodedToken ? decodedToken.exp * 1000 : null;

    return fetch(`${config.apiUrl}${url}`, {
        method,
        body,
        headers
    }).then(response => {
        switch (response.status) {
            case 401:
                //move to login page here and log user out
                localStorage.clear()
                window.location = "/auth/login"
                return
            case 200:
                return Promise.resolve(response.json())
            default:
                return Promise.reject({error: response.json(), status: response.status})
        }

    }).catch(err => {
        return Promise.reject({error: err, status: 503})
    });
};

export const setJwtToken = (token) => {
    jwtToken = token;
};
