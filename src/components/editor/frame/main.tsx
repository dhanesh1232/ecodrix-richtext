"use client";
import * as React from "react";
export interface EditorFrameProps {
  initialContent?: string;
}

export const EditorFrame: React.FC<EditorFrameProps> = ({ initialContent }) => {
  return (
    <div className="border rounded-md overflow-hidden bg-inherit">
      <div
        contentEditable
        suppressContentEditableWarning
        className="min-h-[200px] p-3 outline-none"
      >
        {initialContent}
      </div>
    </div>
  );
};
