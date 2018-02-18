import { h } from 'hyperapp';
import { splitEvery } from 'ramda';

const Cell = ({ value, id, select }) => (
  <td class={'cell'} onclick={() => select(id)} data-value={value}>
    {value}
  </td>
);

const Grid = ({ cols, cells, select }) => {
  const cellList = cells.map(cell => <Cell {...cell} select={select} />);
  return <table>{splitEvery(cols, cellList).map(cs => <tr>{cs}</tr>)}</table>;
};

export const Main = (state, actions) => (
  <main>
    <h1>Connect Four</h1>
    <Grid {...state} select={actions.select} />
  </main>
);
