export interface SnackbarElement extends HTMLElement {
  show: (timeout?: number) => void;
  hide: () => void;
}
