import { h } from 'hyperapp';

import { AppActions } from '../actions';

interface FooterProps {
  newGame: AppActions['newGame'];
}

export const Footer = ({ newGame }: FooterProps) => (
  <footer class={'footer'}>
    <button class={'new-game'} onclick={() => newGame()}>
      New Game
    </button>
  </footer>
);
