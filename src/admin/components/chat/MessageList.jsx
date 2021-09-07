import React, {Component} from 'react';
import {getFormattedDate, getFormattedDateTime} from "../../../_utils/common-utils";

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: props.messages || [],
            user_id: props.user_id,
            scrollPosition: 'bottom'
        }
    }

    componentDidMount() {
        document.body.classList.add('chat-page');
        this.scrollToBottom()

    }
    componentDidUpdate() {
        this.scrollToBottom()

    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            messages: nextProps.messages,
        });
    }

    componentWillUnmount() {
        document.body.classList.remove('chat-page');
    }

    scrollToBottom = () => {
        const {messageList} = this.refs;
        messageList.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }
    handleScrollTop = (e) => {
        if (e.target.scrollTop < 5 && this.props.shouldScrollMore && !this.props.loadingChatIndicator) {
            e.target.scrollTop += 10;
            this.setState({
                scrollPosition: 'top'
            })
            this.props.loadMessagesForUser(this.props.pageId)
        }
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            this.setState({
                scrollPosition: 'bottom'
            })
        }
    }
    render() {
        return (
            <div className="chat-body">
                <div className="chat-scroll">
                    <ul className="list-unstyled" ref={"messageList"} onScroll={this.handleScrollTop}>
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
                                                            <span>{getFormattedDateTime(message.created_at)}</span>
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
