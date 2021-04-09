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
    if (this.isMouseDown && !this.dragAndDropService.isInDragDropMode) {
      const deltaX = Math.abs(e.offsetX - this.fromX);
      const deltaY = Math.abs(e.offsetY - this.fromY);
      if (
        deltaX > this.dragStartThreshold ||
        deltaY > this.dragStartThreshold
      ) {
        this.isMouseDown = false;
        // Drag & Drop Started
        this.dragAndDropService.clearSelection();
        this.dragAndDropService.reset();
        this.dragAndDropService.isInDragDropMode = true;
        this.dragAndDropService.isMouseDown = true;
        this.dragAndDropService.fromCard = this.name;
        this.dragAndDropService.fromX = this.fromX;
        this.dragAndDropService.fromY = this.fromY;
      }
    }
  }

  onpointerup(e: any) {
    this.fromX = 0;
    this.fromY = 0;
    this.isMouseDown = false;
    alert("sd");
  }

  reset() {

  }

  getIsHidden() {
    if (!this.dragAndDropService.isInDragDropMode) {
      return true;
    } else {
      return !this.allowDrop || (this.dragAndDropService.isInFineAdjustMode && this.dragAndDropService.toCard !== this.name);
    }
  }
}
