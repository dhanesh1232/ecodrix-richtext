// src/editor/hooks/use-editor-chain.ts
"use client";
import * as React from "react";
import { EditorChain } from "@/core/chain";
import { useEditor } from "@/context/editor";

export function useEditorChain() {
  const { iframeRef } = useEditor();
  const [chain, setChain] = React.useState<EditorChain | null>(null);

  // initialize chain once iframe is loaded
  React.useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (win && !chain) {
      setChain(new EditorChain(win));
    }
  }, [iframeRef, chain]);

  // central execute handler
  const execute = React.useCallback(
    (action: string, ...args: any[]) => {
      if (!chain) return;
      const fn = (chain as any)[action];
      if (typeof fn === "function") {
        const result = fn.apply(chain, args);
        if (result?.run) result.run();
      } else {
        console.warn(`No chain method found for: ${action}`);
      }
    },
    [chain]
  );

  return { chain, execute };
}
