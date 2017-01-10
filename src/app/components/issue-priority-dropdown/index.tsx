import * as React from 'react';
import * as classNames from 'classnames';
import { IIssuePriority } from '../../application';
import { ServiceManager } from '../../services';
import Dropdown from '../dropdown';

interface IIssuePriorityDropdownProps {
  issuePriority: IIssuePriority;
  className?: string;
  onChange(issuePriority: IIssuePriority): void;
}

interface IIssuePriorityDropdownState {
  issuePriorities?: IIssuePriority[];
}

export default class IssuePriorityDropdown extends React.Component<IIssuePriorityDropdownProps, IIssuePriorityDropdownState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleDropdownChange = this.handleDropdownChange.bind(this);

    this.state = {
      issuePriorities: [],
    };
  }

  componentDidMount() {
    this.setState({
      issuePriorities: this.application.issuePriorities.getAll(),
    });
  }

  private handleDropdownChange(issuePriority: IIssuePriority) {
    this.props.onChange(issuePriority);
  }

  render() {
    return (
      <Dropdown className={classNames('issue-priority-dropdown component', this.props.className)} selectedItem={this.props.issuePriority} items={this.state.issuePriorities} displayProperty="title" onChange={this.handleDropdownChange} />
    );
  }
};
