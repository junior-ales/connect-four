import { h } from 'hyperapp';
import { splitEvery } from 'ramda';

import { AppActions } from '../actions';
import { CellValue } from '../index';

interface CellProps extends CellValue {
  select: AppActions['select'];
}

// TODO Folktale maybe.fold is wrongly declared. As soon as it is
// fixed change this to value.fold(R.always(0), R.idendity)
const getDataValue = (value: CellValue['value']): 0 | 1 | 2 =>
  value.matchWith({ Just: data => data.value, Nothing: (): 0 => 0 });

const Cell = ({ col, row, value, select }: CellProps) => (
  <td class={'cell'} onclick={() => select(col)} data-value={getDataValue(value)}>
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
  return <table>{splitEvery(cols, cellList).map(cs => <tr>{cs}</tr>)}</table>;
};
