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

  constructor(public dragAndDropService: DragAndDropService) {}

  ngOnInit() {}

  onpointerdown(e: any) {
    if (this.allowDrag && e.button === 0 && e.buttons === 1) {
      this.dragAndDropService.reset();
      this.dragAndDropService.isMouseDown = true;
      this.dragAndDropService.fromCard = this.name;
      this.dragAndDropService.fromX = e.offsetX;
      this.dragAndDropService.fromY = e.offsetY;
      this.dragAndDropComponent.canvas.nativeElement.setPointerCapture(e.pointerId);
    }
  }

  onpointermove(e: any) {
    if (this.dragAndDropService.isMouseDown) {
      this.dragAndDropService.isDragging = true;
      this.dragAndDropService.isInDragDropMode = true;
      this.dragAndDropComponent.clearCanvas();
      if (this.showCrosshair) {
        this.dragAndDropComponent.drawCrosshair(e.offsetX, e.offsetY);
      }
    }
  }
}
