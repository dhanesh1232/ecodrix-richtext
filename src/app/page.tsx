"use client";
import { RichtextEditor } from "@/components/richtext/editor";
import { EditorCore } from "@/core/engine";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto p-6 max-h-[600px]">
      <RichtextEditor
        onChange={(value: EditorCore) => {
          console.log(value?.toJSON());
        }}
        initialContent="<p>Start typing…</p>"
        toolbar={{
          mediaUrl: true,
          format: {
            heading: [1, 2, 3, 4, 5, 6],
            paragraph: true,
            code: true,
            blockquote: true,
          },
        }}
      />
    </div>
  );
}
