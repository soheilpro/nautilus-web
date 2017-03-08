import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { IIssue } from '../../application';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';
import Window from '../window';
import Input from '../input';

require('../../assets/stylesheets/base.less');
require ('./index.less');

export interface ISearchResult {
  key: string;
  type: string;
  item: IIssue;
}

interface ISearchWindowProps {
  onIssueSelect(issue: IIssue): void;
}

interface ISearchWindowState {
  searchResults?: ISearchResult[];
  selectedSearchResultIndex?: number;
  searchText?: string;
}

export default class SearchWindow extends React.Component<ISearchWindowProps, ISearchWindowState> {
  private application = ServiceManager.Instance.getApplication();
  private counter = 0;

  constructor() {
    super();

    this.handleContainerKeyDown = this.handleContainerKeyDown.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleSearchResultMouseEnter = this.handleSearchResultMouseEnter.bind(this);
    this.handleSearchResultClick = this.handleSearchResultClick.bind(this);

    this.state = {
      selectedSearchResultIndex: 0,
    };
  }

  private onSearchResultSelect(searchResult: ISearchResult) {
    switch (searchResult.type) {
      case 'Issue':
        this.props.onIssueSelect(searchResult.item);
        break;

      default:
        throw new Error('Not supported.');
    }
  }

  private handleContainerKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      if (this.state.searchResults) {
        this.setState({
          selectedSearchResultIndex: this.state.selectedSearchResultIndex < this.state.searchResults.length - 1 ? this.state.selectedSearchResultIndex + 1 : 0,
        });
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      if (this.state.searchResults) {
        this.setState({
          selectedSearchResultIndex: this.state.selectedSearchResultIndex > 0 ? this.state.selectedSearchResultIndex - 1 : this.state.searchResults.length - 1,
        });
      }
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.state.searchResults && this.state.searchResults.length > 0) {
        const searchResult = this.state.searchResults[this.state.selectedSearchResultIndex];
        this.onSearchResultSelect(searchResult);
      }
    }
  }

  private async handleSearchInputChange(value: string) {
    this.counter++;

    this.setState({
      searchText: value,
    });

    value = value.trim();

    if (!value) {
      this.setState({
        searchResults: undefined,
      });

      return;
    }

    const counter = this.counter;
    const searchResults = await this.search(value);

    // Display results only if no other search has been performed in the meantime
    if (counter !== this.counter)
      return;

    this.setState({
      searchResults,
      selectedSearchResultIndex: 0,
    });
  }

  private handleSearchResultMouseEnter(searchResult: ISearchResult) {
    this.setState({
      selectedSearchResultIndex: this.state.searchResults.indexOf(searchResult),
    });
  }

  private handleSearchResultClick(searchResult: ISearchResult, event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    this.onSearchResultSelect(searchResult);
  }

  private async search(query: string) {
    const issues = await this.application.items.searchIssues(query);

    return issues.map(issue => {
      return {
        key: issue.id,
        type: 'Issue',
        item: issue,
      };
    });
  }

  private renderSearchResult(searchResult: ISearchResult) {
    if (searchResult.type === 'Issue') {
      const issue = searchResult.item as IIssue;

      return (
        <div className="issue">
          <span className="sid">{issue.sid}</span>
          <span className="title">{issue.title}</span>
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <Window className="search-window-component">
        <div className="container" onKeyDown={this.handleContainerKeyDown}>
          <Input className="search-input" placeholder="Search issues, milestones, projects, users..." value={this.state.searchText} autoFocus={true} onChange={this.handleSearchInputChange} />
          {
            this.state.searchResults ?
              this.state.searchResults.length > 0 ?
                <div className="search-result-list">
                  {
                    this.state.searchResults.map((searchResult, index) => {
                      return (
                        <a className={classNames('search-result', {'selected': index === this.state.selectedSearchResultIndex})} href="#" onClick={_.partial(this.handleSearchResultClick, searchResult)} onMouseEnter={_.partial(this.handleSearchResultMouseEnter, searchResult)} key={searchResult.key}>
                          {this.renderSearchResult(searchResult)}
                        </a>
                      );
                    })
                  }
                </div>
                :
                <div className="no-search-results-found">
                  No results found.
                </div>
              :
              <div className="search-help">
                Try searching for an issue's title or its id.
              </div>
          }
        </div>
      </Window>
    );
  }
}
