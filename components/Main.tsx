import { h } from 'hyperapp';

import { AppActions } from '../actions';
import { AppState } from '../store';
import { Footer } from './Footer';
import { Grid } from './Grid';
import { Header } from './Header';

export const Main = (state: AppState, actions: AppActions) => (
  <main>
    <Header {...state} />
    <Grid {...state} select={actions.select} />
    <Footer newGame={actions.newGame} />
  </main>
);
