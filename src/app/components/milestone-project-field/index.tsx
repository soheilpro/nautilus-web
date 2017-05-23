import * as React from 'react';
import { IMilestone } from '../../application';
import ProjectField from '../project-field';

interface IMilestoneProjectFieldProps {
  milestone: IMilestone;
}

interface IMilestoneProjectFieldState {
}

export default class MilestoneProjectField extends React.PureComponent<IMilestoneProjectFieldProps, IMilestoneProjectFieldState> {
  render() {
    return (
      <ProjectField project={this.props.milestone.project} className="milestone-project-field-component" />
    );
  }
};
