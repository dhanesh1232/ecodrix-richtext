// src/editor/runtime.ts
export function editorRuntimeInit() {
  let lastRange: Range | null = null;
  const undoStack: string[] = [];
  const redoStack: string[] = [];

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
    s?.removeAllRanges();
    s?.addRange(lastRange);
  }

  function send(type: string, payload: Record<string, unknown> = {}) {
    parent.postMessage({ type, ...payload }, "*");
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    notifyReadySafely();
  } else {
    window.addEventListener("DOMContentLoaded", notifyReadySafely);
  }

  // 🔁 Triggered whenever selection or caret changes
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
      backColor: document.queryCommandValue("hiliteColor"),
    };

    // 🧱 Detect indentation
    const sel = window.getSelection();
    let isIndented = false;

    if (sel && sel.anchorNode) {
      const el =
        (sel.anchorNode.nodeType === Node.ELEMENT_NODE
          ? sel.anchorNode
          : sel.anchorNode.parentElement) || null;

      const block = (el as HTMLElement)?.closest(
        "p, div, li, blockquote, pre"
      ) as HTMLElement | null;
      if (block) {
        const style = window.getComputedStyle(block);
        const marginLeft = parseFloat(style.marginLeft || "0");
        const paddingLeft = parseFloat(style.paddingLeft || "0");

        // Detect if the element or its HTML has visual indentation
        isIndented =
          marginLeft > 5 ||
          paddingLeft > 5 ||
          /^\s|(&nbsp;)+/.test(block.innerHTML);
      }
    }

    (payload as EditorContextState).isIndented = isIndented;

    // Normalize heading levels
    const blk = String(payload.block).toUpperCase();
    (payload as EditorContextState).isHeading1 = blk === "H1";
    (payload as EditorContextState).isHeading2 = blk === "H2";
    (payload as EditorContextState).isHeading3 = blk === "H3";
    (payload as EditorContextState).isHeading4 = blk === "H4";
    (payload as EditorContextState).isHeading5 = blk === "H5";
    (payload as EditorContextState).isHeading6 = blk === "H6";
    (payload as EditorContextState).isParagraph = blk === "P";
    (payload as EditorContextState).isBlockquote = blk === "BLOCKQUOTE";
    (payload as EditorContextState).isCodeBlock = blk === "PRE";

    send("CONTEXT", payload);
    saveSelection();
  });

  // Save current state for undo tracking
  function pushUndoState() {
    const currentHTML = document.body.innerHTML;
    if (
      undoStack.length === 0 ||
      undoStack[undoStack.length - 1] !== currentHTML
    ) {
      undoStack.push(currentHTML);
      redoStack.length = 0; // clear redo
    }
    send("UNDO_REDO_STATE", {
      canUndo: undoStack.length > 1,
      canRedo: redoStack.length > 0,
    });
  }

  // Restore state for undo
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
      canRedo: redoStack.length > 0,
    });
  }

  // Restore state for redo
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
      canRedo: redoStack.length > 0,
    });
  }

  // 🧠 Initialize
  pushUndoState();

  // 🧠 Update html on edit
  document.body.addEventListener("input", () => {
    pushUndoState();
    send("UPDATE", { html: document.body.innerHTML });
  });

  // 🧹 Clean paste
  document.addEventListener("paste", (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain") || "";
    document.execCommand("insertText", false, text);
  });

  // 📩 Commands from parent
  window.addEventListener("message", (e: MessageEvent) => {
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
      document.execCommand(cmd, false, value ?? null);
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
          tableHtml +=
            "<td style='border: 1px solid #ccc; padding: 6px;'><br></td>";
        }
        tableHtml += "</tr>";
      }
      tableHtml += "</table><p><br></p>";

      document.execCommand("insertHTML", false, tableHtml);
      document.body.dispatchEvent(new Event("input"));
    }
  });

  // ⌨️ Keyboard shortcuts & behaviors
  document.addEventListener("keydown", (ev: KeyboardEvent) => {
    // 🔹 Custom single-line indent / outdent
    if (ev.key === "Tab") {
      ev.preventDefault();
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      // Get current line or block
      const node = range.startContainer as Node;
      let el: HTMLElement | null = null;
      if (node.nodeType === Node.ELEMENT_NODE) el = node as HTMLElement;
      else if ((node as HTMLElement).parentElement)
        el = (node as HTMLElement).parentElement;

      const line = el?.closest(
        "p, div, pre, blockquote, li"
      ) as HTMLElement | null;
      if (!line) return;

      // 🧠 Always work on the first text node
      let textNode: ChildNode | null = line.firstChild;
      while (textNode && textNode.nodeType !== Node.TEXT_NODE) {
        textNode = textNode.nextSibling;
      }

      // If no text node, create one
      if (!textNode) {
        textNode = document.createTextNode("");
        line.insertBefore(textNode, line.firstChild);
      }

      // ➕ INDENT (Tab)
      if (!ev.shiftKey) {
        const indent = "\u00A0\u00A0\u00A0\u00A0"; // 4 non-breaking spaces
        // Insert spaces directly into first text node if caret is at start
        if (range.startOffset === 0 && range.startContainer === textNode) {
          textNode.textContent = indent + textNode.textContent;
        } else {
          const indentNode = document.createTextNode(indent);
          range.insertNode(indentNode);
        }

        // Move caret after indent
        const newRange = document.createRange();
        if (range.startContainer === textNode) newRange.setStart(textNode, 4);
        else newRange.setStartAfter(line.firstChild!);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }

      // ➖ OUTDENT (Shift+Tab)
      else {
        const firstText = textNode.textContent || "";
        const updated = firstText.replace(/^[\u00A0\s]{1,4}/, "");
        textNode.textContent = updated;

        // Also handle accidental &nbsp; in HTML
        const html = line.innerHTML.replace(/^(&nbsp;|\s){1,4}/, "");
        if (line.innerHTML !== html) line.innerHTML = html || "<br>";

        // Reset caret at beginning of cleaned line
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

    // 🔹 Ctrl + B/I/U shortcuts
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
