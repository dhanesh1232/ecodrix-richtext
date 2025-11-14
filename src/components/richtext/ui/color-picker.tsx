"use client";

import * as React from "react";
import { SketchPicker, type ColorResult } from "react-color";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolbarButton } from "../toolbar/toolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui";

export const ColorHighlighter = React.forwardRef<
  HTMLButtonElement,
  ColorHighlighterProps
>(
  (
    {
      color,
      onChange,
      disabled,
      className,
      isBack,
      onChangeIsBackground,
      icon,
      size = "sm",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [tempColor, setTempColor] = React.useState(color || "#000000");
    const IconComponent = icon || Check;

    const handleChange = (clr: ColorResult) => {
      setTempColor(clr.hex);
    };

    React.useEffect(() => {
      const close = () => setIsOpen(false);
      window.addEventListener("editor-iframe-click", close);
      return () => window.removeEventListener("editor-iframe-click", close);
    }, []);

    const handleComplete = (clr: ColorResult) => {
      setTempColor(clr.hex);
      onChange?.(clr.hex);
    };

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <ToolbarButton
            active={isOpen}
            className={className}
            ref={ref}
            disabled={disabled}
            toolButtonSize={size}
            tooltip="Color"
            onClick={() => setIsOpen(!isOpen)}
            {...props}
          >
            <IconComponent color="currentColor" />
          </ToolbarButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="p-2 w-[260px] bg-background shadow-lg border border-border rounded"
          align="end"
        >
          <Tabs
            value={isBack}
            onValueChange={(value) =>
              onChangeIsBackground?.(value as "text" | "background")
            }
          >
            <TabsList className="w-full rounded border border-border bg-background">
              <TabsTrigger
                data-active={isBack === "text"}
                value="text"
                className="w-full cursor-pointer rounded"
              >
                Text
              </TabsTrigger>
              <TabsTrigger
                data-active={isBack === "background"}
                value="background"
                className="w-full cursor-pointer rounded"
              >
                Background
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <Picker
                handleChange={handleChange}
                handleComplete={handleComplete}
                color={tempColor}
              />
            </TabsContent>
            <TabsContent value="background">
              <Picker
                handleChange={handleChange}
                handleComplete={handleComplete}
                color={tempColor}
              />
            </TabsContent>
          </Tabs>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

ColorHighlighter.displayName = "ColorHighlighter";

function Picker({
  handleChange,
  handleComplete,
  color,
}: {
  handleChange: (clr: ColorResult) => void;
  handleComplete: (clr: ColorResult) => void;
  color: string;
}) {
  return (
    <SketchPicker
      color={color}
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
            background: "inherit",
            boxShadow: "none",
            borderRadius: "12px",
            cursor: "pointer",
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
        },
      }}
    />
  );
}
