import { Maybe, maybe } from 'folktale';
import * as R from 'ramda';

import { AppState, CellValue } from './index';

export interface AppActions {
  select: (col: number) => (state: AppState) => AppState;
}

const matchCell = (cell: CellValue): R.Pred =>
  R.allPass([R.propEq('col', cell.col), R.propEq('row', cell.row)]);

const findCellIndex = (cells: CellValue[]) => (cell: CellValue): Maybe<number> => {
  const index = R.findIndex(matchCell(cell), cells);
  return index < 0 ? maybe.Nothing() : maybe.Just(index);
};

const sortByHigherRow = (cells: CellValue[]): CellValue[] =>
  R.sortBy<CellValue>(R.prop('row'), cells);

const lastCellInRow = (cells: CellValue[]): Maybe<CellValue> => maybe.fromNullable(R.last(cells));

const maybeEmpty = <T>(xs: T[]): Maybe<T[]> => (R.isEmpty(xs) ? maybe.Nothing() : maybe.Just(xs));

const matchColAndEmptyness = (col: number): R.Pred =>
  R.allPass([R.propEq('col', col), cell => cell.value.equals(maybe.Nothing())]);

const filterCellsAvailable = (col: number, cells: CellValue[]) =>
  R.filter<CellValue>(matchColAndEmptyness(col), cells);

const cellIndexInColumn = (col: number, cells: CellValue[]): Maybe<number> => {
  return maybeEmpty(filterCellsAvailable(col, cells))
    .map(sortByHigherRow)
    .chain(lastCellInRow)
    .chain(findCellIndex(cells));
};

const updateCell = (player: AppState['player']) => (cell?: CellValue): CellValue | null => {
  return maybe
    .fromNullable(cell)
    .map(validCell => ({ ...validCell, value: maybe.Just(player) }))
    .getOrElse(null);
};

export const actions: AppActions = {
  select: col => state => {
    const { player, cells } = state;

    return cellIndexInColumn(col, cells)
      .map(cellIndex => R.lensIndex(cellIndex))
      .map(lens => [R.view(lens, cells), lens])
      .chain(([cell, lens]: [CellValue | undefined, R.Lens]) =>
        maybe.fromNullable(cell).map(_ => R.over(lens, updateCell(player), cells))
      )
      .map((updatedCells: CellValue[]): AppState => ({
        ...state,
        cells: updatedCells,
        player: state.player === 1 ? 2 : 1
      }))
      .getOrElse(state);
  }
};
