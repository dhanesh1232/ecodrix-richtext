import * as React from "react";
import { Icons } from "@/components/icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { ColorHighlighter } from "@/components/ui/color-picker";
import { Separator } from "@/components/ui/separator";

export const Space = () => {
  return (
    <Separator
      orientation="vertical"
      role="separator"
      style={{ height: "1.5rem" }}
      className="bg-muted-foreground border border-muted-foreground w-px"
    />
  );
};

export interface ButtonProps {
  label: string;
  cmd: string;
  icon: keyof typeof Icons;
}

export interface HistoryFormatProps {
  buttons?: ButtonProps[];
  onCommand?: (cmd: string) => void;
}

const defaultButtons: ButtonProps[] = [
  { cmd: "undo", label: "Undo", icon: "undo" },
  { cmd: "redo", label: "Redo", icon: "redo" },
];

export const HistoryFormat: React.FC<HistoryFormatProps> = ({
  buttons = defaultButtons,
  onCommand,
}) => {
  return (
    <ToggleGroup type="single" variant="default">
      {buttons.map((btn) => {
        const Icon = Icons[btn.icon];
        return (
          <ToggleGroupItem
            value={btn.cmd}
            key={btn.cmd}
            onClick={() => onCommand?.(btn.cmd)}
            title={btn.label}
            className="px-2"
          >
            <Icon size={14} strokeWidth={2} />
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};

const textFormatButtons: ButtonProps[] = [
  { cmd: "formatBlock:h1", label: "Heading 1", icon: "heading1" },
  { cmd: "formatBlock:h2", label: "Heading 2", icon: "heading2" },
  { cmd: "formatBlock:h3", label: "Heading 3", icon: "heading3" },
  { cmd: "formatBlock:h4", label: "Heading 4", icon: "heading4" },
  { cmd: "formatBlock:h5", label: "Heading 5", icon: "heading5" },
  { cmd: "formatBlock:h6", label: "Heading 6", icon: "heading6" },
  { cmd: "formatBlock:p", label: "Paragraph", icon: "paragraph" },
  { cmd: "formatBlock:blockquote", label: "Quote", icon: "quote" },
];

export const TextFormat: React.FC<TextFormatProps> = ({
  formatting = ["h1", "h2", "h3", "p"],
  onFormat,
}) => {
  // filter available buttons based on allowed formats
  const formatBlocks = textFormatButtons.filter((btn) =>
    formatting.includes(btn.cmd.split(":")[1] as formatting)
  );

  const handleChange = (value: string) => {
    console.log(value);
    const format = value.split(":")[1] as formatting;
    if (onFormat) onFormat(format);
  };

  return (
    <Toggle variant="outline" size="sm" asChild>
      <Select onValueChange={handleChange}>
        <SelectTrigger
          size="sm"
          className="focus:ring-0 min-w-28 focus:outline-0 rounded focus-visible:ring-0 focus-visible:outline-0"
        >
          <SelectValue placeholder={formatBlocks[0].label} />
        </SelectTrigger>
        <SelectContent className="rounded">
          {formatBlocks.map((btn) => (
            <SelectItem key={btn.cmd} value={btn.cmd} className="rounded">
              {btn.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Toggle>
  );
};

const styleFormatButtons: ButtonProps[] = [
  { cmd: "bold", label: "Bold", icon: "bold" },
  { cmd: "italic", label: "Italic", icon: "italic" },
  { cmd: "underline", label: "Underline", icon: "underline" },
  { cmd: "strikeThrough", label: "Strikethrough", icon: "strikeThrough" },
  { cmd: "textColor", label: "Text Color", icon: "baseLine" },
];
export const StyleFormat: React.FC<StyleFormatProps> = ({ onCommand }) => {
  const handleChange = (c: string) => {
    console.log(c);
  };

  return (
    <ToggleGroup type="single" variant="default">
      {styleFormatButtons.map((btn) => {
        const Icon = Icons[btn.icon];
        if (btn.cmd === "textColor") {
          return (
            <ToggleGroupItem key={btn.cmd} value={btn.cmd} className="px-0.5">
              <ColorHighlighter icon={btn.icon} onChange={handleChange} />
            </ToggleGroupItem>
          );
        }
        return (
          <ToggleGroupItem
            value={btn.cmd}
            key={btn.cmd}
            onClick={() => onCommand?.(btn.cmd)}
            title={btn.label}
            className="px-2"
          >
            <Icon size={14} strokeWidth={2} />
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};
