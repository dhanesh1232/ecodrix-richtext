"use client";
import { useEditorChain } from "@/hooks/chain-execute";
import * as React from "react";
import { ToolbarButton } from "../toolbar/toolbar";
import { List, ListOrdered } from "lucide-react";

export const ListSelectorSection: React.FC<ToolbarButtonDefaultProps> = ({
  ctx,
  size = "sm",
}) => {
  const { execute } = useEditorChain();
  return (
    <>
      <ToolbarButton
        onClick={() => execute("bulletList")}
        active={ctx.unorderedList as boolean}
        toolButtonSize={size}
        tooltip="Unordered List"
      >
        <List />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => execute("orderedList")}
        active={ctx.orderedList as boolean}
        toolButtonSize={size}
        tooltip="Ordered List"
      >
        <ListOrdered />
      </ToolbarButton>
    </>
  );
};
