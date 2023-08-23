import {IDrawing, IPoint, ITool, Rect} from './types';
import {
  getPointsBoundingBox,
  Point,
  translateRect,
  updateBoundingBox,
  Vector,
} from './utils';

class Tool implements ITool {
  private DrawingConstructor: new () => IDrawing;
  private drawing: IDrawing | null = null;

  get isDrawing() {
    return this.drawing !== null;
  }

  constructor(DrawingConstructor: new () => IDrawing) {
    this.DrawingConstructor = DrawingConstructor;
  }

  startDrawing(point: IPoint, color: string, scalingFactor: number) {
    this.drawing = new this.DrawingConstructor();
    this.drawing.setScalingFactor(scalingFactor);
    this.drawing.setColor(color);
    this.drawing.start(point);
  }

  draw(point: IPoint) {
    if (!this.isDrawing) {
      throw new Error('Call startDrawing before calling draw');
    }
    this.drawing.draw(point);
  }
  endDrawing(point: IPoint) {
    if (!this.isDrawing) {
      throw new Error('Call startDrawing before calling endDrawing');
    }
    this.drawing.end(point);
    const drawing = this.drawing;
    this.drawing = null;
    return drawing;
  }
  getDrawingBuffer() {
    return this.drawing;
  }
}

class Drawing implements IDrawing {
  protected path = new Path2D();
  protected startPoint: IPoint;
  protected endPoint: IPoint;
  protected translate: IPoint = {x: 0, y: 0};
  protected color = 'red';
  protected strokeSize = 6;
  protected scalingFactor = 1;

  public id = Math.random().toString();

  constructor() {
    this.start = this.start.bind(this);
    this.draw = this.draw.bind(this);
    this.end = this.end.bind(this);
    this.isInPath = this.isInPath.bind(this);
    this.drawToCanvas = this.drawToCanvas.bind(this);
    this.getBoundingBox = this.getBoundingBox.bind(this);
  }

  get isValid() {
    return true;
  }

  start(point: IPoint): void {
    this.startPoint = point;
    this.endPoint = point;
  }

  draw(point: IPoint): void {
    this.endPoint = point;
  }

  end(point: IPoint): void {
    this.endPoint = point;
  }

  getBoundingBox() {
    return getPointsBoundingBox([
      Point.add(this.startPoint, this.translate),
      Point.add(this.endPoint, this.translate),
    ]);
  }

  setScalingFactor(scalingFactor: number) {
    this.scalingFactor = scalingFactor;
  }

  setColor(color: string) {
    this.color = color;
  }

  setStrokeSize(strokeSize: number) {
    this.strokeSize = strokeSize;
  }

  isInPath(context: CanvasRenderingContext2D, point: IPoint) {
    context.translate(this.translate.x, this.translate.y);
    const isCollision = context.isPointInStroke(this.path, point.x, point.y);

    // Reset current transformation matrix to the identity matrix
    context.setTransform(1, 0, 0, 1, 0, 0);
    return isCollision;
  }

  drawToCanvas(context: CanvasRenderingContext2D) {
    if (!this.isValid) {
      return;
    }

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = this.color;
    context.lineWidth = this.strokeSize * this.scalingFactor;

    context.translate(this.translate.x, this.translate.y);
    context.stroke(this.path);

    // Reset current transformation matrix to the identity matrix
    context.setTransform(1, 0, 0, 1, 0, 0);
  }

  moveBy(point: IPoint) {
    this.translate = Point.add(this.translate, point);
  }
}

class RectangleDrawing extends Drawing {
  get isValid() {
    return Point.distance(this.startPoint, this.endPoint) > 0;
  }

  draw = (point: IPoint) => {
    super.draw(point);
    this.endPoint = point;
    this.path = new Path2D();
    this.path.rect(
      this.startPoint.x,
      this.startPoint.y,
      this.endPoint.x - this.startPoint.x,
      this.endPoint.y - this.startPoint.y
    );
  };
}

export class Rectangle extends Tool {
  constructor() {
    super(RectangleDrawing);
  }
}

class PenDrawing extends Drawing {
  private lastPoint: IPoint;
  private boundingBox: Rect;

  getBoundingBox(): Rect {
    return translateRect(this.boundingBox, this.translate);
  }

  start = (point: IPoint) => {
    super.start(point);
    this.path.moveTo(point.x, point.y);
    this.lastPoint = point;
    this.boundingBox = getPointsBoundingBox([point]);
  };

  draw = (point: IPoint) => {
    super.draw(point);
    // Smooth the line
    if (Point.distance(this.lastPoint, point) < 5) {
      return;
    }
    this.lastPoint = point;
    this.path.lineTo(point.x, point.y);
    this.boundingBox = updateBoundingBox(this.boundingBox, [point]);
  };

  end = (point: IPoint) => {
    this.path.lineTo(point.x, point.y);
    this.boundingBox = updateBoundingBox(this.boundingBox, [point]);
  };
}

export class Pen extends Tool {
  constructor() {
    super(PenDrawing);
  }
}

class ArrowDrawing extends Drawing {
  get isValid() {
    return Point.distance(this.startPoint, this.endPoint) > 0;
  }

  draw = (point: IPoint) => {
    super.draw(point);

    this.path = new Path2D();
    this.path.moveTo(this.startPoint.x, this.startPoint.y);
    this.path.lineTo(this.endPoint.x, this.endPoint.y);
    const unitVector = new Vector(
      Point.subtract(this.startPoint, this.endPoint)
    ).normalize();
    const leftVector = unitVector.rotate(Math.PI / 5);
    const rightVector = unitVector.rotate(-Math.PI / 5);
    const leftPoint = Point.add(
      this.endPoint,
      Point.multiply(leftVector, 20 * this.scalingFactor)
    );
    const rightPoint = Point.add(
      this.endPoint,
      Point.multiply(rightVector, 20 * this.scalingFactor)
    );
    this.path.lineTo(leftPoint.x, leftPoint.y);
    this.path.moveTo(this.endPoint.x, this.endPoint.y);
    this.path.lineTo(rightPoint.x, rightPoint.y);
  };
}

export class Arrow extends Tool {
  constructor() {
    super(ArrowDrawing);
  }
}
