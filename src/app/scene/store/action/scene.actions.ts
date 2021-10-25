import { createAction } from '@ngrx/store';
import { Line } from '../../scene.interfaces';

export const addLine = createAction(
  '[Scene] Set penWidth',
  (line: Line) => ({ line })
);

export const clear = createAction('[Scene] clear');

