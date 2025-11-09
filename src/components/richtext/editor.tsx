"use client";
import * as React from "react";
import { EditorFrame } from "./editor/iframe";
import { EditorProvider, useEditor } from "./provider";
import { ToolbarChain } from "./toolbar/ToolbarChain";
import { DotsLoader, EditorSkeleton, SpinnerLoader } from "./ui";

export const RichtextEditor: React.FC<RichtextEditorProps> = ({
  initialContent = "<p>Start typing…</p>",
  loader = "shine",
  toolbar,
  onChange,
}) => {
  return (
    <EditorProvider>
      <EditorContainerBlock
        initialContent={initialContent}
        loader={loader}
        toolbar={toolbar}
        onChange={onChange}
      />
    </EditorProvider>
  );
};

// Inner container (can access context)
function EditorContainerBlock({
  initialContent,
  loader,
  toolbar,
  onChange,
}: EditorContainerBlockProps) {
  const { iframeRef, html, setHtml, setOnChange } = useEditor();
  const [isMount, setIsMount] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    setHtml(initialContent!);

    if (onChange) onChange?.(html);
  }, [initialContent, setHtml, html, onChange]);

  React.useEffect(() => {
    const isInit = setInterval(() => {
      setHtml(initialContent!);
      setIsMount(true);
    }, 300);

    const handleLoad = () => clearInterval(isInit);
    window.addEventListener("load", handleLoad);

    // Cleanup when unmounting
    return () => {
      clearInterval(isInit);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // ✅ Focus / blur detection
  React.useEffect(() => {
    const iframe = iframeRef.current;
    console.log(iframe);
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const interval = setInterval(() => {
      const body = doc.body;
      if (body) {
        body.addEventListener("focus", handleFocus);
        body.addEventListener("blur", handleBlur);
        clearInterval(interval);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      const body = doc.body;
      if (body) {
        body.removeEventListener("focus", handleFocus);
        body.removeEventListener("blur", handleBlur);
      }
    };
  }, [iframeRef]);

  // ✅ Loader switch
  if (!isMount) {
    switch (loader) {
      case "shine":
        return <EditorSkeleton animation="shine" />;
      case "skeleton":
        return <EditorSkeleton />;
      case "dots":
        return <DotsLoader />;
      default:
        return <SpinnerLoader />;
    }
  }
  return (
    <div
      data-focused={isFocused}
      className={`relative border border-border rounded-sm transition-all duration-200 ring-0 data-[focused=true]:ring-1 ring-blue-600/60 shadow-sm`}
    >
      <ToolbarChain {...toolbar} />
      <EditorFrame />
    </div>
  );
}
