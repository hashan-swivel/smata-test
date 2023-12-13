import React, { Component } from 'react';
import { axiosInstance } from '../../../utils/axiosInstance';
import dynamic from 'next/dynamic';

const ActionCableProvider = dynamic(
  () => import('react-actioncable-provider').then((mod) => mod.ActionCableProvider),
  {
    ssr: false
  }
);
const ActionCableConsumer = dynamic(
  () => import('react-actioncable-provider').then((mod) => mod.ActionCableConsumer),
  {
    ssr: false
  }
);

export default class ChatRoom extends Component {
  sendMessage(message, chatRoom) {
    axiosInstance.post(`/v1/chat_rooms/${chatRoom}/messages?body=${message}`).then((response) => {
      console.log('Sending message response', response);
    });
  }
  componentDidMount = () => {
    setTimeout(() => {
      let message = 'Hello world';
      this.sendMessage(message, this.props.id);
    }, 10000);
  };

  render() {
    return (
      <ActionCableConsumer
        channel={{ channel: 'MessagesChannel', chat_room_id: this.props.id }}
        onReceived={(e) => console.log('#onReceived', e)}
        onConnected={() => console.log('Connected')}
        onInitialized={(e) => {
          /*console.log('#initialized MessagesChannel')*/
        }}
        onRejected={(e) => console.log('#rejected', e)}
      >
        <h1>Chat room {this.props.id}</h1>
      </ActionCableConsumer>
    );
  }
}
