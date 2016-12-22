import * as React from 'react';
import * as blueimpmd5 from 'blueimp-md5';
import { IUser } from '../../application';

require('./index.less');

interface IAvatarProps {
  user?: IUser;
  size?: number;
}

export default class Avatar extends React.Component<IAvatarProps, {}> {
  public static defaultProps: IAvatarProps = {
    size: 50
  };

  render() {
    let md5: any = blueimpmd5;

    return (
      <div className="avatar component">
        <img src={`http://www.gravatar.com/avatar/${md5(this.props.user.email)}?s=${this.props.size * 2}&d=identicon`} width={this.props.size} height={this.props.size} />
      </div>
    );
  }
};
