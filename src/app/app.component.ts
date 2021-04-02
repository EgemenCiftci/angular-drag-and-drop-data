import { Component, VERSION } from "@angular/core";
import { DragAndDropService } from "./drag-and-drop.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  dragAndDrop = true;
  constructor(public dragAndDropService: DragAndDropService) {}
}
