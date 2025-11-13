"use client";
import { RichtextEditor } from "@/components/richtext/editor";
import { EditorCore } from "@/core/engine";
import { useState } from "react";

export default function Page() {
  const [value, setValue] = useState<string>("");
  return (
    <div className="w-full flex items-center justify-center h-screen">
      <div className="max-w-4xl mx-auto p-6 max-h-[600px] w-full">
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
    </div>
  );
}
