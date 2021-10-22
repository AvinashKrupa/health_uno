import {
  getData,
  storeData,
  removeData,
  getStorageData,
} from "./LocalAsyncStorage";

//JWT_TOKEN
export const setJwtToken = async (data) => {
  return await storeData("@JWT_TOKEN", JSON.stringify(data));
};

export const getJwtToken = async () => {
  const data = await getData("@JWT_TOKEN");
  if (data) {
    return Promise.resolve(JSON.parse(data));
  } else {
    return Promise.resolve(data);
  }
};

export const getJwtAuthToken = () => {
  const data = getStorageData("@JWT_TOKEN");
  if (data) {
    return data;
  } else {
    return data;
  }
};

export const removeJwtToken = async () => {
  await removeData("@JWT_TOKEN");
};

export const setProfileData = async (data) => {
  return await storeData("@USER_ID", JSON.stringify(data));
};

export const getProfileData = async () => {
  const data = await getData("@USER_ID");
  if (data) {
    return Promise.resolve(JSON.parse(data));
  } else {
    return Promise.resolve(data);
  }
};
