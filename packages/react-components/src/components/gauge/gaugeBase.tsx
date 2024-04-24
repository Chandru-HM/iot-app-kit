// eslint-disable-next-line import/default
import React, { useEffect } from 'react';
import omitBy from 'lodash.omitby';
import { useECharts, useLoadableEChart } from '../../hooks/useECharts';
import { GaugeBaseProperties, GaugeSettings } from './types';
import { useGaugeConfiguration } from './hooks/useGaugeConfiguration';
import { GaugeErrorText } from './gaugeErrorText';
import { GaugeDataQualityText } from './gaugeDataQualityText';
import { DEFAULT_GAUGE_SETTINGS } from './constants';
import './gauge.css';
import { getAggregationFrequency } from '../../utils/aggregationFrequency';
import {
  colorBackgroundButtonPrimaryDisabled,
  fontSizeBodyS,
} from '@cloudscape-design/design-tokens';

/**
 * Renders a base gauge component.
 *
 * @param {GaugeBaseProperties} propertyPoint - The property point object.
 * @param {Array} thresholds - The thresholds array.
 * @param {Object} settings - The settings object.
 * @param {string} unit - The unit string.
 * @param {string} name - The name string.
 * @param {boolean} isLoading - The isLoading boolean.
 * @param {number} significantDigits - The significantDigits number.
 * @param {Object} options - The options object.
 * @return {ReactElement} The rendered gauge component.
 */
export const GaugeBase: React.FC<GaugeBaseProperties> = ({
  size,
  propertyPoint,
  resolution,
  aggregationType,
  thresholds = [],
  settings,
  unit,
  name,
  isLoading,
  significantDigits,
  error,
  ...options
}) => {
  const {
    showAggregationAndResolution,
    showDataQuality,
    showTimestamp,
  }: GaugeSettings = {
    ...DEFAULT_GAUGE_SETTINGS,
    ...omitBy(settings, (x) => x == null),
  };
  const gaugeValue = propertyPoint?.y;
  const quality = propertyPoint?.quality;

  // Setup instance of echarts
  const { ref, chartRef } = useECharts(options?.theme);

  // apply loading animation to echart instance
  useLoadableEChart(chartRef, isLoading);

  useGaugeConfiguration(chartRef, {
    isLoading,
    thresholds,
    gaugeValue,
    name,
    settings,
    unit,
    significantDigits,
    error,
  });

  useEffect(() => {
    const chart = chartRef.current;
    chart?.resize({
      width: size?.width,
      height: size?.height,
    });
  }, [size, chartRef]);

  const point = propertyPoint;
  const aggregationResolutionString = getAggregationFrequency(
    resolution,
    aggregationType
  );

  return (
    <div
      className='gauge-base-container gauge-base'
      data-testid={
        !error ? 'gauge-base-component' : 'gauge-base-component-error'
      }
    >
      <div data-testid='gauge-base-component'>
        <div
          ref={ref}
          className='gauge-base'
          data-testid='kpi-name-and-unit'
          style={{
            width: size?.width,
            height: size?.height,
          }}
        />
        <GaugeErrorText error={error} />
        {!isLoading && showDataQuality && (
          <GaugeDataQualityText
            error={error}
            quality={quality}
            showName={settings?.showName}
          />
        )}
      </div>
      {point && (
        <div
          className='timestamp-container'
          style={{
            fontSize: fontSizeBodyS,
            // color: fontColor,
          }}
        >
          {showAggregationAndResolution && aggregationResolutionString && (
            <div className='aggregation' data-testid='gauge-aggregation'>
              {isLoading ? '-' : aggregationResolutionString}
            </div>
          )}
          {showTimestamp && (
            <>
              <div
                className='timestamp-border'
                style={{
                  backgroundColor: colorBackgroundButtonPrimaryDisabled,
                }}
              />
              <div className='timestamp' data-testid='gauge-timestamp'>
                {isLoading ? '-' : new Date(point.x).toLocaleString()}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
