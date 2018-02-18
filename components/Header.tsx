import { h } from 'hyperapp';

import { AppState } from '../index';

interface HeaderProps {
  player: AppState['player'];
}

export const Header = ({ player }: HeaderProps) => (
  <header>
    <h1>Connect Four</h1>
    <p>Your turn player: {player}</p>
  </header>
);
