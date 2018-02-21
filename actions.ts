import { Maybe, maybe } from 'folktale';
import * as R from 'ramda';

import { AppState, CellValue, PlayerId } from './index';

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

const sortCellsByColAndRow = (cells: CellValue[]) =>
  R.sortWith<CellValue>([R.ascend(R.prop('col')), R.ascend(R.prop('row'))], cells);

const cellValueOrDefault = (cell: CellValue): 0 | PlayerId =>
  cell.value.fold(R.always<0>(0), R.identity);

// the cells are ordered by row so we just need to get their values here
const allCellValues: (cells: CellValue[]) => string = R.compose(
  R.join(''),
  R.map(cellValueOrDefault)
);

const cellValuesOrderedByColumn: (cells: CellValue[]) => string = R.compose(
  allCellValues,
  sortCellsByColAndRow
);

// necessary to remove false positives
const dropInvalidCorners: (s: string) => string = R.compose(
  (s: string) => R.dropLast(6, s),
  (s: string) => R.drop(6, s)
);

const cellValuesOrderedByTopDownDiagonal: (cells: CellValue[]) => string = R.compose(
  dropInvalidCorners,
  cellValuesOrderedByColumn,
  R.map(cell => (cell.row === 0 ? cell : { ...cell, col: cell.col - cell.row }))
);

const cellValuesOrderedByBottomUpDiagonal: (cells: CellValue[]) => string = R.compose(
  dropInvalidCorners,
  cellValuesOrderedByColumn,
  R.map(cell => (cell.row === 0 ? cell : { ...cell, col: cell.col + cell.row }))
);

const matchWinner: (values: string) => Maybe<PlayerId[]> = R.cond([
  [R.test(/1111/), () => maybe.Just([1])],
  [R.test(/2222/), () => maybe.Just([2])],
  [R.T, () => maybe.Nothing()]
]);

const matchWinnerInRow = (state: AppState): Maybe<PlayerId[]> => {
  const [m, ...ms] = R.map(matchWinner, R.splitEvery(state.cols, allCellValues(state.cells)));
  return R.reduce((prev, curr) => prev.concat(curr), m, ms);
};

const updateWinner = (state: AppState): AppState =>
  matchWinnerInRow(state)
    .concat(matchWinner(cellValuesOrderedByColumn(state.cells)))
    .concat(matchWinner(cellValuesOrderedByTopDownDiagonal(state.cells)))
    .concat(matchWinner(cellValuesOrderedByBottomUpDiagonal(state.cells)))
    .map((ids: PlayerId[]) => R.head(ids))
    .map(winner => ({ ...state, winner: maybe.Just(winner) }))
    .getOrElse(state);

export const actions: AppActions = {
  select: col => state => {
    const { player, cells, winner } = state;

    return winner.matchWith({
      Just: _ => state,
      Nothing: () =>
        cellIndexInColumn(col, cells)
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
          .map(updateWinner)
          .getOrElse(state)
    });
  }
};
