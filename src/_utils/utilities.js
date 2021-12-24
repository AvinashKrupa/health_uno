import _ from "lodash";

export function getTimer(timeString) {
    const dateOneObj = new Date(timeString);
    const dateTwoObj = new Date();
    const milliseconds = dateTwoObj - dateOneObj;
    const hours = parseFloat(milliseconds / 36e5).toFixed(3);

    if(Math.sign(hours) < 0) {
        return hours >= -1
    }  else if(Math.sign(hours) < 0) {
        return false;
    }
}

export function convert24hto12h(timeString, ampmRequired = true) {
    const H = +timeString.substr(0, 2);
    const h = (H % 12) || 12;
    const ampm = H < 12 ? " AM" : " PM";
    return( h + timeString.substr(2, 3) + (ampmRequired ? ampm : ''));
}

export function timeSince(date) {
    if (typeof date !== 'object') {
        date = new Date(date);
    }

    let seconds = Math.floor((new Date() - date) / 1000);
    let intervalType;

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = 'y';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'm';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'd';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = 'h';
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = 'm';
                    } else {
                        interval = seconds;
                        intervalType = 's';
                    }
                }
            }
        }
    }
    return interval + ' ' + intervalType;
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function replaceUnderscore(string) {
    const stringFormatted = _.startCase(_.toLower(string));
    return stringFormatted.replace(/_/g, " ");
}
