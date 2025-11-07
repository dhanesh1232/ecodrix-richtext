"use client";
import * as React from "react";
import {
  HistoryFormat,
  MediaAndLink,
  MoreTools,
  Space,
  StyleFormat,
  TextAlign,
  TextFormat,
} from "./ui";
import { ToolbarSection } from "../ToolbarSection";

const TOOL_SECTIONS: AllToolTypes[] = [
  "historyTabs",
  "textFormatTabs",
  "textStyleTabs",
  "textAlignTabs",
  "mediaAndLinksTabs",
];

const allTools: AllToolsProps = {
  historyTabs: [
    { cmd: "undo", label: "Undo", icon: "undo" },
    { cmd: "redo", label: "Redo", icon: "redo" },
  ],
  textFormatTabs: [
    {
      cmd: "formatBlock:p",
      label: "Paragraph",
      style: "text-base text-gray-800",
    },
    {
      cmd: "formatBlock:h1",
      label: "Heading 1",
      style: "text-2xl font-bold text-gray-900 leading-tight",
    },
    {
      cmd: "formatBlock:h2",
      label: "Heading 2",
      style: "text-xl font-semibold text-gray-900 leading-tight",
    },
    {
      cmd: "formatBlock:h3",
      label: "Heading 3",
      style: "text-lg font-semibold text-gray-900 leading-tight",
    },
    {
      cmd: "formatBlock:h4",
      label: "Heading 4",
      style: "text-base font-medium text-gray-900 leading-tight",
    },
    {
      cmd: "formatBlock:h5",
      label: "Heading 5",
      style: "text-sm font-medium text-gray-900 leading-tight",
    },
    {
      cmd: "formatBlock:h6",
      label: "Heading 6",
      style: "text-xs font-medium text-gray-900 leading-tight",
    },
    {
      cmd: "formatBlock:blockquote",
      label: "Blockquote",
      style:
        "pl-3 border-l-2 border-gray-400 italic text-gray-600 leading-snug",
    },
  ],
  textStyleTabs: [
    { cmd: "bold", label: "Bold", icon: "bold" },
    { cmd: "italic", label: "Italic", icon: "italic" },
    { cmd: "underline", label: "Underline", icon: "underline" },
    { cmd: "color", label: "Color", icon: "palette" },
  ],
  textAlignTabs: [
    { cmd: "justifyStart", label: "Start", icon: "justifyStart" },
    { cmd: "justifyCenter", label: "Center", icon: "justifyCenter" },
    { cmd: "justifyEnd", label: "End", icon: "justifyEnd" },
  ],
  mediaAndLinksTabs: [
    { cmd: "link", label: "Link", icon: "link" },
    { cmd: "image", label: "Image", icon: "image" },
  ],
};

/**
 * 🧩 Toolbar
 *
 * Main editor component for ECOD Toolbar.
 *
 * @public
 */
export const Toolbar: React.FC<ToolbarProps> = ({ formatting, onCommand }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useRef<Record<AllToolTypes, HTMLDivElement | null>>(
    {
      historyTabs: null,
      textFormatTabs: null,
      textStyleTabs: null,
      textAlignTabs: null,
      mediaAndLinksTabs: null,
    }
  );

  const [hidden, setHidden] = React.useState<AllToolTypes[]>([]);

  // measure & collapse algorithm
  React.useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const measure = () => {
      if (!container) return;

      const containerWidth = container.clientWidth;
      // reserve width for MoreTools button ~ keep it visible
      const reserved = 56; // tweak if needed (button + gap)
      let used = 0;
      const newlyVisible: AllToolTypes[] = [];

      for (const key of TOOL_SECTIONS) {
        const el = sectionRefs.current[key];
        if (!el) continue;

        const width = el.offsetWidth; // current rendered width
        if (used + width + reserved <= containerWidth) {
          newlyVisible.push(key);
          used += width;
        } else {
          break;
        }
      }

      const newlyHidden = TOOL_SECTIONS.filter(
        (t) => !newlyVisible.includes(t)
      );
      setHidden(newlyHidden);
    };

    // observe container + reflow
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    // also remeasure on fonts ready/first paint
    const id = window.requestAnimationFrame(measure);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // helper: visible?
  const show = (sec: AllToolTypes) => !hidden.includes(sec);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-1 border-b bg-muted/25 px-2 py-1 overflow-hidden transition-all duration-200
                 after:pointer-events-none after:absolute after:right-10 after:top-0 after:h-full after:w-6
                 after:bg-linear-to-l after:from-muted/25 after:to-transparent"
      aria-label="Editor Toolbar"
    >
      {/* HISTORY */}
      <ToolbarSection
        ref={(el) => {
          sectionRefs.current.historyTabs = el;
        }}
        section="historyTabs"
        className={
          show("historyTabs")
            ? "opacity-100"
            : "opacity-0 pointer-events-none absolute -left-full"
        }
      >
        <HistoryFormat buttons={allTools.historyTabs} onCommand={onCommand} />
        <Space />
      </ToolbarSection>

      {/* FORMAT */}
      <ToolbarSection
        ref={(el) => {
          sectionRefs.current.textFormatTabs = el;
        }}
        section="textFormatTabs"
        className={
          show("textFormatTabs")
            ? "opacity-100"
            : "opacity-0 pointer-events-none absolute -left-full"
        }
      >
        <TextFormat
          formatting={formatting}
          buttons={allTools.textFormatTabs}
          onFormat={(f) => onCommand?.(f)}
        />
      </ToolbarSection>

      {/* STYLE */}
      <ToolbarSection
        ref={(el) => {
          sectionRefs.current.textStyleTabs = el;
        }}
        section="textStyleTabs"
        className={
          show("textStyleTabs")
            ? "opacity-100"
            : "opacity-0 pointer-events-none absolute -left-full"
        }
      >
        <StyleFormat buttons={allTools.textStyleTabs} onCommand={onCommand} />
      </ToolbarSection>

      {/* ALIGN */}
      <ToolbarSection
        ref={(el) => {
          sectionRefs.current.textAlignTabs = el;
        }}
        section="textAlignTabs"
        className={
          show("textAlignTabs")
            ? "opacity-100"
            : "opacity-0 pointer-events-none absolute -left-full"
        }
      >
        <Space />
        <TextAlign buttons={allTools.textAlignTabs} onCommand={onCommand} />
      </ToolbarSection>

      {/* MEDIA */}
      <ToolbarSection
        ref={(el) => {
          sectionRefs.current.mediaAndLinksTabs = el;
        }}
        section="mediaAndLinksTabs"
        className={
          show("mediaAndLinksTabs")
            ? "opacity-100"
            : "opacity-0 pointer-events-none absolute -left-full"
        }
      >
        <Space />
        <MediaAndLink
          buttons={allTools.mediaAndLinksTabs}
          onCommand={onCommand}
        />
      </ToolbarSection>

      {/* Floating “More” — always visible, takes hidden sections */}
      <div className="ml-auto pr-1">
        <MoreTools tools={allTools} showTools={hidden} />
      </div>
    </div>
  );
};
