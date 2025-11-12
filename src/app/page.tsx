"use client";
import { RichtextEditor } from "@/components/richtext/editor";
import { EditorCore } from "@/core/engine";
import { useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");
  return (
    <div className="max-w-4xl mx-auto p-6 max-h-[600px]">
      <RichtextEditor
        onChange={(value: EditorCore) => {
          console.log(value?.toJSON(), value.toHTML());
        }}
        placeholder="Write something...."
        initialContent={value}
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
