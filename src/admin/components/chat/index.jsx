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
            conversations: []
        }
    }

    openModal = (id) => {
        this.setState({activeModal: id}, () => {

        });
    }

    async componentDidMount() {
        document.body.classList.add('chat-page');

        let conversations = [
            {
                name: "Yatish",
                avatar: "",
                last_message: "Hiii",
                last_message_at: "5 min",
                room_id: ""
            }
        ]

        // let conversations = await fetchApi({
        //     url: "v1/chat/getConversations", method: "POST", body: {
        //         user_id: "612363d240eef4f51b11e4de"
        //     }
        // })

        this.setState({conversations: conversations})
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

                                        <ConversationList conversations={this.state.conversations}/>
                                    </div>
                                    <MessagePane receiver_id={"61028daf17f197002082d079"}
                                                 openModal={(id) => this.openModal(id)}/>
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
