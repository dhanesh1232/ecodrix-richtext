// src/context/editor.tsx
"use client";
import * as React from "react";
import { EditorCore } from "@/core/engine";

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

export const EditorProvider: React.FC<{
  initialContent?: string;
  children?: React.ReactNode;
  onChange?: (editor: EditorCore) => void;
}> = ({ initialContent = "<p>Start typing…</p>", children, onChange }) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const [core, setCore] = React.useState<EditorCore | null>(null);
  const [ctx, setCtx] = React.useState(defaultCtx);
  const [html, setHtml] = React.useState(initialContent);
  const [json, setJson] = React.useState<object[]>([]);
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!iframeRef.current) return;

    const editor = new EditorCore(iframeRef.current, initialContent);
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
        className="
    relative border border-border rounded-sm 
    transition-all duration-200 ring-0 
    data-[focused=true]:ring-1 ring-blue-500/70 shadow-sm
    hover:border-blue-400 cursor-text
  "
      >
        {children}
        <iframe
          ref={iframeRef}
          className="
      w-full h-[350px] border-0 rounded-b 
      bg-background cursor-text focus:cursor-text
    "
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </EditorContext.Provider>
  );
};
