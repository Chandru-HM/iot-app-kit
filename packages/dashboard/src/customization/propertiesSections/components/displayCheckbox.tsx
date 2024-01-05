import type { FC } from 'react';
import React from 'react';
import FormField from '@cloudscape-design/components/form-field';
import { checkboxConsts } from '../constants';
import Checkbox, { CheckboxProps } from '@cloudscape-design/components/checkbox';
import { ChartLegend } from '~/customization/widgets/types';
import { NonCancelableCustomEvent } from '@cloudscape-design/components/internal/events';

type DisplayCheckboxProps = {
  visibleContent?: ChartLegend['visibleContent'];
  onChange: (visibleContent: ChartLegend['visibleContent']) => void;
};

const { legendDisplaylist } = checkboxConsts.legendDisplay;

export const DisplayCheckbox: FC<DisplayCheckboxProps> = ({ visibleContent, onChange }) => {
  const handleVisibleChange = (key: string, event: NonCancelableCustomEvent<CheckboxProps.ChangeDetail>) => {
    onChange({ ...visibleContent, [key]: event.detail.checked });
  };

  return (
    <FormField label='Display'>
      {legendDisplaylist.map(({ label, value }) => (
        <Checkbox
          onChange={(e) => {
            handleVisibleChange(value, e);
          }}
          checked={visibleContent ? visibleContent[value as keyof ChartLegend['visibleContent']] : true}
        >
          {label}
        </Checkbox>
      ))}
    </FormField>
  );
};
