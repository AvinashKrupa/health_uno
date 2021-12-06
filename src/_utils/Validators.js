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
