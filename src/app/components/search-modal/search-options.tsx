import * as React from 'react';
import Input from '../input';

require('./search-options.less');

interface ISearchOptionsProps {
  autoFocus: boolean;
  onQueryChange(query: string): void;
}

interface ISearchOptionsState {
  query?: string;
}

export default class SearchOptions extends React.Component<ISearchOptionsProps, ISearchOptionsState> {
  constructor() {
    super();

    this.handleQueryChange = this.handleQueryChange.bind(this);

    this.state = {};
  }

  private handleQueryChange(value: string) {
    this.props.onQueryChange(value);

    this.setState({
      query: value,
    });
  }

  render() {
    return (
      <div className="search-options component">
        <Input className="query" placeholder="Search issues, milestones, projects, users..." value={this.state.query} autoFocus={this.props.autoFocus} onChange={this.handleQueryChange} />
      </div>
    );
  }
};
