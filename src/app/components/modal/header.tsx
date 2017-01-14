import * as React from 'react';

require('./header.less');

interface IModalHeaderProps {
}

interface IModalHeaderState {
}

export class ModalHeader extends React.Component<IModalHeaderProps, IModalHeaderState> {
  render() {
    return (
      <div className="modal-header component">
        <span className="title">{this.props.children}</span>
      </div>
    );
  }
};
