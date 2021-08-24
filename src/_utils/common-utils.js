import moment from "moment-timezone";
import {useState} from "react";

export const getFullName = (user) => {
    if (!user)
        return ""
    if (!user.first_name && user.user_id && user.user_id.first_name) {
        user = user.user_id
    }

    return `${changeCaseFirstLetter(user.first_name)} ${changeCaseFirstLetter(user.last_name)}`
}

export const getFormattedDate = (date) => {
    return moment(date).format("DD/MM/YYYY")
}

export const getFormattedDateTime = (date) => {
    return moment(date).format("DD/MM/YYYY hh:mm a")
}
export const getNextSlot = (slot) => {
    return moment(slot,"HH:mm").add(10,"minutes").format("HH:mm")
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

export const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
        value,
        setValue,
        reset: () => setValue(""),
        bind: {
            value,
            onChange: event => {
                setValue(event.target.value);
            }
        }
    };
};
export const getTimezone = () => {
    return moment.tz.guess();
}
