import React, {Component, PropTypes} from 'react';

import ChatMessages from '../components/ChatMessages';

import {bindActionCreators} from 'redux';

import * as messagesActions from '../reducers/messages';


import {PUSH} from '../constants';
import {uuid, dateFormat} from '../helpers';


class ChatPage extends Component {

  constructor(props, context) {
    super(props, context);
  }


  componentWillMount() {



    PUSH.subscribe([this.props.params.id], () => {
      console.log('订阅成功');
    });
    PUSH.open(() => {
      console.log('打开成功');
    });


    //去获取记录
    this.props.dispatch(messagesActions.fetchAPIMessages(this.props.params.id));


  }

  componentDidMount() {

    const {dispatch} = this.props;

    PUSH.on('message', (data) => {

      console.log(data);
      dispatch(messagesActions.createMessage(data));
    });

  }


  componentWillUnmount() {
    PUSH.unsubscribe(this.props.params.id, () => console.log('取消订阅成功'));
    PUSH.close();

    //清空messages
    this.props.dispatch(messagesActions.removeMessages());
  }


  handleSendMessage(message) {
    //这里头像什么的需要修改一下的
    PUSH.send({
      data : {
        user : {
          nickname: this.props.bind.name,
          headimgurl : '/dist/images/doge.png',
          self : true
        },
        time : dateFormat(new Date(), 'hh:mm:ss'),
        content : message,
        type : 'text',
        msgid : uuid()
      },
      channels : [this.props.params.id]
    })
  }



  render() {


    const {messages} = this.props;

    return (
      <ChatMessages messages={messages} handleSendMessage={this.handleSendMessage.bind(this)}/>
    );
  }
}


ChatPage.displayName = 'ChatPage';

export default ChatPage;