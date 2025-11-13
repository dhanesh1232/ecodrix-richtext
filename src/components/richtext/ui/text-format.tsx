"use client";
import * as React from "react";
import {
  Check,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Pilcrow,
  Quote,
} from "lucide-react";
import { useEditorChain } from "@/hooks/chain-execute";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const allFormats = [
  {
    type: "heading",
    cmd: "heading",
    args: [1],
    tooltip: "Heading 1",
    icon: <Heading1 />,
    activeKey: "isHeading1",
    style: "text-3xl font-bold leading-tight tracking-tight text-foreground",
  },
  {
    type: "heading",
    cmd: "heading",
    args: [2],
    tooltip: "Heading 2",
    icon: <Heading2 />,
    activeKey: "isHeading2",
    style: "text-2xl font-semibold leading-snug tracking-tight text-foreground",
  },
  {
    type: "heading",
    cmd: "heading",
    args: [3],
    tooltip: "Heading 3",
    icon: <Heading3 />,
    activeKey: "isHeading3",
    style: "text-xl font-semibold leading-snug text-foreground",
  },
  {
    type: "heading",
    cmd: "heading",
    args: [4],
    tooltip: "Heading 4",
    icon: <Heading4 />,
    activeKey: "isHeading4",
    style: "text-lg font-medium leading-relaxed text-foreground",
  },
  {
    type: "heading",
    cmd: "heading",
    args: [5],
    tooltip: "Heading 5",
    icon: <Heading5 />,
    activeKey: "isHeading5",
    style: "text-base font-medium leading-relaxed text-foreground",
  },
  {
    type: "heading",
    cmd: "heading",
    args: [6],
    tooltip: "Heading 6",
    icon: <Heading6 />,
    activeKey: "isHeading6",
    style:
      "text-sm font-semibold uppercase tracking-wide text-muted-foreground",
  },
  {
    type: "paragraph",
    cmd: "paragraph",
    tooltip: "Paragraph",
    icon: <Pilcrow />,
    activeKey: "isParagraph",
    style:
      "text-base leading-relaxed text-muted-foreground max-w-prose truncate",
  },
  {
    type: "blockquote",
    cmd: "quote",
    tooltip: "Blockquote",
    icon: <Quote />,
    activeKey: "isBlockquote",
    style:
      "text-base italic border-l-2 border-muted pl-3 text-muted-foreground leading-relaxed",
  },
  {
    type: "code",
    cmd: "codeBlock",
    tooltip: "Code Block",
    icon: <Code />,
    activeKey: "isCodeBlock",
    style:
      "text-sm font-mono bg-muted rounded px-2 py-1 text-foreground truncate",
  },
];

export const TextFormatSection: React.FC<TextFormatSectionProps> = ({
  ctx,
  format = {
    heading: [1, 2, 3],
    code: false,
    blockquote: false,
    paragraph: true,
  },
  size = "sm",
}) => {
  const { execute } = useEditorChain();

  const visibleFormats = React.useMemo(() => {
    return allFormats.filter((btn) => {
      switch (btn.type) {
        case "heading":
          return format.heading?.includes(btn.args?.[0] as Heading);
        case "paragraph":
          return !!format.paragraph;
        case "blockquote":
          return !!format.blockquote;
        case "code":
          return !!format.code;
        default:
          return false;
      }
    });
  }, [format]);

  const currentActive = visibleFormats.find(
    (btn) => ctx[btn.activeKey as keyof typeof ctx]
  );

  const currentLabel = currentActive?.tooltip || "Format";

  const sizeClasses = {
    sm: "px-2 h-8 text-sm gap-1.5",
    md: "px-3 h-9 text-base gap-2",
    xs: "px-1.5 h-7 text-xs gap-1",
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger
            className={`flex items-center justify-between gap-1 border border-border rounded ${sizeClasses[size]} text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:ring-1 focus-visible:ring-ring focus:outline-none min-w-[6rem]`}
          >
            {currentLabel}
            <ChevronDown className="w-4 h-4 opacity-70" strokeWidth={2} />
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Select Text format</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="center" className="min-w-10 space-y-0.5">
        {visibleFormats.map((btn) => {
          const active = Boolean(ctx[btn.activeKey as keyof typeof ctx]);
          return (
            <DropdownMenuItem
              key={btn.tooltip}
              onClick={() => execute(btn.cmd, ...(btn.args || []))}
              data-active={active}
              className={`flex hover:bg-muted/70 data-[active=true]:text-accent-foreground data-[active=true]:bg-accent items-center justify-between gap-2 px-2 py-1.5 cursor-pointer transition-colors ease-in-out duration-150`}
            >
              <span className={cn("flex items-center gap-2", btn?.style)}>
                {btn.icon}
                {btn.tooltip}
              </span>
              {active && <Check className="w-4 h-4 text-blue-500" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
