import * as React from 'react';
import { IProject, IIssuePriority, IIssueState, IIssueType, IIssue } from '../../application';
import { ModalHeader, ModalContent, ModalActionBar } from '../modal';
import Input from '../input';
import ProjectDropdown from '../project-dropdown';
import IssuePriorityDropdown from '../issue-priority-dropdown';
import IssueTypeDropdown from '../issue-type-dropdown';
import IssueStateDropdown from '../issue-state-dropdown';
import Button from '../button';

require('./add-edit-issue-box.less');

interface IAddEditIssueBoxProps {
  autoFocus: boolean;
  onSave(issue: IIssue): void;
  onCloseRequest(): void;
}

interface IAddEditIssueBoxState {
  title?: string;
  project?: IProject;
  type?: IIssueType;
  priority?: IIssuePriority;
  state?: IIssueState;
  description?: string;
}

export default class AddEditIssueBox extends React.Component<IAddEditIssueBoxProps, IAddEditIssueBoxState> {
  constructor() {
    super();

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
    this.handleProjectDropdownChange = this.handleProjectDropdownChange.bind(this);
    this.handleTypeInputChange = this.handleTypeInputChange.bind(this);
    this.handlePriorityInputChange = this.handlePriorityInputChange.bind(this);
    this.handleStateInputChange = this.handleStateInputChange.bind(this);
    this.handleDescriptionInputChange = this.handleDescriptionInputChange.bind(this);

    this.state = {};
  }

  private handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let issue: IIssue = {
      type: this.state.type,
      title: this.state.title,
      description: this.state.description,
      state: this.state.state,
      priority: this.state.priority,
      project: this.state.project,
    };

    this.props.onSave(issue);
  }

  private handleTitleInputChange(value: string) {
    this.setState({
      title: value,
    });
  }

  private handleProjectDropdownChange(value: IProject) {
    this.setState({
      project: value,
    });
  }

  private handleTypeInputChange(value: IIssueType) {
    this.setState({
      type: value,
    });
  }

  private handlePriorityInputChange(value: IIssuePriority) {
    this.setState({
      priority: value,
    });
  }

  private handleStateInputChange(value: IIssueState) {
    this.setState({
      state: value,
    });
  }

  private handleDescriptionInputChange(value: string) {
    this.setState({
      description: value,
    });
  }

  render() {
    return (
      <div className="add-edit-issue-box component">
        <ModalHeader>New Issue</ModalHeader>
        <ModalContent>
          <form className="form" id="addEditIssueForm" onSubmit={this.handleFormSubmit}>
            <div className="field">
              <div className="label">
                Title:
              </div>
              <div className="value">
                <Input className="title" value={this.state.title} autoFocus={this.props.autoFocus} onChange={this.handleTitleInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Project:
              </div>
              <div className="value">
                <ProjectDropdown className="project" project={this.state.project} onChange={this.handleProjectDropdownChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Type:
              </div>
              <div className="value">
                <IssueTypeDropdown className="issue-type" issueType={this.state.type} onChange={this.handleTypeInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Priority:
              </div>
              <div className="value">
                <IssuePriorityDropdown className="issue-priority" issuePriority={this.state.priority} onChange={this.handlePriorityInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                State:
              </div>
              <div className="value">
                <IssueStateDropdown className="issue-state" issueState={this.state.state} onChange={this.handleStateInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Description:
              </div>
              <div className="value">
                <Input className="description" value={this.state.description} multiline={true} onChange={this.handleDescriptionInputChange} />
              </div>
            </div>
          </form>
        </ModalContent>
        <ModalActionBar>
          <Button type="secondary" onClick={this.props.onCloseRequest}>Cancel</Button>
          <Button type="submit" form="addEditIssueForm">Add Issue</Button>
        </ModalActionBar>
      </div>
    );
  }
};
