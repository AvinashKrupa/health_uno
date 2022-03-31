export const isEmpty =  (value) => {
    return value === '';
}

export const isNumberOnly = (value) => {
    return isNaN(value) ;
}

export const isEmailValid = (value) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(value);
}
export const isLength10 = (value) => {
    if(value.length === 10) {
        return true;
    }
    else {
        return false;
    }
}
export const isLength = (value,length) => {
    if(value.length === length) {
        return true;
    }
    else {
        return false;
    }
}
