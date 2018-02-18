import * as R from 'ramda';

import { AppState, CellValue } from './index';

export interface AppActions {
  select: (cellId: number) => (state: AppState) => AppState;
}

const buildLensCell: (cellId: number) => (cells: CellValue[]) => R.Lens = cellId =>
  R.compose(R.lensIndex, R.findIndex(R.propEq('id', cellId)));

const updateCell = (player: AppState['player']) => (cell: CellValue): CellValue => ({
  ...cell,
  value: cell.value === 0 ? player : cell.value
});

export const actions: AppActions = {
  select: cellId => state => {
    const lensCell = buildLensCell(cellId);
    const { cells, player } = state;

    return {
      ...state,
      player: player === 1 ? 2 : 1,
      cells: R.over(lensCell(cells), updateCell(player), cells)
    };
  }
};
