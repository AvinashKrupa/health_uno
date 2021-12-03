const storeData = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
    }
};

const getData = (key) => {
    try {
        const value = localStorage.getItem(key);
        return Promise.resolve(value);
    } catch (e) {
        return Promise.resolve(null)
    }
};

const getStorageData = (key) => {
    try {
        const value = localStorage.getItem(key);
        return value;
    } catch (e) {
        return null
    }
};

const removeData = (key) => {
    try {
        const value = localStorage.removeItem(key);
    } catch (e) {
    }
};

export {storeData, getData, getStorageData, removeData};
