import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { DragAndDropService } from "../drag-and-drop.service";

@Component({
  selector: "app-drag-and-drop",
  templateUrl: "./drag-and-drop.component.html",
  styleUrls: ["./drag-and-drop.component.css"]
})
export class DragAndDropComponent implements OnInit {
  @ViewChild("div") div: ElementRef;
  @Input() cardName: string;

  constructor(public dragAndDropService: DragAndDropService) {}

  ngOnInit() {}

  onpointerdown(e: any) {
    if (e.button === 0 && e.buttons === 1) {
      this.dragAndDropService.reset();
      this.dragAndDropService.isMouseDown = true;
      this.dragAndDropService.fromCard = this.cardName;
      this.dragAndDropService.fromX = e.offsetX;
      this.dragAndDropService.fromY = e.offsetY;
      this.div.nativeElement.setPointerCapture(e.pointerId);
    }
  }

  onpointermove(e: any) {
    if (this.dragAndDropService.isMouseDown) {
      this.dragAndDropService.isDragging = true;
    }
  }

  onpointerup(e: any) {
    if (this.dragAndDropService.isMouseDown) {
      console.log(e);
      const toCard = this.getToCardElement(e);
      this.dragAndDropService.toCard = toCard.attributes["name"].value;
      this.dragAndDropService.toX = e.pageX;
      this.dragAndDropService.toY = e.pageY;
      console.log(
        `Dragged From:(${this.dragAndDropService.fromCard},${
          this.dragAndDropService.fromX
        },${this.dragAndDropService.fromY})`
      );
      console.log(
        `Dropped To:(${this.dragAndDropService.toCard},${
          this.dragAndDropService.toX
        },${this.dragAndDropService.toY})`
      );
      this.dragAndDropService.reset();
      this.div.nativeElement.releasePointerCapture(e.pointerId);
    }
  }

  getToCardElement(e: any): any {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    return elements.find(f => f.localName === "app-card");
  }
}
