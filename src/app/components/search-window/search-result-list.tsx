import _ from 'underscore';
import React from 'react';
import classNames from 'classnames';
import { IIssue } from '../../application';
import { ISearchResult } from './isearch-result';

require('../../assets/stylesheets/base.less');
require('./search-result-list.less');

interface ISearchResultListProps {
  searchResults: ISearchResult[];
  selectedSearchResultIndex: number;
  onSearchResultSelect(searchResult: ISearchResult): void;
}

interface ISearchResultListState {
}

export default class SearchResultList extends React.Component<ISearchResultListProps, ISearchResultListState> {
  constructor() {
    super();

    this.handleSearchResultClick = this.handleSearchResultClick.bind(this);
  }

  private handleSearchResultClick(searchResult: ISearchResult) {
    this.props.onSearchResultSelect(searchResult);
  }

  private renderSearchResult(searchResult: ISearchResult) {
    if (searchResult.type === 'Issue') {
      let issue = searchResult.item as IIssue;

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
      <div className="search-result-list-component">
        {
          this.props.searchResults.length > 0 ?
            <div className="search-results">
              {
                this.props.searchResults.map((searchResult, index) => {
                  return (
                    <a className={classNames('search-result', {'selected': index === this.props.selectedSearchResultIndex})} onClick={_.partial(this.handleSearchResultClick, searchResult)} key={searchResult.key}>
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
        }
      </div>
    );
  }
};
