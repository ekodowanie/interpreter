import { Injectable } from '@angular/core';
import { Store} from '@ngrx/store';
import { addLine, clear } from './store/action/scene.actions';
import { SceneState } from './store/reducer/scene.reducer';
import { Point } from './scene.interfaces';
import rgbHex from 'rgb-hex';
import { CursorPosition } from './scene.interfaces';
import { Subject } from 'rxjs';
import { SCENE_EVENTS } from '../components/scene/scene.constants';

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  private penColor: string = '#ffffff';
  private penWidth: number = 1;
  private angle = 0;
  private isPenActive = true;
  private cursor: Point = { x: 0, y: 0, z: 0 };
  private _subject = new Subject<any>();

  constructor(private store: Store<SceneState>) { }

  public clear(): void {
    this.penColor = '#000000';
    this.penWidth = 1;
    this.angle = 0;
    this.isPenActive = true;
    this.cursor = { x: 0, y: 0, z: 0 };
    this.store.dispatch(clear());
  }

  public emit(event: SCENE_EVENTS): void {
    this._subject.next(event);
  }

  get events$ () {
    return this._subject.asObservable();
  }

  public getPenWidth(): number {
    return this.penWidth;
  }

  public getCursorPosition(): CursorPosition {
    return {
      ...this.cursor,
      angle: this.angle,
    }
  }

  public setPenColor(r: number, g: number, b:number): void {
    this.penColor = `#${rgbHex(r, g, b)}`;
  }

  public setPenWidth(width: number): void {
    this.penWidth = width;
  }

  public forward(value: number): void {
    const point = this.findNewPoint(this.cursor.x, this.cursor.y, this.angle, value);
    this.addLine(this.cursor, point);
  }

  public backward(value: number): void {
    this.forward(value * -1);
  }

  public turnLeft(value: number): void {
    this.angle = this.angle - value;
  }

  public turnRight(value: number): void {
    this.angle = this.angle + value;
  }

  public direction(value: number): void {
    this.angle = value;
  }

  public center(): void {
    this.cursor = { x: 0, y: 0, z: 0 };
  }

  public go(x: number, y: number): void {
    this.cursor = { x, y, z: 0 };
  }

  public gox(x: number): void {
    this.cursor = { ...this.cursor, x };
  }

  public goy(y: number): void {
    this.cursor = { ...this.cursor, y };
  }

  public setPenUp(): void {
    this.isPenActive = false;
  }

  public setPenDown(): void {
    this.isPenActive = true;
  }

  private addLine(start: Point, end: Point): void {
    if (this.isPenActive) {
      this.store.dispatch(addLine({
        start,
        end,
        penWidth: this.penWidth,
        penColor: this.penColor,
      }))
    }
    this.cursor = end;
  }

  private findNewPoint(x: number, y: number, angle: number, distance: number): Point {
    const pointX = Math.round(Math.sin(angle * Math.PI / 180) * distance + x);
    const pointY = Math.round(Math.cos(angle * Math.PI / 180) * distance + y);
    return { x: pointX, y: pointY, z: 0 };
  }
}
