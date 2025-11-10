// iframe.tsx
"use client";
import React from "react";
import { useEditor } from "@/context/editor";

export const EditorFrame: React.FC = () => {
  const { iframeRef } = useEditor();

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-[350px] border-0 rounded-b bg-background"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
    />
  );
};
