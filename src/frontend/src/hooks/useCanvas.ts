import { useCallback, useEffect, useRef, useState } from "react";

export interface CanvasDimensions {
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
}

export function useGameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [dims, setDims] = useState<CanvasDimensions>({
    width: 480,
    height: 800,
    scaleX: 1,
    scaleY: 1,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (context) setCtx(context);

    const updateDims = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const targetAspect = 480 / 800;
      const parentAspect = w / h;
      let renderW: number;
      let renderH: number;
      if (parentAspect < targetAspect) {
        renderW = w;
        renderH = w / targetAspect;
      } else {
        renderH = h;
        renderW = h * targetAspect;
      }
      canvas.style.width = `${renderW}px`;
      canvas.style.height = `${renderH}px`;
      setDims({
        width: 480,
        height: 800,
        scaleX: renderW / 480,
        scaleY: renderH / 800,
      });
    };

    updateDims();
    const ro = new ResizeObserver(updateDims);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, []);

  const clear = useCallback(() => {
    if (ctx) ctx.clearRect(0, 0, 480, 800);
  }, [ctx]);

  return { canvasRef, ctx, dims, clear };
}
