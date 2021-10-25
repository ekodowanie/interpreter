import { Action, createReducer, on } from '@ngrx/store';
import * as SceneActions from '../action/scene.actions';
import { Line } from '../../scene.interfaces';

export const sceneFeatureKey = 'scene';

export interface SceneState {
  lines: Line[],
}

export const initialState: SceneState = {
  lines: [],
};

export const sceneReducer = createReducer(
  initialState,
  on(SceneActions.addLine,
    (state: SceneState, { line }) => ({ ...state, lines: [...state.lines, line] })
  ),
  on(SceneActions.clear,
    (state: SceneState) => ({ ...state, lines: [] })
  ),
);

export function reducer(state: SceneState | undefined, action: Action): any {
  return sceneReducer(state, action);
}
