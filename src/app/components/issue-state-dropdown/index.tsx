import * as React from 'react';
import * as classNames from 'classnames';
import { IIssueState } from '../../application';
import { ServiceManager } from '../../services';
import Dropdown from '../dropdown';

interface IIssueStateDropdownProps {
  issueState: IIssueState;
  className?: string;
  onChange(issueState: IIssueState): void;
}

interface IIssueStateDropdownState {
  issueStates?: IIssueState[];
}

export default class IssueStateDropdown extends React.Component<IIssueStateDropdownProps, IIssueStateDropdownState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleDropdownChange = this.handleDropdownChange.bind(this);

    this.state = {
      issueStates: [],
    };
  }

  componentDidMount() {
    this.setState({
      issueStates: this.application.issueStates.getAll(),
    });
  }

  private handleDropdownChange(issueState: IIssueState) {
    this.props.onChange(issueState);
  }

  render() {
    return (
      <Dropdown className={classNames('issue-state-dropdown-component', this.props.className)} selectedItem={this.props.issueState} items={this.state.issueStates} displayProperty="title" onChange={this.handleDropdownChange} />
    );
  }
};
