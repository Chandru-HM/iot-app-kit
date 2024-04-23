import React from 'react';
import GaugeWidgetComponent from './component';
import KPIIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { GaugeWidget } from '../types';
import {
  KPI_WIDGET_INITIAL_HEIGHT,
  KPI_WIDGET_INITIAL_WIDTH,
} from '../constants';

export const gaugePlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<GaugeWidget>('gauge', {
      render: (widget) => <GaugeWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Gauge',
        icon: KPIIcon,
      },
      properties: () => ({
        queryConfig: {
          source: 'iotsitewise',
          query: undefined,
        },
        showName: true,
        showUnit: true,
        yMin: 0,
        yMax: 100,
        thresholds: [
          {
            value: 30,
            id: 'abc',
            color: '#1e8103',
            comparisonOperator: 'GT',
          },
          {
            value: 70,
            id: 'xyz',
            color: '#ed7211',
            comparisonOperator: 'GT',
          },
          {
            value: 100,
            id: 'xyz',
            color: '#d13211',
            comparisonOperator: 'GT',
          },
        ],
        significantDigits: 4,
      }),
      initialSize: {
        height: KPI_WIDGET_INITIAL_HEIGHT,
        width: KPI_WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
