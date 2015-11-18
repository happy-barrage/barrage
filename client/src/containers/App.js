import React, {Component, PropTypes} from 'react';

import _ from 'lodash';
import $ from 'jquery';

import {connect} from 'react-redux';

import Icon from '../components/Icon';
import ClearFix from '../components/ClearFix';
import {Link, IndexLink} from 'react-router';

import * as userActions from '../reducers/user';
import * as bindsActions from '../reducers/binds';


import './styles/app.scss';

//需要加载的几个插件
import 'semantic-transition';
import 'semantic-dropdown';


class App extends Component {



  componentDidMount() {
    this.refs['REF_USER_DROPDOWN_MENU'] && $(this.refs['REF_USER_DROPDOWN_MENU'].getDOMNode()).dropdown();

  }

  componentDidUpdate() {
    this.refs['REF_USER_DROPDOWN_MENU'] && $(this.refs['REF_USER_DROPDOWN_MENU'].getDOMNode()).dropdown('refresh');
  }

  handleSignOut(e) {

    const {dispatch, history} = this.props;

    dispatch(userActions.signOut()).then(() => {
      dispatch(bindsActions.removeBinds());
      history.pushState(null, `/signin`);
    });
  }


  render() {

    const block = 'app';
    const {children, dispatch, user, binds, messages} = this.props;


    let childElements = '';
    if (children) {
      childElements = React.cloneElement(children, {
        dispatch, user, binds, messages
      });
    }

    let menuRight = (
      <div className='right menu'>
        <Link to='signin' className='item' activeClassName='active'>
          登录
        </Link>

        <Link to='signup' className='item' activeClassName='active'>
          注册
        </Link>
      </div>
    );

    if (!_.isEmpty(this.props.user)) {

      menuRight = (

        <div className='right menu'>

          <div ref='REF_USER_DROPDOWN_MENU' className="ui dropdown item">
            {this.props.user.username}
            <i className="dropdown icon"></i>

            <div className="menu">
              <a className="item" onClick={this.handleSignOut.bind(this)}>退出</a>
            </div>
          </div>
        </div>
      );
    }

    return (

      <div className={`${block}`}>

        <div className='ui menu stackable'>

          <div className='ui text container'>

            <IndexLink to='/' className='header item'>
              <Icon name='rose' size='m'/>
              Barrage
            </IndexLink>


            {menuRight}

          </div>

        </div>


        <div className='ui text container'>

          {childElements}

        </div>
      </div>

    );
  }
}


App.displayName = 'App';

App.propTypes = {
  dispatch : PropTypes.func.isRequired,
  user : PropTypes.object.isRequired,
  binds : PropTypes.array.isRequired,
  messages : PropTypes.array.isRequired
};

export default connect((state) => {
  return {
    user : state.user,
    binds : state.binds,
    messages : state.messages
  }
})(App);