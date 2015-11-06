import React, {Component, PropTypes} from 'react';


import './panelSwitcher.scss';


class PanelSwitcher extends Component {

  render() {

    const block = 'panel-switcher';


    const style = {
      width : this.props.width
    };

    return (

      <div className={block}>

        <div className={`${block}--wrapper`} style={style}>
          {React.Children.map(this.props.children, child =>
            <div className={`${block}--box`}>
            {child}
            </div>
          )}
        </div>
      </div>

    )

  }
}

PanelSwitcher.defaultProps = {
  width : '600px'
};

PanelSwitcher.propTypes = {
  width : PropTypes.string.isRequired
}


export default PanelSwitcher;


