import * as React from 'react';
import * as classNames from 'classnames';
import { IItemState } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IItemStateSelectProps {
  itemKind: string;
  itemState: IItemState;
  className?: string;
  onChange(itemState: IItemState): void;
}

interface IItemStateSelectState {
  itemStates?: IItemState[];
}

export default class ItemStateSelect extends React.Component<IItemStateSelectProps, IItemStateSelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      itemStates: [],
    };
  }

  componentDidMount() {
    this.setState({
      itemStates: this.application.itemStates.getAll(this.props.itemKind),
    });
  }

  private handleSelectChange(itemState: IItemState) {
    this.props.onChange(itemState);
  }

  render() {
    return (
      <Select className={classNames('item-state-select-component', this.props.className)} selectedItem={this.props.itemState} items={this.state.itemStates} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
