// src/context/editor.tsx
"use client";
import * as React from "react";
import { EditorCore } from "@/core/engine";
import { cn } from "@/lib/utils";

const defaultCtx: EditorContextState = {
  block: "P",
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  orderedList: false,
  unorderedList: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false,
  link: false,
  foreColor: "",
  backColor: "",
  isHeading1: false,
  isHeading2: false,
  isHeading3: false,
  isHeading4: false,
  isHeading5: false,
  isHeading6: false,
  isParagraph: true,
  isBlockquote: false,
  isCodeBlock: false,
  canUndo: false,
  canRedo: false,
  isIndented: false,
};

export type EditorContextShape = {
  core: EditorCore | null;
  ctx: EditorContextState;
  setCtx: React.Dispatch<React.SetStateAction<EditorContextState>>;
  html: string;
  json: object[];
  iframeRef: React.RefObject<HTMLIFrameElement>;
  refreshCtx: () => void;
};

const EditorContext = React.createContext<EditorContextShape | null>(null);

export const useEditor = () => {
  const ctx = React.useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside <EditorProvider>");
  return ctx;
};

export interface EditorProviderProps {
  initialContent?: string;
  children?: React.ReactNode;
  onChange?: (editor: EditorCore) => void;
  placeholder?: string;
  style?: DesignProps;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  initialContent = "Start typing...",
  children,
  onChange,
  placeholder,
  style,
}) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const [core, setCore] = React.useState<EditorCore | null>(null);
  const [ctx, setCtx] = React.useState(defaultCtx);
  const [html, setHtml] = React.useState(initialContent);
  const [json, setJson] = React.useState<object[]>([]);
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!iframeRef.current) return;

    const editor = new EditorCore(
      iframeRef.current,
      initialContent,
      placeholder
    );

    editor.init();
    setCore(editor);

    // 🧠 Watch for updates from iframe runtime
    editor.on("update", () => {
      setHtml(editor.toHTML());
      setJson(editor.toJSON());
      // 🚀 Fire external onChange callback
      onChange?.(editor);
    });

    // 🧠 Watch for context (bold, italics, etc.)
    editor.on("context", (data) => {
      setCtx((prev) => ({ ...prev, ...(data as object) }));
    });

    editor.on("ready", () => {
      editor.enableAutoTheme();
      //editor.setTheme(style?.theme || "light");
    });

    // 🧠 Undo/Redo state updates
    editor.on("undoRedo", (state: UndoRedoState) => {
      setCtx((prev) => ({
        ...prev,
        canUndo: Boolean(state?.canUndo),
        canRedo: Boolean(state?.canRedo),
      }));
    });
    return () => editor.destroy();
  }, [iframeRef, onChange, initialContent]);

  React.useEffect(() => {
    const iframe = iframeRef.current;
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

  const refreshCtx = React.useCallback(() => {
    if (!core?.doc) return;
    const doc = core.doc;
    const block = (doc.queryCommandValue("formatBlock") || "P").toUpperCase();
    setCtx((prev) => ({
      ...prev,
      block,
      bold: doc.queryCommandState("bold"),
      italic: doc.queryCommandState("italic"),
      underline: doc.queryCommandState("underline"),
      strike: doc.queryCommandState("strikeThrough"),
      orderedList: doc.queryCommandState("insertOrderedList"),
      unorderedList: doc.queryCommandState("insertUnorderedList"),
      justifyLeft: doc.queryCommandState("justifyLeft"),
      justifyCenter: doc.queryCommandState("justifyCenter"),
      justifyRight: doc.queryCommandState("justifyRight"),
      link: doc.queryCommandState("createLink"),
      foreColor: doc.queryCommandValue("foreColor") || "",
      backColor: doc.queryCommandValue("hiliteColor") || "",
      isHeading1: block === "H1",
      isHeading2: block === "H2",
      isHeading3: block === "H3",
      isHeading4: block === "H4",
      isHeading5: block === "H5",
      isHeading6: block === "H6",
      isParagraph: block === "P",
      isBlockquote: block === "BLOCKQUOTE",
      isCodeBlock: block === "PRE",
    }));
  }, [core]);

  const radiusClassMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
  };

  const shadowClassMap = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  const borderWidth = style?.border?.width ?? 1;
  const borderRadius = style?.border?.radius ?? "md";
  const shadow = style?.shadow ?? "none";

  const containerClass = cn(
    "relative transition-all duration-200 ring-0 data-[focused=true]:ring-1 ring-blue-500/70 hover:border-blue-400 cursor-text border border-border",
    radiusClassMap[borderRadius!],
    shadowClassMap[shadow!]
  );

  return (
    <EditorContext.Provider
      value={{
        core,
        ctx,
        setCtx,
        html,
        json,
        iframeRef: iframeRef as React.RefObject<HTMLIFrameElement>,
        refreshCtx,
      }}
    >
      <div
        data-focused={isFocused}
        style={{
          height:
            typeof style?.height === "string"
              ? style?.height
              : `${style?.height}px`,
          borderWidth: `${borderWidth}px`,
        }}
        className={cn(containerClass, "overflow-hidden")}
      >
        {children}
        <iframe
          ref={iframeRef}
          style={{
            height: (() => {
              const h = style?.height;
              if (typeof h === "string") {
                // Case 1: percentage → use CSS calc
                if (h.includes("%")) return `calc(${h} - 42px)`;
                // Case 2: pixel string → subtract numerically
                if (h.includes("px")) return `${parseFloat(h) - 42}px`;
              }
              // Case 3: numeric value
              if (typeof h === "number") return `${h - 42}px`;
              // Default fallback
              return "calc(100% - 42px)";
            })(),
          }}
          className="w-full border-0 rounded-b bg-background cursor-text focus:cursor-text p-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </EditorContext.Provider>
  );
};
