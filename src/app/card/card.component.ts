import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { DragAndDropOptions } from "../drag-and-drop-options";
import { DragAndDropService } from "../drag-and-drop.service";
import { DragAndDropComponent } from "../drag-and-drop/drag-and-drop.component";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"]
})
export class CardComponent implements OnInit, AfterViewInit {
  @ViewChild(DragAndDropComponent) dragAndDropComponent: DragAndDropComponent;
  @ViewChild("innerDiv") innerDiv: ElementRef;
  @Input() name: string;
  dragAndDropOptions: DragAndDropOptions = new DragAndDropOptions();
  fromX = 0;
  fromY = 0;
  isMouseDown = false;

  constructor(public dragAndDropService: DragAndDropService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const rect = this.innerDiv.nativeElement.getBoundingClientRect();
    console.log(rect);
    this.dragAndDropComponent.width = rect.width;
    this.dragAndDropComponent.height = rect.height;
  }

  onpointerdown(e: any) {
    if (
      !this.dragAndDropService.isInDragDropMode &&
      this.dragAndDropOptions.allowDrag &&
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
        deltaX > this.dragAndDropOptions.dragStartThreshold ||
        deltaY > this.dragAndDropOptions.dragStartThreshold
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
  }

  getIsHidden() {
    if (!this.dragAndDropService.isInDragDropMode) {
      return true;
    } else {
      return (
        this.dragAndDropService.isInFineAdjustMode &&
        this.dragAndDropService.toCard !== this.name
      );
    }
  }
}
