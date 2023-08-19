import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LineWidgetComponent from './component';
import { DASHBOARD_CONTAINER_ID } from '~/components/grid/getDashboardPosition';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';

jest.mock('~/customization/hooks/useIsSelected', () => ({
  useIsSelected: jest.fn().mockReturnValue(true),
}));

jest.mock('~/customization/hooks/useWidgetActions', () => ({
  useWidgetActions: jest.fn().mockReturnValue({
    update: jest.fn(),
  }),
}));

describe('LineWidgetComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockStore = configureDashboardStore();

  const renderComponentWithDnd = (properties) => {
    return render(
      <Provider store={mockStore}>
        <DndProvider backend={HTML5Backend}>
          <LineWidgetComponent
            id='line-id'
            x={1}
            y={2}
            z={3}
            height={100}
            width={100}
            type='line-widget'
            properties={properties}
          />
        </DndProvider>
      </Provider>
    );
  };

  const { container } = renderComponentWithDnd({
    lineStyle: 'solid',
    color: 'black',
    thickness: 5,
  });
  console.log(container.innerHTML);

  describe('Rendering', () => {
    [
      { lineStyle: 'solid', color: 'black', thickness: 5 },
      { lineStyle: 'dashed', color: 'black', thickness: 5 },
      { lineStyle: 'dotted', color: 'black', thickness: 5 },
      { lineStyle: 'solid', color: 'red', thickness: 5 },
      { lineStyle: 'dashed', color: 'blue', thickness: 10 },
      { lineStyle: 'dotted', color: 'green', thickness: 15 },
    ].forEach((properties) => {
      it(`should render with ${JSON.stringify(properties)} correctly`, () => {
        const { container } = renderComponentWithDnd(properties);
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('Drag and Drop', () => {
    it('should allow dragging of the line start anchor', () => {
      renderComponentWithDnd({
        lineStyle: 'solid',
        color: 'black',
        thickness: 5,
      });

      const startAnchor = screen.getByLabelText('line-start-anchor');
      const endAnchor = screen.getByLabelText('line-end-anchor');

      expect(startAnchor).toBeInTheDocument();
      expect(endAnchor).toBeInTheDocument();

      act(() => {
        fireEvent.dragStart(startAnchor);
      });

      const grid = screen.getByTestId(DASHBOARD_CONTAINER_ID);
      expect(grid).toBeInTheDocument();

      act(() => {
        fireEvent.dragEnter(grid);
        fireEvent.dragOver(grid);
        fireEvent.drop(grid, {
          clientX: 50,
          clientY: 50,
        });
      });

      // todo: check changes in proprties
    });

    it('should allow dragging of the line end anchor', () => {
      renderComponentWithDnd({
        lineStyle: 'solid',
        color: 'black',
        thickness: 5,
      });

      const endAnchor = screen.getByLabelText('line-end-anchor');
      act(() => {
        fireEvent.dragStart(endAnchor);
      });

      const grid = screen.getByTestId(DASHBOARD_CONTAINER_ID);
      expect(grid).toBeInTheDocument();

      act(() => {
        fireEvent.dragEnter(grid);
        fireEvent.dragOver(grid);
        fireEvent.drop(grid, {
          clientX: 300,
          clientY: 300,
        });
      });
    });
  });
});
