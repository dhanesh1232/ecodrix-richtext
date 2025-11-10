````markdown
# 🧠 @ecodrix/richtext

A lightweight, modular **Rich Text Editor** for React and Next.js — powered by an isolated iframe runtime for true sandboxed editing.

---

## ⚙️ Installation

Install using your preferred package manager:

```bash
npm install @ecodrix/richtext
# or
yarn add @ecodrix/richtext
# or
pnpm add @ecodrix/richtext
```
````

---

## 🎨 Import Styles

The package includes built-in Tailwind-based styles.
You must import them once in your global layout (e.g. `layout.tsx` or `_app.tsx`):

```tsx
import "@ecodrix/richtext/styles";
```

> 💡 Make sure your Tailwind setup is working — these styles rely on TailwindCSS utilities.

---

## 🚀 Basic Usage

Here’s the simplest way to use the rich text editor in your React or Next.js project:

```tsx
"use client";
import React from "react";
import { RichtextEditor } from "@ecodrix/richtext";

export default function Example() {
  return (
    <RichtextEditor
      initialContent="<p>Hello, world!</p>"
      onChange={(editor) => {
        console.log("HTML Output:", editor.toHTML());
        console.log("JSON Output:", editor.toJSON());
      }}
    />
  );
}
```

---

## 🧩 Add Toolbar Support

To include the built-in toolbar with text formatting, headings, alignment, and lists:

```tsx
"use client";
import React from "react";
import { RichtextEditor } from "@ecodrix/richtext";

export default function EditorWithToolbar() {
  return (
    <RichtextEditor
      initialContent="<h2>Start typing...</h2><p>This is a sandboxed editor.</p>"
      toolbar={{ format: true }}
      onChange={(editor) => {
        console.log(editor.toHTML());
      }}
    />
  );
}
```

---

## 🪶 Working with Editor Output

You can easily get both **HTML** and **structured JSON**:

```tsx
onChange={(editor) => {
  const html = editor.toHTML();
  const json = editor.toJSON();

  console.log("HTML:", html);
  console.log("JSON:", JSON.stringify(json, null, 2));
}}
```

---

## 🧱 Styling the Editor

By default, the editor body is styled with:

```css
body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #111;
  background: #fff;
  padding: 0.75rem;
}
blockquote {
  border-left: 3px solid #ddd;
  padding-left: 1em;
  color: #555;
}
pre {
  background: #f6f6f6;
  padding: 0.6em;
  border-radius: 6px;
}
```

To customize further, wrap the editor in your own styled container:

```tsx
<div className="border border-gray-300 rounded-md shadow-sm p-2 bg-white">
  <RichtextEditor initialContent="<p>Custom styled editor</p>" />
</div>
```

---

## 🔗 Accessing Editor Instance

If you want direct access to the editor core (e.g. to run commands or serialize manually):

```tsx
import React, { useRef } from "react";
import { RichtextEditor, useEditor } from "@ecodrix/richtext";

export default function ControlledEditor() {
  const { core } = useEditor();

  const handleSave = () => {
    if (core) {
      console.log(core.toHTML());
    }
  };

  return (
    <>
      <RichtextEditor initialContent="<p>Edit here...</p>" />
      <button onClick={handleSave}>Save</button>
    </>
  );
}
```

---

## 🧠 Key Features

- **Iframe runtime isolation** (secure & sandboxed editing)
- **Chainable commands** (e.g. `editor.chain.bold().run()`)
- **Undo/Redo**, **Tables**, **Headings**, **Lists**, **Colors**, **Alignment**
- **JSON + HTML output**
- **Fully typed API** (TypeScript ready)
- **Plug-and-play setup** — no extra configuration needed

---

## 🧩 Example Chain Commands

```ts
editor.chain.bold().italic().underline().run();
editor.chain.heading(2).run();
editor.chain.alignCenter().run();
editor.chain.insertTable(3, 4).run();
editor.chain.color("#ff0077").run();
```

---

## 💡 Tips

- Works with **Next.js 14+**, **React 18/19**
- Automatically handles **undo/redo** states
- Fully **SSR-safe** (initializes only on client)
- You can use `editor.toHTML()` or `editor.toJSON()` for database storage

---

## 🛠️ Development Commands

```bash
# Build package
npm run build

# Run local dev (Next.js demo)
npm run dev

# Publish to npm
npm publish --access public
```

---

## 📄 License

**MIT License** © 2025 ECOD
You are free to use, modify, and distribute this package under open source license.

```

---

Would you like me to add a small **“Next.js setup snippet”** (showing how to import Tailwind + styles into `layout.tsx` and ensure client-only rendering)?
That’s usually the final piece for smooth usage in production.
```
