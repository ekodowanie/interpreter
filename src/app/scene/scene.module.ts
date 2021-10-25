import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer, sceneFeatureKey } from './store/reducer/scene.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(sceneFeatureKey, reducer),
  ],
  exports: []
})
export class SceneModule { }
