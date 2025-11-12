export function editorRuntimeInit() {
  let lastRange: Range | null = null;
  const undoStack: { html: string; caret: any }[] = [];
  const redoStack: { html: string; caret: any }[] = [];

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

  // 🧭 Utility: get and set caret position using node path + offset
  function getCaretPosition() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    const path: number[] = [];

    let node: Node | null = range.startContainer;

    while (node && node !== document.body) {
      const parentNode: Node | null = node.parentNode;
      if (!parentNode) break;

      // ✅ Ensure node is a ChildNode before using in indexOf
      const childNodeList = Array.from(parentNode.childNodes);
      const index = childNodeList.indexOf(node as ChildNode); // <-- Cast here safely

      path.unshift(index);
      node = parentNode;
    }

    return { path, offset: range.startOffset };
  }

  function setCaretPosition(pos: { path: number[]; offset: number } | null) {
    if (!pos) return;
    let node: Node | null = document.body;
    for (const index of pos.path) {
      if (!node?.childNodes[index]) break;
      node = node.childNodes[index];
    }

    if (!node) return;
    const range = document.createRange();
    try {
      range.setStart(node, Math.min(pos.offset, node.textContent?.length || 0));
      range.collapse(true);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    } catch {
      /* ignore invalid positions */
    }
  }

  function send(type: string, payload: Record<string, unknown> = {}) {
    parent.postMessage(Object.assign({ type }, payload), "*");
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    notifyReadySafely();
  } else {
    window.addEventListener("DOMContentLoaded", notifyReadySafely);
  }

  /** 🧱 Ensures a clean paragraph root when body is empty */
  function ensureParagraphExists() {
    const body = document.body;
    const html = body.innerHTML
      .replace(/<br\s*\/?>/gi, "")
      .replace(/<\/?p[^>]*>/gi, "")
      .replace(/<\/?div[^>]*>/gi, "")
      .replace(/&nbsp;/g, "")
      .replace(/\s+/g, "")
      .trim();

    if (html.length === 0) {
      body.innerHTML = "<p><br></p>";

      const firstP = body.querySelector("p");
      const range = document.createRange();
      const sel = window.getSelection();
      if (firstP) {
        range.setStart(firstP, 0);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  /** 💬 Placeholder system */
  function setupPlaceholder() {
    const body = document.body;

    function isVisuallyEmpty(): boolean {
      const html = body.innerHTML
        .replace(/<br\s*\/?>/gi, "")
        .replace(/<\/?p[^>]*>/gi, "")
        .replace(/<\/?div[^>]*>/gi, "")
        .replace(/&nbsp;/g, "")
        .replace(/\s+/g, "")
        .trim();
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

  // 🧠 Initialize placeholder & baseline
  setupPlaceholder();
  ensureParagraphExists();
  pushUndoState();

  // 🔁 Selection tracking
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

    // Detect indentation
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
        isIndented =
          marginLeft > 5 ||
          paddingLeft > 5 ||
          /^\s|(&nbsp;)+/.test(block.innerHTML);
      }
    }

    (payload as EditorContextState).isIndented = isIndented;

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

  // 🧱 Undo/Redo state
  function pushUndoState() {
    const runtimeScript = document.getElementById("__EDITOR_RUNTIME__");
    const clone = document.body.cloneNode(true) as HTMLElement;
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
      canRedo: redoStack.length > 0,
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
      canRedo: redoStack.length > 0,
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
      canRedo: redoStack.length > 0,
    });
  }

  // 🧠 Update html on edit
  document.body.addEventListener("input", () => {
    ensureParagraphExists();
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

    if (type === "EXEC" && cmd === "undo") return void doUndo();
    if (type === "EXEC" && cmd === "redo") return void doRedo();

    if (type === "EXEC") {
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

  // ⌨️ Keyboard shortcuts
  document.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key === "Tab") {
      ev.preventDefault();
      const sel = window.getSelection();
      const caretBefore = getCaretPosition();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const node = range.startContainer as Node;
      let el: HTMLElement | null = null;
      if (node.nodeType === Node.ELEMENT_NODE) el = node as HTMLElement;
      else if ((node as HTMLElement).parentElement)
        el = (node as HTMLElement).parentElement;
      const line = el?.closest(
        "p, div, pre, blockquote, li"
      ) as HTMLElement | null;
      if (!line) return;

      let textNode: ChildNode | null = line.firstChild;
      while (textNode && textNode.nodeType !== Node.TEXT_NODE)
        textNode = textNode.nextSibling;
      if (!textNode) {
        textNode = document.createTextNode("");
        line.insertBefore(textNode, line.firstChild);
      }

      if (!ev.shiftKey) {
        const indent = "\u00A0\u00A0\u00A0\u00A0";
        if (range.startOffset === 0 && range.startContainer === textNode)
          textNode.textContent = indent + textNode.textContent;
        else {
          const indentNode = document.createTextNode(indent);
          range.insertNode(indentNode);
        }
        const newRange = document.createRange();
        if (range.startContainer === textNode) newRange.setStart(textNode, 4);
        else newRange.setStartAfter(line.firstChild!);
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
