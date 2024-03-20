import React from 'react';
import { TableBase } from './tableBase';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import type {
  StyleSettingsMap,
  Threshold,
  TimeSeriesDataQuery,
  Viewport,
} from '@iot-app-kit/core';
import { UseCollectionOptions } from '@cloudscape-design/collection-hooks';
import { TableColumnDefinition, TableItem, TableItemHydrated } from './types';
import { createTableItems } from './createTableItems';
import { DEFAULT_TABLE_MESSAGES } from './messages';
import { TableProps as TableBaseProps } from '@cloudscape-design/components';
import { useTheme } from '../../hooks/useTheming';

const DEFAULT_VIEWPORT: Viewport = { duration: '10m' };

export const Table = ({
  queries,
  viewport: passedInViewport,
  thresholds = [],
  columnDefinitions,
  propertyFiltering,
  items,
  sorting,
  styles,
  significantDigits,
  paginationEnabled,
  pageSize,
  ...props
}: {
  columnDefinitions: TableColumnDefinition[];
  queries: TimeSeriesDataQuery[];
  items: TableItem[];
  thresholds?: Threshold[];
  sorting?: UseCollectionOptions<TableItemHydrated>['sorting'];
  propertyFiltering?: UseCollectionOptions<TableItemHydrated>['propertyFiltering'];
  viewport?: Viewport;
  styles?: StyleSettingsMap;
  significantDigits?: number;
  paginationEnabled?: boolean;
  pageSize?: number;
} & Pick<
  TableBaseProps,
  | 'resizableColumns'
  | 'sortingDisabled'
  | 'stickyHeader'
  | 'empty'
  | 'preferences'
>) => {
  useTheme({
    mode: 'dark',
    tokens: {
      colorBackgroundButtonNormalActive: 'red',
      colorBackgroundButtonNormalDefault: 'green',
      colorBackgroundButtonNormalDisabled: 'blue',
      colorBackgroundButtonNormalHover: 'purple',
      colorBackgroundButtonPrimaryActive: 'orange',
      colorBackgroundButtonPrimaryDisabled: 'cyan',
      colorBackgroundButtonPrimaryHover: 'magenta',
      borderRadiusButton: '2px',
      borderRadiusContainer: '2px',
      borderRadiusDropdown: '2px',
      borderRadiusInput: '2px',
      colorBorderButtonNormalActive: '#02f0fc',
      colorBorderButtonNormalDefault: '#920ea9',
      colorBorderButtonNormalDisabled: '#0cf714',
      colorBorderButtonNormalHover: '#f2da03',
      colorBorderButtonPrimaryDisabled: '#d80505',
      colorTextButtonNormalActive: '#02f0fc',
      colorTextButtonNormalDefault: '#920ea9',
      colorTextButtonNormalHover: '#0cf714',
      colorTextButtonPrimaryActive: '#f2da03',
      colorTextButtonPrimaryDefault: '#d80505',
      colorTextButtonPrimaryHover: '#1f5ce0',
    },
  });
  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: passedInViewport,
    queries,
    // Currently set to only fetch raw data.
    // TODO: Support all resolutions and aggregation types
    settings: { fetchMostRecentBeforeEnd: true, resolution: '0' },
    styles,
  });
  const { viewport } = useViewport();
  const allThresholds = [...queryThresholds, ...thresholds];

  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group
  const itemsWithData = createTableItems(
    {
      dataStreams,
      items,
      viewport: utilizedViewport,
      thresholds: allThresholds,
    },
    DEFAULT_TABLE_MESSAGES
  );

  return (
    <TableBase
      {...props}
      items={itemsWithData}
      sorting={sorting}
      columnDefinitions={columnDefinitions}
      propertyFiltering={propertyFiltering}
      messageOverrides={DEFAULT_TABLE_MESSAGES}
      precision={significantDigits}
      paginationEnabled={paginationEnabled}
      pageSize={pageSize}
    />
  );
};
