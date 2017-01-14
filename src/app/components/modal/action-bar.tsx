import * as React from 'react';

require('./action-bar.less');

interface IModalActionBarProps {
}

interface IModalActionBarState {
}

export class ModalActionBar extends React.Component<IModalActionBarProps, IModalActionBarState> {
  render() {
    return (
      <div className="modal-action-bar component">
        {this.props.children}
      </div>
    );
  }
};
