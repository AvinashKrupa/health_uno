import React, {Component} from 'react';
import SidebarNav from "../sidebar";
import MessagePane from "./MessagePane";
import ConversationList from "./ConversationList";

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

    componentDidMount() {
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
                                    <MessagePane receiver_id={"60fe5e254000bf472c927fd4"}
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
