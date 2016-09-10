import * as React from 'react';
import { Nautilus, IMilestone, entityComparer } from '../nautilus';
import { MilestoneList } from './milestone-list';
import { KeyMaster, Key, isNotInInput } from '../keymaster'

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

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      KeyMaster.handle(event, { which: Key.N }, isNotInInput.bind(this), this.addMilestone.bind(this));
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
        <div className='row action-bar'>
          <div className='columns'>
            <button title='Shortcut: N' className="button-primary" onClick={this.addMilestone.bind(this)}><i className='fa fa-plus' aria-hidden='true'></i> Add Milestone</button>
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
