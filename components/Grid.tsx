import { h } from 'hyperapp';
import { always, identity, splitEvery } from 'ramda';

import { AppActions } from '../actions';
import { CellValue } from '../store';

interface CellProps extends CellValue {
  select: AppActions['select'];
}

const Cell = ({ col, row, value, select }: CellProps) => (
  <td class={'cell'} onclick={() => select(col)} data-value={value.fold(always(0), identity)}>
    {col}
    {row}
  </td>
);

interface GridProps {
  cols: number;
  cells: CellValue[];
  select: AppActions['select'];
}

export const Grid = ({ cols, cells, select }: GridProps) => {
  const cellList = cells.map(cell => <Cell {...cell} select={select} />);
  return (
    <table class={'grid'}>
      {splitEvery(cols, cellList).map(cs => <tr class={'grid-row'}>{cs}</tr>)}
    </table>
  );
};
