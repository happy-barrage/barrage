import React, {Component} from 'react';

import {setSelectRange, getInputSelection} from '../../helpers';

import './messages.scss';

class Message extends Component {


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
          <div className='image'>
            <img src={message.image} />
          </div>
        )
    }


    let selfStyleClass = '';

    if(message.user.self) {
      selfStyleClass = `${block}--self`;
    }


    return (
      <div className={`comment ${block} ${selfStyleClass}`}>
        <a className='avatar'>
          <img src={message.user.headimgurl}/>
        </a>
        <div className='content'>
          <a className='author' onClick={this.props.handleReply.bind(this, message.user.nickname)}>{message.user.nickname}</a>
          <div className='metadata'>
            <span className='date'>{message.time}</span>
          </div>

          {content}

        </div>
      </div>
    )
  }
}


export default class Messages extends Component {


  constructor(props, context) {
    super(props, context);

    this.state = {
      input : ''
    };
  }


  scrollToBottom() {
    let chatNode = this.refs.messages.getDOMNode();
    chatNode.scrollTop = chatNode.scrollHeight;
  }


  componentDidUpdate() {
    this.scrollToBottom();
  }


  handleReply(name) {

    let field = this.refs['REF_MESSAGE_INPUT'].getDOMNode();
    let pos = getInputSelection(field);
    let at = `@${name}`;

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

    if(!!this.state.input) {
      this.props.handleSendMessage(this.state.input);
      this.setState({
        input : ''
      });
    }

  }



  render() {


    const block = 'messages';
    const {messages} = this.props;


    const handleReply = this.handleReply.bind(this);

    return (

      <div className='ui segment'>
        <div className='ui comments'>

          <div className={block} ref='messages'>

            {messages.map( message =>
                <Message message={message} key={message.id} handleReply={handleReply}/>
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