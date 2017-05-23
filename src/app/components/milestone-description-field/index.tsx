import * as React from 'react';
import { IMilestone } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestoneDescriptionFieldProps {
  milestone: IMilestone;
}

interface IMilestoneDescriptionFieldState {
}

export default class MilestoneDescriptionField extends React.PureComponent<IMilestoneDescriptionFieldProps, IMilestoneDescriptionFieldState> {
  render() {
    return (
      <span className="milestone-description-field-component">
        {this.props.milestone.description}
      </span>
    );
  }
};
