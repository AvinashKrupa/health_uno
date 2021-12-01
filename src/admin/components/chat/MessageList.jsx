import React, { Component } from "react";
import {
  getFormattedDate,
  getFormattedDateTime,
} from "../../../_utils/common-utils";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: props.messages || [],
      user_id: props.user_id,
      scrollPosition: "bottom",
      initialCall: true,
    };
  }

  componentDidMount() {
    document.body.classList.add("chat-page");
    this.scrollToBottom();
  }
  componentDidUpdate(prevProps) {
    if (this.state.scrollPosition === "bottom") {
      this.scrollToBottom();
    }
    if (this.props.selectedConv !== prevProps.selectedConv) {
      this.setState({
        scrollPosition: "bottom",
        initialCall: true,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      messages: nextProps.messages,
    });
    if (this.props.selectedConv !== nextProps.selectedConv) {
      this.setState({
        scrollPosition: "bottom",
        initialCall: true,
      });
    }
  }

  componentWillUnmount() {
    document.body.classList.remove("chat-page");
    this.setState({
      scrollPosition: "bottom",
      initialCall: true,
    });
  }

  scrollToBottom = () => {
    const { messageList } = this.refs;
    messageList.scrollIntoView({
      behavior: "auto",
      block: "end",
      inline: "nearest",
    });
  };
  handleScrollTop = (e) => {
    if (
      e.target.scrollTop < 2 &&
      !this.state.initialCall &&
      this.props.shouldScrollMore &&
      !this.props.loadingChatIndicator
    ) {
      e.target.scrollTop += 30;
      this.setState({
        scrollPosition: "top",
      });
      this.props.loadMessagesForUser(
        this.props.selectedConv,
        this.props.pageId
      );
    }
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (!bottom && this.state.initialCall) {
      this.setState({
        initialCall: false,
        scrollPosition: "bottom",
      });
    }
    if (bottom && this.state.scrollPosition !== "bottom") {
      this.setState({
        scrollPosition: "bottom",
        initialCall: true,
      });
    }
  };
  render() {
    return (
      <div className="chat-body">
        <div className="chat-scroll" onScroll={this.handleScrollTop}>
          <ul className="list-unstyled" ref={"messageList"}>
            {this.state.messages.map((message) => {
              return (
                <li
                  className={
                    this.state.user_id === message.sender._id
                      ? "media sent"
                      : "media received"
                  }
                >
                  <div className="media-body">
                    <div className="msg-box">
                      <div>
                        <p>{message.message}</p>
                        <ul className="chat-msg-info">
                          <li>
                            <div className="chat-time">
                              <span>
                                {getFormattedDateTime(message.created_at)}
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default MessageList;
