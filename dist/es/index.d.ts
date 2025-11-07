import * as react from "react";
import { ReactNode } from "react";
import * as lucide_react from "lucide-react";
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
};

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

/**
 * 🧩 RichtextEditor
 *
 * Main editor component for ECOD RichText.
 *
 * @public
 */
declare const RichtextEditor: react.FC<RichtextEditorProps>;

/**
 * 🧩 EditorFrame
 *
 * Main editor component for ECOD EditorFrame.
 *
 * @public
 */
declare const EditorFrame: react.ForwardRefExoticComponent<
  EditorFrameProps & react.RefAttributes<EditorFrameHandle>
>;

/**
 * 🧩 Toolbar
 *
 * Main editor component for ECOD Toolbar.
 *
 * @public
 */
declare const Toolbar: react.FC<ToolbarProps>;

export { EditorFrame, RichtextEditor, Toolbar };
