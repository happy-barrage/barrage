import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as userActions from '../reducers/user';

import {Link} from 'react-router';


class SignUpPage extends Component {

  constructor(props, context) {

    super(props, context);

    if (!_.isEmpty(this.props.user)) {
      this.props.history.pushState(null, `/dashboard`);
    }

    this.state = {
      username : '',
      email : '',
      password : '',
      error : '',
      loading : false
    };
  }


  handleSignUp(e) {
    e.preventDefault();

    let {username, email, password} = this.state;

    this.setState({
      loading : true,
      error : ''
    });


    return ((_this) => {
      _this.props.dispatch(userActions.signUp({
        username,
        email,
        password
      })).then((data) => {

        _this.props.history.pushState(null, `/dashboard`);

        return;

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
            注册
          </h2>

          <div className='ui segment stacked'>

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
                <label htmlFor='email'>邮箱</label>
                <input
                  id='email'
                  type='text'
                  name='email'
                  onChange={this.handleChange.bind(this)}
                  value={this.state.email}
                  placeholder='邮箱' />
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
                onClick={this.handleSignUp.bind(this)}
                disabled={!this.state.username || !this.state.password || !this.state.email}>注册</button>

              <div className={`ui error message ${!this.state.error ? 'hidden' : 'visible'}`}>
                {this.state.error}
              </div>

            </form>

          </div>


          <div className='ui message'>
            已经注册? <Link to='signin'>登录</Link>
          </div>

        </div>

      </div>
    );
  }
}

SignUpPage.displayName = 'SignUpPage';

SignUpPage.propTypes = {
  dispatch : PropTypes.func.isRequired
};

export default SignUpPage;