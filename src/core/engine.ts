import { editorRuntimeInit } from "@/core/runtime";

export interface EditorNode {
  type: string;
  content?: string;
  attrs?: Record<string, EditorAttrs>;
  children?: EditorNode[];
}

type EditorAttrs = string | number | boolean | object | null | undefined;

/**
 * 🧠 EditorCore — standalone controller for the RichtextEditor iframe.
 * Handles runtime injection, postMessage, serialization, theming, and HTML structure setup.
 */
export class EditorCore {
  iframe: HTMLIFrameElement;
  win: Window | null = null;
  doc: Document | null = null;
  html = "";
  placeholder: string;
  isReady = false;
  listeners: Partial<{
    [K in keyof EditorEvents]: Array<(data: EditorEvents[K]) => void>;
  }> = {};
  theme: "light" | "dark" | Record<string, string> = "light";
  autoThemeListener?: MediaQueryList;

  constructor(
    iframe: HTMLIFrameElement,
    value = "",
    placeholder = "Write something..."
  ) {
    this.iframe = iframe;
    this.placeholder = placeholder;
    const clean = (value || "").trim();
    this.html = clean.length === 0 ? "<p><br></p>" : clean;
  }

  /**
   * 🚀 Initializes the editor iframe with full HTML + runtime.
   * Automatically injects styling and runtime script.
   */
  init() {
    const iframe = this.iframe;
    const doc = iframe.contentDocument;
    if (!doc) throw new Error("❌ No iframe document available");

    this.doc = doc;
    this.win = iframe.contentWindow;

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      :root {
        --editor-bg: #ffffff;
        --editor-fg: #111111;
        --editor-accent: #3b82f6;
        --editor-placeholder: rgba(100, 116, 139, 0.6);
        --editor-border: #e5e7eb;
        --editor-code-bg: #f9fafb;
        --editor-blockquote-border: #3b82f6;
        --editor-hr: #d1d5db;
        --tbl-highlight: #3b82f6;

        --scroll-thumb: color-mix(in srgb, var(--editor-fg) 40%, transparent 60%);
        --scroll-thumb-hover: color-mix(in srgb, var(--editor-fg) 55%, transparent 45%);
        --scroll-track: color-mix(in srgb, var(--editor-bg) 85%, transparent 15%);
      }

      [data-theme="dark"] {
        --editor-bg: #0a0a0a;
        --editor-fg: #e5e7eb;
        --editor-accent: #60a5fa;
        --editor-placeholder: rgba(148, 163, 184, 0.6);
        --editor-border: #1f2937;
        --editor-code-bg: #111827;
        --editor-blockquote-border: #60a5fa;
        --editor-hr: #374151;

        --scroll-thumb: color-mix(in srgb, #ffffff 40%, transparent 60%);
        --scroll-thumb-hover: color-mix(in srgb, #ffffff 55%, transparent 45%);
      }

      html, body {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        background: var(--editor-bg);
        color: var(--editor-fg);
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.6;
        cursor: text;
        transition: background-color 0.25s ease, color 0.25s ease, caret-color 0.25s ease;

        /* --- Default: NO scroll, no scrollbar --- */
        overflow-y: hidden;
        scrollbar-width: none; /* Firefox */
      }

      /* Hide scrollbar (WebKit) by default */
      html::-webkit-scrollbar,
      body::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }

      /* ---------------------------------------------------------
         ON FOCUS — enable scroll + premium scrollbar
      --------------------------------------------------------- */
      html:focus-within,
      body:focus-within {
        overflow-y: auto !important;
        scrollbar-width: thin;
        scrollbar-color: var(--scroll-thumb) transparent;
      }

      html:focus-within::-webkit-scrollbar,
      body:focus-within::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      html:focus-within::-webkit-scrollbar-thumb,
      body:focus-within::-webkit-scrollbar-thumb {
        background: var(--scroll-thumb);
        border-radius: 999px;
        opacity: 0.8;
        transition: opacity 0.25s ease;
      }

      html:focus-within::-webkit-scrollbar-thumb:hover,
      body:focus-within::-webkit-scrollbar-thumb:hover {
        background: var(--scroll-thumb-hover);
      }

      /* ---------------------------------------------------------
         Editor basics
      --------------------------------------------------------- */
      body {
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        caret-color: var(--editor-accent);
      }

      [contenteditable]:focus {
        outline: none;
      }

      *, *::before, *::after {
        box-sizing: inherit;
      }

      p, div, h1, h2, h3, h4, h5, h6, pre, blockquote, table, li {
        caret-color: var(--editor-accent);
      }

      p, h1, h2, h3, h4, h5, h6, pre, blockquote {
        margin: 0 0 0.8em;
      }

      a {
        color: var(--editor-accent);
        text-decoration: underline;
      }

      blockquote {
        border-left: 3px solid var(--editor-blockquote-border);
        padding-left: 1em;
        opacity: 0.9;
      }

      pre {
        background: var(--editor-code-bg);
        padding: 0.6em;
        border-radius: 6px;
        font-family: ui-monospace, monospace;
      }

      hr {
        border: none;
        border-top: 1px solid var(--editor-hr);
        margin: 1em 0;
        opacity: 0.7;
      }

      table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 1em;
      }

      td, th {
        border: 1px solid color-mix(in srgb, var(--editor-fg) 25%, transparent);
        padding: 6px;
      }

      /* ---------------------------------------------------------
         Placeholder
      --------------------------------------------------------- */
      body.empty::before {
        content: attr(data-placeholder);
        color: var(--editor-placeholder);
        pointer-events: none;
        position: absolute;
        top: 0.75rem;
        left: 0.75rem;
        opacity: 0.6;
      }

      /* ---------------------------------------------------------
         Default image styling (rectangular crop)
      --------------------------------------------------------- */
      /* Responsive, full-image display inside the editor */
      body img {
        display: block;
        width: 100% !important;
        height: auto !important;         /* prevents cropping */
        object-fit: contain !important;  /* show complete image */
        border-radius: 4px;
        margin: 0.75rem 0;
        max-height: 65vh;                /* prevents overly tall images */
      }

      /* Tablet & Desktop – rectangular feel without cutting image */
      @media (min-width: 768px) {
        body img {
          max-height: 420px;
        }
      }

      /* Large screens */
      @media (min-width: 1200px) {
        body img {
          max-height: 520px;
        }
      }

      /* ---------------------------------------------------------
         Table Resize Highlight
      --------------------------------------------------------- */
      .editor-table-wrapper.handle-left-hover table,
      .editor-table-wrapper.handle-right-hover table,
      .editor-table-wrapper.handle-top-hover table,
      .editor-table-wrapper.handle-bottom-hover table,
      .editor-table-wrapper.handle-corner-hover table,
      .editor-table-wrapper.table-active-border table {
        outline: 2px solid var(--tbl-highlight);
        outline-offset: -2px;
      }

      .editor-table-wrapper table {
        transition: outline-color 0.15s ease;
      }
    </style>
  </head>

  <body contenteditable="true" data-placeholder="${this.placeholder}" data-empty="true"></body>
</html>
`;

    doc.open();
    doc.write(htmlTemplate);
    doc.close();

    iframe.onload = () => {
      if (!this.doc?.body) return;
      this.doc.body.innerHTML = this.html;

      const runtimeScript = this.doc.createElement("script");
      runtimeScript.id = "__EDITOR_RUNTIME__";
      runtimeScript.type = "text/javascript";
      runtimeScript.textContent = `(${editorRuntimeInit.toString()})();`;
      this.doc.body.appendChild(runtimeScript);

      this.isReady = true;
      this.emit("ready", "");
    };

    window.addEventListener("message", this.handleMessage);

    const ensureSetHTML = setInterval(() => {
      if (this.isReady && this.win) {
        this.post("SET_HTML", { html: this.html });
        clearInterval(ensureSetHTML);
      }
    }, 150);
  }

  /**
   * 📡 Message handler for runtime communication.
   */
  private handleMessage = (e: MessageEvent) => {
    const data = e.data || {};
    switch (data.type) {
      case "IFRAME_READY":
        this.isReady = true;
        this.post("SET_HTML", { html: this.html });
        this.emit("ready", "");
        break;
      case "UPDATE":
        this.html = data.html;
        this.emit("update", this.html);
        break;
      case "CONTEXT":
        this.emit("context", data);
        break;
      case "UNDO_REDO_STATE":
        this.emit("undoRedo", { canUndo: data.canUndo, canRedo: data.canRedo });
        break;
      case "IFRAME_ERROR":
        console.error("🛑 Iframe error:", data.message);
        this.emit("error", data.message);
        break;
    }
  };

  /**
   * 📨 Sends a command or message to the iframe runtime.
   */
  post(type: string, payload?: Record<string, unknown>) {
    if (!this.win) return;
    this.win.postMessage({ type, ...payload }, "*");
  }

  fromHTML(html: string) {
    this.html = html;
    this.post("SET_HTML", { html });
  }

  toHTML(): string {
    return this.doc?.body?.innerHTML?.trim() || this.html;
  }

  toJSON(): EditorNode[] {
    if (!this.doc) return [];
    const root = this.doc.body;

    const traverse = (el: HTMLElement): EditorNode => {
      const node: EditorNode = { type: el.tagName.toLowerCase() };
      if (el.childElementCount === 0) node.content = el.innerText;
      else
        node.children = Array.from(el.children).map((c) =>
          traverse(c as HTMLElement)
        );

      if (el.tagName.match(/^H[1-6]$/))
        node.attrs = { level: Number(el.tagName.replace("H", "")) };

      if (el.tagName === "A")
        node.attrs = { ...(node.attrs || {}), href: el.getAttribute("href") };

      if (el.tagName === "IMG")
        node.attrs = {
          ...(node.attrs || {}),
          src: el.getAttribute("src"),
          alt: el.getAttribute("alt"),
        };

      return node;
    };

    return Array.from(root.children).map((c) => traverse(c as HTMLElement));
  }

  on<K extends keyof EditorEvents>(
    type: K,
    fn: (data: EditorEvents[K]) => void
  ) {
    if (!this.listeners[type]) this.listeners[type] = [];
    (this.listeners[type] as Array<(data: EditorEvents[K]) => void>).push(fn);
  }

  emit<K extends keyof EditorEvents>(type: K, payload: EditorEvents[K]) {
    const handlers = this.listeners[type];
    if (handlers) handlers.forEach((handler) => handler(payload));
  }

  /**
   * 🎨 Theme Setter — applies light, dark, or custom theme dynamically.
   */
  setTheme(theme: "light" | "dark" | Record<string, string>) {
    if (!this.doc) return;
    this.theme = theme;

    const htmlEl = this.doc.documentElement;
    const styleEl =
      this.doc.getElementById("__EDITOR_THEME__") ||
      this.doc.createElement("style");

    styleEl.id = "__EDITOR_THEME__";

    let css = `
      :root {
        --editor-bg: #ffffff;
        --editor-fg: #111111;
        --editor-accent: #3b82f6;
        --editor-placeholder: rgba(100, 116, 139, 0.6);
        --editor-border: #e5e7eb;
        --editor-code-bg: #f9fafb;
        --editor-blockquote-border: #3b82f6;
        --editor-hr: #d1d5db;
      }
    `;

    if (theme === "dark") {
      htmlEl.setAttribute("data-theme", "dark");
      css = `
        :root {
          --editor-bg: #0a0a0a;
          --editor-fg: #e5e7eb;
          --editor-accent: #60a5fa;
          --editor-placeholder: rgba(148, 163, 184, 0.6);
          --editor-border: #1f2937;
          --editor-code-bg: #111827;
          --editor-blockquote-border: #60a5fa;
          --editor-hr: #374151;
        }
      `;
    }

    if (typeof theme === "object" && theme !== null) {
      htmlEl.removeAttribute("data-theme");
      const customVars = Object.entries(theme)
        .map(([key, val]) => `--${key}: ${val};`)
        .join("\n");
      css = `:root { ${customVars} }`;
    }

    styleEl.textContent = css;
    this.doc.head.appendChild(styleEl);
  }

  /**
   * 🌗 Enables automatic theme following system preference.
   */
  enableAutoTheme() {
    // Clean up any previous listener
    if (this.autoThemeListener)
      this.autoThemeListener.removeEventListener(
        "change",
        this.autoThemeHandler
      );

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    this.autoThemeListener = mql;
    console.log(mql);
    // Initial apply
    this.setTheme(mql.matches ? "dark" : "light");

    // Add listener safely
    mql.addEventListener("change", this.autoThemeHandler);
  }

  private autoThemeHandler = (e: MediaQueryListEvent) => {
    const isDark = e.matches;
    this.setTheme(isDark ? "dark" : "light");
  };

  /**
   * 🧹 Cleanup method for when editor is unmounted.
   */
  destroy() {
    window.removeEventListener("message", this.handleMessage);
    this.autoThemeListener?.removeEventListener(
      "change",
      this.autoThemeHandler
    );
    this.listeners = {};
    this.isReady = false;
    this.win = null;
    this.doc = null;
  }
}
