import * as React from 'react';
import { Nautilus, IIssue } from '../nautilus';
import { AssignedUserIssueField } from './issue-field-assigned-user';
import { MilestoneIssueField } from './issue-field-milestone';
import { StateIssueField } from './issue-field-state';
import { ProjectIssueField } from './issue-field-project';
import { TitleIssueField } from './issue-field-title';
import config from '../config';

interface IssueListProps {
  issues: IIssue[];
}

interface IssueListState {
  selectedRowIndex?: number;
  selectedColumnIndex?: number;
}

export class IssueList extends React.Component<IssueListProps, IssueListState> {
  constructor() {
    super();

    this.state = {
      selectedRowIndex: 0,
      selectedColumnIndex: 0
    };
  }

  componentDidMount() {
    Nautilus.Instance.on('issueAdded', (issue) => {
      this.setState({
        selectedRowIndex: _.findIndex(this.props.issues, (i => i.id === issue.id)),
        selectedColumnIndex: 2
      });

      var cell = this.refs['cell-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any;
      cell.focus();

      var field = this.refs['field-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any;
      field.edit();
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.target !== event.currentTarget)
      return;

    switch (event.which) {
      case 38: // Up
        if (this.state.selectedRowIndex === 0)
          return;

        this.setState({
          selectedRowIndex: this.state.selectedRowIndex - 1
        });

        event.preventDefault();
        break;

      case 40: // Down
        if (this.state.selectedRowIndex === this.props.issues.length - 1)
          return;

        this.setState({
          selectedRowIndex: this.state.selectedRowIndex + 1
        });

        event.preventDefault();
        break;

      case 37: // Left
        if (!config.rtl) {
          if (this.state.selectedColumnIndex === 0)
            return;

          this.setState({
            selectedColumnIndex: this.state.selectedColumnIndex - 1
          });
        }
        else {
          if (this.state.selectedColumnIndex === 5 - 1)
            return;

          this.setState({
            selectedColumnIndex: this.state.selectedColumnIndex + 1
          });
        }

        event.preventDefault();
        break;

      case 39: // Right
        if (!config.rtl) {
          if (this.state.selectedColumnIndex === 5 - 1)
            return;

          this.setState({
            selectedColumnIndex: this.state.selectedColumnIndex + 1
          });
        }
        else {
          if (this.state.selectedColumnIndex === 0)
            return;

          this.setState({
            selectedColumnIndex: this.state.selectedColumnIndex - 1
          });
        }

        event.preventDefault();
        break;

      case 13: // Enter
        (this.refs['field-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any).edit();

        event.preventDefault();
        break;

      case 8: // Delete
        if (!window.confirm("Delete issue?"))
          return;

        var issue = this.props.issues[this.state.selectedRowIndex];
        Nautilus.Instance.deleteIssue(issue);

        event.preventDefault();
        break;

      case 222: // '
        if (this.state.selectedRowIndex === 0)
          return;

        var thisField = this.refs['field-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any;
        var aboveField = this.refs['field-' + (this.state.selectedRowIndex - 1) + '-' + this.state.selectedColumnIndex] as any;
        thisField.setValue(aboveField.getValue());

        event.preventDefault();
        break;
    }
  }

  onSelected(rowIndex: number, columnIndex: number) {
    this.setState({
      selectedRowIndex: rowIndex,
      selectedColumnIndex: columnIndex
    });
  }

  render() {
    return (
      <table className='issues'>
        <thead>
          <tr>
            <th>Project</th>
            <th>Milestone</th>
            <th>Title</th>
            <th>State</th>
            <th>Assignee</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.issues.map((issue, index) => {
              return (
                <tr key={issue.id} className={this.state.selectedRowIndex === index ? 'selected' : ''}>
                  <td className={'project ' + (this.state.selectedColumnIndex === 0 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 0)} ref={'cell-' + index + '-0'}>
                    <ProjectIssueField issue={issue} ref={'field-' + index + '-0'} />
                  </td>
                  <td className={'milestone ' + (this.state.selectedColumnIndex === 1 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 1)} ref={'cell-' + index + '-1'}>
                    <MilestoneIssueField issue={issue} ref={'field-' + index + '-1'} />
                  </td>
                  <td className={'title ' + (this.state.selectedColumnIndex === 2 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 2)} ref={'cell-' + index + '-2'}>
                    <TitleIssueField issue={issue} ref={'field-' + index + '-2'} />
                  </td>
                  <td className={'state ' + (this.state.selectedColumnIndex === 3 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 3)} ref={'cell-' + index + '-3'}>
                    <StateIssueField issue={issue} ref={'field-' + index + '-3'} />
                  </td>
                  <td className={'state ' + (this.state.selectedColumnIndex === 4 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 4)} ref={'cell-' + index + '-4'}>
                    <AssignedUserIssueField issue={issue} ref={'field-' + index + '-4'} />
                  </td>
                </tr>
              );
            }, this)
          }
        </tbody>
      </table>
    );
  }
};
