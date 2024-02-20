declare module "warpjs" {
  export type Points = [x: number, y: number, z: number];

  export type Transformer = (points: Points) => Points;

  export default class Warp {
    constructor(element: HTMLElement);
    transform(transformer: Transformer): void;
    interpolate(arg: number): void;
  }
}
