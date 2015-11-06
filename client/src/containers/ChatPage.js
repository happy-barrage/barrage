import React, {Component, PropTypes} from 'react';

import Messages from '../components/Messages';

import {bindActionCreators} from 'redux';

import * as messagesActions from '../reducers/messages';


import {PUSH} from '../constants';
import {uuid, dateFormat} from '../helpers';


class ChatPage extends Component {

  constructor(props, context) {
    super(props, context);
  }


  componentWillMount() {

    console.log(this.props.params.id);

    PUSH.subscribe([this.props.params.id], () => console.log('订阅成功'));
    PUSH.open(() => {
      console.log('打开成功');
    });
  }

  componentDidMount() {

    const {dispatch} = this.props;

    PUSH.on('message', (data) => {
      dispatch(messagesActions.createMessage(data));
    });
  }


  componentWillUnmount() {
    PUSH.unsubscribe(this.props.params.id, () => console.log('取消订阅成功'));
    PUSH.close();
  }


  handleSendMessage(message) {
    PUSH.send({
      data : {
        user : {
          nickname: this.props.bind.name,
          headimgurl : 'http://semantic-ui.com/images/avatar/large/steve.jpg',
          self : true
        },
        time : dateFormat(new Date(), 'hh:mm:ss'),
        content : message,
        type : 'text',
        id : uuid()
      },
      channels : [this.props.params.id]
    })
  }



  render() {


    const {messages} = this.props;

    return (
      <Messages messages={messages} handleSendMessage={this.handleSendMessage.bind(this)}/>
    );
  }
}


ChatPage.displayName = 'ChatPage';

export default ChatPage;