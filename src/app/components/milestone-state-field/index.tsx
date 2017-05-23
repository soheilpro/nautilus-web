import * as React from 'react';
import { IMilestone } from '../../application';
import ItemStateField from '../item-state-field';

interface IMilestoneStateFieldProps {
  milestone: IMilestone;
}

interface IMilestoneStateFieldState {
}

export default class MilestoneStateField extends React.PureComponent<IMilestoneStateFieldProps, IMilestoneStateFieldState> {
  render() {
    return (
      <ItemStateField itemState={this.props.milestone.state} className="milestone-state-field-component" />
    );
  }
};
