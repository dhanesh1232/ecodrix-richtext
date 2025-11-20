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
  theme?: "light" | "dark" | Record<string, string>;
  style?: DesignProps;
  className?: string;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  initialContent = "Start typing...",
  children,
  onChange,
  placeholder,
  style,
  theme,
  className,
}) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const [core, setCore] = React.useState<EditorCore | null>(null);
  const [ctx, setCtx] = React.useState(defaultCtx);
  const [html, setHtml] = React.useState(initialContent);
  const [json, setJson] = React.useState<object[]>([]);
  const [isFocused, setIsFocused] = React.useState(false);
  const stableOnChange = React.useRef(onChange);
  const ignoreBlurRef = React.useRef(false);

  React.useEffect(() => {
    stableOnChange.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (!iframeRef.current) return;
    if (core) return; // <-- prevents reinitializing editor

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
      stableOnChange.current?.(editor);
    });

    // 🧠 Watch for context (bold, italics, etc.)
    editor.on("context", (data) => {
      setCtx((prev) => ({ ...prev, ...(data as object) }));
    });

    editor.on("ready", () => {
      if (theme) {
        editor.setTheme(theme);
      } else {
        editor.enableAutoTheme();
      }
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
  }, []);

  // Update initial content safely
  React.useEffect(() => {
    if (core && initialContent !== undefined) {
      core.fromHTML(initialContent);
    }
  }, [initialContent]);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleMouseEnter = () => {
      const evt = new CustomEvent("editor-iframe-enter");
      window.dispatchEvent(evt);
    };

    iframe.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      iframe.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const register = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      doc.addEventListener("mousedown", () => {
        window.dispatchEvent(new Event("editor-iframe-click"));
      });

      doc.addEventListener("touchstart", () => {
        window.dispatchEvent(new Event("editor-iframe-click"));
      });
    };

    // Wait until iframe DOM is ready
    const interval = setInterval(() => {
      if (iframe.contentDocument?.body) {
        register();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      if (ignoreBlurRef.current) return;
      setIsFocused(false);
    };

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
        refreshCtx: () => {},
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
        className={cn(
          containerClass,
          "w-full max-w-full overflow-hidden",
          className
        )}
        onMouseEnter={() => (ignoreBlurRef.current = true)}
        onMouseLeave={() => (ignoreBlurRef.current = false)}
      >
        {/* FLEX CONTAINER FOR TOOLBAR + IFRAME */}
        <div className="flex flex-col w-full h-full overflow-hidden">
          {/* Toolbar */}
          <div className="shrink-0 w-full">{children}</div>

          {/* Iframe */}
          <iframe
            ref={iframeRef}
            style={{
              height: (() => {
                const h = style?.height;
                if (typeof h === "string") {
                  if (h.includes("%")) return `calc(${h} - 42px)`;
                  if (h.includes("px")) return `${parseFloat(h) - 42}px`;
                }
                if (typeof h === "number") return `${h - 42}px`;
                return "calc(100% - 42px)";
              })(),
            }}
            className="
              flex-1
              block
              w-full
              border-0
              bg-background
              rounded-b
              min-h-0
            "
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </div>
    </EditorContext.Provider>
  );
};
