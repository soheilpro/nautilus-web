import * as React from 'react';
import { Nautilus, IMilestone, entityComparer } from '../nautilus';
import { MilestoneList } from './milestone-list';

interface IMilestonesState {
  milestones?: IMilestone[];
}

export class Milestones extends React.Component<{}, IMilestonesState> {
  constructor() {
    super();

    this.state = {
      milestones: []
    };
  }

  componentDidMount() {
    this.setState({
      milestones: this.getFilteredMilestones()
    });

    Nautilus.Instance.on('milestoneAdded', (milestone) => {
      this.setState({
        milestones: this.getFilteredMilestones()
      })
    });

    Nautilus.Instance.on('milestoneChanged', (milestone) => {
      this.setState({
        milestones: this.getFilteredMilestones()
      })
    });

    Nautilus.Instance.on('milestoneDeleted', () => {
      this.setState({
        milestones: this.getFilteredMilestones()
      })
    });

    Mousetrap.bind('ctrl+n', (event: KeyboardEvent) => {
      this.addMilestone();
      event.preventDefault();
    });
  }

  addMilestone() {
    Nautilus.Instance.addMilestone({} as IMilestone);
  }

  getFilteredMilestones() {
    return Nautilus.Instance.getMilestones();
  }

  render() {
    return (
      <div>
        <div style={{marginBottom: '20px'}} className='row'>
          <div className='columns'>
            <button title='Ctrl+N' className="button-primary" onClick={this.addMilestone.bind(this)}>Add Milestone</button>
          </div>
        </div>
        <div className='row'>
          <div className='six columns'>
            <MilestoneList milestones={this.state.milestones} />
          </div>
          <div className='six columns' style={{minHeight: '1px'}}>
          </div>
        </div>
      </div>
    );
  }
};
