// src/core/runtime.ts
export function editorRuntimeInit() {
  let lastRange: Range | null = null;
  const undoStack: { html: string; caret: any }[] = [];
  const redoStack: { html: string; caret: any }[] = [];

  /* ===========================================================
 TABLE RESIZE MODULE — FINAL VERSION
=========================================================== */

  type TableHandle =
    | "col-left"
    | "col-right"
    | "row-top"
    | "row-bottom"
    | "corner-tl"
    | "corner-tr"
    | "corner-bl"
    | "corner-br";

  const RESIZE_SENSITIVITY = 0.35; // smooth small increments

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
      ) as HTMLTableElement | null;
      if (tbl) {
        equalizeColumns(tbl);
        addTableResizeHandles(tbl);
      }
    }, 15);
  }

  function equalizeColumns(table: HTMLTableElement) {
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

  function addTableResizeHandles(table: HTMLTableElement) {
    const wrapper = table.parentElement as HTMLElement;
    wrapper.style.position = "relative";

    wrapper.querySelectorAll(".table-resize-handle").forEach((n) => n.remove());

    const rect = () => table.getBoundingClientRect();
    const wrapRect = () => wrapper.getBoundingClientRect();

    function makeHandle(handle: TableHandle) {
      const el = document.createElement("div");
      el.className = "table-resize-handle";
      el.dataset.handle = handle;

      el.addEventListener("mouseenter", () =>
        wrapper.classList.add("table-active-border")
      );
      el.addEventListener("mouseleave", () =>
        wrapper.classList.remove("table-active-border")
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

    /* ---------------- DRAG LOGIC ---------------- */

    let active: TableHandle | null = null;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startRowHeight = 0;

    wrapper.addEventListener("mousedown", (e) => {
      const target = (e.target as HTMLElement)?.closest(
        ".table-resize-handle"
      ) as HTMLElement | null;
      if (!target) return;

      active = target.dataset.handle as TableHandle;

      startX = e.clientX;
      startY = e.clientY;
      startW = table.offsetWidth;
      startRowHeight = table.rows[0].cells[0].offsetHeight; // 🔥 FIXED: use row height

      e.preventDefault();
      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
    });

    function doDrag(e: MouseEvent) {
      if (!active) return;

      const rawDx = e.clientX - startX;
      const rawDy = e.clientY - startY;

      const dx = rawDx * RESIZE_SENSITIVITY;
      const dy = rawDy * RESIZE_SENSITIVITY;

      // ---- Horizontal ----
      if (active === "col-right") {
        table.style.width = Math.max(80, startW + dx) + "px";
      }
      if (active === "col-left") {
        table.style.width = Math.max(80, startW - dx) + "px";
      }

      // ---- Vertical ----
      if (active === "row-bottom") {
        const newH = Math.max(20, startRowHeight + dy);
        resizeRows(newH);
      }
      if (active === "row-top") {
        const newH = Math.max(20, startRowHeight - dy);
        resizeRows(newH);
      }

      // ---- Corner ----
      if (active.startsWith("corner")) {
        const newW = Math.max(80, startW + dx);
        const newH = Math.max(20, startRowHeight + dy);

        table.style.width = newW + "px";
        resizeRows(newH);
      }

      position();
    }

    function resizeRows(h: number) {
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

  /**
   * ======================================
   * @Default Functions
   */
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

  function closestElement(
    node: Node | null,
    selectors: string
  ): HTMLElement | null {
    if (!node) return null;

    let el: HTMLElement | null =
      node.nodeType === Node.ELEMENT_NODE
        ? (node as HTMLElement)
        : node.parentElement;

    while (el) {
      if (el.matches(selectors)) return el;
      el = el.parentElement;
    }

    return null;
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
    // Detect indentation
    const sel = window.getSelection();
    // Anchor Link Handle Block
    let isLink = false;
    try {
      isLink = document.queryCommandState("createLink");
    } catch {
      isLink = false;
    }

    // manual fallback detection
    if (sel && sel.anchorNode) {
      const anchorElement =
        sel.anchorNode.nodeType === Node.ELEMENT_NODE
          ? (sel.anchorNode as HTMLElement)
          : (sel.anchorNode.parentElement as HTMLElement | null);
      if (anchorElement) {
        const linkParent = anchorElement.closest("a");
        if (linkParent) isLink = true;
      }
    }

    function isInside(tagNames: string[]): boolean {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return false;

      let node: Node | null = sel.anchorNode;
      if (!node) return false;

      if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;

      while (node && node !== document.body) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = (node as HTMLElement).tagName.toUpperCase();
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
      backColor: document.queryCommandValue("hiliteColor"),
    };

    payload.bold = isInside(["B", "STRONG"]);
    payload.italic = isInside(["I", "EM"]);
    payload.underline = isInside(["U"]);
    payload.strike = isInside(["S", "STRIKE"]);

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
    (payload as EditorContextState).link = isLink;
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

  function breakInlineFormatting() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);

    // Only apply if selection is collapsed (typing)
    if (!range.collapsed) return;

    const container = range.startContainer;

    // If inside bold/italic/underline — break out
    const styledParent = closestElement(
      container,
      "b,strong,i,em,u,span[style]"
    );

    if (styledParent) {
      const after = document.createTextNode("");
      styledParent.parentNode?.insertBefore(after, styledParent.nextSibling);

      const newRange = document.createRange();
      newRange.setStart(after, 0);
      newRange.collapse(true);

      sel.removeAllRanges();
      sel.addRange(newRange);
    }
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

      // ⛔ Break formatting continuity after selection
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

  // ⌨️ Keyboard shortcuts
  document.addEventListener("keydown", (ev: KeyboardEvent) => {
    // --- Prevent bold/italic/underline from carrying after Enter ---
    if (ev.key === "Enter") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      if (!range.collapsed) return; // don't run on multi-line selection

      const container =
        range.startContainer.nodeType === Node.TEXT_NODE
          ? range.startContainer.parentElement
          : range.startContainer;

      const styledParent = closestElement(
        container,
        "b,strong,i,em,u,span[style]"
      );
      if (styledParent) {
        ev.preventDefault(); // stop browser default carry-over

        // Create a clean normal <p><br></p> block
        const newP = document.createElement("p");
        newP.innerHTML = "<br>";

        // Insert AFTER current block
        const currentBlock = styledParent.closest("p,div,li,blockquote,pre");
        currentBlock?.parentNode?.insertBefore(newP, currentBlock.nextSibling);

        // Move caret
        const newRange = document.createRange();
        newRange.setStart(newP, 0);
        newRange.collapse(true);

        sel.removeAllRanges();
        sel.addRange(newRange);

        // ensure undo state + context updates
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
