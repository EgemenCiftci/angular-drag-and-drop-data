import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
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
  @Input() showInfo = true;
  @Input() showCrosshair = true;
  background =
    "linear-gradient(135deg, rgba(10,36,99,0.4) 0%, rgba(25,89,163,0.4) 100%)";

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
      this.clearCanvas();
      console.log(e.offsetY);
      const position = this.getMousePos(e.clientX, e.clientY);
      if (this.showInfo) {
        this.drawInfo();
      }
      if (this.showCrosshair) {
        this.drawCrosshair(position.x, position.y);
      }
    }
  }

  onpointerup(e: any) {
    if (this.dragAndDropService.isMouseDown) {
      const tos = this.getTos(e);

      if (tos) {
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
    this.clearCanvas();
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
    const lineWidth = 1;
    const blurFix = lineWidth % 2 == 0 ? 0 : 0.5;
    const simplifiedX = Math.floor(x) + blurFix;
    const simplifiedY = Math.floor(y) + blurFix;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = "red";
    this.ctx.globalAlpha = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, simplifiedY);
    this.ctx.lineTo(this.ctx.canvas.width, simplifiedY);
    this.ctx.moveTo(simplifiedX, 0);
    this.ctx.lineTo(simplifiedX, this.ctx.canvas.height);
    this.ctx.moveTo(simplifiedX, simplifiedY);
    this.ctx.ellipse(simplifiedX, simplifiedY, 6, 3, 0, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fillStyle = "white";
    this.ctx.fill();
  }

  drawInfo() {
    const x = this.ctx.canvas.width - 110;
    const y = 5;
    this.ctx.fillStyle = "rgb(112, 87, 56)";
    this.ctx.globalAlpha = 1;
    this.roundedRect(x, y, 100, 100, 6, 3);
    this.ctx.fill();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  getMousePos(clientX: number, clientY: number) {
    const rect = this.ctx.canvas.getBoundingClientRect();
    const scaleX = this.ctx.canvas.width / rect.width;
    const scaleY = this.ctx.canvas.height / rect.height;
    console.log(scaleY);
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  roundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    rx: number,
    ry: number
  ) {
    const r2d = Math.PI / 180;

    if (w - 2 * rx < 0) {
      rx = w * 0.5;
    }
    if (h - 2 * ry < 0) {
      ry = h * 0.5;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(x + rx, y);
    this.ctx.lineTo(x + w - rx, y);
    this.ctx.ellipse(
      x + w - rx,
      y + ry,
      rx,
      ry,
      0,
      r2d * 270,
      r2d * 360,
      false
    );
    this.ctx.lineTo(x + w, y + h - ry);
    this.ctx.ellipse(x + w - rx, y + h - ry, rx, ry, 0, 0, r2d * 90, false);
    this.ctx.lineTo(x + rx, y + h);
    this.ctx.ellipse(x + rx, y + h - ry, rx, ry, 0, r2d * 90, r2d * 180, false);
    this.ctx.lineTo(x, y + ry);
    this.ctx.ellipse(x + rx, y + ry, rx, ry, 0, r2d * 180, r2d * 270, false);
  }
}
