// Trend Cursor constants
import { KeyMap } from 'react-hotkeys';

export const DEBUG_TREND_CURSORS = localStorage.getItem('DEBUG_TREND_CURSORS') ?? false;
export const TREND_CURSOR_HEADER_COLORS = ['#DA7596', '#2EA597', '#688AE8', '#A783E1', '#E07941'];
export const TREND_CURSOR_HEADER_WIDTH = 120;
export const TREND_CURSOR_LINE_COLOR = 'black';
export const TREND_CURSOR_LINE_WIDTH = 2;
export const TREND_CURSOR_Z_INDEX = 100;
export const MAX_TREND_CURSORS = 5;
export const TREND_CURSOR_HEADER_TEXT_COLOR = 'white';
export const TREND_CURSOR_HEADER_OFFSET = 28;
export const TREND_CURSOR_HEADER_BACKGROUND_COLOR = 'black';
export const TREND_CURSOR_CLOSE_BUTTON_Y_OFFSET = TREND_CURSOR_HEADER_OFFSET + 0.5;
export const TREND_CURSOR_CLOSE_BUTTON_X_OFFSET = 45;
export const TREND_CURSOR_MARKER_RADIUS = 5;
export const TREND_CURSOR_LINE_GRAPHIC_INDEX = 0;
export const TREND_CURSOR_HEADER_GRAPHIC_INDEX = 1;
export const TREND_CURSOR_CLOSE_GRAPHIC_INDEX = 2;
export const TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX = 3;
export const TREND_CURSOR_DRAG_RECT_WIDTH = 60;

export const FRAMES_TO_SKIP = 2;

export const TREND_CURSOR_KEY_MAP: KeyMap = {
  commandDown: { sequence: 't', action: 'keydown' },
  commandUp: { sequence: 't', action: 'keyup' },
};
