import * as React from 'react';
import { IProject } from '../../application';
import { ServiceManager } from '../../services';
import InclusionFilterDropdown from './inclusion-filter-dropdown';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueFilterProps {
}

interface IIssueFilterState {
  projects?: IProject[];
}

export default class IssueFilter extends React.Component<IIssueFilterProps, IIssueFilterState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.state = {
      projects: []
    };
  }

  async componentDidMount() {
    this.setState({
      projects: await this.application.projects.getAll(),
    });
  }

  render() {
    return (
      <div className="issue-filter-component">
        <InclusionFilterDropdown title="Project" items={this.state.projects} displayProperty="name" />
      </div>
    );
  }
};
