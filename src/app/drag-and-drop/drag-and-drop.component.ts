import { NumberFormatStyle } from "@angular/common";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { NumberValueAccessor } from "@angular/forms";
import { DragAndDropService } from "../drag-and-drop.service";

@Component({
  selector: "app-drag-and-drop",
  templateUrl: "./drag-and-drop.component.html",
  styleUrls: ["./drag-and-drop.component.css"]
})
export class DragAndDropComponent implements OnInit, AfterViewInit {
  @ViewChild("canvas") canvas: ElementRef;
  ctx: CanvasRenderingContext2D;
  @Input() cardName: string;
  @Input() showCrosshair = true;

  constructor(public dragAndDropService: DragAndDropService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext("2d");
  }

  onpointerdown(e: any) {
    if (e.button === 0 && e.buttons === 1) {
      this.dragAndDropService.reset();
      this.dragAndDropService.isMouseDown = true;
      this.dragAndDropService.fromCard = this.cardName;
      this.dragAndDropService.fromX = e.offsetX;
      this.dragAndDropService.fromY = e.offsetY;
      this.canvas.nativeElement.setPointerCapture(e.pointerId);
    }
  }

  onpointermove(e: any) {
    if (this.dragAndDropService.isMouseDown) {
      this.dragAndDropService.isDragging = true;
      this.clearCrosshair();
      console.log(e.offsetY);
      this.drawCrosshair(e.offsetX, e.offsetY);
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
        alert(
          `From: ${this.dragAndDropService.fromCard} => (${
            this.dragAndDropService.fromX
          },${this.dragAndDropService.fromY})\nTo: ${
            this.dragAndDropService.toCard
          } => (${this.dragAndDropService.toX},${this.dragAndDropService.toY})`
        );
      }
    }

    this.dragAndDropService.reset();
    this.canvas.nativeElement.releasePointerCapture(e.pointerId);
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

  drawCrosshair(x: number, y: number) {
    const simplifiedX = Math.floor(x);
    const simplifiedY = Math.floor(y);

    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "red";
    this.ctx.globalAlpha = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, simplifiedY);
    this.ctx.lineTo(this.ctx.canvas.width, simplifiedY);
    this.ctx.moveTo(simplifiedX, 0);
    this.ctx.lineTo(simplifiedX, this.ctx.canvas.height);
    this.ctx.stroke();
  }

  clearCrosshair() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}
