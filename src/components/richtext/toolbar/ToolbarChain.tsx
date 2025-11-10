// ToolbarChain.tsx
"use client";
import * as React from "react";
import { useEditor } from "@/context/editor";
import { EditorChain } from "@/core/chain";
import { Ban, Minus } from "lucide-react";
import { TablePicker } from "../ui/table-picker";

import {
  ToolbarButtonSeparator,
  ToolbarWrapper,
  ToolbarButton,
} from "./toolbar";
import { HistorySection } from "../ui/history";
import { StyleFormatSection } from "../ui/text-style";
import { TextFormatSection } from "../ui/text-format";
import { ListSelectorSection } from "../ui/list-selector";
import { IndentOutdentSection } from "../ui/indent-outdent";
import { TextAlignerSection } from "../ui/text-aligner";

export const ToolbarChain: React.FC<ToolbarChainProps> = ({ format }) => {
  const { iframeRef, ctx } = useEditor();
  const [chain, setChain] = React.useState<EditorChain | null>(null);

  // 🧠 Initialize chain only after iframe is mounted
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (iframeRef.current?.contentWindow && !chain) {
        setChain(new EditorChain(iframeRef.current.contentWindow));
      }
    }, 500);
    return () => clearInterval(timer);
  }, [iframeRef, chain]);

  return (
    <ToolbarWrapper className="flex flex-wrap gap-2 border-b py-1 px-2">
      <HistorySection ctx={ctx} size="xs" />
      <ToolbarButtonSeparator orientation="vertical" />
      <TextFormatSection ctx={ctx} size="xs" format={format} />
      <StyleFormatSection ctx={ctx} size="xs" />
      <ToolbarButtonSeparator />
      <ListSelectorSection ctx={ctx} size="xs" />
      <IndentOutdentSection size="xs" ctx={ctx} />
      <TextAlignerSection ctx={ctx} size="xs" />
      <TablePicker
        variant="outline"
        size="icon-xs"
        onSelect={(rows, cols) => {
          const win = iframeRef.current?.contentWindow;
          const body = win?.document?.body;
          body?.focus();

          chain?.insertTable(rows, cols)?.run();
        }}
      />
      <ToolbarButton
        toolButtonSize="xs"
        tooltip="Add Divider"
        onClick={() => chain?.insertHTML("<hr>")?.run()}
      >
        <Minus />
      </ToolbarButton>
      <ToolbarButton
        toolButtonSize="xs"
        tooltip="Clear"
        onClick={() => chain?.clear()?.run()}
      >
        <Ban />
      </ToolbarButton>
    </ToolbarWrapper>
  );
};
