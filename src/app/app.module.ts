import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { InterpreterComponent } from './components/interpreter/interpreter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FormsModule } from '@angular/forms';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { SceneModule } from './scene/scene.module';
import { reducers, metaReducers } from './reducers';
import { SceneComponent } from './components/scene/scene.component';

@NgModule({
  declarations: [
    AppComponent,
    InterpreterComponent,
    SceneComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CodemirrorModule,
    FormsModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    SceneModule,
    StoreModule.forRoot(reducers, { metaReducers }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
