import React, {Component, PropTypes} from 'react';

import Icon from '../components/Icon';


class NoMatchPage extends Component {

  render() {
    return (
        <div className='ui centered aligned grid'>

          <div className='six wide column'>

            <div className="ui statistic">
              <div className="value">
                <Icon name='paperplane-outline' size='l'/> 404
              </div>
              <div className="label">
                Not Found
              </div>
            </div>
          </div>

      </div>

    );
  }
}


NoMatchPage.displayName = 'NoMatchPage';

export default NoMatchPage;