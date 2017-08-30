import * as React from 'react';
import { IMilestone } from '../../application';
import UserField from '../user-field';

interface IMilestoneCreatedByFieldProps {
  milestone: IMilestone;
}

interface IMilestoneCreatedByFieldState {
}

export default class MilestoneCreatedByField extends React.PureComponent<IMilestoneCreatedByFieldProps, IMilestoneCreatedByFieldState> {
  render() {
    return (
      <UserField user={this.props.milestone.createdBy} className="milestone-created-by-field-component" />
    );
  }
};
