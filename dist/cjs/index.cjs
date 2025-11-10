"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  RichtextEditor: () => RichtextEditor
});
module.exports = __toCommonJS(index_exports);
var import_globals = require("./globals.css");

// src/components/richtext/editor.tsx
var React10 = __toESM(require("react"), 1);

// src/context/editor.tsx
var React = __toESM(require("react"), 1);

// src/core/runtime.ts
function editorRuntimeInit() {
  let lastRange = null;
  const undoStack = [];
  const redoStack = [];
  function notifyReadySafely() {
    const check = setInterval(() => {
      if (document.body && document.body.isContentEditable) {
        clearInterval(check);
        parent.postMessage({ type: "IFRAME_READY" }, "*");
      }
    }, 50);
  }
  function saveSelection() {
    const s = window.getSelection();
    if (s && s.rangeCount > 0) lastRange = s.getRangeAt(0);
  }
  function restoreSelection() {
    if (!lastRange) return;
    const s = window.getSelection();
    s == null ? void 0 : s.removeAllRanges();
    s == null ? void 0 : s.addRange(lastRange);
  }
  function send(type, payload = {}) {
    parent.postMessage(__spreadValues({ type }, payload), "*");
  }
  if (document.readyState === "complete" || document.readyState === "interactive") {
    notifyReadySafely();
  } else {
    window.addEventListener("DOMContentLoaded", notifyReadySafely);
  }
  document.addEventListener("selectionchange", () => {
    const payload = {
      block: document.queryCommandValue("formatBlock") || "P",
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strike: document.queryCommandState("strikeThrough"),
      orderedList: document.queryCommandState("insertOrderedList"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      link: document.queryCommandState("createLink"),
      foreColor: document.queryCommandValue("foreColor"),
      backColor: document.queryCommandValue("hiliteColor")
    };
    const sel = window.getSelection();
    let isIndented = false;
    if (sel && sel.anchorNode) {
      const el = (sel.anchorNode.nodeType === Node.ELEMENT_NODE ? sel.anchorNode : sel.anchorNode.parentElement) || null;
      const block = el == null ? void 0 : el.closest(
        "p, div, li, blockquote, pre"
      );
      if (block) {
        const style = window.getComputedStyle(block);
        const marginLeft = parseFloat(style.marginLeft || "0");
        const paddingLeft = parseFloat(style.paddingLeft || "0");
        isIndented = marginLeft > 5 || paddingLeft > 5 || /^\s|(&nbsp;)+/.test(block.innerHTML);
      }
    }
    payload.isIndented = isIndented;
    const blk = String(payload.block).toUpperCase();
    payload.isHeading1 = blk === "H1";
    payload.isHeading2 = blk === "H2";
    payload.isHeading3 = blk === "H3";
    payload.isHeading4 = blk === "H4";
    payload.isHeading5 = blk === "H5";
    payload.isHeading6 = blk === "H6";
    payload.isParagraph = blk === "P";
    payload.isBlockquote = blk === "BLOCKQUOTE";
    payload.isCodeBlock = blk === "PRE";
    send("CONTEXT", payload);
    saveSelection();
  });
  function pushUndoState() {
    const currentHTML = document.body.innerHTML;
    if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== currentHTML) {
      undoStack.push(currentHTML);
      redoStack.length = 0;
    }
    send("UNDO_REDO_STATE", {
      canUndo: undoStack.length > 1,
      canRedo: redoStack.length > 0
    });
  }
  function doUndo() {
    if (undoStack.length > 1) {
      const current = undoStack.pop();
      if (current) redoStack.push(current);
      const prev = undoStack[undoStack.length - 1];
      document.body.innerHTML = prev;
      send("UPDATE", { html: prev });
    }
    send("UNDO_REDO_STATE", {
      canUndo: undoStack.length > 1,
      canRedo: redoStack.length > 0
    });
  }
  function doRedo() {
    if (redoStack.length > 0) {
      const next = redoStack.pop();
      if (next) {
        undoStack.push(next);
        document.body.innerHTML = next;
        send("UPDATE", { html: next });
      }
    }
    send("UNDO_REDO_STATE", {
      canUndo: undoStack.length > 1,
      canRedo: redoStack.length > 0
    });
  }
  pushUndoState();
  document.body.addEventListener("input", () => {
    pushUndoState();
    send("UPDATE", { html: document.body.innerHTML });
  });
  document.addEventListener("paste", (e) => {
    var _a;
    e.preventDefault();
    const text = ((_a = e.clipboardData) == null ? void 0 : _a.getData("text/plain")) || "";
    document.execCommand("insertText", false, text);
  });
  window.addEventListener("message", (e) => {
    const { type, cmd, value, html, block } = e.data || {};
    if (type === "EXEC" && cmd === "undo") {
      doUndo();
      return;
    }
    if (type === "EXEC" && cmd === "redo") {
      doRedo();
      return;
    }
    if (type === "EXEC") {
      console.log(type, cmd, value);
      restoreSelection();
      document.execCommand(cmd, false, value != null ? value : null);
      document.body.dispatchEvent(new Event("input"));
    }
    if (type === "FORMAT_BLOCK") {
      restoreSelection();
      document.execCommand("formatBlock", false, block || "P");
      document.body.dispatchEvent(new Event("input"));
    }
    if (type === "INSERT_HTML") {
      restoreSelection();
      document.execCommand("insertHTML", false, html || "");
      document.body.dispatchEvent(new Event("input"));
    }
    if (type === "SET_HTML") {
      console.log(html);
      document.body.innerHTML = html || "";
      document.body.dispatchEvent(new Event("input"));
    }
    if (type === "CUSTOM_INDENT") {
      console.log(type);
      const ev = new KeyboardEvent("keydown", { key: "Tab" });
      document.dispatchEvent(ev);
    }
    if (type === "CUSTOM_OUTDENT") {
      console.log(type);
      const ev = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true });
      document.dispatchEvent(ev);
    }
    if (type === "INSERT_TABLE") {
      restoreSelection();
      const { rows = 2, cols = 2 } = e.data;
      let tableHtml = "<table style='border-collapse: collapse; width: 100%;'>";
      for (let r = 0; r < rows; r++) {
        tableHtml += "<tr>";
        for (let c = 0; c < cols; c++) {
          tableHtml += "<td style='border: 1px solid #ccc; padding: 6px;'><br></td>";
        }
        tableHtml += "</tr>";
      }
      tableHtml += "</table><p><br></p>";
      document.execCommand("insertHTML", false, tableHtml);
      document.body.dispatchEvent(new Event("input"));
    }
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Tab") {
      ev.preventDefault();
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const node = range.startContainer;
      let el = null;
      if (node.nodeType === Node.ELEMENT_NODE) el = node;
      else if (node.parentElement)
        el = node.parentElement;
      const line = el == null ? void 0 : el.closest(
        "p, div, pre, blockquote, li"
      );
      if (!line) return;
      let textNode = line.firstChild;
      while (textNode && textNode.nodeType !== Node.TEXT_NODE) {
        textNode = textNode.nextSibling;
      }
      if (!textNode) {
        textNode = document.createTextNode("");
        line.insertBefore(textNode, line.firstChild);
      }
      if (!ev.shiftKey) {
        const indent = "\xA0\xA0\xA0\xA0";
        if (range.startOffset === 0 && range.startContainer === textNode) {
          textNode.textContent = indent + textNode.textContent;
        } else {
          const indentNode = document.createTextNode(indent);
          range.insertNode(indentNode);
        }
        const newRange = document.createRange();
        if (range.startContainer === textNode) newRange.setStart(textNode, 4);
        else newRange.setStartAfter(line.firstChild);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      } else {
        const firstText = textNode.textContent || "";
        const updated = firstText.replace(/^[\u00A0\s]{1,4}/, "");
        textNode.textContent = updated;
        const html = line.innerHTML.replace(/^(&nbsp;|\s){1,4}/, "");
        if (line.innerHTML !== html) line.innerHTML = html || "<br>";
        const newRange = document.createRange();
        if (line.firstChild) newRange.setStart(line.firstChild, 0);
        else newRange.selectNodeContents(line);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
      document.body.dispatchEvent(new Event("input"));
      return;
    }
    if (ev.ctrlKey || ev.metaKey) {
      const k = ev.key.toLowerCase();
      if (k === "z") {
        ev.preventDefault();
        document.execCommand("undo");
      }
      if (k === "y") {
        ev.preventDefault();
        document.execCommand("redo");
      }
      if (k === "b") {
        ev.preventDefault();
        document.execCommand("bold");
      }
      if (k === "i") {
        ev.preventDefault();
        document.execCommand("italic");
      }
      if (k === "u") {
        ev.preventDefault();
        document.execCommand("underline");
      }
    }
  });
  window.addEventListener("error", (err) => {
    parent.postMessage({ type: "IFRAME_ERROR", message: err.message }, "*");
  });
}

// src/core/engine.ts
var EditorCore = class {
  constructor(iframe, initialHTML = "<p>Start typing\u2026</p>") {
    this.win = null;
    this.doc = null;
    this.html = "";
    this.isReady = false;
    this.listeners = {};
    /**
     * 📡 Message handler for runtime communication.
     */
    this.handleMessage = (e) => {
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
          console.error("\u{1F6D1} Iframe error:", data.message);
          this.emit("error", data.message);
          break;
      }
    };
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
    if (!doc) throw new Error("\u274C No iframe document available");
    this.doc = doc;
    this.win = iframe.contentWindow;
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            html, body {
              height: 100%;
              min-height: 100%;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              overflow-y: auto;
              cursor: text;

              /* inherit from parent app */
              background: inherit !important;
              color: inherit !important;
              font: inherit !important;
            }

            *, *::before, *::after {
              box-sizing: inherit;
            }

            body {
              padding: 0.75rem;
              line-height: 1.6;
              display: flex;
              flex-direction: column;
            }

            [contenteditable]:focus { outline: none; }

            p, h1, h2, h3, h4, h5, h6, pre, blockquote {
              margin: 0 0 0.8em;
            }

            a {
              color: inherit;
              text-decoration: underline;
            }

            blockquote {
              border-left: 3px solid currentColor;
              padding-left: 1em;
              opacity: 0.85;
            }

            pre {
              background: color-mix(in srgb, currentColor 5%, transparent);
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
              border: 1px solid currentColor;
              opacity: 0.5;
              padding: 6px;
            }

            ::selection {
              background: color-mix(in srgb, currentColor 30%, transparent);
            }

            body:empty::before {
              content: attr(data-placeholder);
              opacity: 0.5;
              pointer-events: none;
            }

            /* optional smooth transition for dark/light switch */
            html, body {
              transition: background-color 0.25s ease, color 0.25s ease;
            }
          </style>
        </head>
        <body contenteditable="true" data-placeholder="Start typing..."></body>
      </html>
    `;
    doc.open();
    doc.write(htmlTemplate);
    doc.close();
    iframe.onload = () => {
      var _a;
      if (!((_a = this.doc) == null ? void 0 : _a.body)) return;
      this.doc.body.innerHTML = this.html;
      const runtimeScript = this.doc.createElement("script");
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
   * 📨 Sends a command or message to the iframe runtime.
   */
  post(type, payload) {
    if (!this.win) return;
    this.win.postMessage(__spreadValues({ type }, payload), "*");
  }
  /**
   * 🧱 Replaces the entire iframe content with new HTML.
   */
  fromHTML(html) {
    this.html = html;
    this.post("SET_HTML", { html });
  }
  /**
   * 💾 Returns current HTML.
   */
  toHTML() {
    var _a, _b, _c;
    return ((_c = (_b = (_a = this.doc) == null ? void 0 : _a.body) == null ? void 0 : _b.innerHTML) == null ? void 0 : _c.trim()) || this.html;
  }
  /**
   * 🧩 Converts current DOM into structured JSON.
   */
  toJSON() {
    if (!this.doc) return [];
    const root = this.doc.body;
    const traverse = (el) => {
      const node = { type: el.tagName.toLowerCase() };
      if (el.childElementCount === 0) {
        node.content = el.innerText;
      } else {
        node.children = Array.from(el.children).map(
          (c) => traverse(c)
        );
      }
      if (el.tagName.match(/^H[1-6]$/))
        node.attrs = { level: Number(el.tagName.replace("H", "")) };
      if (el.tagName === "A")
        node.attrs = __spreadProps(__spreadValues({}, node.attrs || {}), { href: el.getAttribute("href") });
      if (el.tagName === "IMG")
        node.attrs = __spreadProps(__spreadValues({}, node.attrs || {}), {
          src: el.getAttribute("src"),
          alt: el.getAttribute("alt")
        });
      return node;
    };
    return Array.from(root.children).map((c) => traverse(c));
  }
  /** ✅ Typed Event Registration */
  on(type, fn) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(fn);
  }
  /** ✅ Typed Event Emitter */
  emit(type, payload) {
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
};

// src/context/editor.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var defaultCtx = {
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
  isIndented: false
};
var EditorContext = React.createContext(null);
var useEditor = () => {
  const ctx = React.useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside <EditorProvider>");
  return ctx;
};
var EditorProvider = ({ initialContent = "<p>Start typing\u2026</p>", children, onChange }) => {
  const iframeRef = React.useRef(null);
  const [core, setCore] = React.useState(null);
  const [ctx, setCtx] = React.useState(defaultCtx);
  const [html, setHtml] = React.useState(initialContent);
  const [json, setJson] = React.useState([]);
  const [isFocused, setIsFocused] = React.useState(false);
  React.useEffect(() => {
    if (!iframeRef.current) return;
    const editor = new EditorCore(iframeRef.current, initialContent);
    editor.init();
    setCore(editor);
    editor.on("update", () => {
      setHtml(editor.toHTML());
      setJson(editor.toJSON());
      onChange == null ? void 0 : onChange(editor);
    });
    editor.on("context", (data) => {
      setCtx((prev) => __spreadValues(__spreadValues({}, prev), data));
    });
    editor.on("undoRedo", (state) => {
      setCtx((prev) => __spreadProps(__spreadValues({}, prev), {
        canUndo: Boolean(state == null ? void 0 : state.canUndo),
        canRedo: Boolean(state == null ? void 0 : state.canRedo)
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
    if (!(core == null ? void 0 : core.doc)) return;
    const doc = core.doc;
    const block = (doc.queryCommandValue("formatBlock") || "P").toUpperCase();
    setCtx((prev) => __spreadProps(__spreadValues({}, prev), {
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
      isCodeBlock: block === "PRE"
    }));
  }, [core]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    EditorContext.Provider,
    {
      value: {
        core,
        ctx,
        setCtx,
        html,
        json,
        iframeRef,
        refreshCtx
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "div",
        {
          "data-focused": isFocused,
          className: "\n    relative border border-border rounded-sm \n    transition-all duration-200 ring-0 \n    data-[focused=true]:ring-1 ring-blue-500/70 shadow-sm\n    hover:border-blue-400 cursor-text\n  ",
          children: [
            children,
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "iframe",
              {
                ref: iframeRef,
                className: "\n      w-full h-[350px] border-0 rounded-b \n      bg-background cursor-text focus:cursor-text\n    ",
                sandbox: "allow-same-origin allow-scripts allow-forms allow-popups"
              }
            )
          ]
        }
      )
    }
  );
};

// src/hooks/chain-execute.ts
var React2 = __toESM(require("react"), 1);

// src/core/chain.ts
var EditorChain = class {
  constructor(target) {
    this.queue = [];
    this.target = target;
  }
  post(msg) {
    if (!this.target) return;
    this.queue.push(msg);
    return this;
  }
  // Executes queued commands in order
  run() {
    if (!this.target) return;
    for (const msg of this.queue) this.target.postMessage(msg, "*");
    this.queue = [];
  }
  // Inline commands
  exec(cmd, value) {
    return this.post({ type: "EXEC", cmd, value });
  }
  undo() {
    var _a;
    (_a = this.target) == null ? void 0 : _a.postMessage({ type: "EXEC", cmd: "undo" }, "*");
    return this;
  }
  redo() {
    var _a;
    (_a = this.target) == null ? void 0 : _a.postMessage({ type: "EXEC", cmd: "redo" }, "*");
    return this;
  }
  bold() {
    return this.exec("bold");
  }
  italic() {
    return this.exec("italic");
  }
  underline() {
    return this.exec("underline");
  }
  strike() {
    return this.exec("strikeThrough");
  }
  // Block formats
  heading(level) {
    return this.post({ type: "FORMAT_BLOCK", block: `H${level}` });
  }
  paragraph() {
    return this.post({ type: "FORMAT_BLOCK", block: "P" });
  }
  quote() {
    return this.post({ type: "FORMAT_BLOCK", block: "BLOCKQUOTE" });
  }
  codeBlock() {
    return this.post({ type: "FORMAT_BLOCK", block: "PRE" });
  }
  // Lists
  bulletList() {
    return this.exec("insertUnorderedList");
  }
  orderedList() {
    return this.exec("insertOrderedList");
  }
  indent() {
    var _a;
    (_a = this.target) == null ? void 0 : _a.postMessage({ type: "CUSTOM_INDENT" }, "*");
    return this;
  }
  outdent() {
    var _a;
    (_a = this.target) == null ? void 0 : _a.postMessage({ type: "CUSTOM_OUTDENT" }, "*");
    return this;
  }
  // Align
  alignLeft() {
    return this.exec("justifyLeft");
  }
  alignCenter() {
    return this.exec("justifyCenter");
  }
  alignRight() {
    return this.exec("justifyRight");
  }
  // Colors
  color(value) {
    return this.exec("foreColor", value);
  }
  highlight(value) {
    return this.exec("hiliteColor", value);
  }
  // Links
  link(url) {
    return this.exec("createLink", url);
  }
  unlink() {
    return this.exec("unlink");
  }
  // Raw HTML
  insertHTML(html) {
    return this.post({ type: "INSERT_HTML", html });
  }
  setHTML(html) {
    return this.post({ type: "SET_HTML", html });
  }
  insertTable(rows, cols) {
    var _a;
    (_a = this.target) == null ? void 0 : _a.postMessage({ type: "INSERT_TABLE", rows, cols }, "*");
    return this;
  }
  // Helpers
  clear() {
    return this.exec("removeFormat");
  }
};

// src/hooks/chain-execute.ts
function useEditorChain() {
  const { iframeRef } = useEditor();
  const [chain, setChain] = React2.useState(null);
  React2.useEffect(() => {
    var _a;
    const win = (_a = iframeRef.current) == null ? void 0 : _a.contentWindow;
    if (win && !chain) {
      setChain(new EditorChain(win));
    }
  }, [iframeRef, chain]);
  const execute = React2.useCallback(
    (action, ...args) => {
      if (!chain) return;
      const fn = chain[action];
      if (typeof fn === "function") {
        const result = fn.apply(chain, args);
        if (result == null ? void 0 : result.run) result.run();
      } else {
        console.warn(`No chain method found for: ${action}`);
      }
    },
    [chain]
  );
  return { chain, execute };
}

// src/components/ui/button.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_class_variance_authority = require("class-variance-authority");

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/ui/button.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority.cva)(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-blue-600 hover:bg-blue-600/70 text-white"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button(_a) {
  var _b = _a, {
    className,
    variant,
    size,
    asChild = false
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size",
    "asChild"
  ]);
  const Comp = asChild ? import_react_slot.Slot : "button";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    Comp,
    __spreadValues({
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className }))
    }, props)
  );
}

// src/components/ui/separator.tsx
var SeparatorPrimitive = __toESM(require("@radix-ui/react-separator"), 1);
var import_jsx_runtime3 = require("react/jsx-runtime");
function Separator(_a) {
  var _b = _a, {
    className,
    orientation = "horizontal",
    decorative = true
  } = _b, props = __objRest(_b, [
    "className",
    "orientation",
    "decorative"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    SeparatorPrimitive.Root,
    __spreadValues({
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )
    }, props)
  );
}

// src/components/ui/tooltip.tsx
var TooltipPrimitive = __toESM(require("@radix-ui/react-tooltip"), 1);
var import_jsx_runtime4 = require("react/jsx-runtime");
function TooltipProvider(_a) {
  var _b = _a, {
    delayDuration = 0
  } = _b, props = __objRest(_b, [
    "delayDuration"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    TooltipPrimitive.Provider,
    __spreadValues({
      "data-slot": "tooltip-provider",
      delayDuration
    }, props)
  );
}
function Tooltip(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TooltipPrimitive.Root, __spreadValues({ "data-slot": "tooltip" }, props)) });
}
function TooltipTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TooltipPrimitive.Trigger, __spreadValues({ "data-slot": "tooltip-trigger" }, props));
}
function TooltipContent(_a) {
  var _b = _a, {
    className,
    sideOffset = 0,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "sideOffset",
    "children"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TooltipPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    TooltipPrimitive.Content,
    __spreadProps(__spreadValues({
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TooltipPrimitive.Arrow, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    })
  ) });
}

// src/components/richtext/toolbar/toolbar.tsx
var React3 = __toESM(require("react"), 1);
var import_jsx_runtime5 = require("react/jsx-runtime");
var ToolbarWrapper = React3.forwardRef(
  (_a, ref) => {
    var _b = _a, { children, className } = _b, props = __objRest(_b, ["children", "className"]);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "div",
      __spreadProps(__spreadValues({
        ref,
        className: cn(
          "flex items-center transform transition ease-in-out duration-300",
          className
        )
      }, props), {
        children
      })
    );
  }
);
ToolbarWrapper.displayName = "ToolbarWrapper";
var ToolbarGroup = React3.forwardRef(
  (_a, ref) => {
    var _b = _a, { children, className } = _b, props = __objRest(_b, ["children", "className"]);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "div",
      __spreadProps(__spreadValues({
        ref,
        className: cn(
          "flex items-center gap-1 transform transition ease-in-out duration-300",
          className
        )
      }, props), {
        children
      })
    );
  }
);
ToolbarGroup.displayName = "ToolbarGroup";
var ToolbarButtonSeparator = ({
  orientation = "vertical"
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    Separator,
    {
      orientation,
      role: "separator",
      style: { height: "2rem" },
      className: "border border-border border-l-0 border-y-0 w-px"
    }
  );
};
var ToolbarButton = React3.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      children,
      onClick,
      active = false,
      toolButtonSize = "sm",
      tooltip,
      className
    } = _b, props = __objRest(_b, [
      "children",
      "onClick",
      "active",
      "toolButtonSize",
      "tooltip",
      "className"
    ]);
    const sizeClasses = {
      sm: { style: "px-3 py-1 rounded-sm", size: "icon-sm" },
      md: { style: "px-4 py-2 rounded-md", size: "icon" },
      xs: { style: "px-2 py-0.5 rounded", size: "icon-xs" }
    };
    const { style, size } = sizeClasses[toolButtonSize];
    const button = /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      Button,
      __spreadProps(__spreadValues({
        size,
        onMouseDown: (e) => e.preventDefault(),
        onClick,
        variant: "outline",
        ref,
        "data-active": active,
        className: cn(
          `rounded border cursor-pointer text-sm disabled:cursor-not-allowed data-[active=true]:bg-accent data-[active=true]:text-foreground text-foreground/80 hover:text-foreground`,
          className,
          style
        )
      }, props), {
        children
      })
    );
    if (!tooltip) return button;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TooltipProvider, { delayDuration: 250, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Tooltip, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        TooltipContent,
        {
          side: "top",
          align: "end",
          className: "text-xs font-medium",
          children: tooltip
        }
      )
    ] }) });
  }
);
ToolbarButton.displayName = "ToolbarButton";

// src/components/richtext/ui/history.tsx
var import_lucide_react = require("lucide-react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var HistorySection = ({
  ctx,
  size = "sm"
}) => {
  const { execute } = useEditorChain();
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(ToolbarGroup, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      ToolbarButton,
      {
        tooltip: "Undo",
        disabled: !ctx.canUndo,
        onClick: () => execute("undo"),
        toolButtonSize: size,
        className: "rounded",
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react.Undo2, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      ToolbarButton,
      {
        tooltip: "Redo",
        toolButtonSize: size,
        disabled: !ctx.canRedo,
        onClick: () => execute("redo"),
        className: "rounded",
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react.Redo2, {})
      }
    )
  ] });
};

// src/components/richtext/ui/indent-outdent.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var IndentOutdentSection = ({
  ctx,
  size
}) => {
  const { execute } = useEditorChain();
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(ToolbarGroup, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      ToolbarButton,
      {
        toolButtonSize: size,
        tooltip: "Indent",
        disabled: ctx == null ? void 0 : ctx.isIndented,
        onClick: () => execute("indent"),
        children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Indent, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      ToolbarButton,
      {
        toolButtonSize: size,
        tooltip: "Outdent",
        disabled: !(ctx == null ? void 0 : ctx.isIndented),
        onClick: () => execute("outdent"),
        children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Outdent, {})
      }
    )
  ] });
};
var Indent = (_a) => {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "svg",
    __spreadProps(__spreadValues({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16"
    }, props), {
      fill: "currentColor",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M1 10.407c0 .473.55.755.96.493l3.765-2.408a.578.578 0 0 0 0-.985l-3.765-2.407c-.41-.262-.96.02-.96.493z" })
      ]
    })
  );
};
var Outdent = (_a) => {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "svg",
    __spreadProps(__spreadValues({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16"
    }, props), {
      fill: "currentColor",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M6 10.407c0 .473-.55.755-.96.493l-3.765-2.408a.578.578 0 0 1 0-.985l3.765-2.407c.41-.262.96.02.96.493z" })
      ]
    })
  );
};

// src/components/richtext/ui/list-selector.tsx
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime8 = require("react/jsx-runtime");
var ListSelectorSection = ({
  ctx,
  size = "sm"
}) => {
  const { execute } = useEditorChain();
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(ToolbarGroup, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      ToolbarButton,
      {
        onClick: () => execute("bulletList"),
        active: ctx.unorderedList,
        toolButtonSize: size,
        tooltip: "Unordered List",
        children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react2.List, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      ToolbarButton,
      {
        onClick: () => execute("orderedList"),
        active: ctx.orderedList,
        toolButtonSize: size,
        tooltip: "Ordered List",
        children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react2.ListOrdered, {})
      }
    )
  ] });
};

// src/components/ui/popover.tsx
var PopoverPrimitive = __toESM(require("@radix-ui/react-popover"), 1);
var import_jsx_runtime9 = require("react/jsx-runtime");
function Popover(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PopoverPrimitive.Root, __spreadValues({ "data-slot": "popover" }, props));
}
function PopoverTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PopoverPrimitive.Trigger, __spreadValues({ "data-slot": "popover-trigger" }, props));
}
function PopoverContent(_a) {
  var _b = _a, {
    className,
    align = "center",
    sideOffset = 4
  } = _b, props = __objRest(_b, [
    "className",
    "align",
    "sideOffset"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PopoverPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    PopoverPrimitive.Content,
    __spreadValues({
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      )
    }, props)
  ) });
}

// src/components/richtext/ui/table-picker.tsx
var import_lucide_react3 = require("lucide-react");
var React4 = __toESM(require("react"), 1);
var import_jsx_runtime10 = require("react/jsx-runtime");
var TablePicker = React4.forwardRef((_a, ref) => {
  var _b = _a, { onSelect } = _b, buttonProps = __objRest(_b, ["onSelect"]);
  const [open, setOpen] = React4.useState(false);
  const [table, setTable] = React4.useState({ rows: 2, cols: 2 });
  const maxRows = 10;
  const maxCols = 10;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      ToolbarButton,
      __spreadProps(__spreadValues({
        ref,
        toolButtonSize: "xs",
        tooltip: "Insert Table",
        "data-active": open
      }, buttonProps), {
        children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react3.Table, {})
      })
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(PopoverContent, { children: [
      Array.from({ length: maxRows }).map((_, r) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "flex space-y-0.5 space-x-0.5 mx-auto w-full", children: Array.from({ length: maxCols }).map((_2, c) => {
        const active = r <= table.rows && c <= table.cols;
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "div",
          {
            onMouseEnter: () => setTable({ rows: r, cols: c }),
            onClick: () => {
              onSelect == null ? void 0 : onSelect(r + 1, c + 1);
              setOpen(false);
            },
            "data-active": active,
            className: `w-5 h-5 border cursor-pointer bg-transparent hover:bg-gray-200 data-[active=true]:ring-1 data-[active=true]:ring-blue-500 data-[active=true]:bg-accent`
          },
          c
        );
      }) }, r)),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Separator, { className: "w-full" }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "text-xs text-muted-foreground mt-2", children: [
        table.rows + 1,
        " \xD7 ",
        table.cols + 1
      ] })
    ] })
  ] });
});
TablePicker.displayName = "TablePicker";

// src/components/richtext/ui/text-aligner.tsx
var React5 = __toESM(require("react"), 1);

// src/components/ui/dropdown-menu.tsx
var DropdownMenuPrimitive = __toESM(require("@radix-ui/react-dropdown-menu"), 1);
var import_lucide_react4 = require("lucide-react");
var import_jsx_runtime11 = require("react/jsx-runtime");
function DropdownMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DropdownMenuPrimitive.Root, __spreadValues({ "data-slot": "dropdown-menu" }, props));
}
function DropdownMenuTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    DropdownMenuPrimitive.Trigger,
    __spreadValues({
      "data-slot": "dropdown-menu-trigger"
    }, props)
  );
}
function DropdownMenuContent(_a) {
  var _b = _a, {
    className,
    sideOffset = 4
  } = _b, props = __objRest(_b, [
    "className",
    "sideOffset"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    DropdownMenuPrimitive.Content,
    __spreadValues({
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-0 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded border p-1 shadow-md",
        className
      )
    }, props)
  ) });
}
function DropdownMenuItem(_a) {
  var _b = _a, {
    className,
    inset,
    variant = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "variant"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    DropdownMenuPrimitive.Item,
    __spreadValues({
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}

// src/components/richtext/ui/text-aligner.tsx
var import_lucide_react5 = require("lucide-react");
var import_jsx_runtime12 = require("react/jsx-runtime");
var TextAlignerSection = (_a) => {
  var _b = _a, {
    size = "sm",
    ctx
  } = _b, props = __objRest(_b, [
    "size",
    "ctx"
  ]);
  var _a2;
  const [_open, _setOpen] = React5.useState(false);
  const { execute } = useEditorChain();
  const alignOptions = [
    {
      cmd: "alignLeft",
      tooltip: "Align Left",
      icon: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.TextAlignStart, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyLeft
    },
    {
      cmd: "alignCenter",
      tooltip: "Align Center",
      icon: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.TextAlignCenter, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyCenter
    },
    {
      cmd: "alignRight",
      tooltip: "Align Right",
      icon: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.TextAlignEnd, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyRight
    }
  ];
  const activeAlign = ((_a2 = alignOptions.find((a) => a.active)) == null ? void 0 : _a2.icon) || /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.TextAlignStart, { className: "w-4 h-4" });
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(DropdownMenu, { open: _open, onOpenChange: _setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      ToolbarButton,
      __spreadProps(__spreadValues({}, props), {
        tooltip: "Text Alignment",
        "data-active": _open,
        toolButtonSize: size,
        children: activeAlign
      })
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      DropdownMenuContent,
      {
        align: "center",
        className: "flex gap-1 p-2 min-w-0 bg-background/95 backdrop-blur-md rounded shadow-sm border",
        children: alignOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          ToolbarButton,
          {
            tooltip: opt.tooltip,
            toolButtonSize: "sm",
            active: opt.active,
            onClick: () => {
              execute(opt.cmd);
              _setOpen(!_open);
            },
            children: opt.icon
          },
          opt.cmd
        ))
      }
    )
  ] });
};

// src/components/richtext/ui/text-format.tsx
var React6 = __toESM(require("react"), 1);
var import_lucide_react6 = require("lucide-react");
var import_jsx_runtime13 = require("react/jsx-runtime");
var allFormats = [
  {
    type: "heading",
    cmd: "heading",
    args: [1],
    tooltip: "Heading 1",
    icon: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Heading1, {}),
    activeKey: "isHeading1",
    style: "text-3xl font-bold leading-tight tracking-tight text-foreground"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [2],
    tooltip: "Heading 2",
    icon: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Heading2, {}),
    activeKey: "isHeading2",
    style: "text-2xl font-semibold leading-snug tracking-tight text-foreground"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [3],
    tooltip: "Heading 3",
    icon: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Heading3, {}),
    activeKey: "isHeading3",
    style: "text-xl font-semibold leading-snug text-foreground"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [4],
    tooltip: "Heading 4",
    icon: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Heading4, {}),
    activeKey: "isHeading4",
    style: "text-lg font-medium leading-relaxed text-foreground"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [5],
    tooltip: "Heading 5",
    icon: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Heading5, {}),
    activeKey: "isHeading5",
    style: "text-base font-medium leading-relaxed text-foreground"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [6],
    tooltip: "Heading 6",
    icon: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Heading6, {}),
    activeKey: "isHeading6",
    style: "text-sm font-semibold uppercase tracking-wide text-muted-foreground"
  },
  {
    type: "paragraph",
    cmd: "paragraph",
    tooltip: "Paragraph",
    icon: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Pilcrow, {}),
    activeKey: "isParagraph",
    style: "text-base leading-relaxed text-muted-foreground max-w-prose truncate"
  },
  {
    type: "blockquote",
    cmd: "quote",
    tooltip: "Blockquote",
    icon: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Quote, {}),
    activeKey: "isBlockquote",
    style: "text-base italic border-l-2 border-muted pl-3 text-muted-foreground leading-relaxed"
  },
  {
    type: "code",
    cmd: "codeBlock",
    tooltip: "Code Block",
    icon: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Code, {}),
    activeKey: "isCodeBlock",
    style: "text-sm font-mono bg-muted rounded px-2 py-1 text-foreground truncate"
  }
];
var TextFormatSection = ({
  ctx,
  format = {
    heading: [1, 2, 3],
    code: false,
    blockquote: false,
    paragraph: true
  },
  size = "sm"
}) => {
  const { execute } = useEditorChain();
  const visibleFormats = React6.useMemo(() => {
    return allFormats.filter((btn) => {
      var _a, _b;
      switch (btn.type) {
        case "heading":
          return (_b = format.heading) == null ? void 0 : _b.includes((_a = btn.args) == null ? void 0 : _a[0]);
        case "paragraph":
          return !!format.paragraph;
        case "blockquote":
          return !!format.blockquote;
        case "code":
          return !!format.code;
        default:
          return false;
      }
    });
  }, [format]);
  const currentActive = visibleFormats.find(
    (btn) => ctx[btn.activeKey]
  );
  const currentLabel = (currentActive == null ? void 0 : currentActive.tooltip) || "Format";
  const sizeClasses = {
    sm: "px-2 h-8 text-sm gap-1.5",
    md: "px-3 h-9 text-base gap-2",
    xs: "px-1.5 h-7 text-xs gap-1"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(DropdownMenu, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Tooltip, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
        DropdownMenuTrigger,
        {
          className: `flex items-center justify-between gap-1 border border-border rounded ${sizeClasses[size]} text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:ring-1 focus-visible:ring-ring focus:outline-none min-w-[6rem]`,
          children: [
            currentLabel,
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.ChevronDown, { className: "w-4 h-4 opacity-70", strokeWidth: 2 })
          ]
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TooltipContent, { side: "bottom", children: "Select Text format" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DropdownMenuContent, { align: "center", className: "min-w-10 space-y-0.5", children: visibleFormats.map((btn) => {
      const active = Boolean(ctx[btn.activeKey]);
      return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
        DropdownMenuItem,
        {
          onClick: () => execute(btn.cmd, ...btn.args || []),
          "data-active": active,
          className: `flex hover:bg-muted/70 data-[active=true]:text-accent-foreground data-[active=true]:bg-accent items-center justify-between gap-2 px-2 py-1.5 cursor-pointer transition-colors ease-in-out duration-150`,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: cn("flex items-center gap-2", btn == null ? void 0 : btn.style), children: [
              btn.icon,
              btn.tooltip
            ] }),
            active && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Check, { className: "w-4 h-4 text-blue-500" })
          ]
        },
        btn.tooltip
      );
    }) })
  ] });
};

// src/components/richtext/ui/text-style.tsx
var React8 = __toESM(require("react"), 1);
var import_lucide_react8 = require("lucide-react");

// src/components/richtext/ui/color-picker.tsx
var React7 = __toESM(require("react"), 1);
var import_react_color = require("react-color");
var import_lucide_react7 = require("lucide-react");

// src/components/ui/tabs.tsx
var TabsPrimitive = __toESM(require("@radix-ui/react-tabs"), 1);
var import_jsx_runtime14 = require("react/jsx-runtime");
function Tabs(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    TabsPrimitive.Root,
    __spreadValues({
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className)
    }, props)
  );
}
function TabsList(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    TabsPrimitive.List,
    __spreadValues({
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )
    }, props)
  );
}
function TabsTrigger(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    TabsPrimitive.Trigger,
    __spreadValues({
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}
function TabsContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    TabsPrimitive.Content,
    __spreadValues({
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className)
    }, props)
  );
}

// src/components/richtext/ui/color-picker.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
var ColorHighlighter = React7.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      color,
      onChange,
      disabled,
      className,
      isBack,
      onChangeIsBackground,
      icon,
      size = "sm"
    } = _b, props = __objRest(_b, [
      "color",
      "onChange",
      "disabled",
      "className",
      "isBack",
      "onChangeIsBackground",
      "icon",
      "size"
    ]);
    const [isOpen, setIsOpen] = React7.useState(false);
    const [tempColor, setTempColor] = React7.useState(color || "#000000");
    const IconComponent = icon || import_lucide_react7.Check;
    const handleChange = (clr) => {
      setTempColor(clr.hex);
    };
    const handleComplete = (clr) => {
      setTempColor(clr.hex);
      onChange == null ? void 0 : onChange(clr.hex);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
        PopoverTrigger,
        {
          className: cn(
            "px-0.5 p-0 flex items-center data-[state=open]:bg-accent",
            className
          ),
          ref,
          disabled,
          asChild: true,
          children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(ToolbarButton, __spreadProps(__spreadValues({ toolButtonSize: size, tooltip: "Color" }, props), { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(IconComponent, { color: "currentColor" }) }))
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
        PopoverContent,
        {
          className: "p-2 w-[260px] bg-background shadow-lg border border-border rounded",
          align: "end",
          children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
            Tabs,
            {
              value: isBack,
              onValueChange: (value) => onChangeIsBackground == null ? void 0 : onChangeIsBackground(value),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(TabsList, { className: "w-full rounded bg-accent", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                    TabsTrigger,
                    {
                      value: "text",
                      className: "w-full cursor-pointer rounded",
                      children: "Text"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                    TabsTrigger,
                    {
                      value: "background",
                      className: "w-full cursor-pointer rounded",
                      children: "Background"
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(TabsContent, { value: "text", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                  Picker,
                  {
                    handleChange,
                    handleComplete,
                    color: tempColor
                  }
                ) }),
                /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(TabsContent, { value: "background", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                  Picker,
                  {
                    handleChange,
                    handleComplete,
                    color: tempColor
                  }
                ) })
              ]
            }
          )
        }
      )
    ] });
  }
);
ColorHighlighter.displayName = "ColorHighlighter";
function Picker({
  handleChange,
  handleComplete,
  color
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    import_react_color.SketchPicker,
    {
      color,
      onChange: handleChange,
      onChangeComplete: handleComplete,
      disableAlpha: true,
      presetColors: [
        "#4F46E5",
        "#7C3AED",
        "#EC4899",
        "#F43F5E",
        "#EF4444",
        "#F97316",
        "#F59E0B",
        "#10B981",
        "#06B6D4",
        "#0EA5E9",
        "#3B82F6",
        "#64748B",
        "#000000",
        "#FFFFFF"
      ],
      styles: {
        default: {
          picker: {
            padding: "0px",
            maxWidth: "100%",
            width: "250px",
            background: "inherit",
            boxShadow: "none",
            borderRadius: "12px",
            cursor: "pointer"
          },
          saturation: {
            borderRadius: "6px",
            marginBottom: "12px",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.05)"
          },
          controls: {
            display: "flex",
            justifyContent: "space-between",
            color: "inherit"
          },
          color: {
            color: "inherit",
            background: "#000",
            borderRadius: "6px"
          },
          activeColor: {
            borderRadius: "8px",
            border: "1px solid #444"
          },
          hue: {
            color: "inherit",
            height: "12px",
            borderRadius: "8px"
          }
        }
      }
    }
  );
}

// src/components/richtext/ui/text-style.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
var styleButtons = [
  {
    type: "bold",
    cmd: "bold",
    tooltip: "Bold",
    icon: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react8.Bold, {}),
    activeKey: "bold",
    action_type: "button"
  },
  {
    type: "italic",
    cmd: "italic",
    tooltip: "Italic",
    icon: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react8.Italic, {}),
    activeKey: "italic",
    action_type: "button"
  },
  {
    type: "underline",
    cmd: "underline",
    tooltip: "Underline",
    icon: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react8.Underline, {}),
    activeKey: "underline",
    action_type: "button"
  }
];
var StyleFormatSection = ({
  ctx,
  size = "sm",
  highlighter = true
}) => {
  const [isBackground, setIsBackground] = React8.useState("text");
  const { execute } = useEditorChain();
  const handleUpdateColor = (color) => {
    const cmd = isBackground === "text" ? "color" : "highlight";
    execute(cmd, color);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(ToolbarGroup, { children: [
    styleButtons.map((btn) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      ToolbarButton,
      {
        tooltip: btn.tooltip,
        onClick: () => execute(btn.cmd),
        active: Boolean(ctx[btn.activeKey]),
        toolButtonSize: size,
        children: btn.icon
      },
      btn.type
    )),
    highlighter && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      ColorHighlighter,
      {
        size: "xs",
        color: ctx.foreColor,
        icon: import_lucide_react8.Palette,
        onChange: handleUpdateColor,
        isBack: isBackground,
        onChangeIsBackground: () => setIsBackground(isBackground === "text" ? "background" : "text")
      }
    )
  ] });
};

// src/components/ui/skeleton.tsx
var import_jsx_runtime17 = require("react/jsx-runtime");
function Skeleton(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    "div",
    __spreadValues({
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className)
    }, props)
  );
}

// src/components/richtext/ui/loader.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
var EditorSkeleton = ({
  animation = "pulse"
}) => {
  const base = "w-full bg-muted";
  const animationClass = animation === "shine" ? "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent" : "animate-pulse";
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
    "div",
    {
      className: `border border-border w-full rounded-md overflow-hidden bg-background ${animationClass}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-center gap-2 relative px-2 py-1", children: [
          [1, 2, 3, 4, 5, 6, 7, 8].map((width) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            Skeleton,
            {
              className: `${base} h-7 ${width === 3 ? "w-16 lg:w-20" : "w-7 lg:w-8"}  lg:h-8`
            },
            width
          )),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Skeleton, { className: "absolute right-1" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "h-px bg-border" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: `${base} h-64` })
      ]
    }
  );
};
var DotsLoader = () => /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex flex-col items-center justify-center h-48 w-full border border-border rounded-md bg-white", children: [
  /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex space-x-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "w-3 h-3 bg-gray-400 rounded-full animate-bounce" })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-xs text-muted-foreground mt-3", children: "Loading editor..." })
] });
var SpinnerLoader = () => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "flex items-center justify-center h-48 w-full border border-border rounded-md bg-white", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "w-6 h-6 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin" }) });

// src/components/richtext/toolbar/ToolbarChain.tsx
var React9 = __toESM(require("react"), 1);
var import_lucide_react9 = require("lucide-react");
var import_jsx_runtime19 = require("react/jsx-runtime");
var ToolbarChain = ({ format }) => {
  const { iframeRef, ctx } = useEditor();
  const [chain, setChain] = React9.useState(null);
  React9.useEffect(() => {
    const timer = setInterval(() => {
      var _a;
      if (((_a = iframeRef.current) == null ? void 0 : _a.contentWindow) && !chain) {
        setChain(new EditorChain(iframeRef.current.contentWindow));
      }
    }, 500);
    return () => clearInterval(timer);
  }, [iframeRef, chain]);
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(ToolbarWrapper, { className: "flex flex-wrap gap-2 border-b py-1 px-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(HistorySection, { ctx, size: "xs" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(ToolbarButtonSeparator, { orientation: "vertical" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(TextFormatSection, { ctx, size: "xs", format }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(StyleFormatSection, { ctx, size: "xs" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(ToolbarButtonSeparator, { orientation: "vertical" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(ListSelectorSection, { ctx, size: "xs" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(IndentOutdentSection, { size: "xs", ctx }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(TextAlignerSection, { ctx, size: "xs" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      TablePicker,
      {
        variant: "outline",
        size: "icon-xs",
        onSelect: (rows, cols) => {
          var _a, _b, _c;
          const win = (_a = iframeRef.current) == null ? void 0 : _a.contentWindow;
          const body = (_b = win == null ? void 0 : win.document) == null ? void 0 : _b.body;
          body == null ? void 0 : body.focus();
          (_c = chain == null ? void 0 : chain.insertTable(rows, cols)) == null ? void 0 : _c.run();
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      ToolbarButton,
      {
        toolButtonSize: "xs",
        tooltip: "Add Divider",
        onClick: () => {
          var _a;
          return (_a = chain == null ? void 0 : chain.insertHTML("<hr>")) == null ? void 0 : _a.run();
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react9.Minus, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      ToolbarButton,
      {
        toolButtonSize: "xs",
        tooltip: "Clear",
        onClick: () => {
          var _a;
          return (_a = chain == null ? void 0 : chain.clear()) == null ? void 0 : _a.run();
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react9.Ban, {})
      }
    )
  ] });
};

// src/components/richtext/editor.tsx
var import_jsx_runtime20 = require("react/jsx-runtime");
var RichtextEditor = ({
  initialContent = "<p>Start typing\u2026</p>",
  loader = "shine",
  toolbar,
  onChange
}) => {
  const [isMount, setIsMount] = React10.useState(false);
  React10.useEffect(() => {
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
        return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(EditorSkeleton, { animation: "shine" });
      case "skeleton":
        return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(EditorSkeleton, {});
      case "dots":
        return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DotsLoader, {});
      default:
        return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(SpinnerLoader, {});
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(EditorProvider, { initialContent, onChange, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ToolbarChain, __spreadValues({}, toolbar)) });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RichtextEditor
});
//# sourceMappingURL=index.cjs.map