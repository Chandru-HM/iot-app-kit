import { expect, test } from '../test';
import { getDecimalPlaces } from '../utils/getDecimalPlaces';

test.describe('Test Gauge Widget', () => {
  test('Gauge widget can be added to the dashboard', async ({
    dashboardWithGaugeWidget,
  }) => {
    const widgetEmptyState = dashboardWithGaugeWidget.gridArea.locator(
      '.kpi-widget-empty-state'
    );
    await expect(widgetEmptyState).toBeVisible();
  });

  test('Can add property to Gauge widget', async ({
    dashboardWithGaugeWidget,
    resourceExplorer,
  }) => {
    await resourceExplorer.addModeledProperties(['Max Temperature']);
    const widget =
      dashboardWithGaugeWidget.gridArea.getByTestId('kpi-base-component');
    expect(await widget.textContent()).toContain('Max Temperature');
  });

  test('Cannot add more than 1 property to Gauge widget', async ({
    dashboardWithGaugeWidget,
    resourceExplorer,
  }) => {
    //add property
    await resourceExplorer.addModeledProperties(['Max Temperature']);
    dashboardWithGaugeWidget.gridArea.getByTestId('kpi-base-component');
    //select 2 more properties
    await resourceExplorer.selectProperties(['Min Temperature', 'Temperature']);

    //check that add button is disabled
    const addButton = await resourceExplorer.getAddButton();
    await expect(addButton).toBeDisabled();
  });

  test('Cannot multiselect add property to Gauge widget', async ({
    dashboardWithGaugeWidget,
    resourceExplorer,
  }) => {
    //select 3 properties
    await resourceExplorer.selectProperties([
      'Max Temperature',
      'Min Temperature',
      'Temperature',
    ]);
    dashboardWithGaugeWidget.gridArea.locator('.kpi-widget-empty-state');

    //check that add button is disabled
    const addButton = await resourceExplorer.getAddButton();
    await expect(addButton).toBeDisabled();
  });

  test('Gauge Widget supports show/hide several properties', async ({
    resourceExplorer,
    dashboardWithGaugeWidget,
    configPanel,
  }) => {
    // add property
    await resourceExplorer.addModeledProperties(['Max Temperature']);

    const nameAndUnit =
      dashboardWithGaugeWidget.gridArea.getByTestId('kpi-name-and-unit');
    const timestamp =
      dashboardWithGaugeWidget.gridArea.getByTestId('kpi-timestamp');
    const aggregationAndResolution =
      dashboardWithGaugeWidget.gridArea.getByTestId('kpi-aggregation');
    const value = dashboardWithGaugeWidget.gridArea.getByTestId('kpi-value');

    // verify that all values are initially visible
    await expect(nameAndUnit).toBeVisible();
    await expect(timestamp).toBeVisible();
    await expect(aggregationAndResolution).toBeVisible();
    await expect(value).toBeVisible();

    // open config panel
    await configPanel.collapsedButton.click();
    await configPanel.showHideName.click();
    await configPanel.showHideUnit.click();
    await configPanel.showHideTimestamp.click();
    await configPanel.showHideAggregationResolution.click();

    // verify that no values are visible other than the data point
    expect(await nameAndUnit.textContent()).toBe(' ');
    await expect(timestamp).not.toBeVisible();
    await expect(aggregationAndResolution).not.toBeVisible();
    await expect(value).toBeVisible();
  });

  test('Gauge Widget supports significant digits', async ({
    resourceExplorer,
    dashboardWithGaugeWidget,
    configPanel,
  }) => {
    // add property
    await resourceExplorer.addModeledProperties(['Max Temperature']);

    //verify that initial value is not rounded
    const widgetValue = await dashboardWithGaugeWidget.gridArea
      .getByTestId('gauge-value')
      .textContent();
    expect(getDecimalPlaces(widgetValue)).toBe(4);

    //change sig digits to 1
    await configPanel.collapsedButton.click();
    await configPanel.decimalPlaceInput.fill('1');

    //confirm that value has one decimal place
    const updatedWidgetValue = await dashboardWithGaugeWidget.gridArea
      .getByTestId('gauge-value')
      .textContent();
    expect(getDecimalPlaces(updatedWidgetValue)).toBe(1);
  });

  test('Gauge Widget supports thresholds', async ({
    page,
    resourceExplorer,
    dashboardWithGaugeWidget,
    configPanel,
  }) => {
    // add a property
    await resourceExplorer.addModeledProperties(['Max Temperature']);

    // open threshold panel
    await configPanel.collapsedButton.click();
    await configPanel.container
      .getByRole('tab', {
        name: 'Thresholds',
        exact: true,
      })
      .click();

    // add a threshold
    await configPanel.container
      .getByRole('button', {
        name: 'Add a threshold',
        exact: true,
      })
      .click();
    await page.waitForTimeout(1000);
    const thresholdDisplay = configPanel.container.locator(
      'div[class="threshold-display"]'
    );
    await thresholdDisplay
      .locator('div[class="threshold-configuration"]')
      .locator('button')
      .first()
      .click();
    await page.keyboard.down('ArrowDown');
    await page.keyboard.down('Enter');

    await configPanel.container.getByPlaceholder('Threshold value').fill('1');
    await thresholdDisplay.getByLabel('color picker').fill('#f63804');

    const widgetValue =
      dashboardWithGaugeWidget.gridArea.getByTestId('gauge-value');
    await expect(widgetValue).toHaveCSS('color', 'rgb(255, 255, 255)');
  });
});
