"use client";
import * as React from "react";
import { ToolbarButton } from "../toolbar/toolbar";
import { useEditorChain } from "@/hooks/chain-execute";
import { Bold, Italic, Palette, Underline } from "lucide-react";
import { ColorHighlighter } from "@/components/richtext/ui/color-picker";

const styleButtons = [
  {
    type: "bold",
    cmd: "bold",
    tooltip: "Bold",
    icon: <Bold />,
    activeKey: "bold",
    action_type: "button",
  },
  {
    type: "italic",
    cmd: "italic",
    tooltip: "Italic",
    icon: <Italic />,
    activeKey: "italic",
    action_type: "button",
  },
  {
    type: "underline",
    cmd: "underline",
    tooltip: "Underline",
    icon: <Underline />,
    activeKey: "underline",
    action_type: "button",
  },
];

export const StyleFormatSection: React.FC<StyleFormatSectionProps> = ({
  ctx,
  size = "sm",
  highlighter = true,
}) => {
  const [isBackground, setIsBackground] = React.useState("text");
  const { execute } = useEditorChain();

  const handleUpdateColor = (color: string) => {
    const cmd = isBackground === "text" ? "color" : "highlight";
    execute(cmd, color);
  };
  return (
    <>
      {/* Actionable text-style buttons */}
      {styleButtons.map((btn) => (
        <ToolbarButton
          key={btn.type}
          tooltip={btn.tooltip}
          onClick={() => execute(btn.cmd)}
          active={Boolean(ctx[btn.activeKey as keyof typeof ctx])}
          toolButtonSize={size}
        >
          {btn.icon}
        </ToolbarButton>
      ))}
      {highlighter && (
        <ColorHighlighter
          size="xs"
          color={ctx.foreColor}
          icon={Palette}
          onChange={handleUpdateColor}
          isBack={isBackground as "text" | "background"}
          onChangeIsBackground={() =>
            setIsBackground(isBackground === "text" ? "background" : "text")
          }
        />
      )}
    </>
  );
};
