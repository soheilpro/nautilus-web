import * as React from 'react';
import { KeyMaster, Key } from '../keymaster'

// GridHeaderCell

interface IGridHeaderCellProps {
}

interface IGridHeaderCellState {
}

export class GridHeaderCell extends React.Component<IGridHeaderCellProps, IGridHeaderCellState> {
}

// GridCell

interface IGridCellProps {
  item: any;
  rowIndex: number;
  columnIndex: number;
  isSelected: boolean;
}

interface IGridCellState {
}

export abstract class GridCell extends React.Component<IGridCellProps, IGridCellState> {
  copyFrom(sourceCell: GridCell){
  }

  handleKeyDown(event: KeyboardEvent){
  }
}

// GridColumn

export interface IGridColumn {
  key: string;
  HeaderCell: typeof GridHeaderCell;
  Cell: typeof GridCell;
}

// GridHeaderRow

interface IGridHeaderRowProps {
  columns: IGridColumn[];
}

interface IGridHeaderRowState {
}

export class GridHeaderRow extends React.Component<IGridHeaderRowProps, IGridHeaderRowState> {
  render() {
    return (
      <tr>
        {
          this.props.columns.map((column: IGridColumn, columnIndex: number) =>
            <th className={column.key} key={column.key}>
              <column.HeaderCell />
            </th>
          )
        }
      </tr>
    );
  }
}

// GridRow

interface IGridRowProps {
  columns: IGridColumn[];
  item: any;
  rowIndex: number;
  isSelected: boolean;
  selectedColumnIndex: number;
  onCellClick(rowIndex: number, columnIndex: number): void;
}

interface IGridRowState {
}

interface IGridRow extends React.Component<IGridRowProps, IGridRowState> {
  getCell(columnIndex: number): GridCell;
  handleKeyDown(event: KeyboardEvent): void;
}

export class GridRow extends React.Component<IGridRowProps, IGridRowState> implements IGridRow {
  private trElement: HTMLElement;
  private cellElements: GridCell[] = [];

  static keyForItem(item: any): string {
    throw new Error('Not Implemented');
  }

  shouldComponentUpdate(nextProps: IGridRowProps, nextState: IGridRowState) {
    return this.props.isSelected || nextProps.isSelected;
  }

  componentDidMount() {
    if (this.props.isSelected)
      (this.trElement.children[this.props.selectedColumnIndex] as HTMLElement).focus();
  }

  componentDidUpdate() {
    if (this.props.isSelected)
      (this.trElement.children[this.props.selectedColumnIndex] as HTMLElement).focus();
  }

  getCell(columnIndex: number) {
    return this.cellElements[columnIndex];
  }

  handleClick(event: MouseEvent) {
    if ((event.target as HTMLElement).nodeName === 'INPUT')
      return;

    var columnIndex = parseInt((event.currentTarget as HTMLElement).dataset['columnIndex'], 10);
    this.props.onCellClick(this.props.rowIndex, columnIndex);
  }

  handleKeyDown(event: KeyboardEvent) {
    this.cellElements[this.props.selectedColumnIndex].handleKeyDown(event);
  }

  render() {
    return (
      <tr className={this.props.isSelected ? 'selected' : ''} ref={e => this.trElement = e}>
        {
          this.props.columns.map((column: IGridColumn, columnIndex: number) =>
            <td tabIndex='0' className={column.key + ' ' + (this.props.isSelected && this.props.selectedColumnIndex == columnIndex ? 'selected' : '')} onClick={this.handleClick.bind(this)} data-column-index={columnIndex} key={column.key}>
              <column.Cell item={this.props.item} rowIndex={this.props.rowIndex} columnIndex={columnIndex} isSelected={this.props.isSelected && this.props.selectedColumnIndex === columnIndex} ref={(e: GridCell) => this.cellElements[columnIndex] = e} />
            </td>
          )
        }
      </tr>
    );
  }
}

// Grid

interface IGridProps {
  HeaderRow: typeof GridHeaderRow;
  Row: typeof GridRow;
  columns: IGridColumn[];
  items: any[];
  horizontalDirection?: 'leftToRight' | 'rightToLeft';
  verticalOrder?: 'normal' | 'reversed';
  selectedRowIndex?: number;
  selectedColumnIndex?: number;
  onRowSelectionChange?(rowIndex: number): void;
  onRowDeletionRequest?(item: any): boolean;
}

interface IGridState {
  selectedRowIndex?: number;
  selectedColumnIndex?: number;
}

interface IGrid extends React.Component<IGridProps, IGridState> {
}

export class Grid extends React.Component<IGridProps, IGridState> implements IGrid {
  private tableElement: HTMLElement;
  private rowElements: GridRow[] = [];

  static get defaultProps() {
    return {
      horizontalDirection: 'leftToRight',
      verticalOrder: 'normal'
    };
  }

  constructor() {
    super();

    this.state = {
      selectedRowIndex: 0,
      selectedColumnIndex: 0
    }
  }

  componentWillReceiveProps(nextProps: IGridProps) {
    var newState: IGridState = {};

    if (nextProps.selectedRowIndex !== undefined)
      newState.selectedRowIndex = nextProps.selectedRowIndex;

    if (nextProps.selectedColumnIndex !== undefined)
      newState.selectedColumnIndex = nextProps.selectedColumnIndex

    this.setState(newState);
  }

  componentDidMount() {
    $(this.tableElement).on('focusin', (e) => {
      $(this.tableElement).addClass('focus');
    })

    $(this.tableElement).on('focusout', (e) => {
      $(this.tableElement).removeClass('focus');
    })
  }

  private handleCellClick(rowIndex: number, columnIndex: number) {
    this.selectCell(rowIndex, columnIndex);
  }

  private handleTableKeyDown(event: KeyboardEvent) {
    var isInTD = (event.target as HTMLElement).nodeName === 'TD';

    // We want to responsd to Tab and Shift+Tab even when we're in a child element of TD
    KeyMaster.handle(event, { which: Key.Tab, shiftKey: false }, null, this.handleKeyTab.bind(this), isInTD);
    KeyMaster.handle(event, { which: Key.Tab, shiftKey: true }, null, this.handleKeyShiftTab.bind(this), isInTD);

    if (!isInTD)
      return;

    KeyMaster.handle(event, { which: Key.UpArrow }, null, this.handleKeyUp.bind(this));
    KeyMaster.handle(event, { which: Key.DownArrow }, null, this.handleKeyDown.bind(this));
    KeyMaster.handle(event, { which: Key.LeftArrow }, null, this.handleKeyLeft.bind(this));
    KeyMaster.handle(event, { which: Key.RightArrow }, null, this.handleKeyRight.bind(this));
    KeyMaster.handle(event, { which: Key.Delete }, null, this.handleKeyDelete.bind(this));
    KeyMaster.handle(event, { which: Key.SingleQuote }, null, this.handleKeySingleQuote.bind(this));

    this.rowElements[this.state.selectedRowIndex].handleKeyDown(event);
  }

  private handleKeyTab(event: KeyboardEvent) {
    if (this.state.selectedColumnIndex === this.props.columns.length - 1) {
      if (this.state.selectedRowIndex < this.props.items.length - 1)
        return this.selectCell(this.state.selectedRowIndex + 1, 0);
    }
    else {
      return this.selectNextCell();
    }

    return false;
  }

  private handleKeyShiftTab(event: KeyboardEvent) {
    if (this.state.selectedColumnIndex === 0) {
      if (this.state.selectedRowIndex > 0)
        return this.selectCell(this.state.selectedRowIndex - 1, this.props.columns.length - 1);
    }
    else {
      return this.selectPreviousCell();
    }

    return false;
  }

  private handleKeyUp(event: KeyboardEvent) {
    return this.selectCellAbove();
  }

  private handleKeyDown(event: KeyboardEvent) {
    return this.selectCellBelow();
  }

  private handleKeyLeft(event: KeyboardEvent) {
    return this.selectCellLeft();
  }

  private handleKeyRight(event: KeyboardEvent) {
    return this.selectCellRight();
  }

  private handleKeyDelete(event: KeyboardEvent) {
    return this.props.onRowDeletionRequest(this.props.items[this.state.selectedRowIndex]);
  }

  private handleKeySingleQuote(event: KeyboardEvent) {
    var sourceRowIndex: number;

    if (this.props.verticalOrder === 'normal') {
      if (this.state.selectedRowIndex === 0)
        return;

      sourceRowIndex = this.state.selectedRowIndex - 1;
    }
    else if (this.props.verticalOrder === 'reversed') {
      if (this.state.selectedRowIndex === this.props.items.length - 1)
        return;

      sourceRowIndex = this.state.selectedRowIndex + 1;
    }
    else {
      throw new Error('Not Supported');
    }

    var sourceCell = this.rowElements[sourceRowIndex].getCell(this.state.selectedColumnIndex);
    var destinationCell = this.rowElements[this.state.selectedRowIndex].getCell(this.state.selectedColumnIndex);

    destinationCell.copyFrom(sourceCell);
  }

  private selectCell(rowIndex: number, columnIndex: number) {
    this.setState({
      selectedRowIndex: rowIndex,
      selectedColumnIndex: columnIndex
    });

    if (this.state.selectedRowIndex != rowIndex)
      this.props.onRowSelectionChange(rowIndex);

    return true;
  }

  private selectCellAbove() {
    if (this.state.selectedRowIndex === 0)
      return false;

    return this.selectCell(this.state.selectedRowIndex - 1, this.state.selectedColumnIndex);
  }

  private selectCellBelow() {
    if (this.state.selectedRowIndex === this.props.items.length - 1)
      return false;

    return this.selectCell(this.state.selectedRowIndex + 1, this.state.selectedColumnIndex);
  }

  private selectNextCell() {
    if (this.state.selectedColumnIndex === this.props.columns.length - 1)
      return false;

    return this.selectCell(this.state.selectedRowIndex, this.state.selectedColumnIndex + 1);
  }

  private selectPreviousCell() {
    if (this.state.selectedColumnIndex === 0)
      return false;

    return this.selectCell(this.state.selectedRowIndex, this.state.selectedColumnIndex - 1);
  }

  private selectCellLeft() {
    if (this.props.horizontalDirection === 'leftToRight')
      return this.selectPreviousCell();

    if (this.props.horizontalDirection === 'rightToLeft')
      return this.selectNextCell();

    throw new Error('Not Supported');
  }

  private selectCellRight() {
    if (this.props.horizontalDirection === 'leftToRight')
      return this.selectNextCell();

    if (this.props.horizontalDirection === 'rightToLeft')
      return this.selectPreviousCell();

    throw new Error('Not Supported');
  }

  render() {
    var HeaderRow = this.props.HeaderRow;
    var Row = this.props.Row;

    return (
      <table className='grid' onKeyDown={this.handleTableKeyDown.bind(this)} ref={e => this.tableElement = e}>
        <thead>
          <HeaderRow columns={this.props.columns} />
        </thead>
        <tbody>
        {
          this.props.items.map((item, rowIndex) =>
            <Row columns={this.props.columns} item={item} rowIndex={rowIndex} isSelected={this.state.selectedRowIndex === rowIndex} selectedColumnIndex={this.state.selectedColumnIndex} onCellClick={this.handleCellClick.bind(this)} key={Row.keyForItem(item)} ref={e => this.rowElements[rowIndex] = e} />
          )
        }
        </tbody>
      </table>
    );
  }
};
