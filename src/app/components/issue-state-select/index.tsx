import * as React from 'react';
import * as classNames from 'classnames';
import { IIssueState } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IIssueStateSelectProps {
  issueState: IIssueState;
  className?: string;
  onChange(issueState: IIssueState): void;
}

interface IIssueStateSelectState {
  issueStates?: IIssueState[];
}

export default class IssueStateSelect extends React.Component<IIssueStateSelectProps, IIssueStateSelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      issueStates: [],
    };
  }

  componentDidMount() {
    this.setState({
      issueStates: this.application.issueStates.getAll(),
    });
  }

  private handleSelectChange(issueState: IIssueState) {
    this.props.onChange(issueState);
  }

  render() {
    return (
      <Select className={classNames('issue-state-select-component', this.props.className)} selectedItem={this.props.issueState} items={this.state.issueStates} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
