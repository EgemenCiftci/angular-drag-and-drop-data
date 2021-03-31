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
      console.log(
        `Dragged From:(${this.dragAndDropService.fromCard},${
          this.dragAndDropService.fromX
        },${this.dragAndDropService.fromY})`
      );
    }
  }

  onpointermove(e: any) {
    if (this.dragAndDropService.isMouseDown) {
      this.dragAndDropService.isDragging = true;
    }
  }

  onpointerup(e: any) {
    if (this.dragAndDropService.isMouseDown) {
      this.dragAndDropService.toCard = this.cardName;
      this.dragAndDropService.toX = e.offsetX;
      this.dragAndDropService.toY = e.offsetY;
      console.log(
        `Dropped To:(${this.dragAndDropService.toCard},${
          this.dragAndDropService.toX
        },${this.dragAndDropService.toY})`
      );
      this.dragAndDropService.reset();
      this.div.nativeElement.releasePointerCapture(e.pointerId);
    }
  }

  allElementsFromPoint(x: number, y: number) {
    let element: any;
    let elements = [];
    const old_visibility = [];
    while (true) {
      element = document.elementFromPoint(x, y);
      if (!element || element === document.documentElement) {
        break;
      }
      elements.push(element);
      old_visibility.push(element.style.visibility);
      element.style.visibility = "hidden"; // Temporarily hide the element (without changing the layout)
    }
    for (var k = 0; k < elements.length; k++) {
      elements[k].style.visibility = old_visibility[k];
    }
    elements.reverse();
    return elements;
  }
}
