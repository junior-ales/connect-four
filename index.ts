import { app } from 'hyperapp';

import { actions } from './actions';
import { Main } from './components/Main';
import { initialState } from './store';

import './styles/app.scss';

app(initialState, actions, Main, document.body);
