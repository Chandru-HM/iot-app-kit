import { ANOMALY_TOOLTIP } from '../constants';
import { ConfigurationOptions } from '../hooks/types';
import { AnomalyWidgetTooltipData, tooltipAsString } from '../tooltip';

import {
  colorBorderControlDefault,
  colorBackgroundContainerContent,
} from '@cloudscape-design/design-tokens';

export const convertTooltip = ({
  decimalPlaces,
  tooltipSort,
}: Pick<ConfigurationOptions, 'decimalPlaces' | 'tooltipSort'>) => ({
  ...ANOMALY_TOOLTIP,
  formatter: (data: AnomalyWidgetTooltipData[]) =>
    tooltipAsString({ data, decimalPlaces, tooltipSort }),
  borderColor: colorBorderControlDefault,
  backgroundColor: colorBackgroundContainerContent,
});