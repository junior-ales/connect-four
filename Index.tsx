import message from './message';

import { app, h } from 'hyperapp';

const initialState = {
  count: 0
};

const appActions = {
  down: value => state => ({ count: state.count - value }),
  up: value => state => ({ count: state.count + value })
};

const view = (state, actions) => (
  <div>
    <h1>{state.count}</h1>
    <button onclick={() => actions.down(1)}>-</button>
    <button onclick={() => actions.up(1)}>+</button>
  </div>
);

console.log(message); // tslint:disable-line

app(initialState, appActions, view, document.body);
