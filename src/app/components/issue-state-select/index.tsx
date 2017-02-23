import * as React from 'react';
import * as classNames from 'classnames';
import { IItemState } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IIssueStateSelectProps {
  issueState: IItemState;
  className?: string;
  onChange(issueState: IItemState): void;
}

interface IIssueStateSelectState {
  issueStates?: IItemState[];
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
      issueStates: this.application.itemStates.getAllIssueStates(),
    });
  }

  private handleSelectChange(issueState: IItemState) {
    this.props.onChange(issueState);
  }

  render() {
    return (
      <Select className={classNames('issue-state-select-component', this.props.className)} selectedItem={this.props.issueState} items={this.state.issueStates} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
