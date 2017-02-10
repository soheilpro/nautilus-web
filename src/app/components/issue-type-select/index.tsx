import * as React from 'react';
import * as classNames from 'classnames';
import { IIssueType } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IIssueTypeSelectProps {
  issueType: IIssueType;
  className?: string;
  onChange(issueType: IIssueType): void;
}

interface IIssueTypeSelectState {
  issueTypes?: IIssueType[];
}

export default class IssueTypeSelect extends React.Component<IIssueTypeSelectProps, IIssueTypeSelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      issueTypes: [],
    };
  }

  componentDidMount() {
    this.setState({
      issueTypes: this.application.issueTypes.getAll(),
    });
  }

  private handleSelectChange(issueType: IIssueType) {
    this.props.onChange(issueType);
  }

  render() {
    return (
      <Select className={classNames('issue-type-select-component', this.props.className)} selectedItem={this.props.issueType} items={this.state.issueTypes} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
