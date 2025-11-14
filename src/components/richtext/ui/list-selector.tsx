"use client";
import { useEditorChain } from "@/hooks/chain-execute";
import * as React from "react";
import { ToolbarButton } from "../toolbar/toolbar";
import { List, ListOrdered } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui";

export const ListSelectorSection: React.FC<ToolbarButtonDefaultProps> = ({
  ctx,
  size = "sm",
}) => {
  const [_open, _setOpen] = React.useState<boolean>(false);
  const { execute } = useEditorChain();

  const listOptions = [
    {
      cmd: "bulletList",
      tooltip: "Unordered List",
      icon: <List className="h-4 w-4" />,
      active: ctx?.unorderedList,
    },
    {
      cmd: "orderedList",
      icon: <ListOrdered className="h-4 w-4" />,
      active: ctx?.orderedList,
      tooltip: "Ordered List",
    },
  ];

  return (
    <DropdownMenu open={_open} onOpenChange={_setOpen}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          tooltip="List Selector"
          toolButtonSize={size}
          active={_open}
        >
          <List />
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="flex gap-1 py-1.5 px-2 min-w-0 bg-background/95 backdrop-blur-md rounded-md shadow-sm border"
      >
        {listOptions.map((opt) => (
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
