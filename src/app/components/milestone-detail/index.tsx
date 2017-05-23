import * as React from 'react';
import { IMilestone } from '../../application';
import MilestoneDescriptionField from '../milestone-description-field';
import MilestoneCreatedByField from '../milestone-created-by-field';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestoneDetailProps {
  milestone: IMilestone;
}

interface IMilestoneDetailState {
}

export default class MilestoneDetail extends React.PureComponent<IMilestoneDetailProps, IMilestoneDetailState> {
  render() {
    return (
      <div className="milestone-detail-component">
        <div className="header">Milestone #{this.props.milestone.sid}</div>
        <div className="description">
          <MilestoneDescriptionField milestone={this.props.milestone} />
        </div>
        <div className="created">
          <div className="label">Created by:</div>
          <div className="user">
            <MilestoneCreatedByField milestone={this.props.milestone} />
          </div>
        </div>
      </div>
    );
  }
};
