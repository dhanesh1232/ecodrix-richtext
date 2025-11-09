"use client";
import React, { useEffect } from "react";
import { editorRuntimeInit } from "@/core/runtime";
import { useEditor } from "../provider";

export const EditorFrame: React.FC = () => {
  const { html, iframeRef } = useEditor();

  useEffect(() => {
    console.log(iframeRef);
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: system-ui, sans-serif;
              padding: 0.75rem;
              line-height: 1.6;
              color: #111;
            }
            [contenteditable]:focus { outline: none; }
            p, h1, h2, h3, pre, blockquote { margin: 0 0 0.8em; }
            blockquote { border-left: 3px solid #ddd; padding-left: 1em; color: #555; }
            pre { background: #f6f6f6; padding: 0.6em; border-radius: 6px; }
          </style>
        </head>
        <body contenteditable="true">${html}</body>
      </html>
    `);
    doc.close();

    const scriptEl = doc.createElement("script");
    scriptEl.type = "text/javascript";
    scriptEl.textContent = `(${editorRuntimeInit.toString()})();`;
    doc.body.appendChild(scriptEl);
  }, []); // only once on mount

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-[350px] border-0 rounded-b bg-background"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
    />
  );
};
