import { Component, OnInit } from '@angular/core';
import * as CodeMirror from 'codemirror';
import { COMMAND } from './interpreter.constants';
import { SceneService } from '../../scene/scene.service';
import { SCENE_EVENTS } from '../scene/scene.constants';

@Component({
  selector: 'app-interpreter',
  templateUrl: './interpreter.component.html',
  styleUrls: ['./interpreter.component.scss'],
})
export class InterpreterComponent implements OnInit {
  public content!: string;

  constructor(
    private sceneService: SceneService,
  ) {}

  ngOnInit(): void {
    CodeMirror.defineMode('interpreter-mode', () => {
      return {
        token: (stream) => {
          for (const command in COMMAND) {
            if (stream.match(command.toLowerCase())) {
              return 'command';
            }
          }

          if (stream.match(/^[0-9]/gm)) {
            return 'number';
          }

          stream.next();
          return null;
        }
      }
    });
  }

  interpreter(command: string): void {
    const value = command.split(' ');
    switch (value[0]) {
      case COMMAND.FORWARD:
        return this.sceneService.forward(+value[1]);
      case COMMAND.BACKWARD:
        return this.sceneService.backward(+value[1]);
      case COMMAND.CENTER:
        return this.sceneService.center();
      case COMMAND.DIRECTION:
        return this.sceneService.direction(+value[1]);
      case COMMAND.GO:
        return this.sceneService.go(+value[1], +value[2])
      case COMMAND.GOX:
        return this.sceneService.gox(+value[1]);
      case COMMAND.GOY:
        return this.sceneService.goy(+value[1]);
      case COMMAND.PENCOLOR:
        return this.sceneService.setPenColor(+value[1], +value[2], +value[3]);
      case COMMAND.PENWIDTH:
        return this.sceneService.setPenWidth(+value[1]);
      case COMMAND.PENDOWN:
        return this.sceneService.setPenDown();
      case COMMAND.PENUP:
        return this.sceneService.setPenUp();
      case COMMAND.TURNLEFT:
        return this.sceneService.turnLeft(+value[1]);
      case COMMAND.TURNRIGHT:
        return this.sceneService.turnRight(+value[1]);
    }
  }

  onClick() {
    this.sceneService.emit(SCENE_EVENTS.CLEAR);
    const content = this.content.split(/\r?\n/);
    for (const command of content) {
      this.interpreter(command);
    }
    this.sceneService.emit(SCENE_EVENTS.RENDER);
  }

  onClear() {
    this.sceneService.emit(SCENE_EVENTS.CLEAR);
    this.content = '';
    this.sceneService.emit(SCENE_EVENTS.RENDER);
  }
}
