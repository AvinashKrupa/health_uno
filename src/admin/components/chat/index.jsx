import React, { Component } from "react";
import SidebarNav from "../sidebar";
import MessagePane from "./MessagePane";
import ConversationList from "./ConversationList";
import { fetchApi } from "../../../_utils/http-utils";
import { getProfileData } from "../../../_utils/localStorage/SessionManager";
import { ChatType, getNewSocket } from "../../../socketIO/SocketManager";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeModal: null,
      selectedConv: null,
      conversations: [],
      socketObj: null,
      user_id: null,
    };
  }

  openModal = (id) => {
    this.setState({ activeModal: id }, () => {});
  };
  onSelectConv = (conv) => {
    this.setState({ selectedConv: conv });
  };

  async componentDidMount() {
    let user_id = await getProfileData();
    document.body.classList.add("chat-page");
    this.initializeChatWithUser(user_id);
    try {
      let result = await fetchApi({
        url: "v1/chat/getConversations",
        method: "POST",
        body: {
          user_id: user_id,
        },
      });
      let conversations = result.data.map((conv) => {
        return {
          ...conv,
          recipient: conv.participants.find((obj) => {
            return obj._id !== user_id;
          }),
        };
      });
      const sortedConversation = conversations.sort(function compare(a, b) {
        var dateA = new Date(a.last_message.created_at);
        var dateB = new Date(b.last_message.created_at);
        return dateB - dateA;
      })
      this.setState({ conversations: sortedConversation, user_id: user_id });
    } catch (e) {
    }
  }

  initializeChatWithUser = (user_id) => {
    let socketObj = getNewSocket();

    socketObj.auth = {
      user_id: user_id,
      chat_type: ChatType.CHAT_TYPE_DOC_TO_DOC,
    };
    socketObj.connect();

    socketObj.on("connect", () => {
    });
    socketObj.on("onConversationUpdated", (data) => {
      this.handleConversationList(data, user_id)
    });

    socketObj.on("disconnect", (response) => {
    });

    this.setState({ socketObj: socketObj });
    // await this.loadMessagesForUser(conv);
  };

  handleConversationList = (conversationList, user_id) => {
    const existingConversationList = [...this.state.conversations]
    const ConversationIndex = this.state.conversations.findIndex(conversation => conversation._id === conversationList._id )

    if(ConversationIndex > -1){
      existingConversationList[ConversationIndex] = conversationList
      existingConversationList[ConversationIndex].recipient = conversationList.participants.find((obj) => {
        return obj._id !== user_id;
      })
      const sortedConversation = existingConversationList.sort(function compare(a, b) {
        var dateA = new Date(a.last_message.created_at);
        var dateB = new Date(b.last_message.created_at);
        return dateB - dateA;
      })
      this.setState({ conversations: sortedConversation });
    }else{
      const newConversation = conversationList;
      newConversation.recipient = conversationList.participants.find((obj) => {
        return obj._id !== user_id;
      }),
      existingConversationList.push(newConversation)
      const sortedConversation = existingConversationList.sort(function compare(a, b) {
        var dateA = new Date(a.last_message.created_at);
        var dateB = new Date(b.last_message.created_at);
        return dateB - dateA;
      })
      this.setState({ conversations: sortedConversation });
    }

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
  }

  componentWillUnmount() {
    this.terminateConnection();
  }

  componentWillUnmount() {
    document.body.classList.remove("chat-page");
  }

  render() {
    return (
      <div>
        <SidebarNav />
        <div className="page-wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="chat-window">
                  <div className="chat-cont-left">
                    <div className="chat-header">
                      <span>Chats</span>
                    </div>

                    <ConversationList
                      conversations={this.state.conversations}
                      onSelectConv={(conv) => this.onSelectConv(conv)}
                    />
                  </div>
                  {this.state.selectedConv && (
                    <MessagePane
                      selectedConv={this.state.selectedConv}
                      user_id={this.state.user_id}
                      onClickBack={() => {
                        this.setState({ selectedConv: null });
                      }}
                      openModal={(id) => this.openModal(id)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
