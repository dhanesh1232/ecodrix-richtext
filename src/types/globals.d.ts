import { LucideIcon } from "lucide-react";
import type * as React from "react";

declare global {
  type EditorLoader = "skeleton" | "dots" | "shine" | "spinner";

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

  interface TextFormatSectionProps extends ToolbarButtonDefaultProps {
    format?: Format;
  }

  interface StyleFormatSectionProps extends ToolbarButtonDefaultProps {
    highlighter?: boolean;
  }

  type Format = {
    heading?: Heading[];
    code?: boolean;
    blockquote?: boolean;
    paragraph?: boolean;
  };

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

  interface ToolbarChainProps {
    format?: Format;
    isUrl?: boolean;
    aiEnhance?: boolean;
    image?: {
      modal?: boolean;
      isMultiple?: boolean;
    };
    clear?: boolean;
  }

  interface ToolbarButtonDefaultProps {
    ctx: EditorContextState;
    size?: ToolbarButtonSize;
  }

  /// Style
  interface DesignProps {
    height?: string | number;
    border?: {
      width?: BorderWith;
      radius?: BorderRadius;
    };
    ring?: {
      width?: number;
      color?: string;
    };
    shadow?: BoxShadow;
  }

  type BorderWith = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  type BorderRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  type BoxShadow = "none" | "sm" | "md" | "lg" | "xl";
}

export {};
