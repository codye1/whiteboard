// StatsComponent.tsx
import { useEffect, useRef } from 'react';
import Stats from 'stats.js';

const StatsComponent = () => {
  const statsRef = useRef<Stats | null>(null);

  useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    statsRef.current = stats;
    document.body.appendChild(stats.dom);
    stats.dom.style.top = '';
    stats.dom.style.left = '';
    stats.dom.style.bottom = '0px';
    stats.dom.style.right = '0px';

    const updateStats = () => {
      stats.begin();
      // monitored code goes here
      stats.end();
      requestAnimationFrame(updateStats);
    };

    requestAnimationFrame(updateStats);

    return () => {
      document.body.removeChild(stats.dom);
    };
  }, []);

  return null;
};

export default StatsComponent;
