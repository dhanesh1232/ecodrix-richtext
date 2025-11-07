"use client";
import * as React from "react";

/**
 * 🧩 EditorFrame
 *
 * Main editor component for ECOD EditorFrame.
 *
 * @public
 */

export const EditorFrame = React.forwardRef<
  EditorFrameHandle,
  EditorFrameProps
>(({ initialContent = "<p>Start typing...</p>" }, ref) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [doc, setDoc] = React.useState<Document | null>(null);

  // Initialize iframe document on mount
  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: system-ui, sans-serif;
                padding: 12px;
                margin: 0;
                min-height: 100%;
                height: 310px;
                max-height: 320px;
                color: #111;
                line-height: 1.6;
                background: transparent;
              }
              h1, h2, h3, h4, h5, h6 {
                margin: 0.5em 0;
              }
              blockquote {
                border-left: 3px solid #ddd;
                padding-left: 1em;
                color: #555;
                font-style: italic;
              }
              a { color: #0ea5e9; text-decoration: underline; }
              img { max-width: 100%; display: block; margin: 8px 0; }
              p { margin: 0.5em 0; }
            </style>
          </head>
          <body contenteditable="true">${initialContent}</body>
        </html>
      `);
    iframeDoc.close();

    setDoc(iframeDoc);

    // optional autofocus
    iframeDoc.body.focus();
  }, []);

  // expose methods to parent (Toolbar)
  React.useImperativeHandle(ref, () => ({
    handleCommand: (cmd: string, value?: string) => {
      if (!doc) return;

      doc.body.focus();
      const win = doc.defaultView!;
      const sel = win.getSelection();
      if (!sel) return;

      // --- formatBlock ---
      if (cmd.startsWith("formatBlock:")) {
        const tag = cmd.split(":")[1];
        doc.execCommand("formatBlock", false, `<${tag}>`);
        return;
      }

      switch (cmd) {
        case "bold":
        case "italic":
        case "underline":
        case "strikeThrough":
          doc.execCommand(cmd);
          break;

        case "justifyStart":
          doc.execCommand("justifyLeft");
          break;
        case "justifyCenter":
          doc.execCommand("justifyCenter");
          break;
        case "justifyEnd":
          doc.execCommand("justifyRight");
          break;

        case "undo":
        case "redo":
          doc.execCommand(cmd);
          break;

        case "color":
          doc.execCommand("foreColor", false, value ?? "#000000");
          break;

        case "link": {
          const url = prompt("Enter URL:");
          if (url) doc.execCommand("createLink", false, url);
          break;
        }

        case "image": {
          const img = prompt("Enter Image URL:");
          if (img) doc.execCommand("insertImage", false, img);
          break;
        }

        default:
          console.warn("Unknown command:", cmd);
      }
    },

    getContent: () => {
      return doc?.body.innerHTML || "";
    },

    setContent: (html: string) => {
      if (doc) doc.body.innerHTML = html;
    },
  }));

  return (
    <div className="w-full min-h-[350px] border-t border-border bg-background relative overflow-hidden">
      <iframe
        ref={iframeRef}
        className="w-full h-[350px] bg-transparent outline-none border-0"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      />
    </div>
  );
});

EditorFrame.displayName = "EditorFrame";
