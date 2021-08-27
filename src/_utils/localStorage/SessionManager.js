import {getData, storeData, removeData} from './LocalAsyncStorage';

//JWT_TOKEN
export const setJwtToken = async (data) => {
    await storeData('@JWT_TOKEN', JSON.stringify(data));
    return;
};

export const getJwtToken = async () => {
    const data = await getData('@JWT_TOKEN');
    if (data) {
        return Promise.resolve(JSON.parse(data));
    } else {
        return Promise.resolve(data);
    }
};
export const removeJwtToken = async () => {
    await removeData('@JWT_TOKEN');
};
