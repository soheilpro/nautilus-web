import * as React from 'react';
import { IMilestone } from '../../application';
import SidField from '../sid-field';

interface IMilestoneSidFieldProps {
  milestone: IMilestone;
  bold?: boolean;
}

interface IMilestoneSidFieldState {
}

export default class MilestoneSidField extends React.PureComponent<IMilestoneSidFieldProps, IMilestoneSidFieldState> {
  render() {
    return (
      <SidField sid={this.props.milestone.sid} bold={this.props.bold} />
    );
  }
};
