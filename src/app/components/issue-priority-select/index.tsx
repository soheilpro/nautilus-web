import * as React from 'react';
import * as classNames from 'classnames';
import { IItemPriority } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IIssuePrioritySelectProps {
  issuePriority: IItemPriority;
  className?: string;
  onChange(issuePriority: IItemPriority): void;
}

interface IIssuePrioritySelectState {
  issuePriorities?: IItemPriority[];
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
      issuePriorities: this.application.itemPriorities.getAllIssuePriorities(),
    });
  }

  private handleSelectChange(issuePriority: IItemPriority) {
    this.props.onChange(issuePriority);
  }

  render() {
    return (
      <Select className={classNames('issue-priority-select-component', this.props.className)} selectedItem={this.props.issuePriority} items={this.state.issuePriorities} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
