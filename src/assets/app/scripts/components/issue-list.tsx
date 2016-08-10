import * as React from 'react';
import { Nautilus, IIssue } from '../nautilus';
import { AssignedUserIssueField } from './issue-field-assigned-user';
import { CreatorIssueField } from './issue-field-creator';
import { MilestoneIssueField } from './issue-field-milestone';
import { StateIssueField } from './issue-field-state';
import { TypeIssueField } from './issue-field-type';
import { PriorityIssueField } from './issue-field-priority';
import { ProjectIssueField } from './issue-field-project';
import { AreaIssueField } from './issue-field-area';
import { TitleIssueField } from './issue-field-title';
import { SidIssueField } from './issue-field-sid';
import config from '../config';

interface IssueListProps {
  issues: IIssue[];
}

interface IssueListState {
  selectedRowIndex?: number;
  selectedColumnIndex?: number;
}

export class IssueList extends React.Component<IssueListProps, IssueListState> {
  private columnCount = 10;

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
        selectedColumnIndex: 1
      });

      var cell = this.refs['cell-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any;
      cell.focus();

      var field = this.refs['field-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any;
      field.edit();
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.which === 9) { // Tab
      if (event.shiftKey) {
        if (this.state.selectedColumnIndex === 0) {
          if (this.state.selectedRowIndex > 0)
            this.moveToCell(this.state.selectedRowIndex - 1, this.columnCount - 1);
        }
        else {
          this.moveToPreviousCell();
        }
      }
      else {
        if (this.state.selectedColumnIndex === this.columnCount - 1) {
          if (this.state.selectedRowIndex < this.props.issues.length - 1)
            this.moveToCell(this.state.selectedRowIndex + 1, 0);
        }
        else {
          this.moveToNextCell();
        }
      }
    }
    else if (event.which === 38) { // Up
      if (event.target !== event.currentTarget)
        return;

      this.moveToAboveCell();

      event.preventDefault();
    }
    else if (event.which === 40) { // Down
      if (event.target !== event.currentTarget)
        return;

      this.moveToBelowCell();

      event.preventDefault();
    }
    else if (event.which === 37) { // Left
      if (event.target !== event.currentTarget)
        return;

      this.moveLeft();

      event.preventDefault();
    }
    else if (event.which === 39) { // Right
      if (event.target !== event.currentTarget)
        return;

      this.moveRight();

      event.preventDefault();
    }
    else if (event.which === 13) { // Enter
      if (event.target !== event.currentTarget)
        return;

      (this.refs['field-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any).edit();

      event.preventDefault();
    }
    else if (event.which === 8) { // Delete
      if (event.target !== event.currentTarget)
        return;

      if (!window.confirm("Delete issue?"))
        return;

      var issue = this.props.issues[this.state.selectedRowIndex];
      Nautilus.Instance.deleteIssue(issue);

      event.preventDefault();
    }
    else if (event.which === 222) { // '
      if (event.target !== event.currentTarget)
        return;

      if (this.state.selectedRowIndex === 0)
        return;

      var thisField = this.refs['field-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any;
      var aboveField = this.refs['field-' + (this.state.selectedRowIndex - 1) + '-' + this.state.selectedColumnIndex] as any;
      thisField.setValue(aboveField.getValue());

      event.preventDefault();
    }
  }

  moveToCell(rowIndex: number, columnIndex: number) {
    this.setState({
      selectedRowIndex: rowIndex,
      selectedColumnIndex: columnIndex
    });
  }

  moveToAboveCell() {
    if (this.state.selectedRowIndex === 0)
      return;

    this.moveToCell(this.state.selectedRowIndex - 1, this.state.selectedColumnIndex);
  }

  moveToBelowCell() {
    if (this.state.selectedRowIndex === this.props.issues.length - 1)
      return;

    this.moveToCell(this.state.selectedRowIndex + 1, this.state.selectedColumnIndex);
  }

  moveToNextCell() {
    if (this.state.selectedColumnIndex === this.columnCount - 1)
      return;

    this.moveToCell(this.state.selectedRowIndex, this.state.selectedColumnIndex + 1);
  }

  moveToPreviousCell() {
    if (this.state.selectedColumnIndex === 0)
      return;

    this.moveToCell(this.state.selectedRowIndex, this.state.selectedColumnIndex - 1);
  }

  moveLeft() {
    if (!config.rtl)
      this.moveToPreviousCell();
    else
      this.moveToNextCell();
  }

  moveRight() {
    if (!config.rtl)
      this.moveToNextCell();
    else
      this.moveToPreviousCell();
  }

  onSelected(rowIndex: number, columnIndex: number) {
    this.moveToCell(rowIndex, columnIndex);
  }

  render() {
    return (
      <table className='issues'>
        <thead>
          <tr>
            <th className="sid">Id</th>
            <th className="milestone">Milestone</th>
            <th className="project">Project</th>
            <th className="area">Area</th>
            <th className="title">Title</th>
            <th className="type">Type</th>
            <th className="priority">Priority</th>
            <th className="state">State</th>
            <th className="assignee">Assignee</th>
            <th className="creator">Creator</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.issues.map((issue, index) => {
              return (
                <tr key={issue.id} className={this.state.selectedRowIndex === index ? 'selected' : ''}>
                  <td className={'sid ' + (this.state.selectedColumnIndex === 0 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 0)} ref={'cell-' + index + '-0'}>
                    <SidIssueField issue={issue} ref={'field-' + index + '-0'} />
                  </td>
                  <td className={'milestone ' + (this.state.selectedColumnIndex === 1 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 1)} ref={'cell-' + index + '-1'}>
                    <MilestoneIssueField issue={issue} ref={'field-' + index + '-1'} />
                  </td>
                  <td className={'project ' + (this.state.selectedColumnIndex === 2 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 2)} ref={'cell-' + index + '-2'}>
                    <ProjectIssueField issue={issue} ref={'field-' + index + '-2'} />
                  </td>
                  <td className={'area ' + (this.state.selectedColumnIndex === 3 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 3)} ref={'cell-' + index + '-3'}>
                    <AreaIssueField issue={issue} ref={'field-' + index + '-3'} />
                  </td>
                  <td className={'title ' + (this.state.selectedColumnIndex === 4 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 4)} ref={'cell-' + index + '-4'}>
                    <TitleIssueField issue={issue} ref={'field-' + index + '-4'} />
                  </td>
                  <td className={'type ' + (this.state.selectedColumnIndex === 5 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 5)} ref={'cell-' + index + '-5'}>
                    <TypeIssueField issue={issue} ref={'field-' + index + '-5'} />
                  </td>
                  <td className={'priority ' + (this.state.selectedColumnIndex === 6 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 6)} ref={'cell-' + index + '-6'}>
                    <PriorityIssueField issue={issue} ref={'field-' + index + '-6'} />
                  </td>
                  <td className={'state ' + (this.state.selectedColumnIndex === 7 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 7)} ref={'cell-' + index + '-7'}>
                    <StateIssueField issue={issue} ref={'field-' + index + '-7'} />
                  </td>
                  <td className={'assignee ' + (this.state.selectedColumnIndex === 8 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 8)} ref={'cell-' + index + '-8'}>
                    <AssignedUserIssueField issue={issue} ref={'field-' + index + '-8'} />
                  </td>
                  <td className={'creator ' + (this.state.selectedColumnIndex === 9 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} onClick={this.onSelected.bind(this, index, 9)} ref={'cell-' + index + '-9'}>
                    <CreatorIssueField issue={issue} ref={'field-' + index + '-9'} />
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
