import React from "react";
import { ToolbarButton, ToolbarGroup } from "../toolbar/toolbar";
import { useEditorChain } from "@/hooks/chain-execute";

export const IndentOutdentSection: React.FC<IndentOutdentSectionProps> = ({
  ctx,
  size,
}) => {
  const { execute } = useEditorChain();
  return (
    <ToolbarGroup>
      <ToolbarButton
        toolButtonSize={size}
        tooltip="Indent"
        disabled={ctx?.isIndented}
        onClick={() => execute("indent")}
      >
        <Indent />
      </ToolbarButton>
      <ToolbarButton
        toolButtonSize={size}
        tooltip="Outdent"
        disabled={!ctx?.isIndented}
        onClick={() => execute("outdent")}
      >
        <Outdent />
      </ToolbarButton>
    </ToolbarGroup>
  );
};

const Indent = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      {...props}
      fill="currentColor"
    >
      <path d="M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" />
      <path d="M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" />
      <path d="M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" />
      <path d="M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" />
      <path d="M1 10.407c0 .473.55.755.96.493l3.765-2.408a.578.578 0 0 0 0-.985l-3.765-2.407c-.41-.262-.96.02-.96.493z" />
    </svg>
  );
};
const Outdent = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      {...props}
      fill="currentColor"
    >
      <path d="M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" />
      <path d="M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" />
      <path d="M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" />
      <path d="M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" />
      <path d="M6 10.407c0 .473-.55.755-.96.493l-3.765-2.408a.578.578 0 0 1 0-.985l3.765-2.407c.41-.262.96.02.96.493z" />
    </svg>
  );
};
