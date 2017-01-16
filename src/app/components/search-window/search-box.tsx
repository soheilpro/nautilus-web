import * as React from 'react';
import { IIssue } from '../../application';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';
import { ISearchResult } from './isearch-result';
import SearchGuide from './search-guide';
import SearchOptions from './search-options';
import SearchResultList from './search-result-list';

require ('./search-box.less');

interface ISearchBoxProps {
  autoFocus: boolean;
  onIssueSelect(issue: IIssue): void;
}

interface ISearchBoxState {
  searchResults?: ISearchResult[];
  selectedSearchResultIndex?: number;
}

export default class SearchBox extends React.Component<ISearchBoxProps, ISearchBoxState> {
  private application = ServiceManager.Instance.getApplication();
  private counter = 0;

  constructor() {
    super();

    this.handleContainerKeyDown = this.handleContainerKeyDown.bind(this);
    this.handleOptionsQueryChange = this.handleOptionsQueryChange.bind(this);
    this.handleSearchResultListSearchResultSelect = this.handleSearchResultListSearchResultSelect.bind(this);

    this.state = {};
  }

  private onSearchResultSelect(searchResult: ISearchResult) {
    switch (searchResult.type) {
      case 'Issue':
        this.props.onIssueSelect(searchResult.item);
        break;

      default:
        throw new Error('Not implemented.');
    }
  }

  private handleContainerKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      if (this.state.selectedSearchResultIndex < this.state.searchResults.length - 1) {
        this.setState({
          selectedSearchResultIndex: this.state.selectedSearchResultIndex + 1
        });
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      if (this.state.selectedSearchResultIndex > 0) {
        this.setState({
          selectedSearchResultIndex: this.state.selectedSearchResultIndex - 1
        });
      }
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.state.searchResults.length > 0) {
        let searchResult = this.state.searchResults[this.state.selectedSearchResultIndex];
        this.onSearchResultSelect(searchResult);
      }
    }
  }

  private async handleOptionsQueryChange(query: string) {
    this.counter++;

    query = query.trim();

    if (!query) {
      this.setState({
        searchResults: undefined,
      });

      return;
    }

    let counter = this.counter;
    let searchResults = await this.search(query);

    // Display results only if no other search has been performed in the meantime
    if (counter !== this.counter)
      return;

    this.setState({
      searchResults: searchResults,
      selectedSearchResultIndex: 0,
    });
  }

  private async search(query: string) {
    let issues = await this.application.issues.search(query);

    return issues.map(issue => {
      return {
        key: issue.id,
        type: 'Issue',
        item: issue,
      };
    });
  }

  private handleSearchResultListSearchResultSelect(searchResult: ISearchResult) {
    this.onSearchResultSelect(searchResult);
  }

  render() {
    return (
      <div className="search-box component">
        <div className="container" onKeyDown={this.handleContainerKeyDown}>
          <div className="options">
            <SearchOptions autoFocus={this.props.autoFocus} onQueryChange={this.handleOptionsQueryChange} />
          </div>
          {
            this.state.searchResults ?
              <SearchResultList searchResults={this.state.searchResults} selectedSearchResultIndex={this.state.selectedSearchResultIndex} onSearchResultSelect={this.handleSearchResultListSearchResultSelect} />
              :
              <SearchGuide />
          }
        </div>
      </div>
    );
  }
}
