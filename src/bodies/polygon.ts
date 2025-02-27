import SAT from "sat";
import { BBox } from "rbush";
import { System } from "../system";
import { ICollider, Types, Vector } from "../model";
import { ensureVectorPoint, ensurePolygonPoints, dashLineTo } from "../utils";

/**
 * collider - polygon
 */
export class Polygon extends SAT.Polygon implements BBox, ICollider {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  isStatic?: boolean;
  isTrigger?: boolean;
  system?: System;

  readonly type: Types = Types.Polygon;

  /**
   * collider - polygon
   * @param {Vector} position {x, y}
   * @param {Vector[]} points
   */
  constructor(position: Vector, points: Vector[]) {
    super(ensureVectorPoint(position), ensurePolygonPoints(points));

    this.updateAABB();
  }

  /**
   * update position
   * @param {number} x
   * @param {number} y
   */
  setPosition(x: number, y: number): void {
    this.pos.x = x;
    this.pos.y = y;

    this.system?.updateBody(this);
  }

  /**
   * Updates Bounding Box of collider
   */
  updateAABB(): void {
    const { pos, w, h } = (this as any).getAABBAsBox();

    this.minX = pos.x;
    this.minY = pos.y;
    this.maxX = pos.x + w;
    this.maxY = pos.y + h;
  }

  /**
   * Draws collider on a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The canvas context to draw on
   */
  draw(context: CanvasRenderingContext2D): void {
    [...this.calcPoints, this.calcPoints[0]].forEach((point, index: number) => {
      const toX = this.pos.x + point.x;
      const toY = this.pos.y + point.y;
      const prev =
        this.calcPoints[index - 1] ||
        this.calcPoints[this.calcPoints.length - 1];

      if (!index) {
        if (this.calcPoints.length === 1) {
          context.arc(toX, toY, 1, 0, Math.PI * 2);
        } else {
          context.moveTo(toX, toY);
        }
      } else if (this.calcPoints.length > 1) {
        if (this.isTrigger) {
          const fromX = this.pos.x + prev.x;
          const fromY = this.pos.y + prev.y;

          dashLineTo(context, fromX, fromY, toX, toY);
        } else {
          context.lineTo(toX, toY);
        }
      }
    });
  }
}
