"use client";
import * as React from "react";
import { Skeleton } from "../../ui/skeleton";

/* 🩶 Skeleton Loader */
export const EditorSkeleton: React.FC<{ animation?: string }> = ({
  animation = "pulse",
}) => {
  const base = "w-full bg-muted";
  const animationClass =
    animation === "shine"
      ? "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent"
      : "animate-pulse";

  return (
    <div
      className={`border border-border w-full rounded-md overflow-hidden bg-background ${animationClass}`}
    >
      {/* Toolbar Skeleton */}
      <div className="flex items-center gap-2 relative px-2 py-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((width) => (
          <Skeleton
            className={`${base} h-7 ${
              width === 3 ? "w-16 lg:w-20" : "w-7 lg:w-8"
            }  lg:h-8`}
            key={width}
          />
        ))}
        <Skeleton className="absolute right-1" />
      </div>
      <div className="h-px bg-border" />
      <div className={`${base} h-64`} />
    </div>
  );
};

/* ⚪ Dots Loader */
export const DotsLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-48 w-full border border-border rounded-md bg-white">
    <div className="flex space-x-2">
      <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" />
    </div>
    <p className="text-xs text-muted-foreground mt-3">Loading editor...</p>
  </div>
);

/* 🌀 Spinner Loader */
export const SpinnerLoader: React.FC = () => (
  <div className="flex items-center justify-center h-48 w-full border border-border rounded-md bg-white">
    <div className="w-6 h-6 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
  </div>
);

/* Tailwind CSS (add to globals.css or tailwind.config.js)
---------------------------------------------------------
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
--------------------------------------------------------- */
