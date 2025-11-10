// toolbar.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SeparatorProps } from "@radix-ui/react-separator";
import * as React from "react";

interface ToolbarWrapperProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  children?: React.ReactNode;
}

const ToolbarWrapper = React.forwardRef<HTMLDivElement, ToolbarWrapperProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
        {children}
      </div>
    );
  }
);

ToolbarWrapper.displayName = "ToolbarWrapper";

const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarWrapperProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ToolbarGroup.displayName = "ToolbarGroup";

export const ToolbarButtonSeparator: React.FC<SeparatorProps> = ({
  orientation = "vertical",
}) => {
  return (
    <Separator
      orientation={orientation}
      role="separator"
      style={{ height: "2rem" }}
      className="border border-border border-l-0 border-y-0 w-px"
    />
  );
};

export const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(
  (
    {
      children,
      onClick,
      active = false,
      toolButtonSize = "sm",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: { style: "px-3 py-1 rounded-sm", size: "icon-sm" },
      md: { style: "px-4 py-2 rounded-md", size: "icon" },
      xs: { style: "px-2 py-0.5 rounded", size: "icon-xs" },
    };

    const { style, size } = sizeClasses[toolButtonSize];

    const button = (
      <Button
        size={size as "icon-xs" | "icon-sm" | "icon"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        variant="outline"
        ref={ref}
        data-active={active}
        className={cn(
          `rounded border cursor-pointer text-sm disabled:cursor-not-allowed data-[active=true]:bg-accent data-[active=true]:text-foreground text-foreground/80 hover:text-foreground`,
          className,
          style
        )}
        {...props}
      >
        {children}
      </Button>
    );

    if (!tooltip) return button;
    return (
      <TooltipProvider delayDuration={250}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent
            side="top"
            align="end"
            className="text-xs font-medium"
          >
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";

export { ToolbarWrapper, ToolbarGroup };
