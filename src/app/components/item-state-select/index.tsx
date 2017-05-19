import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { ItemKind, IItemState } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IItemStateSelectProps {
  itemKind: ItemKind;
  itemState: IItemState;
  className?: string;
  onChange(itemState: IItemState): void;
}

interface IItemStateSelectState {
  itemStates?: IItemState[];
}

export default class ItemStateSelect extends React.PureComponent<IItemStateSelectProps, IItemStateSelectState> {
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
      itemStates: _.sortBy(this.application.itemStates.getAll(this.props.itemKind), itemState => itemState.order),
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
