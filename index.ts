import { app } from 'hyperapp';
import { times } from 'ramda';

import { actions } from './actions';
import { Main } from './components/Main';

import './styles/app.scss';

export interface CellValue {
  id: number;
  value: 0 | 1 | 2;
}

export interface AppState {
  cols: number;
  rows: number;
  cells: CellValue[];
  player: 1 | 2;
}

const cols = 7;
const rows = 6;

const initialState: AppState = {
  cols,
  rows,
  cells: times<CellValue>(id => ({ id, value: 0 }), cols * rows),
  player: 1
};

app(initialState, actions, Main, document.body);
