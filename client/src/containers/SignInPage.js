import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as userActions from '../reducers/user';

import Icon from '../components/Icon';
import Message from '../components/Message';
import {Link} from 'react-router';




class SignInPage extends Component {


  constructor(props, context) {

    super(props, context);

    if (!_.isEmpty(this.props.user)) {
      this.props.history.pushState(null, `/dashboard`);
    }

    this.state = {
      username : '',
      password : '',
      error : '',
      loading : false
    };
  }


  handleSignIn(e) {
    e.preventDefault();

    let {username, password} = this.state;

    this.setState({
      loading : true,
      error : ''
    });


    return ((_this) => {
      _this.props.dispatch(userActions.signIn({
        username,
        password
      }))
        .then((data) => {
        this.props.history.pushState(null, `/dashboard`);

      }).catch((error) => {
        _this.setState({
          error: error.message,
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

    const block = 'sign';

    return (

      <div className={`ui centered aligned grid ${block}`}>

        <div className={`ten wide column ${block}__content`}>

          <h2 className='ui horizontal divider header'>
            登录
          </h2>

          <div className='ui segment attached stacked'>


            <div className={`ui inverted dimmer ${this.state.loading ? 'active' : ''}`}>
              <div className='ui loader'></div>
            </div>



            <form className='ui form'>
              <div className='field required'>
                <label htmlFor='username'>用户名</label>
                <input
                  id='username'
                  type='text'
                  name='username'
                  onChange={this.handleChange.bind(this)}
                  value={this.state.username}
                  placeholder='用户名' />
              </div>
              <div className='field required'>
                <label htmlFor='password'>密码</label>
                <input
                  id='password'
                  type='password'
                  name='password'
                  onChange={this.handleChange.bind(this)}
                  value={this.state.password}
                  placeholder='密码' />
              </div>

              <button
                className='ui fluid large teal submit button'
                onClick={this.handleSignIn.bind(this)}
                disabled={!this.state.username || !this.state.password}>登录</button>



              <Message message={this.state.error} />
            </form>

          </div>


          <div className='ui message bottom attached'>
            新用户? <Link to='signup'>注册</Link>
          </div>

        </div>

      </div>
    );
  }
}


SignInPage.displayName = 'SignInPage';

SignInPage.propTypes = {
  dispatch : PropTypes.func.isRequired
};


export default SignInPage;