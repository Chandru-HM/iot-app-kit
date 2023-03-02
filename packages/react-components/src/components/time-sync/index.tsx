import { v4 as uuid } from 'uuid';
import React, { createContext, useCallback, useEffect, useState, useRef } from 'react';
import { viewportManager, Viewport } from '@iot-app-kit/core';

export interface IViewportContext {
  viewport?: Viewport;
  setViewport(viewport: Viewport): void;
}

export const ViewportContext = createContext<IViewportContext>({
  setViewport: () => {},
});

export interface TimeSyncProps {
  group?: string;
  initialViewport?: Viewport;
}

const DEFAULT_VIEWPORT: Viewport = {
  duration: '6h', // default viewport
};

export const TimeSync: React.FC<TimeSyncProps> = ({ group, initialViewport, children }) => {
  const [viewport, setViewport] = useState<Viewport>(initialViewport || DEFAULT_VIEWPORT);

  // Fall back unique viewport group, only used if `group` is not defined.
  const autoGeneratedGroup = useRef(uuid());

  const updateViewportGroup = useCallback(
    (v: Viewport) => {
      viewportManager.update(group || autoGeneratedGroup.current, v);
    },
    [group]
  );

  useEffect(() => {
    const { viewport, unsubscribe } = viewportManager.subscribe(group || autoGeneratedGroup.current, (v) =>
      setViewport(v as Viewport)
    );

    // Set initial viewport
    if (viewport) {
      setViewport(viewport as Viewport);
    } else {
      updateViewportGroup(initialViewport || DEFAULT_VIEWPORT);
    }
    return unsubscribe;
  }, [group]);

  return (
    <ViewportContext.Provider
      value={{
        setViewport: updateViewportGroup,
        viewport,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
};
