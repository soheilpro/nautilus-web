import * as React from 'react';
import { IIssue } from '../../application';
import Modal from '../modal';
import SearchBox from './search-box';

interface ISearchModalProps {
  isOpen: boolean;
  onIssueSelect(issue: IIssue): void;
  onCloseRequest(): void;
}

interface ISearchModalState {
}

export default class SearchModal extends React.Component<ISearchModalProps, ISearchModalState> {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} top={20} width={600} onCloseRequest={this.props.onCloseRequest}>
        <SearchBox autoFocus={true} onIssueSelect={this.props.onIssueSelect} />
      </Modal>
    );
  }
}
