import React from 'react';
// import { default as barSvg } from './bar.svg';
import { default as barSvgDark } from './bar-dark.svg';
// import { StatusEyeVisible } from './icons';

const BarIcon: React.FC = () => (
  <span>
    {/* <img src={StatusEyeVisible} alt='Bar widget light icon' /> */}
    <img src={barSvgDark} alt='Bar widget dark icon' />
  </span>
);

export default BarIcon;
