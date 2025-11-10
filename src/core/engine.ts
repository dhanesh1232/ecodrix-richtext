// src/core/engine.ts
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
 * Handles runtime injection, postMessage, serialization, and HTML structure setup.
 */
export class EditorCore {
  iframe: HTMLIFrameElement;
  win: Window | null = null;
  doc: Document | null = null;
  html = "";
  isReady = false;
  listeners: Partial<{
    [K in keyof EditorEvents]: Array<(data: EditorEvents[K]) => void>;
  }> = {};

  constructor(iframe: HTMLIFrameElement, initialHTML = "<p>Start typing…</p>") {
    this.iframe = iframe;
    this.html = initialHTML;
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
        --editor-accent: #3b82f6; /* blue-500 */
        --editor-placeholder: rgba(100, 116, 139, 0.6); /* slate-500 */
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --editor-bg: #0a0a0a;
          --editor-fg: #f8fafc;
          --editor-accent: #60a5fa; /* lighter blue for dark bg */
          --editor-placeholder: rgba(148, 163, 184, 0.6);
        }
      }

      html, body {
        height: 100%;
        min-height: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow-y: auto;
        cursor: text;
        background: var(--editor-bg);
        color: var(--editor-fg);
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.6;
        transition: background-color 0.25s ease, color 0.25s ease;
      }

      *, *::before, *::after {
        box-sizing: inherit;
      }

      body {
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        caret-color: var(--editor-accent);
      }

      [contenteditable]:focus {
        outline: none;
      }

      /* 👇 Force caret (text cursor) to stay blue across all blocks */
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
        border-left: 3px solid var(--editor-accent);
        padding-left: 1em;
        opacity: 0.9;
      }

      pre {
        background: color-mix(in srgb, var(--editor-accent) 10%, transparent);
        padding: 0.6em;
        border-radius: 6px;
        font-family: ui-monospace, monospace;
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

      body:empty::before {
        content: attr(data-placeholder);
        color: var(--editor-placeholder);
        pointer-events: none;
      }

      html, body {
        transition: background-color 0.25s ease, color 0.25s ease, caret-color 0.25s ease;
      }
    </style>
  </head>
  <body contenteditable="true" data-placeholder="Start typing..."></body>
</html>
`;

    doc.open();
    doc.write(htmlTemplate);
    doc.close();

    // ✅ Ensure runtime + HTML are injected only once iframe DOM is fully parsed
    iframe.onload = () => {
      if (!this.doc?.body) return;

      // Inject the initial HTML safely
      this.doc.body.innerHTML = this.html;

      // Inject runtime script
      const runtimeScript = this.doc.createElement("script");
      runtimeScript.type = "text/javascript";
      runtimeScript.textContent = `(${editorRuntimeInit.toString()})();`;
      this.doc.body.appendChild(runtimeScript);

      // Mark ready and sync initial state
      this.isReady = true;
      this.emit("ready", "");
    };

    // 🧠 Setup listener bridge
    window.addEventListener("message", this.handleMessage);
    // 🧠 Ensure runtime gets the HTML even if IFRAME_READY was missed
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

  /**
   * 🧱 Replaces the entire iframe content with new HTML.
   */
  fromHTML(html: string) {
    this.html = html;
    this.post("SET_HTML", { html });
  }

  /**
   * 💾 Returns current HTML.
   */
  toHTML(): string {
    return this.doc?.body?.innerHTML?.trim() || this.html;
  }

  /**
   * 🧩 Converts current DOM into structured JSON.
   */
  toJSON(): EditorNode[] {
    if (!this.doc) return [];
    const root = this.doc.body;

    const traverse = (el: HTMLElement): EditorNode => {
      const node: EditorNode = { type: el.tagName.toLowerCase() };

      if (el.childElementCount === 0) {
        node.content = el.innerText;
      } else {
        node.children = Array.from(el.children).map((c) =>
          traverse(c as HTMLElement)
        );
      }

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

  /** ✅ Typed Event Registration */
  on<K extends keyof EditorEvents>(
    type: K,
    fn: (data: EditorEvents[K]) => void
  ) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    (this.listeners[type] as Array<(data: EditorEvents[K]) => void>).push(fn);
  }

  /** ✅ Typed Event Emitter */
  emit<K extends keyof EditorEvents>(type: K, payload: EditorEvents[K]) {
    const handlers = this.listeners[type];
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }

  /**
   * 🧹 Cleanup method for when editor is unmounted.
   */
  destroy() {
    window.removeEventListener("message", this.handleMessage);
    this.listeners = {};
    this.isReady = false;
    this.win = null;
    this.doc = null;
  }
}
