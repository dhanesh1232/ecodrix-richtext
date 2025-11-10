"use client";
import * as React from "react";
import { EditorProvider } from "@/context/editor";
import { DotsLoader, EditorSkeleton, SpinnerLoader } from "./ui";
import { ToolbarChain } from "./toolbar/ToolbarChain";

export const RichtextEditor: React.FC<RichtextEditorProps> = ({
  initialContent = "<p>Start typing…</p>",
  loader = "shine",
  toolbar,
  onChange,
}) => {
  const [isMount, setIsMount] = React.useState(false);

  React.useEffect(() => {
    const isInit = setInterval(() => {
      setIsMount(true);
    }, 300);
    const handleLoad = () => clearInterval(isInit);
    window.addEventListener("load", handleLoad);
    return () => {
      clearInterval(isInit);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

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
    <EditorProvider initialContent={initialContent} onChange={onChange}>
      <ToolbarChain {...toolbar} />
    </EditorProvider>
  );
};
