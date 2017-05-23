import * as React from 'react';
import * as classNames from 'classnames';
import { IMilestone } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestoneTitleFieldProps {
  milestone: IMilestone;
}

interface IMilestoneTitleFieldState {
}

export default class MilestoneTitleField extends React.PureComponent<IMilestoneTitleFieldProps, IMilestoneTitleFieldState> {
  render() {
    return (
      <span className={classNames('milestone-title-field-component', this.props.milestone.state ? `state-${this.props.milestone.state.key}` : null)}>
        {this.props.milestone.title}
      </span>
    );
  }
};
