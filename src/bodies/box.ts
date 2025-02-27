import SAT from "sat";
import { BBox } from "rbush";
import { System } from "../system";
import { ICollider, Types, Vector } from "../model";
import { ensureVectorPoint, createBox } from "../utils";
import { Polygon } from "./polygon";

/**
 * collider - box
 */
export class Box extends SAT.Polygon implements BBox, ICollider {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  isStatic?: boolean;
  isTrigger?: boolean;
  system?: System;

  readonly type: Types = Types.Box;

  /**
   * collider - box
   * @param {Vector} position {x, y}
   * @param {number} width
   * @param {number} height
   */
  constructor(position: Vector, width: number, height: number) {
    super(ensureVectorPoint(position), createBox(width, height));

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
    const [topLeft, _, topRight] = this.calcPoints;

    this.minX = this.pos.x + topLeft.x;
    this.minY = this.pos.y + topLeft.y;
    this.maxX = this.pos.x + topRight.x;
    this.maxY = this.pos.y + topRight.y;
  }

  /**
   * Draws collider on a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The canvas context to draw on
   */
  draw(context: CanvasRenderingContext2D): void {
    Polygon.prototype.draw.call(this, context);
  }
}
