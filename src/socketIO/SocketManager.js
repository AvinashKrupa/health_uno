const io = require("socket.io-client");
const URL = "http://dev.healthuno.com:6003";
// const URL = "http://localhost:3007";
const options = {
    reconnection: true,
    forceNew: true,
    reconnectionDelay: 500,
    reconnectionAttempts: Infinity,
    transports: ['websocket'],
}
export const ChatType = {
    CHAT_TYPE_DOC_TO_DOC: 0,
    CHAT_TYPE_DOC_TO_PATIENT: 1,
    CHAT_TYPE_PATIENT_TO_SUPPORT: 2,
    CHAT_TYPE_DOC_TO_SUPPORT: 3,
};

export const getNewSocket = () => {
    return io(URL, options)
}
