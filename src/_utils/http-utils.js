import config from "config";
import { decode as jwtDecode } from "jsonwebtoken";
import { getTimezone } from "./common-utils";
import toast from "react-hot-toast";
import { getJwtToken } from "./localStorage/SessionManager";

export const fetchApi = async (params) => {
  const { url, method } = params;
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    timezone: getTimezone(),
  };

  let body = params.body ? JSON.stringify(params.body) : null;

  headers = await prepareAuthHeader(headers);

  return fetch(`${config.apiUrl}${url}`, {
    method,
    body,
    headers,
  })
    .then(async (response) => {
      return handleResponse(response);
    })
    .catch((e) => {
      return handleError(e);
    });
};

export const fetchApiWithFileUpload = async (params) => {
  const { url, method, formData } = params;

  let headers = {
    Accept: "application/json",
    timezone: getTimezone(),
  };
  headers = await prepareAuthHeader(headers);

  return fetch(`${config.apiUrl}${url}`, {
    method,
    body: formData,
    headers,
  })
    .then(async (response) => {
      return handleResponse(response);
    })
    .catch((e) => {
      return handleError(e);
    });
};

async function handleResponse(response) {
  let error = "Unknown error occurred";
  switch (response.status) {
    case 401:
      //move to login page here and log user out
      localStorage.clear();
      window.location = "/login";
      return;
    case 200:
      return Promise.resolve(response.json());
    default:
      error = await response.json();
      return Promise.reject({ error: error.message, status: error.code });
  }
}

async function handleError(e) {
  let errorMessage = "Unknown error occurred";
  if (typeof e.error === "object" && e.error !== null) {
    errorMessage = "";
    Object.keys(e.error).forEach((key) => {
      errorMessage += e.error[key].message + "\n";
    });
  } else {
    errorMessage = e.error;
  }
  toast.error(errorMessage);
  return Promise.reject(e);
}

async function prepareAuthHeader(headers) {
  let jwtToken = await getJwtToken();
  const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
  const tokenExpiresAt = decodedToken ? decodedToken.exp * 1000 : null;
  if (jwtToken && tokenExpiresAt && tokenExpiresAt > new Date().getTime()) {
    headers["Authorization"] = `Bearer ${jwtToken}`;
  }
  return Promise.resolve(headers);
}
