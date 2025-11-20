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
var React15 = __toESM(require("react"), 1);

// src/context/editor.tsx
var React = __toESM(require("react"), 1);

// src/core/runtime.ts
function editorRuntimeInit() {
  let lastRange = null;
  const undoStack = [];
  const redoStack = [];
  const RESIZE_SENSITIVITY = 0.35;
  function insertTable(rows = 2, cols = 2) {
    const wrapper = document.createElement("div");
    wrapper.className = "editor-table-wrapper";
    wrapper.style.position = "relative";
    wrapper.style.width = "100%";
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.tableLayout = "fixed";
    wrapper.appendChild(table);
    for (let r = 0; r < rows; r++) {
      const tr = document.createElement("tr");
      for (let c = 0; c < cols; c++) {
        const td = document.createElement("td");
        td.style.border = "1px solid #ccc";
        td.style.padding = "6px";
        td.innerHTML = "<br>";
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    document.execCommand(
      "insertHTML",
      false,
      wrapper.outerHTML + "<p><br></p>"
    );
    setTimeout(() => {
      const tbl = document.body.querySelector(
        "table:last-of-type"
      );
      if (tbl) {
        equalizeColumns(tbl);
        addTableResizeHandles(tbl);
      }
    }, 15);
  }
  function equalizeColumns(table) {
    const first = table.rows[0];
    if (!first) return;
    const count = first.cells.length;
    const pct = 100 / count;
    for (let r = 0; r < table.rows.length; r++) {
      for (let c = 0; c < count; c++) {
        table.rows[r].cells[c].style.width = pct + "%";
      }
    }
  }
  function addTableResizeHandles(table) {
    const wrapper = table.parentElement;
    wrapper.style.position = "relative";
    wrapper.querySelectorAll(".table-resize-handle").forEach((n) => n.remove());
    const rect = () => table.getBoundingClientRect();
    const wrapRect = () => wrapper.getBoundingClientRect();
    function makeHandle(handle) {
      const el = document.createElement("div");
      el.className = "table-resize-handle";
      el.dataset.handle = handle;
      el.addEventListener(
        "mouseenter",
        () => wrapper.classList.add("table-active-border")
      );
      el.addEventListener(
        "mouseleave",
        () => wrapper.classList.remove("table-active-border")
      );
      wrapper.appendChild(el);
      el.style.position = "absolute";
      return el;
    }
    const colLeft = makeHandle("col-left");
    const colRight = makeHandle("col-right");
    const rowTop = makeHandle("row-top");
    const rowBottom = makeHandle("row-bottom");
    const cornerTL = makeHandle("corner-tl");
    const cornerTR = makeHandle("corner-tr");
    const cornerBL = makeHandle("corner-bl");
    const cornerBR = makeHandle("corner-br");
    function position() {
      const r = rect();
      const w = wrapRect();
      const cornerSize = 12;
      colLeft.style.left = r.left - w.left - 2 + "px";
      colLeft.style.top = "0px";
      colLeft.style.width = "2px";
      colLeft.style.height = table.offsetHeight + "px";
      colLeft.style.cursor = "col-resize";
      colRight.style.left = r.right - w.left - 2 + "px";
      colRight.style.top = "0px";
      colRight.style.width = "2px";
      colRight.style.height = table.offsetHeight + "px";
      colRight.style.cursor = "col-resize";
      rowTop.style.top = r.top - w.top - 2 + "px";
      rowTop.style.left = "0px";
      rowTop.style.height = "2px";
      rowTop.style.width = table.offsetWidth + "px";
      rowTop.style.cursor = "row-resize";
      rowBottom.style.top = r.bottom - w.top - 2 + "px";
      rowBottom.style.left = "0px";
      rowBottom.style.height = "2px";
      rowBottom.style.width = table.offsetWidth + "px";
      rowBottom.style.cursor = "row-resize";
      cornerTL.style.left = r.left - w.left - cornerSize / 2 + "px";
      cornerTL.style.top = r.top - w.top - cornerSize / 2 + "px";
      cornerTL.style.width = cornerSize + "px";
      cornerTL.style.height = cornerSize + "px";
      cornerTL.style.cursor = "nwse-resize";
      cornerTR.style.left = r.right - w.left - cornerSize / 2 + "px";
      cornerTR.style.top = r.top - w.top - cornerSize / 2 + "px";
      cornerTR.style.width = cornerSize + "px";
      cornerTR.style.height = cornerSize + "px";
      cornerTR.style.cursor = "nesw-resize";
      cornerBL.style.left = r.left - w.left - cornerSize / 2 + "px";
      cornerBL.style.top = r.bottom - w.top - cornerSize / 2 + "px";
      cornerBL.style.width = cornerSize + "px";
      cornerBL.style.height = cornerSize + "px";
      cornerBL.style.cursor = "nesw-resize";
      cornerBR.style.left = r.right - w.left - cornerSize / 2 + "px";
      cornerBR.style.top = r.bottom - w.top - cornerSize / 2 + "px";
      cornerBR.style.width = cornerSize + "px";
      cornerBR.style.height = cornerSize + "px";
      cornerBR.style.cursor = "nwse-resize";
    }
    position();
    new ResizeObserver(position).observe(table);
    let active = null;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startRowHeight = 0;
    wrapper.addEventListener("mousedown", (e) => {
      var _a;
      const target = (_a = e.target) == null ? void 0 : _a.closest(
        ".table-resize-handle"
      );
      if (!target) return;
      active = target.dataset.handle;
      startX = e.clientX;
      startY = e.clientY;
      startW = table.offsetWidth;
      startRowHeight = table.rows[0].cells[0].offsetHeight;
      e.preventDefault();
      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
    });
    function doDrag(e) {
      if (!active) return;
      const rawDx = e.clientX - startX;
      const rawDy = e.clientY - startY;
      const dx = rawDx * RESIZE_SENSITIVITY;
      const dy = rawDy * RESIZE_SENSITIVITY;
      if (active === "col-right") {
        table.style.width = Math.max(80, startW + dx) + "px";
      }
      if (active === "col-left") {
        table.style.width = Math.max(80, startW - dx) + "px";
      }
      if (active === "row-bottom") {
        const newH = Math.max(20, startRowHeight + dy);
        resizeRows(newH);
      }
      if (active === "row-top") {
        const newH = Math.max(20, startRowHeight - dy);
        resizeRows(newH);
      }
      if (active.startsWith("corner")) {
        const newW = Math.max(80, startW + dx);
        const newH = Math.max(20, startRowHeight + dy);
        table.style.width = newW + "px";
        resizeRows(newH);
      }
      position();
    }
    function resizeRows(h) {
      for (const row of table.rows) {
        for (const cell of row.cells) {
          cell.style.height = h + "px";
        }
      }
    }
    function stopDrag() {
      active = null;
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    }
  }
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
  function getCaretPosition() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    const path = [];
    let node = range.startContainer;
    while (node && node !== document.body) {
      const parentNode = node.parentNode;
      if (!parentNode) break;
      const childNodeList = Array.from(parentNode.childNodes);
      const index = childNodeList.indexOf(node);
      path.unshift(index);
      node = parentNode;
    }
    return { path, offset: range.startOffset };
  }
  function setCaretPosition(pos) {
    var _a;
    if (!pos) return;
    let node = document.body;
    for (const index of pos.path) {
      if (!(node == null ? void 0 : node.childNodes[index])) break;
      node = node.childNodes[index];
    }
    if (!node) return;
    const range = document.createRange();
    try {
      range.setStart(node, Math.min(pos.offset, ((_a = node.textContent) == null ? void 0 : _a.length) || 0));
      range.collapse(true);
      const sel = window.getSelection();
      sel == null ? void 0 : sel.removeAllRanges();
      sel == null ? void 0 : sel.addRange(range);
    } catch (e) {
    }
  }
  function closestElement(node, selectors) {
    if (!node) return null;
    let el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    while (el) {
      if (el.matches(selectors)) return el;
      el = el.parentElement;
    }
    return null;
  }
  function send(type, payload = {}) {
    parent.postMessage(Object.assign({ type }, payload), "*");
  }
  if (document.readyState === "complete" || document.readyState === "interactive") {
    notifyReadySafely();
  } else {
    window.addEventListener("DOMContentLoaded", notifyReadySafely);
  }
  function ensureParagraphExists() {
    const body = document.body;
    const html = body.innerHTML.replace(/<br\s*\/?>/gi, "").replace(/<\/?p[^>]*>/gi, "").replace(/<\/?div[^>]*>/gi, "").replace(/&nbsp;/g, "").replace(/\s+/g, "").trim();
    if (html.length === 0) {
      body.innerHTML = "<p><br></p>";
      const firstP = body.querySelector("p");
      const range = document.createRange();
      const sel = window.getSelection();
      if (firstP) {
        range.setStart(firstP, 0);
        range.collapse(true);
        sel == null ? void 0 : sel.removeAllRanges();
        sel == null ? void 0 : sel.addRange(range);
      }
    }
  }
  function setupPlaceholder() {
    const body = document.body;
    function isVisuallyEmpty() {
      const html = body.innerHTML.replace(/<br\s*\/?>/gi, "").replace(/<\/?p[^>]*>/gi, "").replace(/<\/?div[^>]*>/gi, "").replace(/&nbsp;/g, "").replace(/\s+/g, "").trim();
      return html.length === 0;
    }
    function updatePlaceholder() {
      if (isVisuallyEmpty()) body.classList.add("empty");
      else body.classList.remove("empty");
    }
    const style = document.createElement("style");
    style.textContent = `
      body.empty::before {
        content: attr(data-placeholder);
        color: var(--editor-placeholder);
        pointer-events: none;
        position: absolute;
        top: 0.75rem;
        left: 0.75rem;
        opacity: 0.6;
      }
    `;
    document.head.appendChild(style);
    body.addEventListener("input", updatePlaceholder);
    body.addEventListener("focus", updatePlaceholder);
    body.addEventListener("blur", updatePlaceholder);
    updatePlaceholder();
  }
  setupPlaceholder();
  ensureParagraphExists();
  pushUndoState();
  document.addEventListener("selectionchange", () => {
    const sel = window.getSelection();
    let isLink = false;
    try {
      isLink = document.queryCommandState("createLink");
    } catch (e) {
      isLink = false;
    }
    if (sel && sel.anchorNode) {
      const anchorElement = sel.anchorNode.nodeType === Node.ELEMENT_NODE ? sel.anchorNode : sel.anchorNode.parentElement;
      if (anchorElement) {
        const linkParent = anchorElement.closest("a");
        if (linkParent) isLink = true;
      }
    }
    function isInside(tagNames) {
      const sel2 = window.getSelection();
      if (!sel2 || sel2.rangeCount === 0) return false;
      let node = sel2.anchorNode;
      if (!node) return false;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
      while (node && node !== document.body) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toUpperCase();
          if (tagNames.includes(tag)) return true;
        }
        node = node.parentNode;
      }
      return false;
    }
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
      foreColor: document.queryCommandValue("foreColor"),
      backColor: document.queryCommandValue("hiliteColor")
    };
    payload.bold = isInside(["B", "STRONG"]);
    payload.italic = isInside(["I", "EM"]);
    payload.underline = isInside(["U"]);
    payload.strike = isInside(["S", "STRIKE"]);
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
    payload.link = isLink;
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
    const runtimeScript = document.getElementById("__EDITOR_RUNTIME__");
    const clone = document.body.cloneNode(true);
    const runtimeClone = clone.querySelector("#__EDITOR_RUNTIME__");
    if (runtimeClone) runtimeClone.remove();
    const currentHTML = clone.innerHTML.trim();
    const caret = getCaretPosition();
    const last = undoStack[undoStack.length - 1];
    if (last && typeof last === "object" && last.html === currentHTML) return;
    undoStack.push({ html: currentHTML, caret });
    redoStack.length = 0;
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
      document.body.innerHTML = prev.html || "<p><br></p>";
      ensureParagraphExists();
      setCaretPosition(prev.caret || null);
      send("UPDATE", { html: prev.html });
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
        document.body.innerHTML = next.html || "<p><br></p>";
        ensureParagraphExists();
        setCaretPosition(next.caret || null);
        send("UPDATE", { html: next.html });
      }
    }
    send("UNDO_REDO_STATE", {
      canUndo: undoStack.length > 1,
      canRedo: redoStack.length > 0
    });
  }
  function breakInlineFormatting() {
    var _a;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!range.collapsed) return;
    const container = range.startContainer;
    const styledParent = closestElement(
      container,
      "b,strong,i,em,u,span[style]"
    );
    if (styledParent) {
      const after = document.createTextNode("");
      (_a = styledParent.parentNode) == null ? void 0 : _a.insertBefore(after, styledParent.nextSibling);
      const newRange = document.createRange();
      newRange.setStart(after, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  }
  document.body.addEventListener("input", () => {
    ensureParagraphExists();
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
    if (type === "EXEC" && cmd === "undo") return void doUndo();
    if (type === "EXEC" && cmd === "redo") return void doRedo();
    if (type === "EXEC") {
      restoreSelection();
      document.execCommand(cmd, false, value != null ? value : null);
      breakInlineFormatting();
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
      document.body.innerHTML = html || "";
      ensureParagraphExists();
      document.body.dispatchEvent(new Event("input"));
    }
    if (type === "CUSTOM_INDENT") {
      const ev = new KeyboardEvent("keydown", { key: "Tab" });
      document.dispatchEvent(ev);
    }
    if (type === "CUSTOM_OUTDENT") {
      const ev = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true });
      document.dispatchEvent(ev);
    }
    if (type === "INSERT_TABLE") {
      restoreSelection();
      insertTable(e.data.rows, e.data.cols);
      document.body.dispatchEvent(new Event("input"));
    }
  });
  document.addEventListener("keydown", (ev) => {
    var _a;
    if (ev.key === "Enter") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (!range.collapsed) return;
      const container = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentElement : range.startContainer;
      const styledParent = closestElement(
        container,
        "b,strong,i,em,u,span[style]"
      );
      if (styledParent) {
        ev.preventDefault();
        const newP = document.createElement("p");
        newP.innerHTML = "<br>";
        const currentBlock = styledParent.closest("p,div,li,blockquote,pre");
        (_a = currentBlock == null ? void 0 : currentBlock.parentNode) == null ? void 0 : _a.insertBefore(newP, currentBlock.nextSibling);
        const newRange = document.createRange();
        newRange.setStart(newP, 0);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
        document.body.dispatchEvent(new Event("input"));
        return;
      }
    }
    if (ev.key === "Tab") {
      ev.preventDefault();
      const sel = window.getSelection();
      const caretBefore = getCaretPosition();
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
      while (textNode && textNode.nodeType !== Node.TEXT_NODE)
        textNode = textNode.nextSibling;
      if (!textNode) {
        textNode = document.createTextNode("");
        line.insertBefore(textNode, line.firstChild);
      }
      if (!ev.shiftKey) {
        const indent = "\xA0\xA0\xA0\xA0";
        if (range.startOffset === 0 && range.startContainer === textNode)
          textNode.textContent = indent + textNode.textContent;
        else {
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
      setCaretPosition(caretBefore);
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
  constructor(iframe, value = "", placeholder = "Write something...") {
    this.win = null;
    this.doc = null;
    this.html = "";
    this.isReady = false;
    this.listeners = {};
    this.theme = "light";
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
    this.autoThemeHandler = (e) => {
      const isDark = e.matches;
      this.setTheme(isDark ? "dark" : "light");
    };
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
        line-height: 1.4;
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
         ON FOCUS \u2014 enable scroll + premium scrollbar
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
        margin: 0 0 0.6em;
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
        height: 100% !important;
        object-fit: contain !important;
        object-position: center;
        margin: 0.75rem 0;
        border-radius: 4px;
        max-height: 480px;
      }


      /* Tablet & Desktop \u2013 rectangular feel without cutting image */
      @media (min-width: 768px) {
        body img {
          min-height: 370px;
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
      var _a;
      if (!((_a = this.doc) == null ? void 0 : _a.body)) return;
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
    this.post("SET_HTML", { html: this.html });
  }
  /**
   * 📨 Sends a command or message to the iframe runtime.
   */
  post(type, payload) {
    if (!this.win) return;
    this.win.postMessage(__spreadValues({ type }, payload), "*");
  }
  fromHTML(html) {
    this.html = html;
    this.post("SET_HTML", { html });
  }
  toHTML() {
    var _a, _b, _c;
    return ((_c = (_b = (_a = this.doc) == null ? void 0 : _a.body) == null ? void 0 : _b.innerHTML) == null ? void 0 : _c.trim()) || this.html;
  }
  toJSON() {
    if (!this.doc) return [];
    const root = this.doc.body;
    const traverse = (el) => {
      const node = { type: el.tagName.toLowerCase() };
      if (el.childElementCount === 0) node.content = el.innerText;
      else
        node.children = Array.from(el.children).map(
          (c) => traverse(c)
        );
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
  on(type, fn) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(fn);
  }
  emit(type, payload) {
    const handlers = this.listeners[type];
    if (handlers) handlers.forEach((handler) => handler(payload));
  }
  /**
   * 🎨 Theme Setter — applies light, dark, or custom theme dynamically.
   */
  setTheme(theme) {
    if (!this.doc) return;
    this.theme = theme;
    const htmlEl = this.doc.documentElement;
    const styleEl = this.doc.getElementById("__EDITOR_THEME__") || this.doc.createElement("style");
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
      const customVars = Object.entries(theme).map(([key, val]) => `--${key}: ${val};`).join("\n");
      css = `:root { ${customVars} }`;
    }
    styleEl.textContent = css;
    this.doc.head.appendChild(styleEl);
  }
  /**
   * 🌗 Enables automatic theme following system preference.
   */
  enableAutoTheme() {
    if (this.autoThemeListener)
      this.autoThemeListener.removeEventListener(
        "change",
        this.autoThemeHandler
      );
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    this.autoThemeListener = mql;
    console.log(mql);
    if (!this.autoThemeListener) {
      mql.addEventListener("change", this.autoThemeHandler);
    }
    this.setTheme(mql.matches ? "dark" : "light");
    mql.addEventListener("change", this.autoThemeHandler);
  }
  /**
   * 🧹 Cleanup method for when editor is unmounted.
   */
  destroy() {
    var _a;
    window.removeEventListener("message", this.handleMessage);
    (_a = this.autoThemeListener) == null ? void 0 : _a.removeEventListener(
      "change",
      this.autoThemeHandler
    );
    this.listeners = {};
    this.isReady = false;
    this.win = null;
    this.doc = null;
  }
};

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

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
var EditorProvider = ({
  initialContent = "Start typing...",
  children,
  onChange,
  placeholder,
  style,
  theme,
  className
}) => {
  var _a, _b, _c, _d, _e;
  const iframeRef = React.useRef(null);
  const [core, setCore] = React.useState(null);
  const [ctx, setCtx] = React.useState(defaultCtx);
  const [html, setHtml] = React.useState(initialContent);
  const [json, setJson] = React.useState([]);
  const [isFocused, setIsFocused] = React.useState(false);
  const stableOnChange = React.useRef(onChange);
  const ignoreBlurRef = React.useRef(false);
  React.useEffect(() => {
    stableOnChange.current = onChange;
  }, [onChange]);
  React.useEffect(() => {
    if (!iframeRef.current) return;
    if (core) return;
    const editor = new EditorCore(
      iframeRef.current,
      initialContent,
      placeholder
    );
    editor.init();
    setCore(editor);
    editor.on("update", () => {
      var _a2;
      setHtml(editor.toHTML());
      setJson(editor.toJSON());
      (_a2 = stableOnChange.current) == null ? void 0 : _a2.call(stableOnChange, editor);
    });
    editor.on("context", (data) => {
      setCtx((prev) => __spreadValues(__spreadValues({}, prev), data));
    });
    editor.on("ready", () => {
      if (theme) {
        editor.setTheme(theme);
      } else {
        editor.enableAutoTheme();
      }
    });
    editor.on("undoRedo", (state) => {
      setCtx((prev) => __spreadProps(__spreadValues({}, prev), {
        canUndo: Boolean(state == null ? void 0 : state.canUndo),
        canRedo: Boolean(state == null ? void 0 : state.canRedo)
      }));
    });
    return () => editor.destroy();
  }, []);
  React.useEffect(() => {
    if (core && initialContent !== void 0) {
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
    const interval = setInterval(() => {
      var _a2;
      if ((_a2 = iframe.contentDocument) == null ? void 0 : _a2.body) {
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
  const radiusClassMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl"
  };
  const shadowClassMap = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl"
  };
  const borderWidth = (_b = (_a = style == null ? void 0 : style.border) == null ? void 0 : _a.width) != null ? _b : 1;
  const borderRadius = (_d = (_c = style == null ? void 0 : style.border) == null ? void 0 : _c.radius) != null ? _d : "md";
  const shadow = (_e = style == null ? void 0 : style.shadow) != null ? _e : "none";
  const containerClass = cn(
    "relative transition-all duration-200 ring-0 data-[focused=true]:ring-1 ring-blue-500/70 hover:border-blue-400 cursor-text border border-border",
    radiusClassMap[borderRadius],
    shadowClassMap[shadow]
  );
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
        refreshCtx: () => {
        }
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          "data-focused": isFocused,
          style: {
            height: typeof (style == null ? void 0 : style.height) === "string" ? style == null ? void 0 : style.height : `${style == null ? void 0 : style.height}px`,
            borderWidth: `${borderWidth}px`
          },
          className: cn(
            containerClass,
            "w-full max-w-full overflow-hidden",
            className
          ),
          onMouseEnter: () => ignoreBlurRef.current = true,
          onMouseLeave: () => ignoreBlurRef.current = false,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col w-full h-full overflow-hidden", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "shrink-0 w-full", children }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "iframe",
              {
                ref: iframeRef,
                style: {
                  height: (() => {
                    const h = style == null ? void 0 : style.height;
                    if (typeof h === "string") {
                      if (h.includes("%")) return `calc(${h} - 42px)`;
                      if (h.includes("px")) return `${parseFloat(h) - 42}px`;
                    }
                    if (typeof h === "number") return `${h - 42}px`;
                    return "calc(100% - 42px)";
                  })()
                },
                className: "\n              flex-1\n              block\n              w-full\n              border-0\n              bg-background\n              rounded-b\n              min-h-0\n            ",
                sandbox: "allow-same-origin allow-scripts allow-forms allow-popups"
              }
            )
          ] })
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
  insertImage(url, alt = "") {
    const html = `<img src="${url}" alt="${alt.replace(/"/g, "&quot;")}" />`;
    return this.insertHTML(html);
  }
  insertImages(images) {
    let html = "";
    for (const img of images) {
      html += `<img src="${img.url}" alt="${(img.alt || "").replace(
        /"/g,
        "&quot;"
      )}" />`;
    }
    return this.insertHTML(html);
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
var import_jsx_runtime2 = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority.cva)(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
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
var import_lucide_react = require("lucide-react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var EdgeIndicator = ({
  direction,
  visible,
  shadowIntensity,
  onClick
}) => {
  const Icon = direction === "left" ? import_lucide_react.ChevronLeft : import_lucide_react.ChevronRight;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "div",
    {
      className: cn(
        "absolute top-0 bottom-0 z-30 flex items-center justify-center transition-all duration-300 w-8",
        direction === "left" ? "left-0 bg-gradient-to-r from-background via-background/80 to-transparent" : "right-0 bg-gradient-to-l from-background via-background/80 to-transparent",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          onClick,
          className: cn(
            "w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200",
            "bg-background border border-border shadow-sm hover:bg-accent hover:scale-110",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          ),
          "aria-label": `Scroll ${direction}`,
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Icon, { className: "w-3.5 h-3.5 text-muted-foreground" })
        }
      )
    }
  );
};
var ToolbarWrapper = React3.forwardRef((_a, ref) => {
  var _b = _a, { children, className } = _b, props = __objRest(_b, ["children", "className"]);
  const containerRef = React3.useRef(null);
  const [showLeft, setShowLeft] = React3.useState(false);
  const [showRight, setShowRight] = React3.useState(false);
  const [hovered, setHovered] = React3.useState(false);
  const [shadowIntensity, setShadowIntensity] = React3.useState(0);
  const [isDragging, setIsDragging] = React3.useState(false);
  const updateOverflow = React3.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 5);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);
  React3.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    const onDown = (e) => {
      isDown = true;
      setIsDragging(true);
      startX = e.pageX;
      scrollStart = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };
    const onUp = () => {
      isDown = false;
      setIsDragging(false);
      el.style.cursor = "grab";
      el.style.userSelect = "auto";
    };
    const onMove = (e) => {
      if (!isDown) return;
      const diff = (e.pageX - startX) * 1.6;
      el.scrollLeft = scrollStart - diff;
      updateOverflow();
    };
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [updateOverflow]);
  React3.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lastScroll = el.scrollLeft;
    let lastTime = Date.now();
    let velocity = 0;
    const onScroll = () => {
      const now = Date.now();
      const currentScroll = el.scrollLeft;
      const deltaTime = now - lastTime;
      if (deltaTime > 0) {
        velocity = Math.abs(currentScroll - lastScroll) / deltaTime;
        setShadowIntensity(Math.min(velocity * 20, 1));
      }
      lastScroll = currentScroll;
      lastTime = now;
      updateOverflow();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [updateOverflow]);
  const scrollBy = (amount) => {
    var _a2;
    (_a2 = containerRef.current) == null ? void 0 : _a2.scrollBy({
      left: amount,
      behavior: "smooth"
    });
  };
  const enhancedChildren = React3.Children.map(children, (child) => {
    if (!React3.isValidElement(child)) return child;
    return React3.cloneElement(child, {
      className: cn(
        child.props.className,
        "transition-all duration-200"
      )
    });
  });
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      className: "relative w-full overflow-hidden group",
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          EdgeIndicator,
          {
            direction: "left",
            visible: showLeft && hovered,
            shadowIntensity,
            onClick: () => scrollBy(-200)
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "div",
          __spreadProps(__spreadValues({
            ref: (node) => {
              containerRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            },
            className: cn(
              "flex items-center gap-1 overflow-x-auto px-3 py-2 scroll-smooth hide-scrollbar",
              "overflow-y-hidden select-none touch-pan-x",
              "bg-background/95 backdrop-blur-sm border-b",
              isDragging ? "cursor-grabbing" : "cursor-grab",
              "transition-all duration-300",
              className
            ),
            style: {
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }
          }, props), {
            children: enhancedChildren
          })
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          EdgeIndicator,
          {
            direction: "right",
            visible: showRight && hovered,
            shadowIntensity,
            onClick: () => scrollBy(200)
          }
        )
      ]
    }
  );
});
ToolbarWrapper.displayName = "ToolbarWrapper";
var ToolbarGroup = React3.forwardRef((_a, ref) => {
  var _b = _a, { children, className } = _b, props = __objRest(_b, ["children", "className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "div",
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "flex items-center gap-1 px-1 first:pl-0 last:pr-0",
        "transition-all duration-300",
        className
      )
    }, props), {
      children
    })
  );
});
ToolbarGroup.displayName = "ToolbarGroup";
var ToolbarButtonSeparator = ({
  orientation = "vertical"
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    Separator,
    {
      orientation,
      role: "separator",
      style: {
        height: "1.75rem"
      },
      className: cn(
        "h-6 mx-1 bg-border/60",
        orientation === "vertical" ? "w-px" : "h-px w-full"
      )
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
      className,
      disabled
    } = _b, props = __objRest(_b, [
      "children",
      "onClick",
      "active",
      "toolButtonSize",
      "tooltip",
      "className",
      "disabled"
    ]);
    const [open, setOpen] = React3.useState(false);
    const [isPressed, setIsPressed] = React3.useState(false);
    React3.useEffect(() => {
      const closeTooltip = () => setOpen(false);
      window.addEventListener("editor-iframe-enter", closeTooltip);
      return () => window.removeEventListener("editor-iframe-enter", closeTooltip);
    }, []);
    const sizeClasses = {
      xs: "h-7 w-7 rounded-md text-xs",
      sm: "h-8 w-8 rounded-md text-sm",
      md: "h-9 w-9 rounded-lg text-base"
    };
    const handleMouseDown = (e) => {
      e.preventDefault();
      setIsPressed(true);
    };
    const handleMouseUp = () => {
      setIsPressed(false);
    };
    const handleClick = (e) => {
      setIsPressed(false);
      onClick == null ? void 0 : onClick(e);
    };
    const button = /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      Button,
      __spreadProps(__spreadValues({
        size: "icon",
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        onClick: handleClick,
        variant: "ghost",
        ref,
        disabled,
        "data-active": active,
        "data-pressed": isPressed,
        className: cn(
          sizeClasses[toolButtonSize],
          "relative transition-all duration-200",
          "border border-transparent hover:border-border/50",
          "bg-background hover:bg-accent/50 active:bg-accent",
          "shadow-sm hover:shadow-md active:shadow-sm",
          "focus:outline-none focus:ring-0 focus:ring-offset-0",
          "disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none",
          active && "bg-accent text-accent-foreground border-border/30",
          isPressed && "scale-95 bg-accent",
          className
        )
      }, props), {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "div",
            {
              className: cn(
                "transition-transform duration-200",
                isPressed && "scale-90"
              ),
              children
            }
          ),
          active && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" })
        ]
      })
    );
    if (!tooltip) return button;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TooltipProvider, { delayDuration: 300, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Tooltip, { open: open && !disabled, onOpenChange: setOpen, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        TooltipContent,
        {
          side: "top",
          align: "center",
          className: "text-xs font-medium px-2 py-1 bg-foreground text-background",
          sideOffset: 8,
          children: [
            tooltip,
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("kbd", { className: "ml-1 text-xs opacity-70", children: "\u2318" })
          ]
        }
      )
    ] }) });
  }
);
ToolbarButton.displayName = "ToolbarButton";

// src/components/richtext/ui/history.tsx
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var HistorySection = ({
  ctx,
  size = "sm"
}) => {
  const { execute } = useEditorChain();
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      ToolbarButton,
      {
        tooltip: "Undo",
        disabled: !ctx.canUndo,
        onClick: () => execute("undo"),
        toolButtonSize: size,
        className: "rounded",
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react2.Undo2, {})
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
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react2.Redo2, {})
      }
    )
  ] });
};

// src/components/richtext/ui/indent-outdent.tsx
var React4 = __toESM(require("react"), 1);

// src/components/ui/dialog.tsx
var DialogPrimitive = __toESM(require("@radix-ui/react-dialog"), 1);
var import_lucide_react3 = require("lucide-react");
var import_jsx_runtime7 = require("react/jsx-runtime");
function Dialog(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DialogPrimitive.Root, __spreadValues({ "data-slot": "dialog" }, props));
}
function DialogTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DialogPrimitive.Trigger, __spreadValues({ "data-slot": "dialog-trigger" }, props));
}
function DialogPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DialogPrimitive.Portal, __spreadValues({ "data-slot": "dialog-portal" }, props));
}
function DialogOverlay(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    DialogPrimitive.Overlay,
    __spreadValues({
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )
    }, props)
  );
}
function DialogContent(_a) {
  var _b = _a, {
    className,
    children,
    showCloseButton = true
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "showCloseButton"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DialogOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      DialogPrimitive.Content,
      __spreadProps(__spreadValues({
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )
      }, props), {
        children: [
          children,
          showCloseButton && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react3.XIcon, {}),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      })
    )
  ] });
}
function DialogHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    __spreadValues({
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className)
    }, props)
  );
}
function DialogTitle(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    DialogPrimitive.Title,
    __spreadValues({
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className)
    }, props)
  );
}

// src/components/ui/dropdown-menu.tsx
var DropdownMenuPrimitive = __toESM(require("@radix-ui/react-dropdown-menu"), 1);
var import_lucide_react4 = require("lucide-react");
var import_jsx_runtime8 = require("react/jsx-runtime");
function DropdownMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(DropdownMenuPrimitive.Root, __spreadValues({ "data-slot": "dropdown-menu" }, props));
}
function DropdownMenuTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
function DropdownMenuGroup(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(DropdownMenuPrimitive.Group, __spreadValues({ "data-slot": "dropdown-menu-group" }, props));
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
function DropdownMenuLabel(_a) {
  var _b = _a, {
    className,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "inset"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    DropdownMenuPrimitive.Label,
    __spreadValues({
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )
    }, props)
  );
}
function DropdownMenuSeparator(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    DropdownMenuPrimitive.Separator,
    __spreadValues({
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className)
    }, props)
  );
}

// src/components/ui/input.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function Input(_a) {
  var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    "input",
    __spreadValues({
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-border h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )
    }, props)
  );
}

// src/components/ui/label.tsx
var LabelPrimitive = __toESM(require("@radix-ui/react-label"), 1);
var import_jsx_runtime10 = require("react/jsx-runtime");
function Label2(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    LabelPrimitive.Root,
    __spreadValues({
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )
    }, props)
  );
}

// src/components/ui/skeleton.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
function Skeleton(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    "div",
    __spreadValues({
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className)
    }, props)
  );
}

// src/components/ui/switch.tsx
var SwitchPrimitive = __toESM(require("@radix-ui/react-switch"), 1);
var import_jsx_runtime12 = require("react/jsx-runtime");
function Switch(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
    SwitchPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )
    }, props), {
      children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        SwitchPrimitive.Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    })
  );
}

// src/components/ui/tabs.tsx
var TabsPrimitive = __toESM(require("@radix-ui/react-tabs"), 1);
var import_jsx_runtime13 = require("react/jsx-runtime");
function Tabs(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    TabsPrimitive.Trigger,
    __spreadValues({
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    TabsPrimitive.Content,
    __spreadValues({
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className)
    }, props)
  );
}

// src/components/richtext/ui/indent-outdent.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
var IconIndent = (_a) => {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
    "svg",
    __spreadProps(__spreadValues({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      fill: "currentColor"
    }, props), {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M1 10.407c0 .473.55.755.96.493l3.765-2.408a.578.578 0 0 0 0-.985l-3.765-2.407c-.41-.262-.96.02-.96.493z" })
      ]
    })
  );
};
var IconOutdent = (_a) => {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
    "svg",
    __spreadProps(__spreadValues({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      fill: "currentColor"
    }, props), {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M6 10.407c0 .473-.55.755-.96.493l-3.765-2.408a.578.578 0 0 1 0-.985l3.765-2.407c.41-.262.96.02.96.493z" })
      ]
    })
  );
};
var IndentOutdentSection = ({
  ctx,
  size
}) => {
  var _a;
  const { execute } = useEditorChain();
  const [open, setOpen] = React4.useState(false);
  const isIndented = (_a = ctx == null ? void 0 : ctx.isIndented) != null ? _a : false;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(DropdownMenu, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
      ToolbarButton,
      {
        toolButtonSize: size,
        active: open,
        tooltip: "Indentation",
        children: isIndented ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(IconOutdent, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(IconIndent, { className: "h-4 w-4" })
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
      DropdownMenuContent,
      {
        align: "end",
        className: "flex gap-1 p-2 min-w-0 rounded-md backdrop-blur-sm bg-background/95 border shadow-sm transition-all",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            ToolbarButton,
            {
              toolButtonSize: size,
              tooltip: "Indent",
              disabled: isIndented,
              onClick: () => {
                execute("indent");
                setOpen(false);
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(IconIndent, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            ToolbarButton,
            {
              toolButtonSize: size,
              tooltip: "Outdent",
              disabled: !isIndented,
              onClick: () => {
                execute("outdent");
                setOpen(false);
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(IconOutdent, { className: "w-4 h-4" })
            }
          )
        ]
      }
    )
  ] });
};

// src/components/richtext/ui/list-selector.tsx
var React5 = __toESM(require("react"), 1);
var import_lucide_react5 = require("lucide-react");
var import_jsx_runtime15 = require("react/jsx-runtime");
var ListSelectorSection = ({
  ctx,
  size = "sm"
}) => {
  const [_open, _setOpen] = React5.useState(false);
  const { execute } = useEditorChain();
  const listOptions = [
    {
      cmd: "bulletList",
      tooltip: "Unordered List",
      icon: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react5.List, { className: "h-4 w-4" }),
      active: ctx == null ? void 0 : ctx.unorderedList
    },
    {
      cmd: "orderedList",
      icon: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react5.ListOrdered, { className: "h-4 w-4" }),
      active: ctx == null ? void 0 : ctx.orderedList,
      tooltip: "Ordered List"
    }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(DropdownMenu, { open: _open, onOpenChange: _setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      ToolbarButton,
      {
        tooltip: "List Selector",
        toolButtonSize: size,
        active: _open,
        children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react5.List, {})
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      DropdownMenuContent,
      {
        align: "end",
        side: "bottom",
        className: "flex gap-1 py-1.5 px-2 min-w-0 bg-background/95 backdrop-blur-md rounded-md shadow-sm border",
        children: listOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
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

// src/components/richtext/ui/table-picker.tsx
var import_lucide_react6 = require("lucide-react");
var React6 = __toESM(require("react"), 1);
var import_jsx_runtime16 = require("react/jsx-runtime");
var TablePicker = React6.forwardRef((_a, ref) => {
  var _b = _a, { onSelect } = _b, buttonProps = __objRest(_b, ["onSelect"]);
  const [open, setOpen] = React6.useState(false);
  const [table, setTable] = React6.useState({ rows: 2, cols: 2 });
  const maxRows = 10;
  const maxCols = 10;
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(DropdownMenu, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      ToolbarButton,
      __spreadProps(__spreadValues({
        ref,
        toolButtonSize: "xs",
        tooltip: "Insert Table",
        active: open
      }, buttonProps), {
        children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react6.Table, {})
      })
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(DropdownMenuContent, { children: [
      Array.from({ length: maxRows }).map((_, r) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "flex space-y-0.5 space-x-0.5 mx-auto w-full", children: Array.from({ length: maxCols }).map((_2, c) => {
        const active = r <= table.rows && c <= table.cols;
        return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Separator, { className: "w-full" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "text-xs text-muted-foreground mt-2", children: [
        table.rows + 1,
        " \xD7 ",
        table.cols + 1
      ] })
    ] })
  ] });
});
TablePicker.displayName = "TablePicker";

// src/components/richtext/ui/text-aligner.tsx
var React7 = __toESM(require("react"), 1);
var import_lucide_react7 = require("lucide-react");
var import_jsx_runtime17 = require("react/jsx-runtime");
var TextAlignerSection = (_a) => {
  var _b = _a, {
    size = "sm",
    ctx
  } = _b, props = __objRest(_b, [
    "size",
    "ctx"
  ]);
  var _a2;
  const [_open, _setOpen] = React7.useState(false);
  const { execute } = useEditorChain();
  const alignOptions = [
    {
      cmd: "alignLeft",
      tooltip: "Align Left",
      icon: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react7.TextAlignStart, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyLeft
    },
    {
      cmd: "alignCenter",
      tooltip: "Align Center",
      icon: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react7.TextAlignCenter, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyCenter
    },
    {
      cmd: "alignRight",
      tooltip: "Align Right",
      icon: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react7.TextAlignEnd, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyRight
    }
  ];
  const activeAlign = ((_a2 = alignOptions.find((a) => a.active)) == null ? void 0 : _a2.icon) || /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react7.TextAlignStart, { className: "w-4 h-4" });
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(DropdownMenu, { open: _open, onOpenChange: _setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
      ToolbarButton,
      __spreadProps(__spreadValues({}, props), {
        tooltip: "Text Alignment",
        active: _open,
        toolButtonSize: size,
        children: activeAlign
      })
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
      DropdownMenuContent,
      {
        align: "center",
        className: "flex gap-1 p-2 min-w-0 bg-background/95 backdrop-blur-md rounded shadow-sm border",
        children: alignOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
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
var React8 = __toESM(require("react"), 1);
var import_lucide_react8 = require("lucide-react");
var import_jsx_runtime18 = require("react/jsx-runtime");
var allFormats = [
  {
    type: "heading",
    cmd: "heading",
    args: [1],
    tooltip: "Heading 1",
    icon: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react8.Heading1, {}),
    activeKey: "isHeading1",
    style: "text-3xl font-bold leading-tight tracking-tight text-foreground"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [2],
    tooltip: "Heading 2",
    icon: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react8.Heading2, {}),
    activeKey: "isHeading2",
    style: "text-2xl font-semibold leading-snug tracking-tight text-foreground"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [3],
    tooltip: "Heading 3",
    icon: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react8.Heading3, {}),
    activeKey: "isHeading3",
    style: "text-xl font-semibold leading-snug text-foreground"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [4],
    tooltip: "Heading 4",
    icon: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react8.Heading4, {}),
    activeKey: "isHeading4",
    style: "text-lg font-medium leading-relaxed text-foreground"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [5],
    tooltip: "Heading 5",
    icon: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react8.Heading5, {}),
    activeKey: "isHeading5",
    style: "text-base font-medium leading-relaxed text-foreground"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [6],
    tooltip: "Heading 6",
    icon: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react8.Heading6, {}),
    activeKey: "isHeading6",
    style: "text-sm font-semibold uppercase tracking-wide text-muted-foreground"
  },
  {
    type: "paragraph",
    cmd: "paragraph",
    tooltip: "Paragraph",
    icon: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react8.Pilcrow, {}),
    activeKey: "isParagraph",
    style: "text-base leading-relaxed text-muted-foreground max-w-prose truncate"
  },
  {
    type: "blockquote",
    cmd: "quote",
    tooltip: "Blockquote",
    icon: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react8.Quote, {}),
    activeKey: "isBlockquote",
    style: "text-base italic border-l-2 border-muted pl-3 text-muted-foreground leading-relaxed"
  },
  {
    type: "code",
    cmd: "codeBlock",
    tooltip: "Code Block",
    icon: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react8.Code, {}),
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
  const visibleFormats = React8.useMemo(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(DropdownMenu, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(Tooltip, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
        DropdownMenuTrigger,
        {
          className: `flex items-center justify-between gap-1 border border-border rounded ${sizeClasses[size]} text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:ring-1 focus-visible:ring-ring focus:outline-none min-w-[6rem]`,
          children: [
            currentLabel,
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react8.ChevronDown, { className: "w-4 h-4 opacity-70", strokeWidth: 2 })
          ]
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TooltipContent, { side: "top", children: "Select Text format" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(DropdownMenuContent, { align: "center", className: "min-w-10 space-y-0.5", children: visibleFormats.map((btn) => {
      const active = Boolean(ctx[btn.activeKey]);
      return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
        DropdownMenuItem,
        {
          onClick: () => execute(btn.cmd, ...btn.args || []),
          "data-active": active,
          className: `flex hover:bg-muted/70 data-[active=true]:text-accent-foreground data-[active=true]:bg-accent items-center justify-between gap-2 px-2 py-1.5 cursor-pointer transition-colors ease-in-out duration-150`,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("span", { className: cn("flex items-center gap-2", btn == null ? void 0 : btn.style), children: [
              btn.icon,
              btn.tooltip
            ] }),
            active && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react8.Check, { className: "w-4 h-4 text-blue-500" })
          ]
        },
        btn.tooltip
      );
    }) })
  ] });
};

// src/components/richtext/ui/text-style.tsx
var React10 = __toESM(require("react"), 1);
var import_lucide_react10 = require("lucide-react");

// src/components/richtext/ui/color-picker.tsx
var React9 = __toESM(require("react"), 1);
var import_react_color = require("react-color");
var import_lucide_react9 = require("lucide-react");
var import_jsx_runtime19 = require("react/jsx-runtime");
var ColorHighlighter = React9.forwardRef(
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
    const [isOpen, setIsOpen] = React9.useState(false);
    const [tempColor, setTempColor] = React9.useState(color || "#000000");
    const IconComponent = icon || import_lucide_react9.Check;
    const handleChange = (clr) => {
      setTempColor(clr.hex);
    };
    React9.useEffect(() => {
      const close = () => setIsOpen(false);
      window.addEventListener("editor-iframe-click", close);
      return () => window.removeEventListener("editor-iframe-click", close);
    }, []);
    const handleComplete = (clr) => {
      setTempColor(clr.hex);
      onChange == null ? void 0 : onChange(clr.hex);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(DropdownMenu, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        ToolbarButton,
        __spreadProps(__spreadValues({
          active: isOpen,
          className,
          ref,
          disabled,
          toolButtonSize: size,
          tooltip: "Color",
          onClick: () => setIsOpen(!isOpen)
        }, props), {
          children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(IconComponent, { color: "currentColor" })
        })
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        DropdownMenuContent,
        {
          className: "p-2 w-[260px] bg-background shadow-lg border border-border rounded",
          align: "end",
          children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
            Tabs,
            {
              value: isBack,
              onValueChange: (value) => onChangeIsBackground == null ? void 0 : onChangeIsBackground(value),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(TabsList, { className: "w-full rounded border border-border bg-background", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                    TabsTrigger,
                    {
                      "data-active": isBack === "text",
                      value: "text",
                      className: "w-full cursor-pointer rounded",
                      children: "Text"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                    TabsTrigger,
                    {
                      "data-active": isBack === "background",
                      value: "background",
                      className: "w-full cursor-pointer rounded",
                      children: "Background"
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(TabsContent, { value: "text", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                  Picker,
                  {
                    handleChange,
                    handleComplete,
                    color: tempColor
                  }
                ) }),
                /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(TabsContent, { value: "background", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
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
var import_jsx_runtime20 = require("react/jsx-runtime");
var styleButtons = [
  {
    type: "bold",
    cmd: "bold",
    tooltip: "Bold",
    icon: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react10.Bold, {}),
    activeKey: "bold",
    action_type: "button"
  },
  {
    type: "italic",
    cmd: "italic",
    tooltip: "Italic",
    icon: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react10.Italic, {}),
    activeKey: "italic",
    action_type: "button"
  },
  {
    type: "underline",
    cmd: "underline",
    tooltip: "Underline",
    icon: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react10.Underline, {}),
    activeKey: "underline",
    action_type: "button"
  }
];
var StyleFormatSection = ({
  ctx,
  size = "sm",
  highlighter = true
}) => {
  const [isBackground, setIsBackground] = React10.useState("text");
  const { execute } = useEditorChain();
  const handleUpdateColor = (color) => {
    const cmd = isBackground === "text" ? "color" : "highlight";
    execute(cmd, color);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
    styleButtons.map((btn) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
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
    highlighter && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      ColorHighlighter,
      {
        size: "xs",
        color: ctx.foreColor,
        icon: import_lucide_react10.Palette,
        onChange: handleUpdateColor,
        isBack: isBackground,
        onChangeIsBackground: () => setIsBackground(isBackground === "text" ? "background" : "text")
      }
    )
  ] });
};

// src/components/richtext/ui/loader.tsx
var import_jsx_runtime21 = require("react/jsx-runtime");
var EditorSkeleton = ({
  animation = "pulse"
}) => {
  const base = "w-full bg-muted";
  const animationClass = animation === "shine" ? "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent" : "animate-pulse";
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(
    "div",
    {
      className: `border border-border w-full rounded-md overflow-hidden bg-background ${animationClass}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex items-center gap-2 relative px-2 py-1", children: [
          [1, 2, 3, 4, 5, 6, 7, 8].map((width) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
            Skeleton,
            {
              className: `${base} h-7 ${width === 3 ? "w-16 lg:w-20" : "w-7 lg:w-8"}  lg:h-8`
            },
            width
          )),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Skeleton, { className: "absolute right-1" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "h-px bg-border" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: `${base} h-64` })
      ]
    }
  );
};
var DotsLoader = () => /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex flex-col items-center justify-center h-48 w-full border border-border rounded-md bg-white", children: [
  /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex space-x-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "w-3 h-3 bg-gray-400 rounded-full animate-bounce" })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: "text-xs text-muted-foreground mt-3", children: "Loading editor..." })
] });
var SpinnerLoader = () => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "flex items-center justify-center h-48 w-full border border-border rounded-md bg-white", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "w-6 h-6 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin" }) });

// src/components/richtext/toolbar/ToolbarChain.tsx
var React14 = __toESM(require("react"), 1);
var import_lucide_react14 = require("lucide-react");

// src/components/theme-provider.tsx
var import_next_themes = require("next-themes");
var import_jsx_runtime22 = require("react/jsx-runtime");
function ThemeProvider(_a) {
  var _b = _a, {
    children
  } = _b, props = __objRest(_b, [
    "children"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_next_themes.ThemeProvider, __spreadProps(__spreadValues({}, props), { children }));
}

// src/components/richtext/ui/link-insert.tsx
var React11 = __toESM(require("react"), 1);
var import_lucide_react11 = require("lucide-react");
var import_jsx_runtime23 = require("react/jsx-runtime");
var AnchorLink = (_a) => {
  var _b = _a, {
    size,
    ctx
  } = _b, props = __objRest(_b, [
    "size",
    "ctx"
  ]);
  const [_open, _setOpen] = React11.useState(false);
  const [url, setUrl] = React11.useState("");
  const [newTab, setNewTab] = React11.useState(true);
  const [error, setError] = React11.useState("");
  const [hasSelection, setHasSelection] = React11.useState(false);
  const { execute } = useEditorChain();
  const { core } = useEditor();
  React11.useEffect(() => {
    const interval = setInterval(() => {
      var _a2;
      const sel = (_a2 = core == null ? void 0 : core.win) == null ? void 0 : _a2.getSelection();
      if (!sel) return setHasSelection(false);
      setHasSelection(
        Boolean(sel.rangeCount && !sel.isCollapsed && sel.toString().trim())
      );
    }, 200);
    return () => clearInterval(interval);
  }, [core]);
  React11.useEffect(() => {
    var _a2, _b2;
    if (ctx.link && ((_a2 = core == null ? void 0 : core.win) == null ? void 0 : _a2.getSelection)) {
      const sel = core.win.getSelection();
      const node = sel == null ? void 0 : sel.anchorNode;
      const linkEl = (_b2 = node == null ? void 0 : node.parentElement) == null ? void 0 : _b2.closest("a");
      if (linkEl) setUrl(linkEl.getAttribute("href") || "");
    } else if (!ctx.link && !_open) {
      setUrl("");
    }
  }, [ctx.link, _open, core]);
  const isValidUrl = (str) => {
    if (!str) return false;
    try {
      const u = new URL(str.startsWith("http") ? str : `https://${str}`);
      return !!u.href;
    } catch (e) {
      return false;
    }
  };
  const handleInsert = () => {
    var _a2, _b2, _c, _d;
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    execute("link", formattedUrl);
    const sel = (_a2 = core == null ? void 0 : core.win) == null ? void 0 : _a2.getSelection();
    const anchor = (_c = (_b2 = sel == null ? void 0 : sel.anchorNode) == null ? void 0 : _b2.parentElement) == null ? void 0 : _c.closest("a");
    if (anchor && newTab) {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    }
    (_d = core == null ? void 0 : core.win) == null ? void 0 : _d.focus();
    setError("");
    _setOpen(false);
  };
  const handleUnlink = () => {
    var _a2;
    execute("unlink");
    (_a2 = core == null ? void 0 : core.win) == null ? void 0 : _a2.focus();
    setUrl("");
    _setOpen(false);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(DropdownMenu, { open: _open, onOpenChange: _setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
      ToolbarButton,
      __spreadProps(__spreadValues({
        tooltip: "Insert or Edit Link",
        toolButtonSize: size,
        "data-active": ctx.link,
        disabled: !hasSelection && !ctx.link
      }, props), {
        children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_lucide_react11.Link, { className: "h-4 w-4" })
      })
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
      DropdownMenuContent,
      {
        align: "end",
        className: "w-80 rounded-xl p-4 border border-border/50 bg-background/95 backdrop-blur-md shadow-lg space-y-4",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("h3", { className: "text-sm font-semibold text-foreground", children: ctx.link ? "Edit Link" : "Insert Link" }),
            /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-6 w-6 cursor-pointer rounded-full text-muted-foreground hover:text-foreground",
                onClick: () => _setOpen(false),
                children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_lucide_react11.X, {})
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Separator, {}),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(DropdownMenuGroup, { className: "space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Label2, { htmlFor: "url", className: "text-sm text-muted-foreground", children: "URL" }),
              /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
                Input,
                {
                  id: "url",
                  placeholder: "https://example.com",
                  value: url,
                  onChange: (e) => setUrl(e.target.value),
                  className: "rounded focus-visible:ring-2 focus-visible:ring-primary/40",
                  autoFocus: true
                }
              ),
              error && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("p", { className: "text-xs text-red-500 font-medium pt-1", children: error })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "flex items-center justify-between pt-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
                Label2,
                {
                  htmlFor: "new-tab",
                  className: "text-sm text-muted-foreground select-none",
                  children: "Open in new tab"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Switch, { id: "new-tab", checked: newTab, onCheckedChange: setNewTab })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Separator, {}),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "flex justify-between pt-2", children: [
            ctx.link && /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "text-muted-foreground hover:text-red-500 gap-1",
                onClick: handleUnlink,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_lucide_react11.Unlink, { className: "h-4 w-4" }),
                  "Remove"
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "flex gap-2 ml-auto", children: [
              /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => _setOpen(false),
                  className: "text-muted-foreground hover:text-foreground",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
                Button,
                {
                  size: "sm",
                  disabled: !url.trim(),
                  onClick: handleInsert,
                  className: "bg-primary text-primary-foreground hover:bg-primary/90",
                  children: ctx.link ? "Update" : "Insert"
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
};

// src/components/richtext/ui/image-picker.tsx
var React13 = __toESM(require("react"), 1);

// src/components/richtext/ui/image-modal.tsx
var React12 = __toESM(require("react"), 1);
var import_lucide_react12 = require("lucide-react");
var import_image = __toESM(require("next/image"), 1);
var import_jsx_runtime24 = require("react/jsx-runtime");
var ImageModal = ({
  onInsert,
  selected,
  maxSize = 5,
  multiple = true,
  open,
  setOpen
}) => {
  const [isUploading, setIsUploading] = React12.useState(false);
  const [images, setImages] = React12.useState([]);
  const [loadingImages, setLoadingImages] = React12.useState(true);
  const [uploadProgress, setUploadProgress] = React12.useState(0);
  const [searchQuery, setSearchQuery] = React12.useState("");
  const [viewMode, setViewMode] = React12.useState("grid");
  const [dragActive, setDragActive] = React12.useState(false);
  const [selectedImages, setSelectedImage] = React12.useState(
    selected ? [selected] : []
  );
  const filteredImages = images.filter(
    (img) => img.url.toLowerCase().includes(searchQuery.toLowerCase()) || img.alt.toLowerCase().includes(searchQuery.toLowerCase())
  );
  React12.useEffect(() => {
    setLoadingImages(true);
    setTimeout(() => {
      setImages([
        {
          url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
          alt: "First Image"
        },
        {
          url: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400&h=600&fit=crop",
          alt: "Second Image"
        },
        {
          url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
          alt: "Third Image"
        },
        {
          url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
          alt: "Fourth Image"
        },
        {
          url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=400&fit=crop",
          alt: "Fifth Image"
        },
        {
          url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
          alt: "Sixth Image"
        },
        {
          url: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=400&h=600&fit=crop",
          alt: "Seventh Image"
        },
        {
          url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop",
          alt: "Eight Image"
        }
      ]);
      setLoadingImages(false);
    }, 1e3);
  }, []);
  const handleUpload = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (file.size > maxSize * 1024 * 1024)
      return alert(`Max size is ${maxSize}MB`);
    if (!file.type.startsWith("image/"))
      return alert("Please upload an image file");
    setIsUploading(true);
    setUploadProgress(0);
    const progress = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progress);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        const result = reader.result;
        const image = {
          url: result,
          alt: result
        };
        setSelectedImage == null ? void 0 : setSelectedImage((prev) => [...prev, image]);
        setIsUploading(false);
        setUploadProgress(100);
        clearInterval(progress);
      }, 1800);
    };
    reader.readAsDataURL(file);
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };
  const handleSelectImage = (url) => {
    if (multiple) {
      setSelectedImage(
        (prev) => prev.includes(url) ? prev.filter((item) => item.url !== url.url) : [...prev, url]
      );
    } else {
      setSelectedImage([url]);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files == null ? void 0 : files[0]) {
      const event = {
        target: { files }
      };
      handleUpload(event);
    }
  };
  const isSelected = (src) => {
    return selectedImages.find((i) => (i == null ? void 0 : i.url) === (src == null ? void 0 : src.url));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(DialogTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      ToolbarButton,
      {
        tooltip: "Add Media",
        toolButtonSize: "xs",
        "data-active": open,
        children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react12.ImagePlus, { className: "h-4 w-4" })
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(DialogContent, { className: "sm:max-w-md max-h-[80vh] p-0 overflow-hidden rounded-md shadow-2xl flex flex-col", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(DialogHeader, { className: "p-4 border-b border-border/50 sticky top-0 bg-background z-0", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(DialogTitle, { className: "text-lg font-semibold", children: "Choose or Upload Image" }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex items-center gap-2 justify-between mt-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "relative w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react12.Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
              "input",
              {
                type: "text",
                placeholder: "Search images...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "w-full pl-10 pr-4 py-1.5 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex border border-border rounded-md p-1 ml-3 shrink-0", children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setViewMode("grid"),
                "data-active": viewMode === "grid",
                className: cn(
                  "rounded-md transition-colors border-0 data-[active=true]:bg-accent"
                ),
                children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react12.Grid3X3, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setViewMode("list"),
                "data-active": viewMode === "list",
                className: cn(
                  "p-1.5 rounded-md transition-colors border-0 data-[active=true]:bg-accent"
                ),
                children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react12.List, { className: "h-4 w-4" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex-1 overflow-y-auto p-4 space-y-3 bg-background", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          "div",
          {
            className: cn(
              "relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300",
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/60 hover:bg-primary/5",
              isUploading && "bg-muted/50"
            ),
            onDragEnter: handleDrag,
            onDragLeave: handleDrag,
            onDragOver: handleDrag,
            onDrop: handleDrop,
            children: !isUploading ? /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(import_jsx_runtime24.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react12.Upload, { className: "h-8 w-8 text-primary mb-2" }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "font-medium", children: "Drop your image or click to browse" }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { className: "text-sm text-muted-foreground", children: [
                "JPG, PNG, WEBP \u2014 Max ",
                maxSize,
                "MB"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                "input",
                {
                  type: "file",
                  accept: "image/*",
                  onChange: handleUpload,
                  className: "absolute inset-0 opacity-0 cursor-pointer"
                }
              )
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex flex-col items-center space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react12.Loader2, { className: "h-10 w-10 text-primary animate-spin" }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "w-48 bg-muted rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                "div",
                {
                  className: "bg-primary h-2 rounded-full transition-all",
                  style: { width: `${uploadProgress}%` }
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { className: "text-sm text-muted-foreground", children: [
                "Uploading... ",
                uploadProgress,
                "%"
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-sm font-medium mb-3 text-muted-foreground", children: "Your Media Files" }),
          loadingImages ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
            "div",
            {
              className: cn(
                "gap-4",
                viewMode === "grid" ? "grid grid-cols-3" : "space-y-3"
              ),
              children: [...Array(6)].map(
                (_, i) => viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Skeleton, { className: "h-32 rounded-lg" }, i) : /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex gap-3 items-center", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Skeleton, { className: "h-16 w-16 rounded-lg" }),
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Skeleton, { className: "h-4 flex-1" })
                ] }, i)
              )
            }
          ) : filteredImages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex flex-col items-center py-12 text-center text-muted-foreground", children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react12.ImagePlus, { className: "h-10 w-10 opacity-40 mb-3" }),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { children: "No images found" })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
            "div",
            {
              className: cn(
                "gap-4",
                viewMode === "grid" ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5" : "flex flex-col space-y-3"
              ),
              children: filteredImages.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                "div",
                {
                  onClick: () => handleSelectImage(src),
                  className: cn(
                    "cursor-pointer relative rounded-md group transition-all duration-200 border overflow-hidden",
                    isSelected(src) ? "border-blue-500 ring-2 ring-blue-500/30" : "border-border hover:border-blue-500/50 hover:shadow-sm",
                    viewMode === "list" && "flex items-center gap-4 p-1"
                  ),
                  children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
                    "div",
                    {
                      className: cn(
                        "p-0 relative",
                        viewMode === "list" && "flex items-center gap-4"
                      ),
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                          "div",
                          {
                            className: cn(
                              "overflow-hidden bg-muted",
                              viewMode === "grid" ? "aspect-square" : "w-16 h-16",
                              "rounded-md"
                            ),
                            children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                              import_image.default,
                              {
                                width: 100,
                                height: 100,
                                loading: "lazy",
                                src: src.url,
                                alt: `Media ${i}`,
                                className: "object-cover w-full h-full group-hover:scale-105 ease-in-out duration-150 transform transition-transform"
                              }
                            )
                          }
                        ),
                        isSelected(src) && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1 shadow", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react12.Check, { className: "h-3 w-3" }) }),
                        !isSelected(src) && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1 shadow opacity-0 group-hover:opacity-60 transition-transform transform ease-in-out duration-100", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react12.Check, { className: "h-3 w-3" }) }),
                        viewMode === "list" && /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { className: "text-sm font-medium truncate", children: [
                            "Image ",
                            i + 1
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-xs text-muted-foreground truncate", children: src.url.split("/").pop() })
                        ] })
                      ]
                    }
                  )
                },
                i
              ))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex justify-between items-center border-t border-border bg-muted/10 p-3 sticky bottom-0 z-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "text-sm text-muted-foreground", children: selectedImages.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react12.Check, { className: "h-4 w-4 text-green-600" }),
          "Image selected",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "text-blue-500 font-bold", children: selectedImages.length })
        ] }) : "No image selected" }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setOpen == null ? void 0 : setOpen(!open),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
            Button,
            {
              size: "sm",
              variant: "primary",
              disabled: !selectedImages.length || isUploading,
              onClick: () => {
                onInsert == null ? void 0 : onInsert(selectedImages);
                setOpen == null ? void 0 : setOpen(!open);
              },
              className: "gap-2",
              children: isUploading ? /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(import_jsx_runtime24.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react12.Loader2, { className: "h-4 w-4 animate-spin" }),
                " Uploading..."
              ] }) : `Select`
            }
          )
        ] })
      ] })
    ] })
  ] }) });
};

// src/components/richtext/ui/image-picker.tsx
var import_lucide_react13 = require("lucide-react");
var import_jsx_runtime25 = require("react/jsx-runtime");
var ImagePickerBlock = ({
  modal,
  isMultiple
}) => {
  const [_open, _setOpen] = React13.useState(false);
  const [urls, setUrls] = React13.useState([""]);
  const [alts, setAlts] = React13.useState([""]);
  const { execute } = useEditorChain();
  const addField = () => {
    setUrls((prev) => [...prev, ""]);
    setAlts((prev) => [...prev, ""]);
  };
  const handleChange = (i, type, value) => {
    if (type === "url") {
      const updated = [...urls];
      updated[i] = value;
      setUrls(updated);
    } else {
      const updated = [...alts];
      updated[i] = value;
      setAlts(updated);
    }
  };
  const handleInsert = () => {
    const images = urls.map((u, i) => ({ url: u.trim(), alt: alts[i].trim() })).filter((img) => img.url);
    if (!images.length) return;
    if (images.length === 1) {
      execute("insertImage", (images[0].url, images[0].alt));
    } else {
      execute("insertImages", images);
    }
    setUrls([""]);
    setAlts([""]);
    _setOpen(false);
  };
  return !modal ? /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(DropdownMenu, { open: _open, onOpenChange: _setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
      ToolbarButton,
      {
        toolButtonSize: "xs",
        active: _open,
        tooltip: "Add Image URL",
        children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react13.ImagePlus, { className: "h-4 w-4" })
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
      DropdownMenuContent,
      {
        align: "end",
        className: "w-72 p-4 space-y-4 rounded-md",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DropdownMenuLabel, { className: "text-sm px-0 py-0 my-0 font-medium", children: "Add Image URL(s)" }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DropdownMenuSeparator, { className: "mb-2" }),
          urls.map((url, i) => /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(DropdownMenuGroup, { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(Label2, { children: [
              "Image URL ",
              urls.length > 1 ? i + 1 : ""
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
              Input,
              {
                placeholder: "https://example.com/image.png",
                className: "rounded",
                value: url,
                onChange: (e) => handleChange(i, "url", e.target.value)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Label2, { children: "Alt Text" }),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
              Input,
              {
                className: "rounded",
                placeholder: "Describe the image",
                value: alts[i],
                onChange: (e) => handleChange(i, "alt", e.target.value)
              }
            )
          ] }, i)),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
            Button,
            {
              variant: "secondary",
              className: "rounded",
              size: "sm",
              onClick: addField,
              children: "+ Add More"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
            Button,
            {
              onClick: handleInsert,
              variant: "primary",
              size: "sm",
              className: "w-full rounded",
              children: [
                "Insert Image",
                urls.length > 1 ? "s" : ""
              ]
            }
          )
        ]
      }
    )
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
    ImageModal,
    {
      open: _open,
      multiple: isMultiple,
      setOpen: _setOpen,
      onInsert: (images) => {
        console.log(images);
        if (images.length === 1) {
          const img = images[0];
          execute("insertImage", img == null ? void 0 : img.url, img == null ? void 0 : img.alt);
        } else {
          execute("insertImages", images);
        }
      }
    }
  );
};

// src/components/richtext/toolbar/ToolbarChain.tsx
var import_jsx_runtime26 = require("react/jsx-runtime");
var ToolbarChain = ({
  format,
  image,
  aiEnhance = false
}) => {
  const { iframeRef, ctx } = useEditor();
  const [chain, setChain] = React14.useState(null);
  React14.useEffect(() => {
    const initChain = () => {
      var _a;
      if (((_a = iframeRef.current) == null ? void 0 : _a.contentWindow) && !chain) {
        setChain(new EditorChain(iframeRef.current.contentWindow));
      }
    };
    initChain();
    const timer = setInterval(initChain, 300);
    return () => {
      clearInterval(timer);
    };
  }, [iframeRef, chain]);
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
    ThemeProvider,
    {
      attribute: "class",
      defaultTheme: "system",
      enableSystem: true,
      disableTransitionOnChange: true,
      children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(ToolbarWrapper, { className: "flex flex-nowrap gap-0 border-b py-2 px-3 bg-background/95 backdrop-blur-xs supports-backdrop-blur:bg-background/60 sticky top-0 z-40", children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(HistorySection, { ctx, size: "xs" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(ToolbarButtonSeparator, {}),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(ToolbarGroup, { children: [
          aiEnhance && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_jsx_runtime26.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            ToolbarButton,
            {
              toolButtonSize: "xs",
              tooltip: "AI Enhance",
              className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0",
              children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react14.Sparkles, { className: "w-4 h-4" })
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TextFormatSection, { ctx, size: "xs", format })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(ToolbarButtonSeparator, {}),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(StyleFormatSection, { ctx, size: "xs" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(ToolbarButtonSeparator, {}),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(ToolbarGroup, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(ListSelectorSection, { ctx, size: "xs" }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(IndentOutdentSection, { size: "xs", ctx }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TextAlignerSection, { ctx, size: "xs" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(ToolbarButtonSeparator, {}),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(ToolbarGroup, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(AnchorLink, { size: "xs", ctx }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(ImagePickerBlock, __spreadValues({}, image)),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            TablePicker,
            {
              variant: "ghost",
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
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            ToolbarButton,
            {
              toolButtonSize: "xs",
              tooltip: "Insert Divider",
              onClick: () => {
                var _a;
                return (_a = chain == null ? void 0 : chain.insertHTML("<hr>")) == null ? void 0 : _a.run();
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react14.Minus, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(ToolbarButtonSeparator, {}),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
          ToolbarButton,
          {
            toolButtonSize: "xs",
            tooltip: "Clear Formatting",
            onClick: () => {
              var _a;
              return (_a = chain == null ? void 0 : chain.clear()) == null ? void 0 : _a.run();
            },
            variant: "outline",
            children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react14.Ban, { className: "w-4 h-4" })
          }
        ) })
      ] })
    }
  );
};

// src/components/richtext/editor.tsx
var import_jsx_runtime27 = require("react/jsx-runtime");
var RichtextEditor = ({
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
      radius: "md"
    },
    shadow: "md"
  },
  className
}) => {
  const [isMount, setIsMount] = React15.useState(false);
  React15.useEffect(() => {
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
  const handleToChangeValue = React15.useCallback(
    (value) => {
      if (value) {
        onChange == null ? void 0 : onChange(value);
      }
    },
    [onChange]
  );
  if (!isMount) {
    switch (loader) {
      case "shine":
        return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(EditorSkeleton, { animation: "shine" });
      case "skeleton":
        return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(EditorSkeleton, {});
      case "dots":
        return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(DotsLoader, {});
      default:
        return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SpinnerLoader, {});
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
    EditorProvider,
    {
      placeholder,
      initialContent,
      onChange: handleToChangeValue,
      theme,
      style,
      className,
      children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(ToolbarChain, __spreadValues({}, toolbar))
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RichtextEditor
});
//# sourceMappingURL=index.cjs.map