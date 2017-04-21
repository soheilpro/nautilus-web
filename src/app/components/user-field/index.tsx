import * as React from 'react';
import { IUser } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IUserFieldProps {
  user: IUser;
}

interface IUserFieldState {
}

export default class UserField extends React.PureComponent<IUserFieldProps, IUserFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.user)
      return null;

    const user = this.application.users.get(this.props.user);

    return (
      <div className="task-assigned-to-field-component">
        {user.name}
      </div>
    );
  }
};
