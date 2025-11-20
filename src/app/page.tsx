"use client";
import { RichtextEditor } from "@/components/richtext/editor";
import { EditorCore } from "@/core/engine";
import { useState } from "react";

export default function Page() {
  const [value, setValue] = useState<string>("");
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-center h-screen">
      <div className="w-full lg:w-7/12 mx-auto p-6 max-h-[600px]">
        <RichtextEditor
          onChange={(value: EditorCore) => {
            console.log(value?.toJSON(), value.toHTML());
          }}
          placeholder="Write something...."
          initialContent={value}
          toolbar={{
            aiEnhance: true,
            image: {
              isMultiple: true,
              modal: true,
            },
            format: {
              heading: [1, 2, 3, 4, 5, 6],
              paragraph: true,
              code: true,
              blockquote: true,
            },
          }}
        />
      </div>
      <div className="max-w-full w-full lg:w-5/12">
        <h1>Hello World!</h1>
      </div>
    </div>
  );
}
