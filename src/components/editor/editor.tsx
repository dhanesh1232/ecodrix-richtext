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
  return (
    <div className="border border-border w-full">
      <Toolbar
        historyTabs={toolbar?.historyTabs}
        formatting={toolbar?.formatting}
      />
      <EditorFrame initialContent={initialContent} />
    </div>
  );
};
