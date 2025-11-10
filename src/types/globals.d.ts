import type { Icons } from "@/components/icons";
import { EditorCore } from "@/core/engine";
import { TooltipContentProps } from "@radix-ui/react-tooltip";
import { LucideIcon } from "lucide-react";
import React, { ReactNode } from "react";

// declare module "@monaco-editor/react";
declare global {
  interface RichtextEditorProps {
    initialContent?: string;
    onChange?: (value: EditorCore) => void;
    loader?: EditorLoader;
    init?: {
      height?: string | number;
    };
    toolbar?: ToolbarChainProps;
  }

  type EditorLoader = "skeleton" | "dots" | "shine" | "spinner";

  type EditorMode = "design" | "html" | "preview";
  interface UndoRedoState {
    canUndo: boolean;
    canRedo: boolean;
  }

  interface EditorContainerBlockProps {
    initialContent?: string;
    loader?: EditorLoader;
    toolbar?: ToolbarChainProps;
    onChange?: (html: string) => void;
  }

  interface ToolbarChainProps {
    format?: Format;
    mediaUrl?: boolean;
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
    textAdjustTabs?: ButtonProps[];
    extraTabs?: ButtonProps[];
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
    /** Whether the color picker is for background color */
    isBack?: "text" | "background";
    /** Triggered when the background color state changes */
    onChangeIsBackground?: (isBack: "text" | "background") => void;
    icon?: LucideIcon;
    size?: ToolbarButtonSize;
  }

  interface MediaLinkProps {
    onCommand?: (cmd: string) => void;
    buttons?: ButtonProps[];
    mediaUrl?: boolean;
  }
  interface MediaHanderProps {
    onCommand?: (cmd: string, value?: string) => void;
    mediaUrl?: boolean;
  }

  type AllToolTypes = keyof AllToolsProps;

  interface TextAdjustProps {
    buttons?: ButtonProps[];
    onCommand?: (cmd: string) => void;
  }

  interface ResponsiveStyleFormatProps {
    buttons: ButtonProps[];
    onCommand?: (cmd: string) => void;
  }

  interface MoreToolsProps {
    show?: boolean;
    onShow?: () => void;
    tools?: AllToolsProps;
    showTools?: AllToolTypes[];
  }

  // New Methods of Editor
  /**
   * New Method prepared with class and better handling
   */
  type EditorContextState = {
    block: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strike: boolean;
    orderedList: boolean;
    unorderedList: boolean;
    justifyLeft: boolean;
    justifyCenter: boolean;
    justifyRight: boolean;
    link: boolean;
    foreColor: string;
    backColor: string;
    isHeading1: boolean;
    isHeading2: boolean;
    isHeading3: boolean;
    isHeading4: boolean;
    isHeading5: boolean;
    isHeading6: boolean;
    isParagraph: boolean;
    isBlockquote: boolean;
    isCodeBlock: boolean;
    canUndo: boolean;
    canRedo: boolean;
    isIndented?: boolean;
  };

  interface ToolbarHistoryProps {
    ctx: EditorContextState;
    size?: ToolbarButtonSize;
  }

  interface TextFormatSectionProps {
    ctx: EditorContextState;
    size?: ToolbarButtonSize;
    format?: Format;
  }

  type Format = {
    heading?: Heading[];
    code?: boolean;
    blockquote?: boolean;
    paragraph?: boolean;
  };

  interface StyleFormatSectionProps {
    ctx: EditorContextState;
    size?: ToolbarButtonSize;
    highlighter?: boolean;
  }

  interface ListSelectorSectionProps {
    ctx: EditorContextState;
    size?: ToolbarButtonSize;
  }

  interface IndentOutdentSectionProps {
    ctx?: EditorContextState;
    size?: ToolbarButtonSize;
  }

  interface TextAlignerSectionProps {
    ctx?: EditorContextState;
    size?: ToolbarButtonSize;
  }
  // Toolbar button
  interface ToolbarButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    active?: boolean;
    toolButtonSize?: ToolbarButtonSize;
    tooltip?: string;
  }

  type Heading = 1 | 2 | 3 | 4 | 5 | 6;
  type ToolbarButtonSize = "sm" | "md" | "xs";

  interface UndoRedoState {
    canUndo: boolean;
    canRedo: boolean;
  }

  type EditorEvents = {
    ready: string;
    update: string;
    context: EditorContextState;
    undoRedo: UndoRedoState;
    error: string;
  };
}

export {};
