import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
// @ts-ignore
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { select, Store } from '@ngrx/store';
import { SceneState } from '../../scene/store/reducer/scene.reducer';
import { selectLines } from '../../scene/store/selector/scene.selectors';
import { Line, Point } from '../../scene/scene.interfaces';
import { SceneService } from '../../scene/scene.service';
import { SCENE_EVENTS } from './scene.constants';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.Camera;
  private renderer!: THREE.WebGLRenderer;
  private lines: Line[] = [];

  constructor(
    private store: Store<SceneState>,
    private sceneService: SceneService,
  ) {}

  ngOnInit(): void {
    this.store.pipe(select(selectLines)).subscribe(val => this.lines = val);
    this.sceneService.events$.forEach(event => this.getEvent(event));
  }

  getEvent(event: SCENE_EVENTS) {
    switch (event) {
      case SCENE_EVENTS.RENDER:
        return this.draw();
      case SCENE_EVENTS.CLEAR:
        return this.clear();
    }
  }

  ngAfterViewInit(): void {
    this.init();
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private init(): void {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.drawCursor();
  }

  public clear(): void {
    this.sceneService.clear();
    for(let i = this.scene.children.length - 1; i >= 0; i--) {
      const obj = this.scene.children[i];
      this.scene.remove(obj);
    }
    this.render();
  }

  public draw(): void {
    if (this.scene) {
      this.lines.forEach(line => {
        if (line) this.drawLine(line);
      });
      this.drawCursor();
    }
  }

  private drawLine(line: Line): void {
    const { start, end } = line;
    const points = [start.x, start.y, start.z, end.x , end.y, end.z];

    const material = this.createPen(line.penColor, line.penWidth);
    const draw = new MeshLine();
    draw.setPoints(points);

    const mesh = new THREE.Mesh(draw, material);
    mesh.geometry.computeBoundingSphere();
    this.scene.add(mesh);

    this.drawRounded(start, line.penWidth, line.penColor);
    this.drawRounded(end, line.penWidth, line.penColor);
  }

  private drawRounded(point: Point, penWidth: number, penColor: string): void {
    const geometry = new THREE.CircleGeometry(penWidth / 2, 200);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: penColor });
    const circle = new THREE.Mesh(geometry, circleMaterial);
    circle.position.set(point.x, point.y, 0)
    circle.geometry.computeBoundingSphere();
    this.scene.add(circle);
  }

  private drawCursor(): void {
    const cursorPosition = this.sceneService.getCursorPosition();
    const loader = new THREE.TextureLoader();

    const material = new THREE.MeshBasicMaterial({
      map: loader.load('https://cdn-icons-png.flaticon.com/512/123/123996.png'),
      transparent: true,
    });

    const penWidth = this.sceneService.getPenWidth();
    const size = penWidth < 10 ? 25 : penWidth * 2.5;

    const geometry = new THREE.BoxGeometry(size, size, 1);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.z = this.sceneService.getCursorPosition().angle * (Math.PI / 180) * -1;
    mesh.position.set(cursorPosition.x, cursorPosition.y, cursorPosition.z)

    this.scene.add(mesh);
  }

  private createPen(color: string, width: number): MeshLineMaterial {
    return new MeshLineMaterial({ color: new THREE.Color(color), lineWidth: width });
  }

  private createScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
  }

  private createCamera(): void {
    this.camera = new THREE.OrthographicCamera(
      this.canvas.clientWidth / - 2,
      this.canvas.clientWidth / 2,
      this.canvas.clientHeight / 2,
      this.canvas.clientHeight / - 2,
      0.1,
      1000
    );
    this.camera.position.set( 0, 0, 1000);
    this.camera.lookAt( 0, 0, 0 );
  }

  private createRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.renderer.setAnimationLoop(() => {
      this.render();
    });
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
