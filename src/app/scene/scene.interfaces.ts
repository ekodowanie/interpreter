export interface Point {
  x: number;
  y: number;
  z: number;
}

export interface Line {
  start: Point,
  end: Point,
  penWidth: number;
  penColor: string;
}

export interface CursorPosition extends Point{
  angle: number;
}
