import { useState, useEffect, useCallback } from 'react';

export const useCenteredTree = () => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const containerRef = useCallback((containerElem: HTMLDivElement | null) => {
    if (containerElem) {
      const { width, height } = containerElem.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 2.5 });
    }
  }, []);

  return { translate, containerRef };
};