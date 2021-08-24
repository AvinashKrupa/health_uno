import React, {Component} from 'react';
import {ChatType, getNewSocket} from "../../../socketIO/SocketManager";
import MessageList from "./MessageList";
import {getFullName} from "../../../_utils/common-utils";
import {fetchApi} from "../../../_utils/http-utils";

class MessagePane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room_id: null,
            selectedConv: props.selectedConv,
            user_id: "612363d240eef4f51b11e4de",
            text: "",
            messages: [],
            socketObj: null,
        }
    }

    async componentDidMount() {
        console.log("componentDidMount>>>")
        document.body.classList.add('chat-page');
        this.initializeChatWithUser(this.state.selectedConv)
        await this.loadMessagesForUser()

    }

    async componentWillReceiveProps(nextProps) {
        if(nextProps.selectedConv!==this.state.selectedConv){
            console.log("componentWillReceiveProps>>>")
            this.terminateConnection()
            this.setState({
                selectedConv: nextProps.selectedConv,
            });
            this.initializeChatWithUser(this.state.selectedConv)
            await this.loadMessagesForUser()
        }

    }

    async loadMessagesForUser() {
        try {
            let result = await fetchApi({
                url: "v1/chat/getMessages", method: "POST", body: {
                    room_id: this.state.selectedConv.room_id
                }
            })
            let messages=result.data.docs.reverse()
            this.setState({messages: messages})
        } catch (e) {
            console.log("Error>>>", e)
        }
    }

    initializeChatWithUser(conv) {
        let socketObj = getNewSocket()

        socketObj.auth = {
            user_id: this.state.user_id,
            chat_type: ChatType.CHAT_TYPE_DOC_TO_PATIENT,
            receiver_id: conv.recipient._id,
            conversation_id: conv._id
        };
        socketObj.connect();

        socketObj.on("connect", () => {
            console.log("socket connected>>>")
        })
        socketObj.on("onConversation", ({conversation_id, room_id}) => {
            this.setState({room_id: room_id})
            // attach the session ID to the next reconnection attempts
            socketObj.auth = {...socketObj.auth, conversation_id};
            // store it in the localStorage
            localStorage.setItem("conversation_id", conversation_id);
            socketObj.room_id = room_id;
        });

        socketObj.on('onNewMessage', data => {
            console.log('onNewMessage>>>>', data);
            let messages = this.state.messages
            messages.push(data)
            this.setState({
                messages: messages
            })
        });


        socketObj.on('disconnect', response => {
            console.log("disconnected>>>>")
        });

        this.setState({socketObj: socketObj})
    }

    sendMessage() {
        if (this.state.socketObj) {
            console.log("Sending Message>>>", this.state.text)
            this.state.socketObj.emit("sendMessage", {
                message: this.state.text,
                sender: this.state.user_id,
            });
            let finalMessage = {
                message: this.state.text,
                sender: {_id: this.state.user_id, name: this.state.user_id, avatar: ""},
                created_at: new Date().toDateString()
            }
            let messages = this.state.messages
            messages.push(finalMessage)
            this.setState({text: "", messages: messages})
        }

    }

    handleTextChange(e) {
        this.setState({text: e.target.value})
    }

    componentWillUnmount() {
        this.terminateConnection()
        document.body.classList.remove('chat-page');
    }

    terminateConnection() {
        let socketObj = this.state.socketObj
        if (socketObj) {
            socketObj.off("onConversation")
            socketObj.off("onNewMessage")
            socketObj.off("connect")
            socketObj.off("disconnect")
            socketObj.disconnect()
        }
    }

    render() {
        return (
            <div className="chat-cont-right">
                <div className="chat-header">
                    <a id="back_user_list" href="#0" className="back-user-list">
                        <i className="material-icons">chevron_left</i>
                    </a>
                    <div className="media">
                        <div className="media-img-wrap">
                            <div className="avatar avatar-online">
                                <img src={this.state.selectedConv.recipient.dp} alt="User"
                                     className="avatar-img rounded-circle"/>
                            </div>
                        </div>
                        <div className="media-body">
                            <div className="user-name">{getFullName(this.state.selectedConv.recipient)}</div>
                            {/*<div className="user-status">online</div>*/}
                        </div>
                    </div>
                    {/*<div className="chat-options">*/}
                    {/*    <a href="#0" data-toggle="modal" data-target="#voice_call"*/}
                    {/*       onClick={() => props.openModal('voice')}>*/}
                    {/*        <i className="material-icons">local_phone</i>*/}
                    {/*    </a>*/}
                    {/*    <a href="#0" data-toggle="modal" data-target="#video_call"*/}
                    {/*       onClick={() => props.openModal('video')}>*/}
                    {/*        <i className="material-icons">videocam</i>*/}
                    {/*    </a>*/}
                    {/*    <a href="#0">*/}
                    {/*        <i className="material-icons">more_vert</i>*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                </div>
                <MessageList messages={this.state.messages} user_id={this.state.user_id}/>
                <div className="chat-footer">
                    <div className="input-group">
                        <div className="input-group-prepend">
                        </div>
                        <input value={this.state.text} type="text" className="input-msg-send form-control"
                               placeholder="Type something"
                               onChange={(e) => this.handleTextChange(e)}/>
                        <div className="input-group-append">
                            <button type="button" className="btn msg-send-btn" onClick={() => this.sendMessage()}>
                                <i className="fab fa-telegram-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MessagePane;
