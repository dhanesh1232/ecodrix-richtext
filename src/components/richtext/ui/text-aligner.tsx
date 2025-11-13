"use client";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolbarButton } from "../toolbar/toolbar";
import { TextAlignStart, TextAlignCenter, TextAlignEnd } from "lucide-react";

import { useEditorChain } from "@/hooks/chain-execute";

export const TextAlignerSection: React.FC<ToolbarButtonDefaultProps> = ({
  size = "sm",
  ctx,
  ...props
}) => {
  const [_open, _setOpen] = React.useState(false);
  const { execute } = useEditorChain();

  const alignOptions = [
    {
      cmd: "alignLeft",
      tooltip: "Align Left",
      icon: <TextAlignStart className="w-4 h-4" />,
      active: ctx?.justifyLeft,
    },
    {
      cmd: "alignCenter",
      tooltip: "Align Center",
      icon: <TextAlignCenter className="w-4 h-4" />,
      active: ctx?.justifyCenter,
    },
    {
      cmd: "alignRight",
      tooltip: "Align Right",
      icon: <TextAlignEnd className="w-4 h-4" />,
      active: ctx?.justifyRight,
    },
  ];

  // Pick icon for trigger based on current active alignment
  const activeAlign = alignOptions.find((a) => a.active)?.icon || (
    <TextAlignStart className="w-4 h-4" />
  );

  return (
    <DropdownMenu open={_open} onOpenChange={_setOpen}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          {...props}
          tooltip="Text Alignment"
          data-active={_open}
          toolButtonSize={size}
        >
          {activeAlign}
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="flex gap-1 p-2 min-w-0 bg-background/95 backdrop-blur-md rounded shadow-sm border"
      >
        {alignOptions.map((opt) => (
          <ToolbarButton
            key={opt.cmd}
            tooltip={opt.tooltip}
            toolButtonSize="sm"
            active={opt.active}
            onClick={() => {
              execute(opt.cmd);
              _setOpen(!_open);
            }}
          >
            {opt.icon}
          </ToolbarButton>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
