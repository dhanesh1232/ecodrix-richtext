"use client";

import * as React from "react";
import { ImageModal } from "./image-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Button, Input, Label } from "@/components/ui";
import { ToolbarButton } from "../toolbar/toolbar";
import { ImagePlus } from "lucide-react";
import { useEditorChain } from "@/hooks/chain-execute";

interface ImagePickerProps {
  modal?: boolean;
  isMultiple?: boolean;
}

export const ImagePickerBlock: React.FC<ImagePickerProps> = ({
  modal,
  isMultiple,
}) => {
  const [_open, _setOpen] = React.useState<boolean>(false);
  const [urls, setUrls] = React.useState<string[]>([""]);
  const [alts, setAlts] = React.useState<string[]>([""]);
  const { execute } = useEditorChain();

  const addField = () => {
    setUrls((prev) => [...prev, ""]);
    setAlts((prev) => [...prev, ""]);
  };

  const handleChange = (i: number, type: "url" | "alt", value: string) => {
    if (type === "url") {
      const updated = [...urls];
      updated[i] = value;
      setUrls(updated);
    } else {
      const updated = [...alts];
      updated[i] = value;
      setAlts(updated);
    }
  };

  const handleInsert = () => {
    const images = urls
      .map((u, i) => ({ url: u.trim(), alt: alts[i].trim() }))
      .filter((img) => img.url);

    if (!images.length) return;

    if (images.length === 1) {
      execute("insertImage", (images[0].url, images[0].alt));
    } else {
      execute("insertImages", images);
    }

    // reset
    setUrls([""]);
    setAlts([""]);
    _setOpen(false);
  };

  return !modal ? (
    <DropdownMenu open={_open} onOpenChange={_setOpen}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          toolButtonSize="xs"
          active={_open}
          tooltip="Add Image URL"
        >
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 p-4 space-y-4 rounded-md"
      >
        <DropdownMenuLabel className="text-sm px-0 py-0 my-0 font-medium">
          Add Image URL(s)
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-2" />

        {urls.map((url, i) => (
          <DropdownMenuGroup key={i} className="space-y-2">
            <Label>Image URL {urls.length > 1 ? i + 1 : ""}</Label>
            <Input
              placeholder="https://example.com/image.png"
              className="rounded"
              value={url}
              onChange={(e) => handleChange(i, "url", e.target.value)}
            />
            <Label>Alt Text</Label>
            <Input
              className="rounded"
              placeholder="Describe the image"
              value={alts[i]}
              onChange={(e) => handleChange(i, "alt", e.target.value)}
            />
          </DropdownMenuGroup>
        ))}

        <Button
          variant="secondary"
          className="rounded"
          size="sm"
          onClick={addField}
        >
          + Add More
        </Button>

        <Button
          onClick={handleInsert}
          variant="primary"
          size="sm"
          className="w-full rounded"
        >
          Insert Image{urls.length > 1 ? "s" : ""}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <ImageModal
      open={_open}
      multiple={isMultiple}
      setOpen={_setOpen}
      onInsert={(images) => {
        console.log(images);
        // images = [{ url, alt }]

        if (images.length === 1) {
          const img = images[0];
          execute("insertImage", img?.url, img?.alt);
        } else {
          execute("insertImages", images);
        }
      }}
    />
  );
};
