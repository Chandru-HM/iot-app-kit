import React, { useMemo } from 'react';
import { DataStreamInformation, TrendCursor } from './types';
import Table from '@cloudscape-design/components/table';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { createTableLegendColumnDefinitions } from './columnDefinitions/factory';
import { ChartLegend, ChartOptions } from '../../types';

import './table.css';

type ChartLegendTableOptions = ChartLegend & {
  datastreams: DataStreamInformation[];
  trendCursors: TrendCursor[];
  significantDigits: ChartOptions['significantDigits'];
};

export const ChartLegendTable = ({
  datastreams,
  trendCursors,
  visible,
  position,
  width,
  visibleContent,
  significantDigits,
}: ChartLegendTableOptions) => {
  const { items, collectionProps } = useCollection(datastreams, {
    sorting: {},
  });

  const columnDefinitions = useMemo(
    () =>
      createTableLegendColumnDefinitions({
        trendCursors,
        width: Number(width),
        visibleContent,
        significantDigits,
      }),
    [width, trendCursors, visibleContent, significantDigits]
  );

  if (!visible) return null;

  return (
    <div
      className='base-chart-legend-table-container'
      style={
        position === 'right' ? { padding: `0 16px 0 0` } : { padding: '0 16px' }
      }
    >
      <Table
        {...collectionProps}
        items={items}
        columnDefinitions={columnDefinitions}
        stickyColumns={{ first: 1, last: 0 }}
        stickyHeader
        trackBy='id'
        variant='embedded'
        preferences={<></>}
        contentDensity='compact'
      />
    </div>
  );
};
