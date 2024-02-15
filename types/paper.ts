/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */

type ViewEvent = {
  /** the number of times the frame event was fired */
  count: number;
  /** the total amount of time passed since the first frame event in seconds */
  delta: number;
  /** the time passed in seconds since the last frame event */
  time: number;
};
declare namespace paper {
  interface Item {
    segments: paper.Segment[];
  }
  interface View {
    onFrame: (e: ViewEvent) => void;
  }
}
