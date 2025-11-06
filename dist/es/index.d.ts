import * as react from 'react';
import * as lucide_react from 'lucide-react';

declare const Icons: {
    readonly undo: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly redo: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly heading1: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly heading2: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly heading3: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly heading4: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly heading5: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly heading6: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly paragraph: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly quote: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly bold: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly underline: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly italic: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly strikeThrough: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    readonly baseLine: react.ForwardRefExoticComponent<Omit<lucide_react.LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
};

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

/**
 * 🧩 RichtextEditor
 *
 * Main editor component for ECOD RichText.
 *
 * @public
 */
declare const RichtextEditor: react.FC<RichtextEditorProps>;

interface EditorFrameProps {
    initialContent?: string;
}
declare const EditorFrame: react.FC<EditorFrameProps>;

declare const Toolbar: react.FC<ToolbarProps>;

export { EditorFrame, type EditorFrameProps, RichtextEditor, Toolbar };
