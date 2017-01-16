import * as React from 'react';
import { IIssue } from '../../application';
import Window from '../window';
import SearchBox from './search-box';

interface ISearchWindowProps {
  isOpen: boolean;
  onIssueSelect(issue: IIssue): void;
  onCloseRequest(): void;
}

interface ISearchWindowState {
}

export default class SearchWindow extends React.Component<ISearchWindowProps, ISearchWindowState> {
  render() {
    return (
      <Window isOpen={this.props.isOpen} top={20} width={600} onCloseRequest={this.props.onCloseRequest}>
        <SearchBox autoFocus={true} onIssueSelect={this.props.onIssueSelect} />
      </Window>
    );
  }
}
