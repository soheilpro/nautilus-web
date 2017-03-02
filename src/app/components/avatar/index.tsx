import React from 'react';
import blueimpmd5 from 'blueimp-md5';
import { IUser } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IAvatarProps {
  user?: IUser;
  size?: number;
}

interface IAvatarState {
}

export default class Avatar extends React.Component<IAvatarProps, IAvatarState> {
  public static defaultProps: IAvatarProps = {
    size: 50
  };

  render() {
    let md5: any = blueimpmd5;

    return (
      <div className="avatar-component">
        <img className="image" src={`http://www.gravatar.com/avatar/${md5(this.props.user.email)}?s=${this.props.size * 2}&d=identicon`} width={this.props.size} height={this.props.size} />
      </div>
    );
  }
};
