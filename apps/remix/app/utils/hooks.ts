import { useEffect, useRef, useState } from "react";

export function useElementRect<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [rect, setRect] = useState<DOMRect | undefined>();

  useEffect(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
    // add ref.current as dep or else hook won't fire
     
  }, [ref.current]);

  return [ref, rect] as const;
}
