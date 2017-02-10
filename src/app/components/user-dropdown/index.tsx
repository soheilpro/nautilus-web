import * as React from 'react';
import * as classNames from 'classnames';
import { IUser } from '../../application';
import { ServiceManager } from '../../services';
import Dropdown from '../dropdown';

interface IUserDropdownProps {
  user: IUser;
  className?: string;
  onChange(user: IUser): void;
}

interface IUserDropdownState {
  users?: IUser[];
}

export default class UserDropdown extends React.Component<IUserDropdownProps, IUserDropdownState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleDropdownChange = this.handleDropdownChange.bind(this);

    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.setState({
      users: this.application.users.getAll(),
    });
  }

  private handleDropdownChange(user: IUser) {
    this.props.onChange(user);
  }

  render() {
    return (
      <Dropdown className={classNames('user-type-dropdown-component', this.props.className)} selectedItem={this.props.user} items={this.state.users} displayProperty="name" onChange={this.handleDropdownChange} />
    );
  }
};
