// ToolbarChain.tsx
"use client";
import * as React from "react";
import { useEditor } from "@/context/editor";
import { EditorChain } from "@/core/chain";
import { Ban, Minus, Sparkles } from "lucide-react";
import { TablePicker } from "../ui/table-picker";

import {
  ToolbarButtonSeparator,
  ToolbarWrapper,
  ToolbarButton,
  ToolbarGroup,
} from "./toolbar";
import { HistorySection } from "../ui/history";
import { StyleFormatSection } from "../ui/text-style";
import { TextFormatSection } from "../ui/text-format";
import { ListSelectorSection } from "../ui/list-selector";
import { IndentOutdentSection } from "../ui/indent-outdent";
import { TextAlignerSection } from "../ui/text-aligner";
import { ThemeProvider } from "@/components/theme-provider";
import { AnchorLink } from "../ui/link-insert";
import { ImagePicker } from "../ui/image-modal";

export const ToolbarChain: React.FC<ToolbarChainProps> = ({ format }) => {
  const { iframeRef, ctx } = useEditor();
  const [chain, setChain] = React.useState<EditorChain | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    const initChain = () => {
      if (iframeRef.current?.contentWindow && !chain) {
        setChain(new EditorChain(iframeRef.current.contentWindow));
      }
    };

    // Try immediately, then set up interval
    initChain();
    const timer = setInterval(initChain, 300);

    return () => {
      clearInterval(timer);
      setMounted(false);
    };
  }, [iframeRef, chain]);

  if (!mounted) {
    return (
      <ToolbarWrapper className="flex flex-nowrap gap-2 border-b py-2 px-3 bg-background/80 backdrop-blur-xs">
        <div className="flex items-center gap-1 animate-pulse">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-8 w-8 bg-muted rounded-md" />
          ))}
        </div>
      </ToolbarWrapper>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ToolbarWrapper className="flex flex-nowrap gap-0 border-b py-2 px-3 bg-background/95 backdrop-blur-xs supports-backdrop-blur:bg-background/60 sticky top-0 z-40">
        <ToolbarGroup>
          <HistorySection ctx={ctx} size="xs" />
        </ToolbarGroup>

        <ToolbarButtonSeparator />

        <ToolbarGroup>
          <TextFormatSection ctx={ctx} size="xs" format={format} />
        </ToolbarGroup>

        <ToolbarButtonSeparator />

        <ToolbarGroup>
          <StyleFormatSection ctx={ctx} size="xs" />
        </ToolbarGroup>

        <ToolbarButtonSeparator />

        <ToolbarGroup>
          <ListSelectorSection ctx={ctx} size="xs" />
          <IndentOutdentSection size="xs" ctx={ctx} />
        </ToolbarGroup>

        <ToolbarButtonSeparator />

        <ToolbarGroup>
          <TextAlignerSection ctx={ctx} size="xs" />
        </ToolbarGroup>

        <ToolbarButtonSeparator />

        <ToolbarGroup>
          <AnchorLink size="xs" ctx={ctx} />
          <ImagePicker />
          <TablePicker
            variant="ghost"
            size="icon-xs"
            onSelect={(rows: number, cols: number) => {
              const win = iframeRef.current?.contentWindow;
              const body = win?.document?.body;
              body?.focus();
              chain?.insertTable(rows, cols)?.run();
            }}
          />
          <ToolbarButton
            toolButtonSize="xs"
            tooltip="Insert Divider"
            onClick={() => chain?.insertHTML("<hr>")?.run()}
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarButtonSeparator />

        <ToolbarGroup>
          <ToolbarButton
            toolButtonSize="xs"
            tooltip="AI Enhance"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0"
          >
            <Sparkles className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            toolButtonSize="xs"
            tooltip="Clear Formatting"
            onClick={() => chain?.clear()?.run()}
            variant="outline"
          >
            <Ban className="w-4 h-4" />
          </ToolbarButton>
        </ToolbarGroup>
      </ToolbarWrapper>
    </ThemeProvider>
  );
};
