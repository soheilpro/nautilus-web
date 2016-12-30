import * as React from 'react';
import Modal from '../modal';
import SearchBox from './search-box';
import { ISearchResult } from './isearch-result';

interface ISearchModalProps {
  isOpen: boolean;
  onSearchResultSelect(searchResult: ISearchResult): void;
  onCloseRequest(): void;
}

interface ISearchModalState {
}

export default class SearchModal extends React.Component<ISearchModalProps, ISearchModalState> {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} onCloseRequest={this.props.onCloseRequest}>
        <SearchBox onSearchResultSelect={this.props.onSearchResultSelect} />
      </Modal>
    );
  }
}

export * from './isearch-result';
