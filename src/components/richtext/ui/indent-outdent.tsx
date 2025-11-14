"use client";
import * as React from "react";
import { ToolbarButton } from "../toolbar/toolbar";
import { useEditorChain } from "@/hooks/chain-execute";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui";

// -------------------------
// Icons
// -------------------------
const IconIndent = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
  >
    <path d="M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" />
    <path d="M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" />
    <path d="M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" />
    <path d="M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" />
    <path d="M1 10.407c0 .473.55.755.96.493l3.765-2.408a.578.578 0 0 0 0-.985l-3.765-2.407c-.41-.262-.96.02-.96.493z" />
  </svg>
);

const IconOutdent = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
  >
    <path d="M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" />
    <path d="M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" />
    <path d="M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" />
    <path d="M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" />
    <path d="M6 10.407c0 .473-.55.755-.96.493l-3.765-2.408a.578.578 0 0 1 0-.985l3.765-2.407c.41-.262.96.02.96.493z" />
  </svg>
);

// -------------------------
// Component
// -------------------------
export const IndentOutdentSection: React.FC<ToolbarButtonDefaultProps> = ({
  ctx,
  size,
}) => {
  const { execute } = useEditorChain();
  const [open, setOpen] = React.useState(false);

  const isIndented = ctx?.isIndented ?? false;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          toolButtonSize={size}
          active={open}
          tooltip="Indentation"
        >
          {isIndented ? (
            <IconOutdent className="h-4 w-4" />
          ) : (
            <IconIndent className="h-4 w-4" />
          )}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="flex gap-1 p-2 min-w-0 rounded-md backdrop-blur-sm bg-background/95 border shadow-sm transition-all"
      >
        <ToolbarButton
          toolButtonSize={size}
          tooltip="Indent"
          disabled={isIndented}
          onClick={() => {
            execute("indent");
            setOpen(false);
          }}
        >
          <IconIndent className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          toolButtonSize={size}
          tooltip="Outdent"
          disabled={!isIndented}
          onClick={() => {
            execute("outdent");
            setOpen(false);
          }}
        >
          <IconOutdent className="w-4 h-4" />
        </ToolbarButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
