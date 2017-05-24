import * as React from 'react';
import { IItem } from './iitem';

interface ITableRowProps {
  item: IItem;
  index: number;
  isSelected: boolean;
  onSelect?(): void;
  onAction?(): void;
}

interface ITableRowState {
}

export default class TableRow extends React.Component<ITableRowProps, ITableRowState> {
}
