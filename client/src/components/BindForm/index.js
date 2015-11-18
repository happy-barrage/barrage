import React, {Component, PropTypes} from 'react';
import $ from 'jquery';

import ClearFix from '../ClearFix';
import Message from '../Message';

import {uuid} from '../../helpers';

import {MP} from '../../constants';

class BindForm extends Component {

  constructor(props, context) {
    super(props, context);

    let {objectId, name, token, appId, appSecret, type} = this.props.bind;


    this.state = {
      objectId : objectId,
      name : name,
      token : token,
      appId : appId,
      appSecret : appSecret,
      type : type,

      error : '',
      loading : false
    };
  }

  handleRandomToken(e) {
    e.preventDefault();
    this.setState({
      token : uuid().substr(0, 8) //如果是uuid太长了，因为这个不是一定要唯一的，为了方便就substr一下
    });
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.history.goBack()
  }

  createBind({name, token, appId, appSecret, type}) {
    const {actions} = this.props;
    return actions.fetchAPIBindStore({name, token, appId, appSecret, type});
  }

  updateBind({objectId, name, token, appId, appSecret, type}) {
    const {actions} = this.props;
    return actions.fetchAPIBindUpdate(objectId, {name, token, appId, appSecret, type});
  }

  componentDidMount() {


    ((_this) => {

      _this.refs['REF_TYPE_DROPDOWN_MENU'] && $(_this.refs['REF_TYPE_DROPDOWN_MENU'].getDOMNode()).dropdown({
        onChange : function(value) {
          //这里只能非常特殊对onChange进行操作，因为dropmenu的插件
          _this.setState({
            type : value
          });
        }
      });

    })(this);


  }

  componentDidUpdate() {
    this.refs['REF_TYPE_DROPDOWN_MENU'] && $(this.refs['REF_TYPE_DROPDOWN_MENU'].getDOMNode()).dropdown('refresh');
  }



  handleSave(e) {
    e.preventDefault();

    const {objectId, name, token, appId, appSecret, type} = this.state;
    const {history} = this.props;
    let promiseHandle;



    this.setState({
      loading : true,
      error : ''
    });

    if(!!objectId) {
      promiseHandle = this.updateBind({objectId, name, token, appId, appSecret, type});
    } else {
      promiseHandle = this.createBind({name, token, appId, appSecret, type});
    }


    return ((_this) => {
      promiseHandle.then((bind) => {
        history.pushState(null, `/dashboard/binds/${bind.objectId}`);
      }).catch((error) => {
        _this.setState({
          error: error.message
        });
      }).then(() => {
        _this.setState({
          loading : false
        });
      });
    })(this);

  }


  handleChange(e) {
    this.setState({
      [e.target.name] : e.target.value
    });
  }



  render() {

    let headerTitle = '新的公众号绑定';

    if (this.state.objectId) {
      headerTitle = `修改公众号绑定--${this.state.name}`;
    }

    return (

      <div>
        <h3 className='ui horizontal divider header'>
          {headerTitle}
        </h3>

        <div className='ui segment stacked'>

          <div className={`ui inverted dimmer ${this.state.loading ? 'active' : ''}`}>
            <div className='ui loader'></div>
          </div>

          <form className='ui form'>
            <div className='inline fields'>

              <div className='four wide field'>
                <label htmlFor='name'>名称</label>
              </div>

              <div className='ten wide field'>

                <input
                  id='name'
                  type='text'
                  name='name'
                  onChange={this.handleChange.bind(this)}
                  value={this.state.name}
                  placeholder='名称' />

              </div>

            </div>


            <div className='inline fields'>

              <div className='four wide field'>
                <label htmlFor='name'>公众号类型</label>
              </div>

              <div className='ten wide field'>

                <select value={this.state.type}
                        className='ui dropdown'
                        ref='REF_TYPE_DROPDOWN_MENU'
                        name='type'>
                  <option value={MP.COMMON}>未认证</option>
                  <option value={MP.SUBSCRIPTION}>订阅号</option>
                  <option value={MP.SERVICE}>服务号</option>
                </select>

              </div>

            </div>


            <div className='inline fields'>

              <div className='four wide field'>
                <label htmlFor='appId'>appID</label>
              </div>

              <div className='ten wide field'>

                <input
                  id='appId'
                  type='text'
                  name='appId'
                  onChange={this.handleChange.bind(this)}
                  value={this.state.appId}
                  placeholder='微信公众号的appID' />

              </div>

            </div>


            <div className='inline fields'>

              <div className='four wide field'>
                <label htmlFor='appSecret'>appSecret</label>
              </div>

              <div className='ten wide field'>

                <input
                  id='appSecret'
                  type='text'
                  name='appSecret'
                  onChange={this.handleChange.bind(this)}
                  value={this.state.appSecret}
                  placeholder='微信公众号的appSecret' />

              </div>

            </div>

            <div className='inline fields'>
              <div className='four wide field'>
                <label htmlFor='token'>Token</label>
              </div>
              <div className='twelve wide field'>
                <div className='ui action input'>
                  <input
                    id='token'
                    type='text'
                    name='token'
                    onChange={this.handleChange.bind(this)}
                    value={this.state.token}
                    placeholder='Token' />
                  <button
                    className='ui basic button'
                    onClick={this.handleRandomToken.bind(this)}>随机生成</button>

                </div>

              </div>


            </div>


            <div className='ui section divider'></div>

            <input ref="formulaId" type='hidden' value={this.state.objectId} />

            <button className='ui positive button left floated'
                    onClick={this.handleSave.bind(this)}
                    disabled={!this.state.name || !this.state.token}>保存</button>

            <button className='ui button right floated'
                    onClick={this.handleCancel.bind(this)}>取消</button>


            <ClearFix />

            <Message message={this.state.error} />


          </form>
        </div>


      </div>



    );
  }
}


BindForm.displayName = 'BindForm';

export default BindForm;