import { RichtextEditor } from "../components/editor";

export default function Home() {
  return (
    <div className="w-full max-w-xl lg:max-w-2xl mx-auto h-full flex items-center justify-center">
      <RichtextEditor
        toolbar={{
          formatting: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote"],
        }}
      />
    </div>
  );
}
