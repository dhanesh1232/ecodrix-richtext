"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  Input,
  Label,
  Button,
  Separator,
  Switch,
} from "@/components/ui";
import { ToolbarButton } from "../toolbar/toolbar";
import { Link, X, Unlink } from "lucide-react";
import { useEditorChain } from "@/hooks/chain-execute";
import { useEditor } from "@/context/editor";

export const AnchorLink: React.FC<ToolbarButtonDefaultProps> = ({
  size,
  ctx,
  ...props
}) => {
  const [_open, _setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [newTab, setNewTab] = React.useState(true);
  const [error, setError] = React.useState("");
  const [hasSelection, setHasSelection] = React.useState(false);
  const { execute } = useEditorChain();
  const { core } = useEditor();

  /** 🧠 Check for selected text in the iframe */
  React.useEffect(() => {
    const interval = setInterval(() => {
      const sel = core?.win?.getSelection();
      if (!sel) return setHasSelection(false);
      setHasSelection(
        Boolean(sel.rangeCount && !sel.isCollapsed && sel.toString().trim())
      );
    }, 200);
    return () => clearInterval(interval);
  }, [core]);

  /** Prefill URL if caret is inside an existing link */
  React.useEffect(() => {
    if (ctx.link && core?.win?.getSelection) {
      const sel = core.win.getSelection();
      const node = sel?.anchorNode as HTMLElement | null;
      const linkEl = node?.parentElement?.closest("a");
      if (linkEl) setUrl(linkEl.getAttribute("href") || "");
    } else if (!ctx.link && !_open) {
      setUrl("");
    }
  }, [ctx.link, _open, core]);

  /** Validate URL */
  const isValidUrl = (str: string) => {
    if (!str) return false;
    try {
      const u = new URL(str.startsWith("http") ? str : `https://${str}`);
      return !!u.href;
    } catch {
      return false;
    }
  };

  /** Handle insert or update link */
  const handleInsert = () => {
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    execute("link", formattedUrl);

    // optional new-tab attributes
    const sel = core?.win?.getSelection();
    const anchor = sel?.anchorNode?.parentElement?.closest("a");
    if (anchor && newTab) {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    }

    core?.win?.focus();
    setError("");
    _setOpen(false);
  };

  const handleUnlink = () => {
    execute("unlink");
    core?.win?.focus();
    setUrl("");
    _setOpen(false);
  };

  return (
    <DropdownMenu open={_open} onOpenChange={_setOpen}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          tooltip="Insert or Edit Link"
          toolButtonSize={size}
          data-active={ctx.link}
          disabled={!hasSelection && !ctx.link} // 🧠 disable if no selection & not editing
          {...props}
        >
          <Link className="h-4 w-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 rounded-xl p-4 border border-border/50 bg-background/95 backdrop-blur-md shadow-lg space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {ctx.link ? "Edit Link" : "Insert Link"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-pointer rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => _setOpen(false)}
          >
            <X />
          </Button>
        </div>
        <Separator />

        {/* Fields */}
        <DropdownMenuGroup className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="url" className="text-sm text-muted-foreground">
              URL
            </Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="rounded focus-visible:ring-2 focus-visible:ring-primary/40"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-500 font-medium pt-1">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label
              htmlFor="new-tab"
              className="text-sm text-muted-foreground select-none"
            >
              Open in new tab
            </Label>
            <Switch id="new-tab" checked={newTab} onCheckedChange={setNewTab} />
          </div>
        </DropdownMenuGroup>

        <Separator />

        {/* Actions */}
        <div className="flex justify-between pt-2">
          {ctx.link && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-red-500 gap-1"
              onClick={handleUnlink}
            >
              <Unlink className="h-4 w-4" />
              Remove
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => _setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!url.trim()}
              onClick={handleInsert}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {ctx.link ? "Update" : "Insert"}
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
