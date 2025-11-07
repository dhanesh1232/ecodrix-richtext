"use client";
import * as React from "react";
import { EditorFrame } from "./frame";
import { Toolbar } from "./toolbar";

/**
 * 🧩 RichtextEditor
 *
 * Main editor component for ECOD RichText.
 *
 * @public
 */

export const RichtextEditor: React.FC<RichtextEditorProps> = ({
  initialContent = "Start typing...",
  toolbar,
}) => {
  const editorRef = React.useRef<EditorFrameHandle>(null);

  const handleCommand = (cmd: string, value?: string) => {
    editorRef.current?.handleCommand(cmd, value);
  };

  return (
    <div className="border border-border w-full rounded-sm overflow-hidden bg-inherit mx-4">
      <Toolbar formatting={toolbar?.formatting} onCommand={handleCommand} />
      <EditorFrame ref={editorRef} initialContent={initialContent} />
    </div>
  );
};
