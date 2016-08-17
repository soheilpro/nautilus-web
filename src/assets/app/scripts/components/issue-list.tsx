import * as React from 'react';
import { Nautilus, IIssue, entityComparer } from '../nautilus';
import { AssignedUserIssueField } from './issue-field-assigned-user';
import { MilestoneIssueField } from './issue-field-milestone';
import { StateIssueField } from './issue-field-state';
import { TypeIssueField } from './issue-field-type';
import { PriorityIssueField } from './issue-field-priority';
import { ProjectIssueField } from './issue-field-project';
import { AreaIssueField } from './issue-field-area';
import { TitleIssueField } from './issue-field-title';
import { SidIssueField } from './issue-field-sid';
import { IssueDetail } from './issue-detail';
import config from '../config';

interface IssueListProps {
  issues: IIssue[];
}

interface IssueListState {
  selectedRowIndex?: number;
  selectedColumnIndex?: number;
}

export class IssueList extends React.Component<IssueListProps, IssueListState> {
  private columnCount = 9;

  getIssues() {
    var issues = this.props.issues.slice();
    issues.reverse();

    return issues;
  }

  constructor() {
    super();

    this.state = {
      selectedRowIndex: 0,
      selectedColumnIndex: 0
    };
  }

  componentDidMount() {
    Nautilus.Instance.on('issueAdded', (issue) => {
      var issueIndex = _.findIndex(this.getIssues(), entityComparer.bind(this, issue));

      if (issueIndex === -1)
        return;

      this.setState({
        selectedRowIndex: issueIndex,
        selectedColumnIndex: 2
      });

      var cell = this.refs['cell-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any;

      cell.focus();

      var field = this.refs['field-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any;
      field.edit();
    });

    Mousetrap.bind('tab', () => {
      if (this.state.selectedColumnIndex === this.columnCount - 1) {
        if (this.state.selectedRowIndex < this.getIssues().length - 1)
          this.moveToCell(this.state.selectedRowIndex + 1, 0);
      }
      else {
        this.moveToNextCell();
      }
    });

    Mousetrap.bind('shift+tab', () => {
      if (this.state.selectedColumnIndex === 0) {
        if (this.state.selectedRowIndex > 0)
          this.moveToCell(this.state.selectedRowIndex - 1, this.columnCount - 1);
      }
      else {
        this.moveToPreviousCell();
      }
    });

    Mousetrap.bind('up', (event: KeyboardEvent) => {
      if (!$.contains($('table.issues')[0], event.target as any))
        return;

      this.moveToAboveCell();

      event.preventDefault();
    });

    Mousetrap.bind('down', (event: KeyboardEvent) => {
      if (!$.contains($('table.issues')[0], event.target as any))
        return;

      this.moveToBelowCell();

      event.preventDefault();
    });

    Mousetrap.bind('left', (event: KeyboardEvent) => {
      if (!$.contains($('table.issues')[0], event.target as any))
        return;

      this.moveLeft();

      event.preventDefault();
    });

    Mousetrap.bind('right', (event: KeyboardEvent) => {
      if (!$.contains($('table.issues')[0], event.target as any))
        return;

      this.moveRight();

      event.preventDefault();
    });

    Mousetrap.bind('enter', (event: KeyboardEvent) => {
      if (!$.contains($('table.issues')[0], event.target as any))
        return;

      (this.refs['field-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any).edit();

      event.preventDefault();
    });

    Mousetrap.bind('del', (event: KeyboardEvent) => {
      if (!$.contains($('table.issues')[0], event.target as any))
        return;

      if (!window.confirm("Delete issue?"))
        return;

      var issue = this.getIssues()[this.state.selectedRowIndex];
      Nautilus.Instance.deleteIssue(issue);

      event.preventDefault();
    });

    Mousetrap.bind('\'', (event: KeyboardEvent) => {
      if (!$.contains($('table.issues')[0], event.target as any))
        return;

      if (this.state.selectedRowIndex === this.getIssues().length - 1)
        return;

      var thisField = this.refs['field-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any;
      var belowField = this.refs['field-' + (this.state.selectedRowIndex + 1) + '-' + this.state.selectedColumnIndex] as any;
      thisField.setValue(belowField.getValue());

      event.preventDefault();
    });

    var alphabet = _.flatten(Array.apply(null, {length: 26}).map(Function.call, Number).map((x: number) => [x + 65, x + 97])).map((x: number) => String.fromCharCode(x));

    Mousetrap.bind(alphabet, (event: KeyboardEvent) => {
      if (!$.contains($('table.issues')[0], event.target as any))
        return;

      (this.refs['field-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex] as any).edit();
    });

    ($(".issue-detail-container") as any).sticky();
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
    if (this.state.selectedRowIndex === this.getIssues().length - 1)
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
      <div className='issue-list'>
        <div className='row'>
          <div className='three columns' style={{minHeight: '1px'}}>
            <div className='issue-detail-container'>
              {
                this.getIssues()[this.state.selectedRowIndex] ?
                  <IssueDetail issue={this.getIssues()[this.state.selectedRowIndex]} /> : null
              }
            </div>
          </div>
          <div className='nine columns'>
            <table className='issues'>
              <thead>
                <tr>
                  <th className="sid">Id</th>
                  <th className="milestone">Milestone</th>
                  <th className="title">Title</th>
                  <th className="project">Project</th>
                  <th className="area">Area</th>
                  <th className="type">Type</th>
                  <th className="priority">Priority</th>
                  <th className="state">State</th>
                  <th className="assignee">Assignee</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.getIssues().map((issue, index) => {
                    return (
                      <tr key={issue.id} className={this.state.selectedRowIndex === index ? 'selected' : ''}>
                        <td className={'sid ' + (this.state.selectedColumnIndex === 0 ? 'selected' : '')} tabIndex="0" onClick={this.onSelected.bind(this, index, 0)} ref={'cell-' + index + '-0'}>
                          <SidIssueField issue={issue} ref={'field-' + index + '-0'} />
                        </td>
                        <td className={'milestone ' + (this.state.selectedColumnIndex === 1 ? 'selected' : '')} tabIndex="0" onClick={this.onSelected.bind(this, index, 1)} ref={'cell-' + index + '-1'}>
                          <MilestoneIssueField issue={issue} ref={'field-' + index + '-1'} />
                        </td>
                        <td className={'title ' + (this.state.selectedColumnIndex === 2 ? 'selected' : '')} tabIndex="0" onClick={this.onSelected.bind(this, index, 2)} ref={'cell-' + index + '-2'}>
                          <TitleIssueField issue={issue} ref={'field-' + index + '-2'} />
                        </td>
                        <td className={'project ' + (this.state.selectedColumnIndex === 3 ? 'selected' : '')} tabIndex="0" onClick={this.onSelected.bind(this, index, 3)} ref={'cell-' + index + '-3'}>
                          <ProjectIssueField issue={issue} ref={'field-' + index + '-3'} />
                        </td>
                        <td className={'area ' + (this.state.selectedColumnIndex === 4 ? 'selected' : '')} tabIndex="0" onClick={this.onSelected.bind(this, index, 4)} ref={'cell-' + index + '-4'}>
                          <AreaIssueField issue={issue} ref={'field-' + index + '-4'} />
                        </td>
                        <td className={'type ' + (this.state.selectedColumnIndex === 5 ? 'selected' : '')} tabIndex="0" onClick={this.onSelected.bind(this, index, 5)} ref={'cell-' + index + '-5'}>
                          <TypeIssueField issue={issue} ref={'field-' + index + '-5'} />
                        </td>
                        <td className={'priority ' + (this.state.selectedColumnIndex === 6 ? 'selected' : '')} tabIndex="0" onClick={this.onSelected.bind(this, index, 6)} ref={'cell-' + index + '-6'}>
                          <PriorityIssueField issue={issue} ref={'field-' + index + '-6'} />
                        </td>
                        <td className={'state ' + (this.state.selectedColumnIndex === 7 ? 'selected' : '')} tabIndex="0" onClick={this.onSelected.bind(this, index, 7)} ref={'cell-' + index + '-7'}>
                          <StateIssueField issue={issue} ref={'field-' + index + '-7'} />
                        </td>
                        <td className={'assignee ' + (this.state.selectedColumnIndex === 8 ? 'selected' : '')} tabIndex="0" onClick={this.onSelected.bind(this, index, 8)} ref={'cell-' + index + '-8'}>
                          <AssignedUserIssueField issue={issue} ref={'field-' + index + '-8'} />
                        </td>
                      </tr>
                    );
                  }, this)
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
};
