import * as React from 'react';
import * as classNames from 'classnames';
import { IIssueType } from '../../application';
import { ServiceManager } from '../../services';
import Dropdown from '../dropdown';

interface IIssueTypeDropdownProps {
  issueType: IIssueType;
  className?: string;
  onChange(issueType: IIssueType): void;
}

interface IIssueTypeDropdownState {
  issueTypes?: IIssueType[];
}

export default class IssueTypeDropdown extends React.Component<IIssueTypeDropdownProps, IIssueTypeDropdownState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleDropdownChange = this.handleDropdownChange.bind(this);

    this.state = {
      issueTypes: [],
    };
  }

  componentDidMount() {
    this.setState({
      issueTypes: this.application.issueTypes.getAll(),
    });
  }

  private handleDropdownChange(issueType: IIssueType) {
    this.props.onChange(issueType);
  }

  render() {
    return (
      <Dropdown className={classNames('issue-type-dropdown component', this.props.className)} selectedItem={this.props.issueType} items={this.state.issueTypes} displayProperty="title" onChange={this.handleDropdownChange} />
    );
  }
};
