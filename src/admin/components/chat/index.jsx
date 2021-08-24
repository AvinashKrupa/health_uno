import React, {Component} from 'react';
import SidebarNav from "../sidebar";
import MessagePane from "./MessagePane";
import ConversationList from "./ConversationList";
import {fetchApi} from "../../../_utils/http-utils";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeModal: null,
            selectedConv: null,
            conversations: [],
            user_id: "612363d240eef4f51b11e4de"
        }
    }

    openModal = (id) => {
        this.setState({activeModal: id}, () => {

        });
    }
    onSelectConv = (conv) => {
        this.setState({selectedConv: conv})
    }

    async componentDidMount() {
        document.body.classList.add('chat-page');
        try {
            let result = await fetchApi({
                url: "v1/chat/getConversations", method: "POST", body: {
                    user_id: this.state.user_id
                }
            })
            let conversations = result.data.map(conv => {
                return {
                    ...conv,
                    recipient: conv.participants.find(obj => {
                        return obj._id !== this.state.user_id
                    })
                }
            })
            this.setState({conversations: conversations})
        } catch (e) {
            console.log("Error>>>", e)
        }


    }

    componentWillUnmount() {
        document.body.classList.remove('chat-page');
    }

    render() {
        return (
            <div>
                <SidebarNav/>
                <div className="page-wrapper">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="chat-window">
                                    <div className="chat-cont-left">
                                        <div className="chat-header">
                                            <span>Chats</span>
                                            <a href="#0" className="chat-compose">
                                                <i className="material-icons">control_point</i>
                                            </a>
                                        </div>

                                        <ConversationList conversations={this.state.conversations}
                                                          onSelectConv={(conv) => this.onSelectConv(conv)}/>
                                    </div>
                                    {this.state.selectedConv &&
                                    <MessagePane selectedConv={this.state.selectedConv}
                                                 openModal={(id) => this.openModal(id)}/>}
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
