import { Injectable } from "@angular/core";

@Injectable()
export class DragAndDropService {
  isMouseDown = false;
  isDragging = false;
  
  fromCard: string;
  fromX: number;
  fromY: number;

  toCard: string;
  toX: number;
  toY: number;

  constructor() {}

  reset() {
    this.isMouseDown = false;
    this.isDragging = false;
    this.fromCard = undefined;
    this.fromX = undefined;
    this.fromY = undefined;
    this.toCard = undefined;
    this.toX = undefined;
    this.toY = undefined;
  }
}
