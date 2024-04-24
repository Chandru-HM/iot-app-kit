import React from 'react';
import { render, screen } from '@testing-library/react';
import { GaugeBase } from './gaugeBase';
import type { DataPoint } from '@iot-app-kit/core';

describe('name', () => {
  it('renders name when showName is true', () => {
    const someName = 'some-name';
    render(<GaugeBase name={someName} settings={{ showName: false }} />);

    expect(screen.queryByText(someName)).not.toBeNull();
  });

  it('does not render name when showName is false', () => {
    const someName = 'some-name';
    render(<GaugeBase name={someName} settings={{ showName: false }} />);

    expect(screen.queryByText(someName)).toBeNull();
  });
});

describe('unit', () => {
  const point: DataPoint = { x: 1213, y: 123 };

  it('renders unit when showUnit is true and provided a property point', () => {
    const someUnit = 'some-Unit';
    render(
      <GaugeBase
        unit={someUnit}
        propertyPoint={point}
        settings={{ showUnit: true }}
      />
    );

    expect(screen.getByTestId('gauge-name-and-unit').textContent).toContain(
      someUnit
    );
  });

  it('does not render unit when showUnit is true and is not provided a data point', () => {
    const someUnit = 'some-Unit';
    render(<GaugeBase unit={someUnit} settings={{ showUnit: true }} />);

    expect(screen.queryByText(someUnit)).toBeNull();
  });

  it('does not render unit when showUnit is false', () => {
    const someUnit = 'some-Unit';
    render(
      <GaugeBase
        unit={someUnit}
        settings={{ showUnit: false }}
        propertyPoint={point}
      />
    );

    expect(screen.queryByText(someUnit)).toBeNull();
  });
});

describe('data quality', () => {
  const goodQualityPoint: DataPoint = { x: 1213, y: 123, quality: 'GOOD' };
  const badQualityPoint: DataPoint = { x: 1213, y: 123, quality: 'BAD' };
  const uncertainQualityPoint: DataPoint = {
    x: 1213,
    y: 123,
    quality: 'UNCERTAIN',
  };
  const undefinedQualityPoint: DataPoint = { x: 1213, y: 123 };

  it('renders quality when showDataQuality is true and provided a property point with bad quality', () => {
    render(
      <GaugeBase
        propertyPoint={badQualityPoint}
        settings={{ showDataQuality: true }}
      />
    );

    expect(screen.queryByText('Bad quality')).toBeDefined();
  });

  it('renders quality when showDataQuality is true and provided a property point with uncertain quality', () => {
    render(
      <GaugeBase
        propertyPoint={uncertainQualityPoint}
        settings={{ showDataQuality: true }}
      />
    );

    expect(screen.queryByText('Uncertain quality')).toBeDefined();
  });

  it('does not render quality when showDataQuality is true and it is a good quality point', () => {
    render(
      <GaugeBase
        propertyPoint={goodQualityPoint}
        settings={{ showDataQuality: true }}
      />
    );

    expect(screen.queryByTestId('data-quality-text')).toBeNull();
  });

  it('does not render quality if the point quality is not defined', () => {
    render(
      <GaugeBase
        propertyPoint={undefinedQualityPoint}
        settings={{ showDataQuality: true }}
      />
    );

    expect(screen.queryByTestId('data-quality-text')).toBeNull();
  });

  it('does not render quality when showDataQuality is false', () => {
    render(
      <GaugeBase
        propertyPoint={badQualityPoint}
        settings={{ showDataQuality: false }}
      />
    );

    expect(screen.queryByText('Bad quality')).toBeNull();
  });
});

describe('property value', () => {
  it('renders property points y value', () => {
    const Y_VALUE = 123445;
    render(
      <GaugeBase
        propertyPoint={{ x: new Date().getTime(), y: Y_VALUE }}
        settings={{ showName: false }}
      />
    );
    expect(screen.queryByText(Y_VALUE)).not.toBeNull();
  });
});

describe('timestamp', () => {
  const PROPERTY_POINT_DATE = new Date(2000, 0, 0);

  it('renders property timestamp when showTimestamp is true', () => {
    render(
      <GaugeBase
        propertyPoint={{ x: PROPERTY_POINT_DATE.getTime(), y: 123123 }}
        settings={{ showTimestamp: true }}
      />
    );

    expect(
      screen.queryByText(PROPERTY_POINT_DATE.toLocaleString())
    ).not.toBeNull();
  });

  it('does not render property timestamp when showTimestamp is false', () => {
    render(
      <GaugeBase
        propertyPoint={{ x: PROPERTY_POINT_DATE.getTime(), y: 123123 }}
        settings={{ showTimestamp: false }}
      />
    );

    expect(screen.queryByText(PROPERTY_POINT_DATE.toLocaleString())).toBeNull();
  });
});

describe('error', () => {
  it('renders error', () => {
    const someError = 'some-error';
    render(<GaugeBase error={someError} settings={{}} />);

    expect(screen.queryByText(someError)).not.toBeNull();
  });
});

describe('loading', () => {
  it('renders loading spinner while isLoading is true', () => {
    render(<GaugeBase isLoading settings={{}} />);

    expect(screen.queryByTestId('loading')).not.toBeNull();
  });

  it('does not render loading spinner while isLoading is false', () => {
    render(<GaugeBase isLoading={false} settings={{}} />);

    expect(screen.queryByTestId('loading')).toBeNull();
  });

  it('renders error while loading', () => {
    const someError = 'some-error';
    render(<GaugeBase error={someError} isLoading settings={{}} />);

    expect(screen.queryByText(someError)).not.toBeNull();
  });

  it('does not render data point while isLoading is true', () => {
    const point = { x: 12341, y: 123213 };
    render(<GaugeBase propertyPoint={point} isLoading settings={{}} />);

    expect(screen.queryByText(point.y)).toBeNull();
  });

  it('does not render timestamp while loading and showTimestamp is true', () => {
    const DATE = new Date(2001, 0, 0);
    render(
      <GaugeBase
        propertyPoint={{ x: DATE.getTime(), y: 123123 }}
        isLoading
        settings={{ showTimestamp: true }}
      />
    );

    expect(screen.queryByText(DATE.toLocaleString())).toBeNull();
  });
});
