import React, {Component, PropTypes} from 'react';

import Icon from '../components/Icon';
import ClearFix from '../components/ClearFix';
import Message from '../components/Message';
import {Link, IndexLink} from 'react-router';
import * as bindsActions from '../reducers/binds';



class DashboardPage extends Component {

  constructor(props, context) {
    super(props, context);
    if (_.isEmpty(this.props.user)) {
      this.props.history.pushState(null, `/signin`);
    }


    this.state = {
      error : ''
    };

  }

  componentWillMount() {

    ((_this) => {
      _this.props.dispatch(bindsActions.fetchAPIBinds(this.props.user)).then((binds) => {

      }).catch((error) => {
        _this.setState({
          error : error.message
        });
      });
    })(this);


  }

  render() {

    const block = 'dashboard';
    const {children, dispatch, user, binds, messages} = this.props;


    let bindsElements = '';

    if(binds.length > 0) {
      bindsElements = (
        <div>
          <h5 className='ui horizontal divider header' style={{width: '15rem'}}>
            已绑定的公众号
          </h5>
          <div className='ui vertical menu'>
            {binds.map(bind =>
                <Link to={`/dashboard/binds/${bind.objectId}`} className='item' key={bind.objectId} activeClassName='active'>
                  {bind.name} <i className='angle right icon'></i>
                </Link>
            )}
          </div>
        </div>
      )
    }


    let childElements = (
      <h2 className={`${block}__content__empty`}>
        试试左边的按钮？
        <Icon name='doge' size='l' />
      </h2>
    );

    if(children) {
      childElements = React.cloneElement(children, {
        dispatch, user, binds, messages
      });
    }

    return (


      <div className={block}>
        <div className='ui grid'>

          <div className='ui column six wide'>

            <div className='ui vertical menu text'>
              <Link className='item' to='/dashboard/binds/create'>
                <i className='plus icon'></i> 创建一个新的公众号绑定
              </Link>
            </div>

            {bindsElements}

          </div>
          <div className='ui column ten wide'>

            <Message message={this.state.error}/>

            {childElements}
          </div>

        </div>

      </div>
    );
  }
}

DashboardPage.displayName = 'DashboardPage';



export default DashboardPage;