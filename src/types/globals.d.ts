import type { Icons } from "@/components/icons";

declare global {
  interface RichtextEditorProps {
    initialContent?: string;
    toolbar?: ToolbarProps;
  }

  interface ButtonProps {
    label: string;
    cmd: string;
    icon: keyof typeof Icons;
  }

  interface ToolbarProps {
    command?: () => void;
    historyTabs?: boolean;
    formatting?: formatting[];
  }

  interface HistoryFormatProps {
    buttons?: ButtonProps[];
    onCommand?: (cmd: string) => void;
  }

  interface TextFormatProps {
    formatting?: formatting[];
    onFormat?: (format: formatting) => void;
  }

  type formatting =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "blockquote";

  interface StyleFormatProps {
    onCommand?: (cmd: string) => void;
  }
}

export {};
