import * as React from 'react';
import { Nautilus, IProject, entityComparer } from '../nautilus';
import { Nav } from './nav';
import { ProjectList } from './project-list';
import { KeyMaster, Key, isNotInInput } from '../keymaster'

interface IProjectsState {
  projects?: IProject[];
}

export class Projects extends React.Component<{}, IProjectsState> {
  constructor() {
    super();

    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    this.setState({
      projects: this.getFilteredProjects()
    });

    Nautilus.Instance.on('projectAdded', (project) => {
      this.setState({
        projects: this.getFilteredProjects()
      })
    });

    Nautilus.Instance.on('projectChanged', (project) => {
      this.setState({
        projects: this.getFilteredProjects()
      })
    });

    Nautilus.Instance.on('projectDeleted', () => {
      this.setState({
        projects: this.getFilteredProjects()
      })
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      KeyMaster.handle(event, { which: Key.N }, isNotInInput.bind(this), this.addProject.bind(this));
    });
  }

  addProject() {
    Nautilus.Instance.addProject({} as IProject);
  }

  getFilteredProjects() {
    return Nautilus.Instance.getProjects();
  }

  render() {
    return (
      <div>
        <Nav />
        <div className='row action-bar'>
          <div className='columns'>
            <button title='Shortcut: N' className="button-primary" onClick={this.addProject.bind(this)}><i className='fa fa-plus' aria-hidden='true'></i> Add Project</button>
          </div>
        </div>
        <div className='row'>
          <div className='six columns'>
            <ProjectList projects={this.state.projects} />
          </div>
          <div className='six columns' style={{minHeight: '1px'}}>
          </div>
        </div>
      </div>
    );
  }
};
