"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { SketchPicker, type ColorResult } from "react-color";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "./button";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";

interface ColorHighlighterProps {
  /** Current text color */
  color?: string;
  /** Triggered when a color is selected */
  onChange?: (color: string) => void;
  /** Optional additional props for the trigger button */
  disabled?: boolean;
  className?: string;
  icon?: keyof typeof Icons;
}

export const ColorHighlighter = React.forwardRef<
  HTMLButtonElement,
  ColorHighlighterProps
>(({ color, onChange, disabled, className, icon = "baseLine" }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempColor, setTempColor] = React.useState(color || "#000000");

  const handleChange = (clr: ColorResult) => setTempColor(clr.hex);
  const handleComplete = (clr: ColorResult) => onChange?.(clr.hex);

  const applyColor = () => setIsOpen(false);

  const Icon = Icons[icon];
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={cn("px-0 p-0 flex items-center gap-0", className)}
        ref={ref}
        disabled={disabled}
        style={{ color: tempColor }}
      >
        <Icon size={15} strokeWidth={2} />
        <ChevronDown className="text-muted-foreground" size={12} />
      </PopoverTrigger>

      <PopoverContent
        className="p-2 w-[260px] bg-background shadow-lg border border-border rounded"
        align="end"
      >
        <SketchPicker
          color={tempColor}
          onChange={handleChange}
          onChangeComplete={handleComplete}
          disableAlpha={true}
          presetColors={[
            "#4F46E5",
            "#7C3AED",
            "#EC4899",
            "#F43F5E",
            "#EF4444",
            "#F97316",
            "#F59E0B",
            "#10B981",
            "#06B6D4",
            "#0EA5E9",
            "#3B82F6",
            "#64748B",
            "#000000",
            "#FFFFFF",
          ]}
          styles={{
            default: {
              picker: {
                padding: "0px",
                maxWidth: "100%",
                width: "250px",
                background: "inherit", // whole background
                boxShadow: "none",
                borderRadius: "12px",
              },
              saturation: {
                borderRadius: "6px",
                marginBottom: "12px",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.05)",
              },
              controls: {
                display: "flex",
                justifyContent: "space-between",
                color: "inherit",
              },
              color: {
                color: "inherit",
                background: "#000",
                borderRadius: "6px",
              },
              activeColor: {
                borderRadius: "8px",
                border: "1px solid #444",
              },
              hue: {
                color: "inherit",
                height: "12px",
                borderRadius: "8px",
              },
              alpha: {
                color: "inherit",
                height: "12px",
                borderRadius: "8px",
              },
            },
          }}
        />
        <div className="pt-2 border-t border-border mt-2">
          <Button
            size="sm"
            variant="primary"
            className="w-full flex items-center justify-center"
            onClick={applyColor}
          >
            <Check className="h-4 w-4 mr-2" />
            Apply Color
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});

ColorHighlighter.displayName = "ColorHighlighter";
