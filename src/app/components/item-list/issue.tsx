import * as React from 'react';
import { IIssue, IItemState } from '../../application';
import { ServiceManager } from '../../services';
import ProjectField from '../project-field';
import SidField from '../sid-field';
import TextField from '../text-field';
import ItemTypeField from '../item-type-field';
import ItemPriorityField from '../item-priority-field';
import ItemStateField from '../item-state-field';
import ItemField from '../item-field';
import UserField from '../user-field';

require('../../assets/stylesheets/base.less');
require('./issue.less');

interface IIssueProps {
  issue: IIssue;
}

interface IIssueState {
}

export default class Issue extends React.PureComponent<IIssueProps, IIssueState> {
  private application = ServiceManager.Instance.getApplication();

  private styleForState(state: IItemState) {
    let style = {
      'padding': '1px 5px',
    };

    if (!state)
      return style;

    switch (state.key) {
      case 'todo':
        return {
          ...style,
          backgroundColor: '#ffe0b2',
        };

      case 'doing':
        return {
          ...style,
          backgroundColor: '#b3e5fc',
        };

      case 'done':
        return {
          ...style,
          backgroundColor: '#c5e1a5',
        };

      case 'closed':
        return {
          ...style,
          color: '#aaa',
          textDecoration: 'line-through',
        };
    }

    return null;
  }

  render() {
    const state = this.application.itemStates.get(this.props.issue.state);

    return (
      <div className="issue-component">
        <span className="sid">
          <SidField sid={this.props.issue.sid} />
        </span>
        <span className="divider1"></span>
        {
          <span className="title">
            <TextField title={this.props.issue.title} style={this.styleForState(state)} />
          </span>
        }
        <span className="spacer"></span>
        {
          this.props.issue.project &&
            <span className="project">
              <span className="divider2"></span>
              <ProjectField project={this.props.issue.project} />
            </span>
        }
        {
          this.props.issue.type &&
            <span className="type">
              <span className="divider2"></span>
              <ItemTypeField itemType={this.props.issue.type} />
            </span>
        }
        {
          this.props.issue.priority &&
            <span className="priority">
              <span className="divider2"></span>
              <ItemPriorityField itemPriority={this.props.issue.priority} />
            </span>
        }
        {
          this.props.issue.state &&
            <span className="state">
              <span className="divider2"></span>
              <ItemStateField itemState={this.props.issue.state} />
            </span>
        }
        {
          this.props.issue.assignedTo &&
            <span className="assigned-to">
              <span className="divider2"></span>
              <UserField user={this.props.issue.assignedTo} />
            </span>
        }
        {
          this.props.issue.parent &&
            <span className="milestone">
              <span className="divider2"></span>
              <ItemField item={this.props.issue.parent} />
            </span>
        }
      </div>
    );
  }
};
