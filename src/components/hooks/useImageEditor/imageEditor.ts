import {IDrawing, ITool, Rect} from './types';
import {
  Point,
  translateBoundingBoxToDocument,
  translateMouseEvent,
  translatePointToCanvas,
} from './utils';

interface Options {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  onLoad?: () => void;
}

class Resizer {
  private boundingBox: Rect;
  private box: HTMLDivElement;
  private isDragging: boolean = false;
  constructor(boundingBox: Rect, onDrag?: (event: MouseEvent) => void) {
    this.boundingBox = boundingBox;

    const box = document.createElement('div');
    this.box = box;
    document.body.appendChild(box);

    const horizontalDashedGradient = `repeating-linear-gradient(
      to right,
      white,
      white 5px,
      black 5px,
      black 10px
    )`;
    const verticalDashedGradient = `repeating-linear-gradient(
      to bottom,
      white,
      white 5px,
      black 5px,
      black 10px
    )`;

    const topBorder = document.createElement('div');
    topBorder.style.position = 'absolute';
    topBorder.style.width = '100%';
    topBorder.style.height = '2px';
    topBorder.style.top = '0';
    topBorder.style.left = '0';
    topBorder.style.backgroundImage = horizontalDashedGradient;

    const bottomBorder = document.createElement('div');
    bottomBorder.style.position = 'absolute';
    bottomBorder.style.width = '100%';
    bottomBorder.style.height = '2px';
    bottomBorder.style.bottom = '0';
    bottomBorder.style.left = '0';
    bottomBorder.style.backgroundImage = horizontalDashedGradient;

    this.box.appendChild(topBorder);
    this.box.appendChild(bottomBorder);

    const leftBorder = document.createElement('div');
    leftBorder.style.position = 'absolute';
    leftBorder.style.height = '100%';
    leftBorder.style.width = '2px';
    leftBorder.style.top = '0';
    leftBorder.style.left = '0';
    leftBorder.style.backgroundImage = verticalDashedGradient;

    const rightBorder = document.createElement('div');
    rightBorder.style.position = 'absolute';
    rightBorder.style.height = '100%';
    rightBorder.style.width = '2px';
    rightBorder.style.top = '0';
    rightBorder.style.right = '0';
    rightBorder.style.backgroundImage = verticalDashedGradient;

    this.box.appendChild(leftBorder);
    this.box.appendChild(rightBorder);

    this.box.addEventListener('mousedown', () => {
      this.isDragging = true;
    });

    this.box.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', e => {
      if (this.isDragging) {
        onDrag?.(e);
      }
    });

    this.updateStyles();
  }

  destroy() {
    this.box.remove();
  }

  move(x: number, y: number) {
    this.boundingBox = {
      ...this.boundingBox,
      x: this.boundingBox.x + x,
      y: this.boundingBox.y + y,
    };
    this.updateStyles();
  }

  private updateStyles() {
    this.box.style.position = 'fixed';
    this.box.style.zIndex = '90000';
    this.box.style.width = `${this.boundingBox.width + 12}px`;
    this.box.style.height = `${this.boundingBox.height + 12}px`;
    this.box.style.left = `${this.boundingBox.x - 6}px`;
    this.box.style.top = `${this.boundingBox.y - 6}px`;
    this.box.style.cursor = 'move';
  }
}

export class ImageEditor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private drawings: IDrawing[] = [];
  private scheduledFrame: number | null = null;
  private image: HTMLImageElement;
  private isInteractive: boolean = false;
  private selectedDrawingId: string | null = null;
  private resizer: Resizer | null = null;
  private _tool: ITool | null = null;
  private _color: string = '#79628c';
  private _strokeSize: number = 6;

  constructor(options: Options) {
    const {canvas, image, onLoad} = options;
    this.canvas = canvas;
    this.image = image;
    this.ctx = canvas.getContext('2d');

    if (image.complete) {
      this.isInteractive = true;
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      this.sheduleUpdateCanvas();
      onLoad?.();
    } else {
      image.addEventListener('load', () => {
        this.isInteractive = true;
        this.canvas.width = image.width;
        this.canvas.height = image.height;
        this.sheduleUpdateCanvas();
        onLoad();
      });
    }

    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove, {passive: true});
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('click', this.handleClick);
    window.addEventListener('keydown', this.handleDelete);
  }

  destroy() {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.removeEventListener('click', this.handleClick);
    window.removeEventListener('keydown', this.handleDelete);
    this.drawings = [];
  }

  set tool(tool: ITool | null) {
    if (this._tool?.isDrawing) {
      // end the current drawing and discard it
      this._tool.endDrawing(Point.fromNumber(0));
    }
    this._tool = tool;
    // TODO(arthur): where to place this?
    this.canvas.style.cursor = this._tool ? 'crosshair' : 'grab';
  }

  get tool(): ITool | null {
    return this._tool;
  }

  set color(color: string) {
    this._color = color;
    if (this.selectedDrawingId) {
      const selectedDrawing = this.drawings.find(d => d.id === this.selectedDrawingId);
      selectedDrawing?.setColor(color);
    }
  }

  get color(): string {
    return this._color;
  }

  set strokeSize(strokeSize: number) {
    this._strokeSize = strokeSize;
    if (this.selectedDrawingId) {
      const selectedDrawing = this.drawings.find(d => d.id === this.selectedDrawingId);
      selectedDrawing?.setStrokeSize(strokeSize);
    }
  }

  get strokeSize(): number {
    return this._strokeSize;
  }

  private updateCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    this.drawings.forEach(drawing => {
      drawing.drawToCanvas(this.ctx, drawing.id === this.selectedDrawingId);
    });
    if (this._tool?.isDrawing) {
      const drawing = this._tool.getDrawingBuffer();
      if (drawing) {
        drawing.drawToCanvas(this.ctx, false);
      }
    }
  };

  private sheduleUpdateCanvas = () => {
    if (this.scheduledFrame) {
      cancelAnimationFrame(this.scheduledFrame);
    }
    this.scheduledFrame = requestAnimationFrame(this.updateCanvas);
  };

  private handleClick = (e: MouseEvent) => {
    if (this._tool || !this.isInteractive) {
      return;
    }
    const point = translateMouseEvent(e, this.canvas);
    const drawing = [...this.drawings].reverse().find(d => d.isInPath(this.ctx, point));
    this.selectedDrawingId = drawing?.id;
    this.sheduleUpdateCanvas();
    this.resizer?.destroy();
    this.resizer = null;
    if (drawing) {
      const boundingBox = drawing.getBoundingBox();
      this.resizer = new Resizer(
        translateBoundingBoxToDocument(boundingBox, this.canvas),
        this.handleDrag
      );
    }
  };

  private handleDelete = (e: KeyboardEvent) => {
    if (!this.selectedDrawingId || !['Delete', 'Backspace'].includes(e.key)) {
      return;
    }
    this.drawings = this.drawings.filter(d => d.id !== this.selectedDrawingId);
    this.selectedDrawingId = null;
    this.resizer?.destroy();
    this.resizer = null;
    this.sheduleUpdateCanvas();
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (!this._tool || this._tool.isDrawing || !this.isInteractive) {
      return;
    }
    this._tool.startDrawing(translateMouseEvent(e, this.canvas), this._color);
    this.sheduleUpdateCanvas();
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this._tool || !this._tool.isDrawing) {
      return;
    }
    this._tool.draw(translateMouseEvent(e, this.canvas));
    this.sheduleUpdateCanvas();
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (!this._tool || !this._tool.isDrawing) {
      return;
    }
    const drawing = this._tool.endDrawing(translateMouseEvent(e, this.canvas));
    if (drawing) {
      this.drawings.push(drawing);
    }
    this.sheduleUpdateCanvas();
  };

  private handleDrag = (e: MouseEvent) => {
    const selectedDrawing = this.drawings.find(d => d.id === this.selectedDrawingId);
    if (!this.resizer || !this.selectedDrawingId) {
      return;
    }
    const delta = Point.fromNumber(e.movementX, e.movementY);
    selectedDrawing.moveBy(translatePointToCanvas(delta, this.canvas));
    this.resizer.move(e.movementX, e.movementY);
    this.sheduleUpdateCanvas();
  };

  public getDataURL = (): string => {
    return this.canvas.toDataURL();
  };

  public getBlob = (): Promise<Blob> => {
    return new Promise<Blob>(resolve => {
      this.canvas.toBlob(blob => {
        resolve(blob);
      });
    });
  };
}
