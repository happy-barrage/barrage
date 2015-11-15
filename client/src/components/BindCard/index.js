import React, {Component} from 'react';

import {Link} from 'react-router';

import {SERVER_URL, MP} from '../../constants';


import './bindCard.scss';

export default class BindCard extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      loading : false,
      confirm : false,
      error : ''
    };
  }

  handleSelect(e) {
    e.target.select();
  }

  handleConfirmDelete() {

    this.setState({
      confirm : true
    });
  }

  handleCancel() {
    this.setState({
      confirm : false
    });
  }


  handleDelete() {

    let {actions, bind, history} = this.props;

    this.setState({
      loading : true,
      confirm : false,
      error : ''
    });


    ((_this) => {


      actions.fetchAPIBindDelete(bind.objectId).then((data) => {
        history.pushState(null, '/dashboard');
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

    return false;


  }

  render() {

    const {bind} = this.props;

    let type = '';
    switch (parseInt(bind.type)) {

      case MP.SUBSCRIPTION:
        type = '订阅号';
        break;
      case MP.SERVICE:
        type = '服务号';
        break;

      default:
        type = '未认证公众号';
        break;
    }

    return (


        <div className='ui segment'>

          <div className={`ui inverted dimmer ${this.state.loading ? 'active' : ''}`}>
            <div className='ui loader'></div>
          </div>

          <table className='ui very basic selectable celled table'>
            <tbody>
            <tr>
              <td className='two wide'><div className='ui ribbon label'>名称</div></td>
              <td>{bind.name}</td>
            </tr>

            <tr>
              <td><div className='ui ribbon label'>类型</div></td>
              <td>{type}</td>
            </tr>

            <tr>
              <td><div className='ui ribbon label'>appID</div></td>
              <td>{bind.appId}</td>
            </tr>

            <tr>
              <td><div className='ui ribbon label'>appSecret</div></td>
              <td>{bind.appSecret}</td>
            </tr>


            <tr>
              <td><div className='ui ribbon label'>Token</div></td>
              <td>{bind.token}</td>
            </tr>

            <tr>
              <td><div className='ui ribbon label'>Url</div></td>
              <td>

                <div className='ui input fluid'>

                  <input type='text'
                         readOnly={true}
                         value={`${SERVER_URL}/wechat/${bind.objectId}`}
                         onClick={this.handleSelect.bind(this)}/>
                </div>

              </td>
            </tr>


            <tr>
              <td><div className='ui ribbon label'>弹幕key</div></td>
              <td>
                {bind.objectId}
              </td>
            </tr>

            </tbody>

          </table>


          <Link to={`/dashboard/binds/${bind.objectId}/edit`} className='ui button basic'>编辑</Link>

          <a className='ui inverted red button right floated' onClick={this.handleConfirmDelete.bind(this)}>删除</a>

          <div className={`ui error message ${!this.state.error ? 'hidden' : 'visible'}`}>
            {this.state.error}
          </div>


          <div className={`ui modal small ${this.state.confirm ? 'active' : ''}`}>
            <div className='header'>{`确定删除公众号绑定 ${bind.name}？`}</div>
            <div className='content'>
              <p>确定删除？</p>
            </div>
            <div className='actions'>
              <div className='ui negative button' onClick={this.handleCancel.bind(this)}>取消</div>
              <div className='ui positive button' onClick={this.handleDelete.bind(this)}>确定</div>
            </div>
          </div>

        </div>


    )
  }
}