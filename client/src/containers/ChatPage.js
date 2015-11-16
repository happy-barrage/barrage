import React, {Component, PropTypes} from 'react';

import ChatMessages from '../components/ChatMessages';

import {bindActionCreators} from 'redux';

import * as messagesActions from '../reducers/messages';


import {PUSH, MP} from '../constants';
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

      dispatch(messagesActions.createMessage(data));
    });

  }


  componentWillUnmount() {
    PUSH.unsubscribe(this.props.params.id, () => console.log('取消订阅成功'));
    PUSH.close();

    //清空messages
    this.props.dispatch(messagesActions.removeMessages());
  }


  /**
   * 回复用户，如果有回复用户将已客服模式发送到用户的微信
   * @param content
   * @param replies 回复的用户
   */
  handleSendMessage(content, replies) {
    //这里头像什么的需要修改一下的

    const {dispatch, bind} = this.props;
    const type = 'text';

    if(bind.type < MP.SERVICE) {
      //如果不是服务号，那么不会去回复用户，为了避免错误
      replies = [];
    }

    messagesActions.fetchAPIMessageSend(bind.objectId, {
      content, type, replies
    });
  }



  render() {

    const {messages} = this.props;
    return (
      <ChatMessages bind={bind} messages={messages} handleSendMessage={this.handleSendMessage.bind(this)}/>
    );
  }
}


ChatPage.displayName = 'ChatPage';

export default ChatPage;