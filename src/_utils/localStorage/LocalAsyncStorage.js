const storeData = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.log('Error in storing in asyncStoragefor' + key, e.message);
    }
    console.log('Store data in asyncStorage');
};

const getData = (key) => {
    try {
        const value = localStorage.getItem(key);
        return Promise.resolve(value);
    } catch (e) {
        console.log('Error in retrieving value from asyncStorage', e.message);
        return Promise.resolve(null)
    }
    console.log('Get data in asyncStorage');
};

const getStorageData = (key) => {
    try {
        const value = localStorage.getItem(key);
        return value;
    } catch (e) {
        console.log('Error in retrieving value from asyncStorage', e.message);
        return null
    }
};

const removeData = (key) => {
    try {
        const value = localStorage.removeItem(key);
    } catch (e) {
        console.log('Error in removing value from asyncStorage', e.message);
    }
    console.log('removed data in asyncStorage');
};

export {storeData, getData, getStorageData, removeData};
