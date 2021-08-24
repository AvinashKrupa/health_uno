import React from "react";
import moment from "moment";
import {changeCaseFirstLetter, getFormattedDate, getFullName, getNextSlot} from "./common-utils";
import {Link} from "react-router-dom";

export const sorterDate = (a, b) => {
    return moment(a).diff(moment(b), "seconds")
}
export const sorterText = (a, b) => {
    if (!a)
        a = ""
    if (!b)
        b = ""
    return a.localeCompare(b);
}
export const sorterNumber = (a, b) => {
    if (!a)
        a = Number.MIN_SAFE_INTEGER
    if (!b)
        b = Number.MIN_SAFE_INTEGER
    return a - b;
}
export const renderDate = (date) => {
    return (
        <div className="sorting_1">
            {getFormattedDate(date)}
        </div>
    )
}

export const renderName = (record, prefix, suffix, includeImage = false) => {
    return (
        <h2 className="table-avatar">
            {includeImage && <Link to="/profile" className="avatar avatar-sm mr-2">
                <img alt="" src={record.user_id.dp}/>
            </Link>}
            <Link
                to="/profile">{`${prefix ? prefix + " " : ""}${getFullName(record)}${suffix ? " " + suffix : ""}`}</Link>
        </h2>
    )
}
export const renderChips = (items) => {
    return items.map(item => {
        return (<div>{item.title}</div>)
    })
}
export const renderText = (text) => {
    return <div className="sorting_1">
        {changeCaseFirstLetter(text)}
    </div>
}
export const renderAppointment = (date,text) => {
    return  <>
        <span>{getFormattedDate(date)}</span>
        <span className="text-primary d-block">{`${text} - ${getNextSlot(text)}`}</span>
    </>
}
