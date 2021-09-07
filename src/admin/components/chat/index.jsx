import React, {Component} from 'react';
import SidebarNav from "../sidebar";
import MessagePane from "./MessagePane";
import ConversationList from "./ConversationList";
import {fetchApi} from "../../../_utils/http-utils";
import {getProfileData} from "../../../_utils/localStorage/SessionManager";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeModal: null,
            selectedConv: null,
            conversations: [],
            user_id: null
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
        let user_id = await getProfileData()
        document.body.classList.add('chat-page');
        try {
            let result = await fetchApi({
                url: "v1/chat/getConversations", method: "POST", body: {
                    user_id: user_id
                }
            })
            let conversations = result.data.map(conv => {
                return {
                    ...conv,
                    recipient: conv.participants.find(obj => {
                        return obj._id !== user_id
                    })
                }
            })
            this.setState({conversations: conversations, user_id: user_id})
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
                                    <MessagePane selectedConv={this.state.selectedConv} user_id={this.state.user_id}
                                                 onClickBack={() => {
                                                     this.setState({selectedConv: null})
                                                 }}
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
