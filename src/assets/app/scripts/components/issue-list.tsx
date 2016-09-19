import * as React from 'react';
import { Nautilus, IIssue, entityComparer } from '../nautilus';
import { IssueGrid } from './issue-grid';

interface IIssueListProps {
  issues?: IIssue[];
  selectedIssueIndex?: number;
  onSelectionChange?(index: number): void;
}

export class IssueList extends React.Component<IIssueListProps, {}> {
  handleSelectionChange(index: number): void {
    this.setState({
      selectedIssueIndex: index
    });

    this.props.onSelectionChange(index);
  }

  render() {
    var selectedIssue = this.props.issues[this.props.selectedIssueIndex];

    return (
      <IssueGrid issues={this.props.issues} selectedIssueIndex={this.props.selectedIssueIndex} onSelectionChange={this.handleSelectionChange.bind(this)} />
    );
  }
};
