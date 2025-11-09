"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

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
  html: string;
  setHtml: (h: string) => void;
  ctx: EditorContextState;
  setCtx: React.Dispatch<React.SetStateAction<EditorContextState>>;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  refreshCtx: () => void;
  onChange?: (html: string) => void; // ✅ external change listener
  setOnChange?: (fn: (html: string) => void) => void;
};

const EditorContext = createContext<EditorContextShape | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [html, setHtml] = useState("");
  const [ctx, setCtx] = useState<EditorContextState>(defaultCtx);
  const [onChange, setOnChange] = useState<
    ((html: string) => void) | undefined
  >();

  const refreshCtx = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    const doc = win.document;
    if (!doc) return;

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
  }, [iframeRef]);

  // ✅ Handle iframe ready & inject initial content
  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "IFRAME_READY") {
        console.log("Ready");
        console.log("🟢 IFRAME READY — injecting initial content");
        const win = iframe.contentWindow;
        if (win) {
          console.log(win);
          win.postMessage({ type: "SET_HTML", html: html }, "*");
          setHtml(html || "");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [iframeRef, setHtml, html]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const d = e.data || {};
      if (d.type === "UPDATE") {
        setHtml(d.html);
        console.log(onChange);
        if (onChange) {
          console.log(d.type);
          onChange(d.html);
        }
      }
      if (d.type === "CONTEXT") setCtx((prev) => ({ ...prev, ...d }));
      if (d.type === "UNDO_REDO_STATE")
        setCtx((prev) => ({
          ...prev,
          canUndo: !!d.canUndo,
          canRedo: !!d.canRedo,
        }));
      if (d.type === "IFRAME_ERROR") console.error("Iframe error:", d.message);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <EditorContext.Provider
      value={{
        html,
        setHtml,
        ctx,
        setCtx,
        iframeRef: iframeRef as React.RefObject<HTMLIFrameElement>,
        refreshCtx,
        onChange,
        setOnChange,
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
