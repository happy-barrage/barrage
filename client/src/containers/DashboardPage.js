import React, {Component, PropTypes} from 'react';

import Icon from '../components/Icon';
import ClearFix from '../components/ClearFix';
import {Link, IndexLink} from 'react-router';
import * as bindsActions from '../reducers/binds';



class DashboardPage extends Component {

  constructor(props, context) {
    super(props, context);
    if (_.isEmpty(this.props.user)) {
      this.props.history.pushState(null, `/signin`);
    }

  }

  componentWillMount() {
    this.props.dispatch(bindsActions.fetchAPIBinds(this.props.user)).then((binds) => {

    }).catch((error) => {
      console.log(error);
    });
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
                  {bind.name} <Icon name='arrow-right' size='s' className={`${block}__icon-fix__menu-left-2`}/>
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
                <Icon name='plus-empty' size='ms' className={`${block}__icon-fix__menu-left`}/> 创建一个新的公众号绑定
              </Link>
            </div>

            {bindsElements}

          </div>
          <div className='ui column ten wide'>
            {childElements}
          </div>

        </div>

      </div>
    );
  }
}

DashboardPage.displayName = 'DashboardPage';



export default DashboardPage;