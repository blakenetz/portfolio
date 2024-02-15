/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
declare namespace paper {
  interface Item {
    segments: paper.Segment[];
  }
  interface View {
    onFrame: (e: { count: number }) => void;
  }
}
