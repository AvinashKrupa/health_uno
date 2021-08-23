import React, {Component} from 'react';
import {IMG01} from "./img";

class ConversationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeModal: null,
            conversations: props.conversations || []
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
                            <a href="#0" className="media">
                                <div className="media-img-wrap">
                                    <div className="avatar avatar-online">
                                        <img src={conversation.avatar ? conversation.avatar : IMG01} alt="User"
                                             className="avatar-img rounded-circle"/>
                                    </div>
                                </div>
                                <div className="media-body">
                                    <div>
                                        <div className="user-name">{conversation.name ? conversation.name : ""}</div>
                                        <div
                                            className="user-last-chat">{conversation.last_message ? conversation.last_message : ""}</div>
                                    </div>
                                    <div>
                                        <div
                                            className="last-chat-time block">{conversation.last_message_at ? conversation.last_message_at : ""}</div>
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
