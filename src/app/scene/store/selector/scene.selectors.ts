import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromScene from '../reducer/scene.reducer';

export const selectSceneState = createFeatureSelector<fromScene.SceneState>(
  fromScene.sceneFeatureKey,
);

export const selectLines = createSelector(
  selectSceneState,
  (state: fromScene.SceneState) => state.lines
);
