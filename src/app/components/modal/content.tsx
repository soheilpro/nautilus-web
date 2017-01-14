import * as React from 'react';

require('./content.less');

interface IModalContentProps {
}

interface IModalContentState {
}

export class ModalContent extends React.Component<IModalContentProps, IModalContentState> {
  render() {
    return (
      <div className="modal-content component">
        {this.props.children}
      </div>
    );
  }
};
