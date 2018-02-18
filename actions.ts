import * as R from 'ramda';

import { AppState, CellValue } from './index';

const onlyMatchedCellsOfColumn = col => R.allPass([R.propEq('col', col), R.propEq('value', 0)]);

const matchCell = (cell: CellValue): R.Pred =>
  R.allPass([R.propEq('col', cell.col), R.propEq('row', cell.row)]);

const findCellIndex = (cells: CellValue[]) => (cell: CellValue): number =>
  R.findIndex(matchCell(cell), cells);

const sortByHigherRow = (cells: CellValue[]): CellValue[] =>
  R.sortBy<CellValue>(R.prop('row'), cells);

const invalidCell: CellValue = {
  col: Infinity,
  row: Infinity,
  value: 0
};

const lastCellInRow = (cells: CellValue[]): CellValue => {
  const lastCell = R.last(cells);
  return R.isNil(lastCell) ? invalidCell : lastCell;
};

const cellIndexInColumn = (col: number, cells: CellValue[]): number => {
  const filterCells = R.filter<CellValue>(onlyMatchedCellsOfColumn(col));
  const cellIndex = findCellIndex(cells);
  return cellIndex(lastCellInRow(sortByHigherRow(filterCells(cells))));
};

const updateCell = (player: AppState['player']) => (cell?: CellValue): CellValue => {
  if (R.isNil(cell)) {
    return invalidCell;
  } else {
    return {
      ...cell,
      value: cell.value === 0 ? player : cell.value
    };
  }
};

export interface AppActions {
  select: (col: number) => (state: AppState) => AppState;
}

export const actions: AppActions = {
  select: col => state => {
    const cellIndex = cellIndexInColumn(col, state.cells);

    if (cellIndex < 0) {
      return state;
    } else {
      return {
        ...state,
        player: state.player === 1 ? 2 : 1,
        cells: R.over(R.lensIndex(cellIndex), updateCell(state.player), state.cells)
      };
    }
  }
};
