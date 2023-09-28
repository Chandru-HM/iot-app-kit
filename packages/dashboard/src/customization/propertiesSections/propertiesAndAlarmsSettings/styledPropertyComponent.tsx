import React, { useState } from 'react';
import {
  Button,
  SpaceBetween,
  Box,
  ExpandableSection,
  Checkbox,
  Toggle,
  FormField,
  Input,
} from '@cloudscape-design/components';
import ColorPicker from '../shared/colorPicker';
import type { FC } from 'react';

import './propertyComponent.css';
import { StyledAssetPropertyQuery, YAxisOptions } from '~/customization/widgets/types';
import { getPropertyDisplay } from './getPropertyDetails';
import type { AssetSummary } from '../../../hooks/useAssetDescriptionQueries';
import { StatusEyeHidden, StatusEyeVisible } from './icons';
import { CancelableEventHandler } from '@cloudscape-design/components/internal/events';
import {
  colorBackgroundHomeHeader,
  colorBackgroundLayoutMain,
  colorBorderButtonNormalDisabled,
  spaceScaledM,
  spaceScaledS,
  spaceScaledXxxs,
  spaceStaticXs,
} from '@cloudscape-design/design-tokens';

const YAxisPropertyConfig = ({
  resetStyles,
  property,
  onUpdate,
}: {
  resetStyles: (reset: object) => void;
  property: StyledAssetPropertyQuery;
  onUpdate: (newStyles: object) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [useGlobalStyle, setUseGlobalStyle] = useState(Object.keys(property.yAxis ?? {}).length == 0);

  const onToggleUseGlobalStyles = (isChecked: boolean) => {
    setUseGlobalStyle(isChecked);
    isChecked && resetStyles({ yAxis: undefined });
  };

  const onToggleControls = (hasControls: boolean) => {
    onToggleUseGlobalStyles(false);
    onUpdate({ yAxis: { ...property.yAxis, visible: hasControls } });
  };

  const onUpdateYAxis = (newYAxis: YAxisOptions) => {
    onToggleUseGlobalStyles(false);
    onUpdate({ yAxis: newYAxis });
  };

  return (
    <ExpandableSection expanded={expanded} onChange={({ detail }) => setExpanded(detail.expanded)} headerText='Y-axis'>
      <SpaceBetween size='m'>
        <Checkbox onChange={({ detail }) => onToggleUseGlobalStyles(detail.checked)} checked={useGlobalStyle}>
          Use default style
        </Checkbox>
        <Toggle checked={!!property.yAxis?.visible} onChange={({ detail }) => onToggleControls(detail.checked)}>
          Show Y-axis controls
        </Toggle>
        <FormField description='Leave empty to auto-calculate based on all the values' label='Range'>
          <SpaceBetween size='m' direction='horizontal'>
            <SpaceBetween size='s' direction='horizontal'>
              <label htmlFor='y-axis-min'>Min</label>
              <Input
                disabled={!property.yAxis?.visible}
                placeholder='Auto'
                controlId='y-axis-min'
                value={`${property.yAxis?.yMin ?? ''}`}
                type='number'
                onChange={({ detail }) => onUpdateYAxis({ ...property.yAxis, yMin: parseInt(detail.value) })}
              />
            </SpaceBetween>
            <SpaceBetween size='s' direction='horizontal'>
              <label htmlFor='y-axis-max'>Max</label>
              <Input
                disabled={!property.yAxis?.visible}
                placeholder='Auto'
                controlId='y-axis-max'
                value={`${property.yAxis?.yMax ?? ''}`}
                type='number'
                onChange={({ detail }) => onUpdateYAxis({ ...property.yAxis, yMax: parseInt(detail.value) })}
              />
            </SpaceBetween>
          </SpaceBetween>
        </FormField>
      </SpaceBetween>
    </ExpandableSection>
  );
};

export type StyledPropertyComponentProps = {
  updateStyle: (newStyles: object) => void;
  assetSummary: AssetSummary;
  property: StyledAssetPropertyQuery;
  onHideAssetQuery: () => void;
  onDeleteAssetQuery?: () => void;
  colorable: boolean;
  isPropertyVisible: boolean;
};

export const StyledPropertyComponent: FC<StyledPropertyComponentProps> = ({
  assetSummary,
  property,
  updateStyle,
  onHideAssetQuery,
  onDeleteAssetQuery,
  colorable,
  isPropertyVisible,
}) => {
  const { display, label } = getPropertyDisplay(property.propertyId, assetSummary);
  const tooltipStyle = {
    fontSize: spaceScaledM,
    color: colorBackgroundHomeHeader,
    backgroundColor: colorBackgroundLayoutMain,
    padding: `${spaceScaledS} ${spaceScaledM}`,
    borderRadius: spaceStaticXs,
    borderWidth: spaceScaledXxxs,
    borderColor: colorBorderButtonNormalDisabled,
    boxShadow: `${spaceScaledXxxs} ${spaceScaledXxxs} ${spaceScaledXxxs} ${colorBorderButtonNormalDisabled}`,
  };
  const [expanded, setExpanded] = useState(isPropertyVisible);
  const resetStyles = (styleToReset: object) => {
    updateStyle(styleToReset); // as we add more sections, reset style values here
  };

  const onHideAssetQuerytest = (e) => {
    e.stopPropagation();
    onHideAssetQuery();
  };

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };

  const YAxisHeader = (
    <SpaceBetween size='s' direction='horizontal'>
      {colorable && display === 'property' && (
        <ColorPicker color={property.color || ''} updateColor={(newColor) => updateStyle({ color: newColor })} />
      )}
      <div style={{ fontWeight: 'normal' }}>{label}</div>
      <div>
        <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Button
            onClick={onHideAssetQuerytest}
            variant='icon'
            iconSvg={
              !expanded
                ? isPropertyVisible
                  ? StatusEyeVisible
                  : StatusEyeHidden
                : !isPropertyVisible
                ? StatusEyeVisible
                : StatusEyeHidden
            }
          />
        </span>
      </div>

      {/* <div className='palette-component-icon'>
        <Icon />
        <span className='tooltiptext' style={tooltipStyle}>
          Test
        </span>
      </div> */}
      <Button onClick={onDeleteAssetQuery} variant='icon' iconName='remove' />
    </SpaceBetween>
  );

  return (
    <div className='property-display'>
      <div className='property-display-summary'>
        <SpaceBetween size='xxxs'>
          <Box padding={{ top: 'xxs' }}>
            <SpaceBetween size='xs' direction='horizontal'>
              <ExpandableSection headerText={YAxisHeader}>
                <div style={{ padding: '0 24px', backgroundColor: '#fbfbfb' }}>
                  <YAxisPropertyConfig resetStyles={resetStyles} onUpdate={updateStyle} property={property} />
                </div>
              </ExpandableSection>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </div>
    </div>
  );
};
