import moment from "moment-timezone";
import React from "react";

export const constants = {
    USER_TYPE_PATIENT: "1",
    USER_TYPE_DOCTOR: "2",
    PATIENT_STATUSES: ['active', 'inactive', 'suspended', 'banned'],
    DOCTOR_STATUSES: ['pending', 'active', 'inactive'],
    GENDER_DROPDOWN: ['Male', 'Female', 'Other'],
}
export const getFullName = (user) => {
    if (!user)
        return ""
    if (!user.first_name && user.user_id && user.user_id.first_name) {
        user = user.user_id
    }

    return `${changeCaseFirstLetter(user.first_name)} ${changeCaseFirstLetter(user.last_name)}`
}
export const getAddress = (address) => {
    if (!address)
        return ""
    return <a>
        {address.line1 + ", " + address.line2}<br/>
        {address.city + ", " + address.state}<br/>
        {address.country}
    </a>
}

export const getFormattedDate = (date) => {
    return moment(date).format("DD/MM/YYYY")
}

export const getFormattedDateTime = (date) => {
    return moment(date).format("DD/MM/YYYY hh:mm a")
}
export const getNextSlot = (slot) => {
    return moment(slot, "HH:mm").add(10, "minutes").format("HH:mm")
}
export const changeCaseFirstLetter = (params) => {
    if (!params)
        return ""
    if (typeof params === 'string') {
        return params.charAt(0).toUpperCase() + params.slice(1);
    }
    return params;
}

export const getNameFromEmail = (email) => {
    if (!email)
        return ""
    return email.slice(0, email.indexOf("@"))
}


export const getTimezone = () => {
    return moment.tz.guess();
}

export function assign(obj, keyPath, value) {
    let lastKeyIndex = keyPath.length - 1;
    for (let i = 0; i < lastKeyIndex; ++i) {
        let key = keyPath[i];
        if (!(key in obj)) {
            obj[key] = {}
        }
        obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
}

export function convert24hto12h(timeString, ampmRequired = true) {
    const H = +timeString.substr(0, 2);
    const h = (H % 12) || 12;
    const ampm = H < 12 ? " AM" : " PM";
    return( h + timeString.substr(2, 3) + (ampmRequired ? ampm : ''));
}
