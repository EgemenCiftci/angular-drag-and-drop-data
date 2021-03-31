import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-drag-and-drop",
  templateUrl: "./drag-and-drop.component.html",
  styleUrls: ["./drag-and-drop.component.css"]
})
export class DragAndDropComponent implements OnInit {
  @Input() showCurtain = false;
  isMouseDown = false;
  isDragging = false;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  @ViewChild("div") div: ElementRef;

  constructor() {}

  ngOnInit() {}

  onpointerdown(e: any) {
    if (e.button === 0 && e.buttons === 1) {
      this.isMouseDown = true;
      this.isDragging = false;
      this.fromX = e.offsetX;
      this.fromY = e.offsetY;
      this.toX = undefined;
      this.toY = undefined;
      this.div.nativeElement.setPointerCapture(e.pointerId);
      console.log(`Dragged From:(${this.fromX},${this.fromY})`);
    }
  }

  onpointermove(e: any) {
    if (this.isMouseDown) {
      this.isDragging = true;
    }
  }

  onpointerup(e: any) {
    if (this.isMouseDown) {
      this.toX = e.offsetX;
      this.toY = e.offsetY;
      console.log(`Dropped To:(${this.toX},${this.toY})`);
      this.isMouseDown = false;
      this.isDragging = false;
      this.fromX = undefined;
      this.fromY = undefined;
      this.toX = undefined;
      this.toY = undefined;
      this.div.nativeElement.releasePointerCapture(e.pointerId);
    }
  }
}
