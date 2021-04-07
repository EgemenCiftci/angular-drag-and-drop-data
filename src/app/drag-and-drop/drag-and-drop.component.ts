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
  @Input() width: number;
  @Input() height: number;
  @Input() cardName: string;
  @Input() showInfo = true;
  @Input() showCrosshair = true;
  @Input() allowDrag = true;
  @Input() allowDrop = true;
  background =
    "linear-gradient(135deg, rgba(10,36,99,0.4) 0%, rgba(25,89,163,0.4) 100%)";

  constructor(public dragAndDropService: DragAndDropService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.dragAndDropService.onReset.subscribe(() => this.clearCanvas());
  }

  onpointerdown(e: any) {
    // Reposition Drop Target
    if (this.dragAndDropService.isInDragDropMode) {
      this.dragAndDropService.isMouseDown = true;
      this.dragAndDropService.fromCard = this.cardName;
      this.dragAndDropService.toX = e.offsetX;
      this.dragAndDropService.toY = e.offsetY;
      this.clearCanvas();
      if (this.showCrosshair) {
        this.drawCrosshair(e.offsetX, e.offsetY);
      }
      this.canvas.nativeElement.setPointerCapture(e.pointerId);
    }
  }

  onpointermove(e: any) {
    if (
      this.dragAndDropService.isMouseDown &&
      this.dragAndDropService.isInDragDropMode
    ) {
      if (!this.dragAndDropService.isDragging) {
        this.dragAndDropService.isDragging = true;
        this.canvas.nativeElement.setPointerCapture(e.pointerId);
        console.log("setPointerCapture: " + this.cardName);
      }

      this.clearCanvas();
      if (this.showCrosshair) {
        const isCrosshairInBounds =
          e.offsetX >= 0 &&
          e.offsetY >= 0 &&
          e.offsetX < this.width &&
          e.offsetY < this.height;
        if (isCrosshairInBounds) {
          this.drawCrosshair(e.offsetX, e.offsetY);
        } else {
          const tos = this.getTos(e);
          if (tos) {
            this.clearCanvas();
            this.canvas.nativeElement.releasePointerCapture(e.pointerId);
            console.log("releasePointerCapture: " + this.cardName);
            this.dragAndDropService.isDragging = false;
          }
        }
      }
    }
  }

  onpointerup(e: any) {
    if (
      this.dragAndDropService.isMouseDown &&
      this.dragAndDropService.isInDragDropMode
    ) {
      const tos = this.getTos(e);
      if (tos) {
        const toCard = tos.element.attributes["ng-reflect-card-name"].value;
        if (this.allowDrop) {
          this.dragAndDropService.toCard = this.cardName;
          this.dragAndDropService.toX = e.offsetX;
          this.dragAndDropService.toY = e.offsetY;
          if (this.showInfo) {
            this.drawInfo();
          }
          console.log(
            `From: ${this.dragAndDropService.fromCard} => (${
              this.dragAndDropService.fromX
            },${this.dragAndDropService.fromY})\nTo: ${
              this.dragAndDropService.toCard
            } => (${this.dragAndDropService.toX},${
              this.dragAndDropService.toY
            })`
          );
        } else {
          this.dragAndDropService.reset();
        }
      } else {
        this.dragAndDropService.reset();
      }
    }
    this.dragAndDropService.isMouseDown = false;
    this.dragAndDropService.isDragging = false;
    this.canvas.nativeElement.releasePointerCapture(e.pointerId);
  }

  onpointerenter(e: any) {
    console.log("Enter");
  }

  onpointerleave(e: any) {
    console.log("Leave");
  }

  onpointerover(e: any) {
    console.log("Over");
  }

  onpointerout(e: any) {
    console.log("Out");
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
    this.ctx.ellipse(simplifiedX, simplifiedY, 6, 6, 0, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fillStyle = "white";
    this.ctx.fill();
  }

  drawInfo() {
    const w = 150;
    const x = this.ctx.canvas.width - (w + 10);
    const y = 10;
    const h = 110;
    this.ctx.fillStyle = "rgb(112, 87, 56)";
    this.ctx.globalAlpha = 1;
    this.roundedRect(x, y, w, h, 6, 6);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("FromCard:", x + 10, y + 10, 80);
    this.ctx.fillText("FromX:", x + 10, y + 25, 80);
    this.ctx.fillText("FromY:", x + 10, y + 40, 80);

    this.ctx.moveTo(x + 10, y + 54.5);
    this.ctx.lineTo(x + w - 10, y + 54.5);
    this.ctx.stroke();

    this.ctx.fillText("ToCard:", x + 10, y + 60, 80);
    this.ctx.fillText("ToX:", x + 10, y + 75, 80);
    this.ctx.fillText("ToY:", x + 10, y + 90, 80);

    this.ctx.textAlign = "end";
    this.ctx.fillText(this.dragAndDropService.fromCard, x + w - 10, y + 10, 80);
    this.ctx.fillText(
      Math.floor(this.dragAndDropService.fromX).toString(),
      x + w - 10,
      y + 25,
      80
    );
    this.ctx.fillText(
      Math.floor(this.dragAndDropService.fromY).toString(),
      x + w - 10,
      y + 40,
      80
    );

    this.ctx.fillText(this.dragAndDropService.toCard, x + w - 10, y + 60, 80);
    this.ctx.fillText(
      Math.floor(this.dragAndDropService.toX).toString(),
      x + w - 10,
      y + 75,
      80
    );
    this.ctx.fillText(
      Math.floor(this.dragAndDropService.toY).toString(),
      x + w - 10,
      y + 90,
      80
    );
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
