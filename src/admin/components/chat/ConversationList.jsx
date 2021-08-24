import React, {Component} from 'react';
import {IMG01} from "./img";
import {getFormattedDateTime, getFullName} from "../../../_utils/common-utils";

class ConversationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeModal: null,
            conversations: props.conversations || [],
            onSelectConv: props.onSelectConv
        }
    }

    componentDidMount() {
        document.body.classList.add('chat-page');
    }

    componentWillUnmount() {
        document.body.classList.remove('chat-page');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            conversations: nextProps.conversations,
        });
    }

    render() {
        return (
            <div className="chat-users-list">
                <div className="chat-scroll">

                    {this.state.conversations.map(conversation => {
                        return (
                            <a href="#0" className="media"
                               onClick={() => this.state.onSelectConv(conversation)}>
                                <div className="media-img-wrap">
                                    <div className="avatar avatar-online">
                                        <img src={conversation.recipient ? conversation.recipient.dp : IMG01} alt="User"
                                             className="avatar-img rounded-circle"/>
                                    </div>
                                </div>
                                <div className="media-body">
                                    <div>
                                        <div className="user-name">{getFullName(conversation.recipient)}</div>
                                        <div
                                            className="user-last-chat">{conversation.last_message ? conversation.last_message.message : ""}</div>
                                    </div>
                                    <div>
                                        <div
                                            className="last-chat-time block">{conversation.last_message ? getFormattedDateTime(conversation.last_message.created_at):""}</div>
                                        {conversation.unread &&
                                        <div className="badge badge-success badge-pill">{conversation.unread}</div>}
                                    </div>
                                </div>
                            </a>
                        )
                    })}

                </div>
            </div>

        );
    }
}

export default ConversationList;
