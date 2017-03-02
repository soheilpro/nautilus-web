import * as React from 'react';
import * as classNames from 'classnames';
import { IUser } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IUserSelectProps {
  user: IUser;
  className?: string;
  onChange(user: IUser): void;
}

interface IUserSelectState {
  users?: IUser[];
}

export default class UserSelect extends React.Component<IUserSelectProps, IUserSelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.setState({
      users: this.application.users.getAll(),
    });
  }

  private handleSelectChange(user: IUser) {
    this.props.onChange(user);
  }

  render() {
    return (
      <Select className={classNames('user-select-component', this.props.className)} selectedItem={this.props.user} items={this.state.users} displayProperty="name" onChange={this.handleSelectChange} />
    );
  }
};
