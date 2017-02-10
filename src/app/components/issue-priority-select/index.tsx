import * as React from 'react';
import * as classNames from 'classnames';
import { IIssuePriority } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IIssuePrioritySelectProps {
  issuePriority: IIssuePriority;
  className?: string;
  onChange(issuePriority: IIssuePriority): void;
}

interface IIssuePrioritySelectState {
  issuePriorities?: IIssuePriority[];
}

export default class IssuePrioritySelect extends React.Component<IIssuePrioritySelectProps, IIssuePrioritySelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      issuePriorities: [],
    };
  }

  componentDidMount() {
    this.setState({
      issuePriorities: this.application.issuePriorities.getAll(),
    });
  }

  private handleSelectChange(issuePriority: IIssuePriority) {
    this.props.onChange(issuePriority);
  }

  render() {
    return (
      <Select className={classNames('issue-priority-select-component', this.props.className)} selectedItem={this.props.issuePriority} items={this.state.issuePriorities} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
