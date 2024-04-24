import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { Gauge } from './gauge';

const VIEWPORT = { duration: '5m' };

const LATEST_VALUE = 123.2;
const DATA_STREAM = {
  id: 'abc-1',
  data: [{ x: new Date(2000, 0, 0).getTime(), y: LATEST_VALUE }],
  resolution: 0,
  name: 'some name',
  unit: 'mph',
};

it('renders', async () => {
  const query = mockTimeSeriesDataQuery([
    {
      dataStreams: [DATA_STREAM],
      viewport: VIEWPORT,
      thresholds: [],
    },
  ]);

  render(<Gauge query={query} viewport={VIEWPORT} />);

  expect(screen.getByTestId('gauge-name-and-unit').textContent).toContain(
    DATA_STREAM.name
  );
  expect(screen.getByTestId('gauge-name-and-unit').textContent).toContain(
    DATA_STREAM.unit
  );
  expect(screen.getByTestId('gauge-value').textContent).toContain(
    `${DATA_STREAM.data[0].y} `
  );
  expect(screen.getByTestId('gauge-timestamp').textContent).toContain(
    new Date(DATA_STREAM.data[0].x).toLocaleString()
  );
});
