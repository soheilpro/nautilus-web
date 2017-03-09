import * as React from 'react';
import { IIssue } from '../../application';
import ProjectField from '../project-field';
import SidField from '../sid-field';
import TextField from '../text-field';
import ItemTypeField from '../item-type-field';
import ItemPriorityField from '../item-priority-field';
import ItemStateField from '../item-state-field';

require('../../assets/stylesheets/base.less');
require('./issue.less');

interface IIssueProps {
  issue: IIssue;
}

interface IIssueState {
}

export default class Issue extends React.Component<IIssueProps, IIssueState> {
  render() {
    return (
      <div className="issue-component">
        <span className="sid">
          <SidField sid={this.props.issue.sid} />
        </span>
        {
          this.props.issue.title &&
            <span className="title">
              <TextField title={this.props.issue.title} />
            </span>
        }
        {
          this.props.issue.project &&
            <span className="project">
              <ProjectField project={this.props.issue.project} />
            </span>
        }
        {
          this.props.issue.type &&
            <span className="type">
              <ItemTypeField itemType={this.props.issue.type} />
            </span>
        }
        {
          this.props.issue.priority &&
            <span className="priority">
              <ItemPriorityField itemPriority={this.props.issue.priority} />
            </span>
        }
        {
          this.props.issue.state &&
            <span className="state">
              <ItemStateField itemState={this.props.issue.state} />
            </span>
        }
      </div>
    );
  }
};
