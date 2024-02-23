import { createContext } from "react";

export type ColorContext<T = boolean> = {
  ada: T;
  toggle: (value?: T) => void;
};

export default createContext<ColorContext>({
  ada: false,
  toggle: () => null,
});
