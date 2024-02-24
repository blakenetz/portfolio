import { createContext } from "react";

export type ColorContext<T = boolean> = {
  ada: T;
  toggle: (val: T | ((prevState: T) => T)) => void;
};

export default createContext<ColorContext>({
  ada: false,
  toggle: () => null,
});
