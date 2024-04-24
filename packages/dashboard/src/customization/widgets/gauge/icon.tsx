import React from 'react';
import { default as KPISvg } from './gauge.svg';
import { default as KPISvgDark } from './gauge-dark.svg';
import WidgetIcon from '../components/widgetIcon';

const GaugeIcon = () => {
  return (
    <WidgetIcon widget='gauge' defaultIcon={KPISvg} darkIcon={KPISvgDark} />
  );
};

export default GaugeIcon;
