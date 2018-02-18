import { app } from 'hyperapp';
import { flatten, times } from 'ramda';

import { actions } from './actions';
import { Main } from './components/Main';

import './styles/app.scss';

type PlayerId = 1 | 2;

export interface CellValue {
  col: number;
  row: number;
  value: 0 | PlayerId;
}

export interface AppState {
  cols: number;
  rows: number;
  cells: CellValue[];
  player: PlayerId;
}

const cols = 7;
const rows = 6;

const buildCellInfo = (row: number) => (col: number): CellValue => ({ row, col, value: 0 });

const initialState: AppState = {
  cols,
  rows,
  cells: flatten<CellValue>(times(c => times(buildCellInfo(c), cols), rows)),
  player: 1
};

app(initialState, actions, Main, document.body);
