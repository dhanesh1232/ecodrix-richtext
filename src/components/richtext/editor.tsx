"use client";
import * as React from "react";
import { EditorProvider } from "@/context/editor";
import { DotsLoader, EditorSkeleton, SpinnerLoader } from "./ui";
import { ToolbarChain } from "./toolbar/ToolbarChain";
import type { EditorCore } from "@/core/engine";

interface RichtextEditorProps {
  initialContent?: string;
  onChange?: (value: EditorCore) => void;
  placeholder?: string;
  theme?: "light" | "dark" | Record<string, string>;

  loader?: EditorLoader;
  toolbar?: ToolbarChainProps;
  style?: DesignProps;
}

export const RichtextEditor: React.FC<RichtextEditorProps> = ({
  initialContent,
  loader = "shine",
  toolbar,
  onChange,
  placeholder,
  theme,
  style = {
    height: "350px",
    border: {
      width: 1,
      radius: "md",
    },
    shadow: "md",
  },
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
    <EditorProvider
      placeholder={placeholder}
      initialContent={initialContent}
      onChange={onChange}
      theme={theme}
      style={style}
    >
      <ToolbarChain {...toolbar} />
    </EditorProvider>
  );
};
