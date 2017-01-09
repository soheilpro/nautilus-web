import * as React from 'react';

require('./search-options.less');

interface ISearchOptionsProps {
  onQueryChange(query: string): void;
}

interface ISearchOptionsState {
  query?: string;
}

export default class SearchOptions extends React.Component<ISearchOptionsProps, ISearchOptionsState> {
  constructor() {
    super();

    this.handleQueryChange = this.handleQueryChange.bind(this);

    this.state = {
      query: '',
    };
  }

  private handleQueryChange(event: React.FormEvent<HTMLInputElement>) {
    let query = (event.target as HTMLInputElement).value;

    this.props.onQueryChange(query);

    this.setState({
      query: query,
    });
  }

  render() {
    return (
      <div className="search-options component">
        <input type="text" placeholder="Search issues, milestones, projects, users..." className="query" value={this.state.query} autoFocus={true} onChange={this.handleQueryChange} />
      </div>
    );
  }
};
