// components/editor/ToolbarSection.tsx
import * as React from "react";

export const ToolbarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { section: AllToolTypes }
>(({ section, className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-section={section}
      className={`flex items-center shrink-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
ToolbarSection.displayName = "ToolbarSection";
