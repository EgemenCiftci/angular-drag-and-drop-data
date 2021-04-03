import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { DragAndDropComponent } from "../drag-and-drop/drag-and-drop.component";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"]
})
export class CardComponent implements OnInit {
  @ViewChild(DragAndDropComponent) dd: DragAndDropComponent;
  @Input() name: string;
  @Input() showInfo = true;
  @Input() showCrosshair = true;
  @Input() allowDrag = true;
  @Input() allowDrop = true;

  constructor() {}

  ngOnInit() {}
}
