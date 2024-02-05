import {
  type BatchGetAssetPropertyValueRequest,
  type BatchGetAssetPropertyValueResponse,
  type BatchGetAssetPropertyValueHistoryRequest,
  type BatchGetAssetPropertyValueHistoryResponse,
  type BatchGetAssetPropertyAggregatesRequest,
  type BatchGetAssetPropertyAggregatesResponse,
  type AssetPropertyValue,
  type AggregatedValue,
  type AggregateType,
  Quality,
} from '@aws-sdk/client-iotsitewise';
import { faker } from '@faker-js/faker';
import { rest } from 'msw';
import {
  BATCH_GET_ASSET_PROPERTY_AGGREGATES_URL,
  BATCH_GET_ASSET_PROPERTY_VALUE_HISTORY_URL,
  BATCH_GET_ASSET_PROPERTY_VALUE_URL,
} from './constants';

type PartialAggregatedValue = Partial<Omit<AggregatedValue, 'value'>>;

export class AggregatedValueFactory {
  public create(
    aggregateType: AggregateType,
    partialAggregatedValue: PartialAggregatedValue = {}
  ): AggregatedValue {
    const aggregateTypeMap = {
      AVERAGE: 'average',
      COUNT: 'count',
      MAXIMUM: 'maximum',
      MINIMUM: 'minimum',
      STANDARD_DEVIATION: 'standardDeviation',
      SUM: 'sum',
    };

    const aggregatedValue = {
      ...this.#createDefaults(),
      ...partialAggregatedValue,
      value: {
        [aggregateTypeMap[aggregateType]]: faker.number.float({
          min: 0,
          max: 100,
        }),
      },
    };

    return aggregatedValue;
  }

  #createDefaults() {
    const quality = 'GOOD' as Quality;
    const timestamp = Date.now() as unknown as AggregatedValue['timestamp'];
    const defaults = { quality, timestamp };

    return defaults;
  }
}

type PartialAssetPropertyValue = Partial<Omit<AssetPropertyValue, 'value'>>;

export class AssetPropertyValueFactory {
  public createIntegerAssetPropertyValue(
    partialAssetPropertyValue: PartialAssetPropertyValue = {}
  ): AssetPropertyValue {
    const assetPropertyValue = {
      ...this.#createDefaults(),
      ...partialAssetPropertyValue,
      value: {
        integerValue: faker.number.int({ min: 0, max: 100 }),
      },
    };

    return assetPropertyValue;
  }

  public createDoubleAssetPropertyValue(
    partialAssetPropertyValue: PartialAssetPropertyValue = {}
  ): AssetPropertyValue {
    const assetPropertyValue = {
      ...this.#createDefaults(),
      ...partialAssetPropertyValue,
      value: {
        doubleValue: faker.number.float({ min: 0, max: 100, precision: 0.001 }),
      },
    };

    return assetPropertyValue;
  }

  public createBooleanAssetPropertyValue(
    partialAssetPropertyValue: PartialAssetPropertyValue = {}
  ): AssetPropertyValue {
    const assetPropertyValue = {
      ...this.#createDefaults(),
      ...partialAssetPropertyValue,
      value: {
        booleanValue: faker.datatype.boolean(),
      },
    };

    return assetPropertyValue;
  }

  public createStringAssetPropertyValue(
    partialAssetPropertyValue: PartialAssetPropertyValue = {}
  ): AssetPropertyValue {
    const assetPropertyValue = {
      ...this.#createDefaults(),
      ...partialAssetPropertyValue,
      value: {
        stringValue: faker.helpers.arrayElement(['ON', 'OFF']),
      },
    };

    return assetPropertyValue;
  }

  #createDefaults() {
    const quality = 'GOOD' as Quality;
    const timestamp = { timeInSeconds: Math.floor(Date.now() / 1000) };
    const defaults = { quality, timestamp };

    return defaults;
  }
}

export function batchGetAssetPropertyValueHandler() {
  return rest.post<
    BatchGetAssetPropertyValueRequest,
    Record<string, string>,
    BatchGetAssetPropertyValueResponse
  >(BATCH_GET_ASSET_PROPERTY_VALUE_URL, async (req, res, ctx) => {
    const { entries = [] } =
      await req.json<BatchGetAssetPropertyValueRequest>();

    const factory = new AssetPropertyValueFactory();
    const response = {
      successEntries: entries.map(({ entryId }) => ({
        entryId,
        assetPropertyValue: factory.createDoubleAssetPropertyValue(),
      })),
      skippedEntries: [],
      errorEntries: [],
      nextToken: undefined,
    } satisfies BatchGetAssetPropertyValueResponse;

    return res(ctx.delay(), ctx.status(200), ctx.json(response));
  });
}

function parseTimeInSecondsDate(date: number | Date) {
  // Parse date into Date object
  if (typeof date === 'number') {
    // date in type number are expressed in seconds
    date = new Date(date * 1000);
  }

  return date;
}

export function batchGetAssetPropertyValueHistoryHandler() {
  return rest.post(
    BATCH_GET_ASSET_PROPERTY_VALUE_HISTORY_URL,
    async (req, res, ctx) => {
      const { entries = [], maxResults = 20_000 } =
        await req.json<BatchGetAssetPropertyValueHistoryRequest>();
      const maxResultsPerEntry = Math.floor(maxResults / entries.length);

      const factory = new AssetPropertyValueFactory();
      const response: BatchGetAssetPropertyValueHistoryResponse = {
        successEntries: entries.map(
          ({ entryId, startDate = 0, endDate = Date.now() / 1000 }) => {
            // Parse startDate into common Date object
            startDate = parseTimeInSecondsDate(startDate);
            // Parse endDate into common Date object
            endDate = parseTimeInSecondsDate(endDate);

            return {
              entryId,
              assetPropertyValueHistory: faker.date
                .betweens({
                  from: startDate,
                  to: endDate,
                  count: maxResultsPerEntry,
                })
                .map((date) => {
                  const assetPropertyValue =
                    factory.createDoubleAssetPropertyValue({
                      timestamp: {
                        timeInSeconds: Math.floor(date.getTime() / 1000),
                        offsetInNanos: Math.floor(date.getTime() % 1000),
                      },
                    });

                  return assetPropertyValue;
                }),
            };
          }
        ),
        skippedEntries: [],
        errorEntries: [],
      };

      return res(ctx.delay(), ctx.status(200), ctx.json(response));
    }
  );
}

export function batchGetAssetPropertyAggregatesHandler() {
  return rest.post(
    BATCH_GET_ASSET_PROPERTY_AGGREGATES_URL,
    async (req, res, ctx) => {
      const { entries = [], maxResults = 4000 } =
        await req.json<BatchGetAssetPropertyAggregatesRequest>();
      const maxResultsPerEntry = Math.floor(maxResults / entries.length);
      const factory = new AggregatedValueFactory();

      const response: BatchGetAssetPropertyAggregatesResponse = {
        successEntries: entries.map(
          ({
            entryId,
            startDate = 0,
            endDate = Date.now(),
            aggregateTypes = ['AVERAGE'],
          }) => {
            return {
              entryId,
              aggregatedValues: faker.date
                .betweens({
                  from: startDate,
                  to: endDate,
                  count: maxResultsPerEntry,
                })
                .map((date) => {
                  const aggregatedValue = factory.create(
                    aggregateTypes[0] as AggregateType,
                    {
                      timestamp:
                        date.getTime() as unknown as AggregatedValue['timestamp'],
                    }
                  );

                  return aggregatedValue;
                }),
            };
          }
        ),
        skippedEntries: [],
        errorEntries: [],
      };

      return res(ctx.delay(), ctx.status(200), ctx.json(response));
    }
  );
}
