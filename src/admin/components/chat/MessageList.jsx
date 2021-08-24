import React, {Component} from 'react';
import {getFormattedDate} from "../../../_utils/common-utils";

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: props.messages || [],
            user_id:props.user_id
        }
    }

    componentDidMount() {
        document.body.classList.add('chat-page');

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            messages: nextProps.messages,
        });
    }

    componentWillUnmount() {
        document.body.classList.remove('chat-page');
    }

    render() {
        return (
            <div className="chat-body">
                <div className="chat-scroll">
                    <ul className="list-unstyled">
                        {this.state.messages.map(message => {
                            return (
                                <li className={this.state.user_id === message.sender._id ? "media sent" : "media received"}>
                                    <div className="media-body">
                                        <div className="msg-box">
                                            <div>
                                                <p>{message.message}</p>
                                                <ul className="chat-msg-info">
                                                    <li>
                                                        <div className="chat-time">
                                                            <span>{getFormattedDate(message.created_at)}</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default MessageList;
