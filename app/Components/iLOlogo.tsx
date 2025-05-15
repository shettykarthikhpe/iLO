
import React, { useEffect, useState } from 'react';
import styles from './iLOlogo.module.css';

const HexLogo = () => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  const getHexPoints = (cx: number, cy: number, r: number) =>
    Array.from({ length: 6 }).map((_, i) => {
      const angle = Math.PI / 3 * i - Math.PI / 2;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    });

  const outer = getHexPoints(100, 100, 80);
  const inner = getHexPoints(100, 100, 40);

  return (
    <svg
      key={animationKey} 
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.svg}
    >
      {outer.map((point, i) => {
        const [x1, y1] = point;
        const [x2, y2] = outer[(i + 1) % 6];
        return (
          <line
            key={`outer-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={`${styles.line} ${styles[`line${i}`]}`}
          />
        );
      })}

      {inner.map((point, i) => {
        const [x1, y1] = point;
        const [x2, y2] = inner[(i + 1) % 6];
        return (
          <line
            key={`inner-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={`${styles.line} ${styles[`line${i + 6}`]}`}
          />
        );
      })}

      {[1, 3, 5].map((i, idx) => {
        const [x1, y1] = outer[i];
        const [x2, y2] = inner[i];
        return (
          <line
            key={`connect-${idx}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={`${styles.line} ${styles[`line${idx + 12}`]}`}
          />
        );
      })}

      {[0, 2, 4].map((i, idx) => {
        const [x, y] = inner[i];
        return (
          <line
            key={`yline-${idx}`}
            x1={x}
            y1={y}
            x2={100}
            y2={100}
            className={`${styles.line} ${styles[`line${idx + 15}`]}`}
          />
        );
      })}

      <circle cx="100" cy="100" r="4" className={styles.centerDot} />
    </svg>
  );
};

export default HexLogo;