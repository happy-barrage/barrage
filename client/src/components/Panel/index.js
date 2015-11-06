import React, {Component, PropTypes} from 'react';


import './panel.scss';


class Panel extends Component {

  render() {

    const block = 'panel';

    return (

      <div className={block}>
        {this.props.children}
      </div>

    )

  }
}


export default Panel;


