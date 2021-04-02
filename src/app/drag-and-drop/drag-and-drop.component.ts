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
      const tos = this.getTos(e);

      if (tos) {
        console.log(tos);
        this.dragAndDropService.toCard =
          tos.element.attributes["ng-reflect-card-name"].value;
        this.dragAndDropService.toX = tos.x;
        this.dragAndDropService.toY = tos.y;
        console.log(
          `From: ${this.dragAndDropService.fromCard}-(${
            this.dragAndDropService.fromX
          },${this.dragAndDropService.fromY})\nTo: ${
            this.dragAndDropService.toCard
          }-(${this.dragAndDropService.toX},${this.dragAndDropService.toY})`
        );
      }
    }

    this.dragAndDropService.reset();
    this.div.nativeElement.releasePointerCapture(e.pointerId);
  }

  getTos(e: any): { element: Element; x: number; y: number } {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const to = elements.find(f => f.localName === "app-drag-and-drop");
    if (to) {
      const rect = to.getBoundingClientRect();
      const x = e.clientX - rect.x;
      const y = e.clientY - rect.y;
      return { element: to, x: x, y: y };
    }

    return undefined;
  }
}
