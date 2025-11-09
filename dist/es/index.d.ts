import * as react from "react";
import react__default, { ReactNode } from "react";
import * as lucide_react from "lucide-react";
import { LucideIcon } from "lucide-react";
import { TooltipContentProps } from "@radix-ui/react-tooltip";

declare const Icons: {
  readonly undo: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly redo: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly heading1: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly heading2: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly heading3: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly heading4: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly heading5: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly heading6: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly paragraph: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly blockquote: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly bold: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly underline: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly italic: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly strikeThrough: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly baseLine: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly palette: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly justifyStart: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly justifyCenter: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly justifyEnd: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly link: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly image: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly video: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly ellipsis: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly moreHorizontal: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly orderList: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly list: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly indent: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly outdent: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly table: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly code: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly superscript: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  readonly reset: react.ForwardRefExoticComponent<
    Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
};

declare global {
  interface RichtextEditorProps {
    initialContent?: string;
    toolbar?: ToolbarProps;
    loader?: EditorLoader;
  }

  type EditorLoader = "skeleton" | "dots" | "shine" | "spinner";

  interface EditorFrameProps {
    initialContent?: string;
  }

  type EditorMode = "design" | "html" | "preview";

  interface EditorFrameHandle {
    handleCommand: (cmd: string, value?: string) => void;
    getContent: () => string;
    setContent: (html: string) => void;

    subscribeFocus: (cb: () => void) => () => void;
    subscribeBlur: (cb: () => void) => () => void;
  }

  interface ToolbarProps {
    onCommand?: (value: string) => void;
    formatting?: formatting[];
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
    format?: {
      heading?: Heading[];
      code?: boolean;
      blockquote?: boolean;
      paragraph?: boolean;
    };
  }

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
    extends react__default.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: react__default.ReactNode;
    active?: boolean;
    toolButtonSize?: ToolbarButtonSize;
    tooltip?: string;
  }

  type Heading = 1 | 2 | 3 | 4 | 5 | 6;
  type ToolbarButtonSize = "sm" | "md" | "xs";
}

declare const RichtextEditor: react.FC<RichtextEditorProps>;

declare const Toolbar: react.FC<
  ToolbarProps & {
    activeFormats?: Record<string, boolean>;
  }
>;

export { RichtextEditor, Toolbar };
