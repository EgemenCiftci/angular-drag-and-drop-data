import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { DragAndDropService } from "../drag-and-drop.service";
import { DragAndDropComponent } from "../drag-and-drop/drag-and-drop.component";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"]
})
export class CardComponent implements OnInit {
  @ViewChild(DragAndDropComponent) dragAndDropComponent: DragAndDropComponent;
  @Input() name: string;
  @Input() showInfo = true;
  @Input() showCrosshair = true;
  @Input() allowDrag = true;
  @Input() allowDrop = true;
  @Input() dragStartThreshold = 32;
  fromX = 0;
  fromY = 0;
  isMouseDown = false;

  constructor(public dragAndDropService: DragAndDropService) {}

  ngOnInit() {}

  onpointerdown(e: any) {
    if (
      !this.dragAndDropService.isInDragDropMode &&
      this.allowDrag &&
      e.button === 0 &&
      e.buttons === 1
    ) {
      this.fromX = e.offsetX;
      this.fromY = e.offsetY;
      this.isMouseDown = true;
    }
  }

  onpointermove(e: any) {
    if (this.isMouseDown) {
      const deltaX = Math.abs(e.offsetX - this.fromX);
      const deltaY = Math.abs(e.offsetY - this.fromY);
      if (deltaX > this.dragStartThreshold || deltaY > this.dragStartThreshold) {
        // Drag & Drop Started
        this.dragAndDropService.reset();
        this.dragAndDropService.isDragging = true;
        this.dragAndDropService.isInDragDropMode = true;
        this.dragAndDropService.isMouseDown = true;
        this.dragAndDropService.fromCard = this.name;
        this.dragAndDropService.fromX = this.fromX;
        this.dragAndDropService.fromY = this.fromY;
        this.dragAndDropComponent.canvas.nativeElement.setPointerCapture(
          e.pointerId
        );
        this.dragAndDropComponent.clearCanvas();
        if (this.showCrosshair) {
          this.dragAndDropComponent.drawCrosshair(e.offsetX, e.offsetY);
        }
      }
    }
  }

  onpointerup(e: any) {
    this.fromX = 0;
    this.fromY = 0;
    this.isMouseDown = false;
  }
}
