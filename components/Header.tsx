import { h } from 'hyperapp';

import { AppState } from '../store';

interface HeaderProps {
  player: AppState['player'];
  winner: AppState['winner'];
}

export const Header = ({ player, winner }: HeaderProps) => (
  <header class={'title'}>
    <h1>Connect Four</h1>
    {winner
      .map(w => <p class={'winner'}>YOU WON PLAYER {w}!!!</p>)
      .getOrElse(<p>Your turn player: {player}</p>)}
  </header>
);
