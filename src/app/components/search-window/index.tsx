import * as React from 'react';
import { IIssue } from '../../application';
import Window from '../window';
import SearchBox from './search-box';

interface ISearchWindowProps {
  onIssueSelect(issue: IIssue): void;
}

interface ISearchWindowState {
}

export default class SearchWindow extends React.Component<ISearchWindowProps, ISearchWindowState> {
  render() {
    return (
      <Window>
        <SearchBox autoFocus={true} onIssueSelect={this.props.onIssueSelect} />
      </Window>
    );
  }
}
