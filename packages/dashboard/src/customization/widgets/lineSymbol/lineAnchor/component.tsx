import React, { CSSProperties, useEffect, useRef } from 'react';
import { LineWidget } from '~/customization/widgets/types';
import { UpdateWidgetsAction } from '~/store/actions';
import { XYCoord, useDrag } from 'react-dnd';
import { DashboardWidget } from '~/types';
import { useGridSettings } from '~/components/actions/useGridSettings';
import './component.css';

export const LineAnchor: React.FC<{
  style: CSSProperties;
  anchorType: 'start' | 'end';
  widget: LineWidget;
  updateWidget: (widget: DashboardWidget) => UpdateWidgetsAction;
}> = ({ style, anchorType, widget, updateWidget }) => {
  // These refs are needed because we want to remember the coordinates at the start of the drag event.
  // We don't want to recalculate the coordinates of the points on every render, only when the drag event completes.
  const initialStartPointRef = useRef({
    x: 0,
    y: 0,
  });
  const initialEndPointRef = useRef({
    x: 0,
    y: 0,
  });

  const { cellSize } = useGridSettings();

  function computeNewPosition(initialPosition: XYCoord, offsetDifference: XYCoord) {
    const { x: initialX, y: initialY } = initialPosition;
    const { x: offsetX, y: offsetY } = offsetDifference;

    const widthPixels = Math.round(widget.width * cellSize);
    const heightPixels = Math.round(widget.height * cellSize);

    const newX = Math.max(0, Math.min(initialX + offsetX, widthPixels));
    const newY = Math.max(0, Math.min(initialY + offsetY, heightPixels));

    return { x: newX, y: newY } as XYCoord;
  }

  const [{ diff, isDragging }, ref] = useDrag({
    type: 'LineAnchor',
    item: () => {
      initialStartPointRef.current = {
        x: widget.properties.start.x,
        y: widget.properties.start.y,
      };
      initialEndPointRef.current = {
        x: widget.properties.end.x,
        y: widget.properties.end.y,
      };
      return {
        anchorType,
      };
    },
    collect: (monitor) => {
      const offsetDifference = monitor.getDifferenceFromInitialOffset();
      return { diff: offsetDifference, isDragging: monitor.isDragging() };
    },
  });
  useEffect(() => {
    if (isDragging && diff) {
      let updatedWidget;
      if (anchorType === 'start') {
        const { x: newStartX, y: newStartY } = computeNewPosition(initialStartPointRef.current, diff);
        updatedWidget = {
          ...widget,
          properties: {
            ...widget.properties,
            start: {
              x: newStartX,
              y: newStartY,
            },
          },
        };
      } else if (anchorType == 'end') {
        const { x: newEndX, y: newEndY } = computeNewPosition(initialEndPointRef.current, diff);
        updatedWidget = {
          ...widget,
          properties: {
            ...widget.properties,
            end: {
              x: newEndX,
              y: newEndY,
            },
          },
        };
      }
      console.log(updatedWidget);
      if (updatedWidget) {
        updateWidget(updatedWidget);
      }
    }
  }, [diff?.x, diff?.y]);
  return <div ref={ref} style={style} className='line-anchor' />;
};
