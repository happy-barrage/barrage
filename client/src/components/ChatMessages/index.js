import React, {Component} from 'react';

import _ from 'lodash';

import $ from 'jquery';

import {setSelectRange, getInputSelection, uuid} from '../../helpers';

import ClearFix from '../ClearFix';

import './messages.scss';

class ChatMessage extends Component {

  render() {

    let content = '';
    const {message} = this.props;
    const block = 'message';

    switch (message.type) {
      case 'text' :
        content = (
          <div className='text'>
            {message.content}
          </div>
        );
        break;
      case 'voice' :
        content = (
          <div className='text'>
            {message.recognition}
          </div>
        )
        break;
      case 'image' :
        content = (
          <div className={`ui medium rounded image ${block}--image`}>
            <img src={message.image} />
          </div>
        )
    }




    let messageElements = (

      <div className={`comment ${block} ${block}--common ${message.user && message.user.self ? block + '--self' : ''}`}>

        <div className={`content ${block}--bubble`}>
          {content}
        </div>
        <ClearFix/>
      </div>

    );


    //这里需要区分，有user的还有没有user的。
    if(message.user) {

      messageElements = (
        <div className={`comment ${block} ${message.user && message.user.self ? block + '--self' : ''}`}>
          <a className='avatar'>
            <img src={message.user.headimgurl}/>
          </a>
          <div className='content'>
            <a className='author' onClick={this.props.handleReply.bind(this, message.user)}>{message.user.nickname}</a>
            <div className='metadata'>
              <span className='date'>{message.time}</span>
            </div>

            {content}

          </div>
        </div>
      );

    }





    return messageElements;
  }
}


export default class ChatMessages extends Component {


  constructor(props, context) {
    super(props, context);

    this.state = {
      input : '',
      replies : [],
      scroll : true,
      scroll_show : false
    };
  }


  scrollToBottom() {

    if(this.state.scroll) {
      let chatNode = this.refs['REF_MESSAGES'].getDOMNode();
      chatNode.scrollTop = chatNode.scrollHeight;
    }

  }


  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {

    ((_this) => {

      $(_this.refs['REF_MESSAGES_CONTAINER'].getDOMNode()).hover(() => {
        _this.setState({
          scroll_show : true
        });
      }, () => {
        _this.setState({
          scroll_show : false
        });
      });

    })(this);


  }


  handleReply(user) {

    //要回复的用户列表
    let {replies} = this.state;
    replies.push(user);
    this.setState({
      replies : replies
    });



    //这里是将名字变成@到聊天输入框里
    const {nickname} = user;
    let field = this.refs['REF_MESSAGE_INPUT'].getDOMNode();
    let pos = getInputSelection(field);
    let at = `@${nickname}`;

    let input = `${this.state.input.substring(0, pos.start)} ${at} ${this.state.input.substring(pos.end)}`;

    this.setState({
      input : input
    });

    setSelectRange(field, pos.start, pos.start + at.length);
  }


  handleChange(e) {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  handleChangeCheckbox(e) {
    this.setState({
      [e.target.name] : e.target.checked
    });
  }


  handleSendByClick(e) {
    e.preventDefault();
    this.send();
  }

  handleSendByKeyDown(e) {
    if(e.which === 13) {
      this.send();
    }

  }

  send() {

    let {replies, input} = this.state;
    const {bind, handleSendMessage} = this.props;

    if(!!input) {




      //过滤出来要真正需要回复的用户列表，避免重复回复
      if(!_.isEmpty(replies)) {
        replies = _.uniq(replies, 'openid');
        replies = _.filter(replies, (reply) => {
          //过滤掉在文本框里也删除掉的，和自己本身
          return input.indexOf(`@${reply.nickname}`) !== -1 && bind.appId !== reply.openid;
        });

      }


      handleSendMessage(input, replies);
      this.setState({
        input : '',
        replies : []
      });
    }

  }



  render() {


    const block = 'messages';
    const {messages} = this.props;


    const handleReply = this.handleReply.bind(this);

    return (

      <div className='ui segment' ref='REF_MESSAGES_CONTAINER'>

        <div className={`${block}__controls ${this.state.scroll_show?'visible':'hidden'}`}>

          <div className='ui toggle checkbox'>
            <input
              type='checkbox'
              name='scroll'
              checked={this.state.scroll}
              onChange={this.handleChangeCheckbox.bind(this)}
              id='scroll'/>
            <label htmlFor='scroll'>开始滚屏</label>
          </div>

        </div>





        <div className={`ui comments ${block}__content`}>

          <div className={block} ref='REF_MESSAGES'>

            {messages.map( message =>
                <ChatMessage message={message} key={message.msgid} handleReply={handleReply}/>
            )}

          </div>



          <form className='ui reply form'>
            <div className='field'>
              <div className='ui action input'>
                <input type='text'
                       placeholder='跟大家互动一下吧...'
                       value={this.state.input}
                       name='input'
                       ref='REF_MESSAGE_INPUT'
                       onKeyDown={this.handleSendByKeyDown.bind(this)}
                       onChange={this.handleChange.bind(this)}/>
                <button className='ui basic button'
                        onClick={this.handleSendByClick.bind(this)}>发送</button>
              </div>
            </div>
          </form>

        </div>
      </div>
    );
  }
}