import { useEditorChain } from "@/hooks/chain-execute";
import { ToolbarButton } from "../toolbar/toolbar";
import { Redo2, Undo2 } from "lucide-react";

export const HistorySection: React.FC<ToolbarButtonDefaultProps> = ({
  ctx,
  size = "sm",
}) => {
  const { execute } = useEditorChain();

  return (
    <>
      <ToolbarButton
        tooltip="Undo"
        disabled={!ctx.canUndo}
        onClick={() => execute("undo")}
        toolButtonSize={size}
        className="rounded"
      >
        <Undo2 />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Redo"
        toolButtonSize={size}
        disabled={!ctx.canRedo}
        onClick={() => execute("redo")}
        className="rounded"
      >
        <Redo2 />
      </ToolbarButton>
    </>
  );
};
