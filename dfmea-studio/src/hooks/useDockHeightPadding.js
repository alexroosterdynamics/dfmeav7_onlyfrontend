import { useLayoutEffect, useRef, useState } from "react";

export function useDockHeightPadding() {
  const dockRef = useRef(null);
  const [dockHeight, setDockHeight] = useState(0);

  useLayoutEffect(() => {
    if (!dockRef.current) return;
    const ro = new ResizeObserver((entries) => {
      setDockHeight(Math.ceil(entries[0].contentRect.height));
    });
    ro.observe(dockRef.current);
    return () => ro.disconnect();
  }, []);

  return { dockRef, dockHeight };
}