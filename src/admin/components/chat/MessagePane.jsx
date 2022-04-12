import React, { Component } from "react";
import { ChatType, getNewSocket } from "../../../socketIO/SocketManager";
import MessageList from "./MessageList";
import { getFullName } from "../../../_utils/common-utils";
import { fetchApi } from "../../../_utils/http-utils";
import moment from "moment-timezone";
import _ from "lodash";

class MessagePane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room_id: null,
      selectedConv: props.selectedConv,
      user_id: props.user_id,
      text: "",
      messages: [],
      socketObj: null,
      onClickBack: props.onClickBack,
      pageId: 1,
      totalMessages: null,
      shouldScrollMore: true,
      loading: false,
    };
  }

  async componentDidMount() {
    document.body.classList.add("chat-page");
    if (this.state.user_id)
      await this.initializeChatWithUser(this.state.selectedConv);
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.selectedConv !== this.state.selectedConv) {
      this.terminateConnection();
      this.setState({
        pageId: 1,
        messages: [],
        totalMessages: null,
        shouldScrollMore: true,
      });
      await this.initializeChatWithUser(nextProps.selectedConv);
    }
  }

  loadMessagesForUser = async (conv, pageId = 1) => {
    try {
      const limit = 10;
      if (
        this.state.totalMessages > limit * (pageId - 1) ||
        this.state.totalMessages === null
      ) {
        this.setState({
          loading: true,
        });
        let result = await fetchApi({
          url: "v1/chat/getMessages",
          method: "POST",
          body: {
            room_id: conv.room_id,
            limit: limit,
            page: pageId,
          },
        });
        let messages = result.data.docs.reverse();
        let total = result.data.total;
        if (this.state.messages.length === 0)
          this.setState({
            messages: messages,
            pageId: pageId + 1,
            totalMessages: total,
            shouldScrollMore: this.state.messages.length < total,
            loading: false,
          });
        else {
          messages = _.concat(messages, this.state.messages);
          this.setState({
            messages: messages,
            pageId: pageId + 1,
            totalMessages: total,
            shouldScrollMore: this.state.messages.length < total,
            loading: false,
          });
        }
        return Promise.resolve();
      } else {
        this.setState({
          shouldScrollMore: false,
        });
      }
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  };

  async initializeChatWithUser(conv) {
    let socketObj = getNewSocket();

    socketObj.auth = {
      user_id: this.state.user_id,
      chat_type: ChatType.CHAT_TYPE_DOC_TO_DOC,
      receiver_id: conv.recipient._id,
      conversation_id: conv._id,
    };
    socketObj.connect();

    socketObj.on("connect", () => {});
    socketObj.on("onConversation", ({ conversation_id, room_id }) => {
      this.setState({ room_id: room_id });
      // attach the session ID to the next reconnection attempts
      socketObj.auth = { ...socketObj.auth, conversation_id };
      // store it in the localStorage
      localStorage.setItem("conversation_id", conversation_id);
      socketObj.room_id = room_id;
    });

    socketObj.on("onNewMessage", (data) => {
      let messages = this.state.messages;
      messages.push(data);
      this.setState({
        messages: messages,
      });
    });

    socketObj.on("disconnect", (response) => {});

    this.setState(
      {
        socketObj: socketObj,
        selectedConv: conv,
        pageId: 1,
        messages: [],
        totalMessages: null,
        shouldScrollMore: true,
      },
      async () => {
        await this.loadMessagesForUser(conv);
      }
    );
  }

  sendMessage = (e) => {
    e.preventDefault();
    if (this.state.socketObj) {
      if (!this.state.text || this.state.text.trim().length === 0) {
        return;
      } else {
        let finalMessage = {
          message: this.state.text,
          sender: {
            _id: this.state.user_id,
            name: this.state.user_id,
            avatar: "",
          },
          created_at: moment().utc().toDate(),
        };
        this.state.socketObj.emit("sendMessage", finalMessage);
        let messages = this.state.messages;
        messages.push(finalMessage);
        this.setState({ text: "", messages: messages }, () =>
          this.refs.messageList.scrollToBottom()
        );
      }
    }
  };

  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }

  componentWillUnmount() {
    this.terminateConnection();
    document.body.classList.remove("chat-page");
  }

  terminateConnection() {
    let socketObj = this.state.socketObj;
    if (socketObj) {
      socketObj.off("onConversation");
      socketObj.off("onNewMessage");
      socketObj.off("connect");
      socketObj.off("disconnect");
      socketObj.disconnect();
    }
    this.setState({ selectedConv: null, messages: [] });
  }

  render() {
    return (
      <div className="chat-cont-right">
        <div className="chat-header">
          <a
            id="back_user_list"
            onClick={() => {
              if (this.state.onClickBack) this.state.onClickBack();
            }}
            className="back-user-list"
          >
            <i className="material-icons">chevron_left</i>
          </a>
          <div className="media">
            <div className="media-img-wrap">
              <div className="avatar">
                <img
                  src={this.state.selectedConv.recipient.dp}
                  alt="User"
                  className="avatar-img rounded-circle"
                />
              </div>
            </div>
            <div className="media-body">
              <div className="user-name">
                {getFullName(this.state.selectedConv.recipient)}
              </div>
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
        <MessageList
          ref="messageList"
          messages={this.state.messages}
          user_id={this.state.user_id}
          loadMessagesForUser={this.loadMessagesForUser}
          pageId={this.state.pageId}
          selectedConv={this.state.selectedConv}
          shouldScrollMore={this.state.shouldScrollMore}
          loadingChatIndicator={this.state.loading}
        />
        <div className="chat-footer">
          <form onSubmit={this.sendMessage}>
            <div className="input-group">
              <div className="input-group-prepend"></div>
              <input
                value={this.state.text}
                type="text"
                className="input-msg-send form-control"
                placeholder="Type something"
                onChange={(e) => this.handleTextChange(e)}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn msg-send-btn"
                  onClick={(e) => {
                    this.sendMessage(e);
                  }}
                >
                  <i className="fab fa-telegram-plane"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default MessagePane;
