import { h } from 'hyperapp';
import { splitEvery } from 'ramda';

import { AppActions } from '../actions';
import { CellValue } from '../index';

interface CellProps extends CellValue {
  select: AppActions['select'];
}

const Cell = ({ value, id, select }: CellProps) => (
  <td class={'cell'} onclick={() => select(id)} data-value={value}>
    {value}
  </td>
);

interface GridProps {
  cols: number;
  cells: CellValue[];
  select: AppActions['select'];
}

export const Grid = ({ cols, cells, select }: GridProps) => {
  const cellList = cells.map(cell => <Cell {...cell} select={select} />);
  return <table>{splitEvery(cols, cellList).map(cs => <tr>{cs}</tr>)}</table>;
};
