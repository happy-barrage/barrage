import React, {Component, PropTypes} from 'react';

import BindCard from '../components/BindCard';

import {bindActionCreators} from 'redux';
import * as bindsActions from '../reducers/binds';


class BindPage extends Component {


  render() {

    const {dispatch, history} = this.props;
    const actions = bindActionCreators(bindsActions, dispatch);

    let content = (<div></div>);

    if(this.props.bind) {
      content = (<BindCard bind={this.props.bind} actions={actions} history={history}/>);
    }

    return (
    <div>{content}</div>
    );
  }
}


BindPage.displayName = 'BindPage';

//BindPage.propTypes = {
//  binds : PropTypes.array.isRequired
//};

export default BindPage;