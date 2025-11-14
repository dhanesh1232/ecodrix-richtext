// src/core/chain.ts
export class EditorChain {
  private target: Window | null;
  private queue: Array<Record<string, unknown>> = [];

  constructor(target: Window | null) {
    this.target = target;
  }

  private post(msg: Record<string, unknown>) {
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

  insertImage(url: string, alt: string = "") {
    const html = `<img src="${url}" alt="${alt.replace(/"/g, "&quot;")}" />`;
    return this.insertHTML(html);
  }

  insertImages(images: Array<{ url: string; alt?: string }>) {
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
  exec(cmd: string, value?: string) {
    return this.post({ type: "EXEC", cmd, value });
  }

  undo() {
    this.target?.postMessage({ type: "EXEC", cmd: "undo" }, "*");
    return this;
  }

  redo() {
    this.target?.postMessage({ type: "EXEC", cmd: "redo" }, "*");
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
  heading(level: 1 | 2 | 3 | 4 | 5 | 6) {
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
    this.target?.postMessage({ type: "CUSTOM_INDENT" }, "*");
    return this;
  }
  outdent() {
    this.target?.postMessage({ type: "CUSTOM_OUTDENT" }, "*");
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
  color(value: string) {
    return this.exec("foreColor", value);
  }
  highlight(value: string) {
    return this.exec("hiliteColor", value);
  }

  // Links
  link(url: string) {
    return this.exec("createLink", url);
  }
  unlink() {
    return this.exec("unlink");
  }

  // Raw HTML
  insertHTML(html: string) {
    return this.post({ type: "INSERT_HTML", html });
  }
  setHTML(html: string) {
    return this.post({ type: "SET_HTML", html });
  }

  insertTable(rows: number, cols: number) {
    this.target?.postMessage({ type: "INSERT_TABLE", rows, cols }, "*");
    return this;
  }

  // Helpers
  clear() {
    return this.exec("removeFormat");
  }
}
