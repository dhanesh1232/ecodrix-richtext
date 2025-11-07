import type { Icons } from "@/components/icons";
import { TooltipContentProps } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

declare global {
  interface RichtextEditorProps {
    initialContent?: string;
    toolbar?: ToolbarProps;
  }

  interface EditorFrameProps {
    initialContent?: string;
  }

  interface EditorFrameHandle {
    handleCommand: (cmd: string, value?: string) => void;
    getContent: () => string;
    setContent: (html: string) => void;
  }

  interface ToolbarProps {
    onCommand?: (value: string) => void;
    formatting?: formatting[];
  }

  interface ButtonWIthTooltipProps
    extends Omit<TooltipContentProps, "children"> {
    label?: ReactNode;
    icon?: ButtonIcon;
    withIcon?: boolean;
    isArrow?: boolean;
  }

  interface AllToolsProps {
    historyTabs?: ButtonProps[];
    textFormatTabs?: TextFormatTagProps[];
    textStyleTabs?: ButtonProps[];
    textAlignTabs?: ButtonProps[];
    mediaAndLinksTabs?: ButtonProps[];
  }

  interface ButtonProps {
    label?: string;
    cmd?: string;
    icon?: ButtonIcon;
  }

  interface TextFormatTagProps {
    label?: string;
    cmd?: string;
    style?: string;
    icon?: ButtonIcon;
  }

  interface HistoryFormatProps {
    buttons?: ButtonProps[];
    onCommand?: (cmd: string) => void;
  }

  interface TextFormatProps {
    buttons?: TextFormatTagProps[];
    formatting?: formatting[];
    onFormat?: (format: string) => void;
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

  type ButtonIcon = keyof typeof Icons;

  interface TextStyleFormatProps {
    buttons?: ButtonProps[];
    onCommand?: (cmd: string) => void;
  }

  interface TextAlignProps {
    buttons?: ButtonProps[];
    onCommand?: (cmd: string) => void;
  }

  interface ColorHighlighterProps {
    color?: string;
    /** Triggered when a color is selected */
    onChange?: (color: string) => void;
    disabled?: boolean;
    className?: string;
    icon?: ButtonIcon;
  }

  interface MediaLinkProps {
    onCommand?: (cmd: string) => void;
    buttons?: ButtonProps[];
  }
  interface MediaHanderProps {
    onCommand?: (cmd: string, value?: string) => void;
  }

  interface MoreToolsProps {
    show?: boolean;
    onShow?: () => void;
    tools?: AllToolsProps;
    showTools?: AllToolTypes[];
  }

  type AllToolTypes = keyof AllToolsProps;
}

export {};
