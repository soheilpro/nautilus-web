import * as React from 'react';
import * as classNames from 'classnames';
import { IIssue, IItemState } from '../../application';
import { ServiceManager } from '../../services';
import ProjectField from '../project-field';
import SidField from '../sid-field';
import TextField from '../text-field';
import ItemTypeField from '../item-type-field';
import ItemPriorityField from '../item-priority-field';
import ItemStateField from '../item-state-field';
import ItemField from '../item-field';

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
    if (!state)
      return null;

    let style = {
      'padding': '1px 5px',
    };

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
      <div className={classNames('issue-component', state ? `state-${state.key}` : null)}>
        <span className="sid">
          <SidField sid={this.props.issue.sid} />
        </span>
        {
          <span className="title">
            <TextField title={this.props.issue.title} style={this.styleForState(state)} />
          </span>
        }
        <span className="spacer"></span>
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
        {
          this.props.issue.parent &&
            <span className="milestone">
              <ItemField item={this.props.issue.parent} />
            </span>
        }
      </div>
    );
  }
};
