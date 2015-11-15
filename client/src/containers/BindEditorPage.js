import React, {Component, PropTypes} from 'react';

import {bindActionCreators} from 'redux';

import BindForm from '../components/BindForm';

import {uuid} from '../helpers';

import * as bindsActions from '../reducers/binds';

import {MP} from '../constants';


class BindEditorPage extends Component {

  render() {

    const {binds, history, dispatch, params} = this.props;
    const actions = bindActionCreators(bindsActions, dispatch);

    let currentBind = {
      objectId : '',
      name : '',
      token : '',
      type : MP.COMMON
    };

    //这里的代码不是很干净
    let content = (
      <BindForm actions={actions} history={history} bind={currentBind}/>
    );

    if (params.id) {
      currentBind = _.find(binds, {objectId : params.id});

      if (!currentBind) {
        content = (
          <div className="ui active loader"></div>
        );
      } else {
        content = (
          <BindForm actions={actions} history={history} bind={currentBind}/>
        );
      }

    }

    return (
      <div>{content}</div>
    );
  }
}


BindEditorPage.displayName = 'BindEditorPage';

//BindEditorPage.propTypes = {
//  dispatch : PropTypes.func.isRequired,
//  binds : PropTypes.array.isRequired
//};

export default BindEditorPage;