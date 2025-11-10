"use client";
import React, { useEffect, useRef, useState } from "react";
import { EditorCore } from "@/core/engine";

export default function EditorDemo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [editor, setEditor] = useState<EditorCore | null>(null);
  const [html, setHtml] = useState("");
  const [json, setJson] = useState<object[]>([]);

  useEffect(() => {
    if (!iframeRef.current) return;

    // 🧩 Initialize editor
    const core = new EditorCore(iframeRef.current, "<p>Hello World 🌍</p>");
    core.init();
    setEditor(core);

    // 🔁 Listen for content updates
    core.on("update", (updatedHtml) => {
      setHtml(updatedHtml as string);
      setJson(core.toJSON()); // keep JSON in sync
    });

    // ✅ Cleanup on unmount
    return () => core.destroy();
  }, []);

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-semibold">ECOD Editor Demo</h2>

      {/* Editor iframe */}
      <iframe
        ref={iframeRef}
        className="w-full h-[300px] border rounded"
        sandbox="allow-same-origin allow-scripts allow-forms"
      />

      <button
        onClick={() => {
          console.log("HTML:", editor?.toHTML());
          console.log("JSON:", editor?.toJSON());
          alert("Check your console for HTML + JSON output.");
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Export HTML & JSON
      </button>

      <div className="mt-4">
        <h3 className="font-medium">Current HTML Output:</h3>
        <pre className="p-2 bg-gray-100 text-sm whitespace-pre-wrap border rounded">
          {html}
        </pre>
      </div>

      <div>
        <h3 className="font-medium">JSON Structure:</h3>
        <pre className="p-2 bg-gray-100 text-sm border rounded">
          {JSON.stringify(json, null, 2)}
        </pre>
      </div>
    </div>
  );
}
