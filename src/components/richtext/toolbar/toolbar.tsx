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
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ToolbarWrapperProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  children?: React.ReactNode;
}

const EdgeIndicator = ({
  direction,
  visible,
  shadowIntensity,
  onClick,
}: {
  direction: "left" | "right";
  visible: boolean;
  shadowIntensity: number;
  onClick: () => void;
}) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <div
      className={cn(
        "absolute top-0 bottom-0 z-30 flex items-center justify-center transition-all duration-300 w-8",
        direction === "left"
          ? "left-0 bg-gradient-to-r from-background via-background/80 to-transparent"
          : "right-0 bg-gradient-to-l from-background via-background/80 to-transparent",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <button
        onClick={onClick}
        className={cn(
          "w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200",
          "bg-background border border-border shadow-sm hover:bg-accent hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
        aria-label={`Scroll ${direction}`}
      >
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  );
};

export const ToolbarWrapper = React.forwardRef<
  HTMLDivElement,
  ToolbarWrapperProps
>(({ children, className, ...props }, ref) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [shadowIntensity, setShadowIntensity] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const updateOverflow = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 5);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  // Enhanced drag-to-scroll with better UX
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    const onDown = (e: MouseEvent) => {
      isDown = true;
      setIsDragging(true);
      startX = e.pageX;
      scrollStart = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };

    const onUp = () => {
      isDown = false;
      setIsDragging(false);
      el.style.cursor = "grab";
      el.style.userSelect = "auto";
    };

    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      const diff = (e.pageX - startX) * 1.6; // Slightly faster scrolling
      el.scrollLeft = scrollStart - diff;
      updateOverflow();
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [updateOverflow]);

  // Dynamic shadow with momentum
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let lastScroll = el.scrollLeft;
    let lastTime = Date.now();
    let velocity = 0;

    const onScroll = () => {
      const now = Date.now();
      const currentScroll = el.scrollLeft;
      const deltaTime = now - lastTime;

      if (deltaTime > 0) {
        velocity = Math.abs(currentScroll - lastScroll) / deltaTime;
        setShadowIntensity(Math.min(velocity * 20, 1));
      }

      lastScroll = currentScroll;
      lastTime = now;
      updateOverflow();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [updateOverflow]);

  const scrollBy = (amount: number) => {
    containerRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  // Enhanced magnetic hover with ripple effect
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    return React.cloneElement(child as React.ReactElement<any>, {
      className: cn(
        (child as React.ReactElement<any>).props.className,
        "transition-all duration-200"
      ),
    });
  });

  return (
    <div
      className="relative w-full overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <EdgeIndicator
        direction="left"
        visible={showLeft && hovered}
        shadowIntensity={shadowIntensity}
        onClick={() => scrollBy(-200)}
      />

      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        className={cn(
          "flex items-center gap-1 overflow-x-auto px-3 py-2 scroll-smooth hide-scrollbar",
          "overflow-y-hidden select-none touch-pan-x",
          "bg-background/95 backdrop-blur-sm border-b",
          isDragging ? "cursor-grabbing" : "cursor-grab",
          "transition-all duration-300",
          className
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        {...props}
      >
        {enhancedChildren}
      </div>

      <EdgeIndicator
        direction="right"
        visible={showRight && hovered}
        shadowIntensity={shadowIntensity}
        onClick={() => scrollBy(200)}
      />
    </div>
  );
});

ToolbarWrapper.displayName = "ToolbarWrapper";

export const ToolbarGroup = React.forwardRef<
  HTMLDivElement,
  ToolbarWrapperProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-1 px-1 first:pl-0 last:pr-0",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ToolbarGroup.displayName = "ToolbarGroup";

export const ToolbarButtonSeparator: React.FC<SeparatorProps> = ({
  orientation = "vertical",
}) => {
  return (
    <Separator
      orientation={orientation}
      role="separator"
      style={{
        height: "1.75rem",
      }}
      className={cn(
        "h-6 mx-1 bg-border/60",
        orientation === "vertical" ? "w-px" : "h-px w-full"
      )}
    />
  );
};

interface ToolbarButtonProps extends React.ComponentProps<typeof Button> {
  active?: boolean;
  toolButtonSize?: "xs" | "sm" | "md";
  tooltip?: string;
  children: React.ReactNode;
}

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
      disabled,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    React.useEffect(() => {
      const closeTooltip = () => setOpen(false);
      window.addEventListener("editor-iframe-enter", closeTooltip);
      return () =>
        window.removeEventListener("editor-iframe-enter", closeTooltip);
    }, []);

    const sizeClasses = {
      xs: "h-7 w-7 rounded-md text-xs",
      sm: "h-8 w-8 rounded-md text-sm",
      md: "h-9 w-9 rounded-lg text-base",
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsPressed(true);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onClick?.(e);
    };

    const button = (
      <Button
        size="icon"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        variant="ghost"
        ref={ref}
        disabled={disabled}
        data-active={active}
        data-pressed={isPressed}
        className={cn(
          sizeClasses[toolButtonSize],
          "relative transition-all duration-200",
          "border border-transparent hover:border-border/50",
          "bg-background hover:bg-accent/50 active:bg-accent",
          "shadow-sm hover:shadow-md active:shadow-sm",
          "focus:outline-none focus:ring-0 focus:ring-offset-0",
          "disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none",
          active && "bg-accent text-accent-foreground border-border/30",
          isPressed && "scale-95 bg-accent",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "transition-transform duration-200",
            isPressed && "scale-90"
          )}
        >
          {children}
        </div>

        {/* Active indicator dot */}
        {active && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </Button>
    );

    if (!tooltip) return button;

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip open={open && !disabled} onOpenChange={setOpen}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="text-xs font-medium px-2 py-1 bg-foreground text-background"
            sideOffset={8}
          >
            {tooltip}
            <kbd className="ml-1 text-xs opacity-70">⌘</kbd>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";
