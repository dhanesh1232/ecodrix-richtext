import { RichtextEditor } from "../components/editor";

export default function Home() {
  return (
    <div className="w-full max-w-xl lg:max-w-2xl mx-auto h-full flex items-center justify-center">
      <RichtextEditor
        toolbar={{
          historyTabs: true,
          formatting: ["h1", "h2", "h3", "h4", "p"],
        }}
      />
    </div>
  );
}
