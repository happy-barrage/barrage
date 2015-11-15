import React, {Component, PropTypes} from 'react';

import BindCard from '../components/BindCard';

import {Link} from 'react-router';


class BindPageContainer extends Component {

  constructor(props, context) {
    super(props, context);

  }



  render() {

    const bind = _.find(this.props.binds, {objectId : this.props.params.id});

    let content = (<div className="ui active loader"></div>);

    if(bind) {

      let childElements = (<div></div>);

      if (this.props.children) {
        childElements = React.cloneElement(this.props.children, {
          messages : this.props.messages,
          bind : bind
        });
      }

      content = (

        <div>
          <div className='ui pointing menu'>
            <Link to={`/dashboard/binds/${bind.objectId}/index`} className='item' activeClassName='active'>
              设置
            </Link>
            <Link to={`/dashboard/binds/${bind.objectId}/chat`} className='item' activeClassName='active'>
              聊天
            </Link>
          </div>

          {childElements}

        </div>
      )

    }

    return (
      <div>
        {content}
      </div>

    );
  }
}


BindPageContainer.displayName = 'BindPageContainer';

//BindPage.propTypes = {
//  binds : PropTypes.array.isRequired
//};

export default BindPageContainer;