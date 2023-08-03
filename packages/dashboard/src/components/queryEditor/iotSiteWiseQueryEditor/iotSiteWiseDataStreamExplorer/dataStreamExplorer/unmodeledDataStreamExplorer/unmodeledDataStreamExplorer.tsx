import { useCollection } from '@cloudscape-design/collection-hooks';
import Box from '@cloudscape-design/components/box';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import PropertyFilter from '@cloudscape-design/components/property-filter';
import Table from '@cloudscape-design/components/table';
import React from 'react';

import { useTimeSeriesDataStreams } from '../useTimeSeries';
import { useLatestValues, isSuccessValue, isErrorValue } from '../useLatestValues';

import { useExplorerPreferences } from '../../../../useExplorerPreferences';
import type { WithIoTSiteWiseClient } from '../../../../types';
import { POLLING_INTERVAL } from '../constants';
import { SelectedDataStream } from '../../../types';

export interface UnmodeledDataStreamExplorerProps extends WithIoTSiteWiseClient {
  selectedDataStreams: SelectedDataStream[];
  onSelect: (dataStreams: SelectedDataStream[]) => void;
}

export function UnmodeledDataStreamExplorer({ selectedDataStreams, client }: UnmodeledDataStreamExplorerProps) {
  const [preferences, setPreferences] = useExplorerPreferences({
    defaultVisibleContent: ['name', 'latestValue'],
    resourceName: 'asset property',
  });

  const { timeSeriesDataStreams } = useTimeSeriesDataStreams({
    client,
  });
  const { latestValues } = useLatestValues({
    isEnabled:
      preferences.visibleContent.includes('latestValue') || preferences.visibleContent.includes('latestValueTime'),
    assetProperties: timeSeriesDataStreams,
    pollingInterval: POLLING_INTERVAL,
    client,
  });

  const assetPropertiesWithLatestValues = timeSeriesDataStreams.map((timeSeries) => {
    const latestValue = latestValues.find((v) => v.propertyId === timeSeries && v.assetId === property.assetId);

    if (latestValue == null) {
      return {
        ...property,
        latestValue: 'No data',
        latestValueTime: undefined,
      };
    }

    if (isSuccessValue(latestValue)) {
      return {
        ...property,
        latestValue: latestValue.value,
        latestValueTime: new Date((latestValue.timestamp?.timeInSeconds ?? 0) * 1000),
      };
    }

    if (isErrorValue(latestValue)) {
      return {
        ...property,
        latestValue: latestValue.errorMessage,
        latestValueTime: undefined,
      };
    }

    return {
      ...property,
      latestValue: 'No data',
      latestValueTime: undefined,
    };
  });

  const { items, collectionProps, paginationProps, propertyFilterProps } = useCollection(
    assetPropertiesWithLatestValues,
    {
      propertyFiltering: {
        filteringProperties: [
          {
            key: 'id',
            propertyLabel: 'ID',
            groupValuesLabel: 'Property IDs',
            operators: ['=', '!=', ':', '!:'],
          },
          {
            key: 'alias',
            propertyLabel: 'Alias',
            groupValuesLabel: 'Property aliases',
            operators: ['=', '!=', ':', '!:'],
          },
          {
            key: 'name',
            propertyLabel: 'Name',
            groupValuesLabel: 'Property names',
            operators: ['=', '!=', ':', '!:'],
          },
          {
            key: 'assetName',
            propertyLabel: 'Asset name',
            groupValuesLabel: 'Asset names',
            operators: ['=', '!=', ':', '!:'],
          },
          {
            key: 'dataType',
            propertyLabel: 'Data type',
            groupValuesLabel: 'Data types',
            operators: ['=', '!=', ':', '!:'],
          },
          {
            key: 'dataTypeSpec',
            propertyLabel: 'Data type spec',
            groupValuesLabel: 'Data type specs',
            operators: ['=', '!=', ':', '!:'],
          },
          {
            key: 'unit',
            propertyLabel: 'Unit',
            groupValuesLabel: 'Units',
            operators: ['=', '!=', ':', '!:'],
          },
          {
            key: 'latestValue',
            propertyLabel: 'Latest value',
            groupValuesLabel: 'Latest values',
            operators: ['=', '!=', '>', '>=', '<', '<='],
          },
        ],
      },
      pagination: { pageSize: preferences.pageSize },
      selection: {
        trackBy: (item) => `${item.assetId}---${item.id}`,
        defaultSelectedItems: selectedDataStreams as unknown as typeof assetPropertiesWithLatestValues,
      },
      sorting: {},
    }
  );

  return (
    <Table
      {...collectionProps}
      items={items}
      header={<Header variant='h3'>Asset properties</Header>}
      resizableColumns
      columnDefinitions={[
        {
          id: 'id',
          header: 'ID',
          cell: ({ id }) => id,
        },
        {
          id: 'alias',
          header: 'Alias',
          cell: ({ alias }) => alias,
          sortingField: 'alias',
        },
        {
          id: 'name',
          header: 'Name',
          cell: ({ name }) => name,
          sortingField: 'name',
        },
        {
          id: 'latestValue',
          header: 'Latest value',
          cell: ({ latestValue }) => latestValue,
          sortingField: 'latestValue',
        },
        {
          id: 'latestValueTime',
          header: 'Latest value time',
          cell: ({ latestValueTime }) => latestValueTime?.toLocaleDateString(),
          sortingField: 'latestValueTime',
        },
        {
          id: 'assetName',
          header: 'Asset name',
          cell: ({ assetName }) => assetName,
          sortingField: 'assetName',
        },
        {
          id: 'dataType',
          header: 'Data type',
          cell: ({ dataType }) => dataType,
          sortingField: 'dataType',
        },
        {
          id: 'dataTypeSpec',
          header: 'Data type spec',
          cell: ({ dataTypeSpec }) => dataTypeSpec,
          sortingField: 'dataTypeSpec',
        },
        {
          id: 'unit',
          header: 'Unit',
          cell: ({ unit }) => unit,
          sortingField: 'unit',
        },
      ]}
      variant='embedded'
      loading={isFetchingAssetProperties}
      loadingText='Loading asset properties...'
      stickyColumns={preferences.stickyColumns}
      selectionType='multi'
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No asset properties.</b>

          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            {selectedDataStreams.length === 0
              ? 'Select an asset to see its properties.'
              : 'No properties found for selected asset(s).'}
          </Box>
        </Box>
      }
      pagination={<Pagination {...paginationProps} />}
      filter={
        <PropertyFilter
          {...propertyFilterProps}
          filteringLoadingText='Loading suggestions'
          filteringErrorText='Error fetching suggestions.'
          filteringRecoveryText='Retry'
          filteringFinishedText='End of results'
          filteringEmpty='No suggestions found'
          i18nStrings={{
            filteringAriaLabel: 'your choice',
            dismissAriaLabel: 'Dismiss',
            filteringPlaceholder: 'Filter asset properties by text, property or value',
            groupValuesText: 'Values',
            groupPropertiesText: 'Properties',
            operatorsText: 'Operators',
            operationAndText: 'and',
            operationOrText: 'or',
            operatorLessText: 'Less than',
            operatorLessOrEqualText: 'Less than or equal',
            operatorGreaterText: 'Greater than',
            operatorGreaterOrEqualText: 'Greater than or equal',
            operatorContainsText: 'Contains',
            operatorDoesNotContainText: 'Does not contain',
            operatorEqualsText: 'Equals',
            operatorDoesNotEqualText: 'Does not equal',
            editTokenHeader: 'Edit filter',
            propertyText: 'Property',
            operatorText: 'Operator',
            valueText: 'Value',
            cancelActionText: 'Cancel',
            applyActionText: 'Apply',
            allPropertiesLabel: 'All properties',
            tokenLimitShowMore: 'Show more',
            tokenLimitShowFewer: 'Show fewer',
            clearFiltersText: 'Clear filters',
            removeTokenButtonAriaLabel: (token) => `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
            enteredTextLabel: (text) => `Use: "${text}"`,
          }}
        />
      }
      visibleColumns={preferences.visibleContent}
      stripedRows={preferences.stripedRows}
      wrapLines={preferences.wrapLines}
      preferences={
        <CollectionPreferences
          title='Asset property preferences'
          confirmLabel='Confirm'
          cancelLabel='Cancel'
          preferences={preferences}
          onConfirm={({ detail }) => {
            setPreferences(detail as typeof preferences);
          }}
          pageSizePreference={{
            title: 'Select page size',
            options: [
              { value: 10, label: '10' },
              { value: 25, label: '25' },
              { value: 100, label: '100' },
              { value: 250, label: '250' },
            ],
          }}
          wrapLinesPreference={{
            label: 'Wrap lines',
            description: 'Select to see all the text and wrap the lines',
          }}
          stripedRowsPreference={{
            label: 'Striped rows',
            description: 'Select to add alternating shaded rows',
          }}
          visibleContentPreference={{
            title: 'Select visible content',
            options: [
              {
                label: `Asset property fields`,
                options: [
                  { id: 'id', label: 'ID' },
                  { id: 'alias', label: 'Alias' },
                  { id: 'name', label: 'Name' },
                  { id: 'latestValue', label: 'Latest values' },
                  { id: 'latestValueTime', label: 'Latest value times' },
                  { id: 'assetName', label: 'Asset name' },
                  { id: 'dataType', label: 'Data type' },
                  { id: 'dataTypeSpec', label: 'Data type spec' },
                  { id: 'unit', label: 'Unit' },
                ],
              },
            ],
          }}
        />
      }
    />
  );
}
