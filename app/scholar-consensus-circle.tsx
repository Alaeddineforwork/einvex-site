"use client";

import { useEffect, useState } from "react";

type ScholarConsensusCircleProps = {
  percentage: number;
  strokeColor: string;
  trackColor: string;
  textClassName: string;
  size?: number;
  strokeWidth?: number;
};

export default function ScholarConsensusCircle({
  percentage,
  strokeColor,
  trackColor,
  textClassName,
  size = 84,
  strokeWidth = 8,
}: ScholarConsensusCircleProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;

    if (mediaQuery.matches) {
      frameId = window.requestAnimationFrame(() => {
        setAnimatedPercentage(percentage);
      });

      return () => window.cancelAnimationFrame(frameId);
    }

    frameId = window.requestAnimationFrame(() => {
      const duration = 1200;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setAnimatedPercentage(Math.round(percentage * easedProgress));

        if (progress < 1) {
          frameId = window.requestAnimationFrame(animate);
        }
      };

      frameId = window.requestAnimationFrame(animate);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [percentage]);

  return (
    <div className="relative flex h-[84px] w-[84px] items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-150 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-semibold tracking-tight ${textClassName}`}>
          {animatedPercentage}%
        </span>
      </div>
    </div>
  );
}
