// src/context/editor.tsx
"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
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

const EditorContext = createContext<EditorContextShape | null>(null);

export const EditorProvider: React.FC<{
  initialContent?: string;
  children?: React.ReactNode;
  onChange?: (editor: EditorCore) => void;
}> = ({ initialContent = "<p>Start typing…</p>", children, onChange }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [core, setCore] = useState<EditorCore | null>(null);
  const [ctx, setCtx] = useState(defaultCtx);
  const [html, setHtml] = useState(initialContent);
  const [json, setJson] = useState<object[]>([]);

  useEffect(() => {
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

  const refreshCtx = useCallback(() => {
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
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside <EditorProvider>");
  return ctx;
};
