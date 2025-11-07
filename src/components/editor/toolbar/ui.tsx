import * as React from "react";
import { Icons } from "@/components/icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { ColorHighlighter } from "@/components/ui/color-picker";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, ImageIcon } from "lucide-react";

export const Space = () => {
  return (
    <Separator
      orientation="vertical"
      role="separator"
      style={{ height: "1.5rem" }}
      className="border border-border border-l-0 border-y-0 w-px"
    />
  );
};

export const ButtonWithTooltip = ({
  label,
  icon,
  withIcon = false,
  isArrow = false,
  ...props
}: ButtonWIthTooltipProps) => {
  const Icon = icon ? Icons[icon] : null;
  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1">
        {Icon ? <Icon className="w-4 h-4" strokeWidth={2} /> : null}
        {isArrow && (
          <ChevronDown
            className="w-4 h-4 text-muted-foreground"
            strokeWidth={2}
          />
        )}
      </TooltipTrigger>
      <TooltipContent {...props}>{label}</TooltipContent>
    </Tooltip>
  );
};

export const HistoryFormat: React.FC<HistoryFormatProps> = ({
  buttons,
  onCommand,
}) => {
  return (
    <ToggleGroup type="single" variant="default">
      {buttons?.map((btn) => {
        return (
          <ToggleGroupItem
            value={btn.cmd!}
            key={btn.cmd}
            onClick={() => onCommand?.(btn.cmd!)}
            className="px-2 w-7 h-7 lg:w-8 lg:h-8"
          >
            <ButtonWithTooltip label={btn.label} icon={btn.icon} />
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};

export const TextFormat: React.FC<TextFormatProps> = ({
  formatting = ["h1", "h2", "h3", "p"],
  onFormat,
  buttons,
}) => {
  // filter available buttons based on allowed formats
  const formatBlocks = buttons?.filter((btn) =>
    formatting.includes(btn.cmd?.split(":")[1] as formatting)
  );

  return (
    <Select onValueChange={(f) => onFormat?.(f)}>
      <SelectTrigger
        size="sm"
        className="focus:ring-0 min-w-28 px-2 py-1 h-7 lg:h-8 focus:outline-0 rounded focus-visible:ring-0 focus-visible:outline-0"
      >
        <Tooltip>
          <TooltipTrigger>
            <SelectValue placeholder={formatBlocks?.[0].label} />
          </TooltipTrigger>
          <TooltipContent>Formatting</TooltipContent>
        </Tooltip>
      </SelectTrigger>
      <SelectContent className="rounded">
        {formatBlocks?.map((btn) => (
          <SelectItem
            key={btn.cmd}
            value={btn.cmd!}
            className={cn("rounded", btn?.style)}
          >
            {btn.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const StyleFormat: React.FC<TextStyleFormatProps> = ({
  buttons,
  onCommand,
}) => {
  const handleChange = (c: string) => {
    console.log(c);
  };

  return (
    <ToggleGroup type="single" variant="default">
      {buttons?.map((btn) => {
        if (btn.cmd === "color") {
          return (
            <ToggleGroupItem
              key={btn.cmd}
              value={btn.cmd}
              className="px-0.5 w-7 h-7 lg:w-8 lg:h-8"
            >
              <ColorHighlighter icon={btn.icon} onChange={handleChange} />
            </ToggleGroupItem>
          );
        }
        return (
          <ToggleGroupItem
            value={btn.cmd!}
            key={btn.cmd}
            onClick={() => onCommand?.(btn.cmd!)}
            className="px-2 w-7 h-7 lg:w-8 lg:h-8"
          >
            <ButtonWithTooltip label={btn.label} icon={btn.icon} />
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};

export const TextAlign: React.FC<TextAlignProps> = ({ buttons, onCommand }) => {
  const [active, setActive] = React.useState("justifyStart");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="font-medium h-7 px-1.5 min-w-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground">
        <ButtonWithTooltip
          label="Text Align"
          icon={active as ButtonIcon}
          isArrow
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {buttons?.map((btn) => {
          return (
            <DropdownMenuItem
              key={btn.cmd}
              onClick={() => {
                setActive(btn.cmd!);
                console.log(btn.cmd);
                onCommand?.(btn.cmd!);
              }}
              className="px-2 w-7 h-7 lg:w-8 lg:h-8"
            >
              <ButtonWithTooltip
                label={btn.label}
                icon={btn.icon}
                side="left"
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const MediaAndLink: React.FC<MediaLinkProps> = ({
  buttons,
  onCommand,
}) => {
  const [linkOpen, setLinkOpen] = React.useState(false);
  return (
    <ToggleGroup type="single" variant="default">
      {buttons?.map((btn) => {
        if (btn.cmd === "link") {
          return (
            <ToggleGroupItem
              key={btn.cmd}
              value={btn.cmd}
              className="px-2 w-7 h-7 lg:w-8 lg:h-8"
            >
              <DropdownMenu open={linkOpen} onOpenChange={setLinkOpen}>
                <DropdownMenuTrigger className="font-medium px-1 min-w-7 min-h-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground">
                  <ButtonWithTooltip
                    label={btn.label}
                    icon={btn.icon as ButtonIcon}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-64">
                  <DropdownMenuLabel className="px-1">URL</DropdownMenuLabel>
                  <Input
                    className="h-7 py-2 px-2 rounded focus-visible:ring-0 focus-visible:outline-0"
                    size={14}
                  />
                  <div className="flex items-center gap-2 justify-end mt-1.5">
                    <Button
                      variant="outline"
                      onClick={() => setLinkOpen(!linkOpen)}
                      size="sm"
                      className="rounded-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setLinkOpen(!linkOpen)}
                      size="sm"
                      variant="primary"
                      className="rounded-sm"
                    >
                      Insert
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </ToggleGroupItem>
          );
        }
        return (
          <ToggleGroupItem
            value={btn.cmd!}
            key={btn.cmd}
            className="px-2 w-7 h-7 lg:w-8 lg:h-8"
          >
            <MediaHandler />
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};

export const MediaHandler: React.FC<MediaHanderProps> = ({ onCommand }) => {
  const [open, setOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("upload");

  // Fake DB images (you’ll replace with real fetch)
  const [dbImages, setDbImages] = React.useState<string[]>([
    "https://picsum.photos/300/200?random=1",
    "https://picsum.photos/300/200?random=2",
    "https://picsum.photos/300/200?random=3",
    "https://picsum.photos/300/200?random=4",
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInsertImage = (url: string) => {
    onCommand?.("image", url);
    setOpen(false);
    setImageUrl("");
    setUploadedImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <ButtonWithTooltip label="Media" icon="image" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-lg p-0 overflow-hidden">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle className="text-base font-semibold">
            Add Image
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full px-4 pb-4"
        >
          <TabsList className="grid grid-cols-2 mb-3 rounded-md bg-muted">
            <TabsTrigger value="upload">Upload / URL</TabsTrigger>
            <TabsTrigger value="library">From Library</TabsTrigger>
          </TabsList>

          {/* --- Upload / URL Tab --- */}
          <TabsContent value="upload">
            <div className="flex flex-col gap-4">
              {/* Local Upload */}
              <div className="flex flex-col items-center justify-center border border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary transition">
                {!uploadedImage ? (
                  <div className="relative flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click or drop image to upload
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      className="opacity-0 absolute h-full w-full cursor-pointer"
                      onChange={handleFileUpload}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="max-h-48 rounded border object-contain"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleInsertImage(uploadedImage)}
                    >
                      Insert Image
                    </Button>
                  </div>
                )}
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Or insert via URL
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button
                    onClick={() => handleInsertImage(imageUrl)}
                    disabled={!imageUrl}
                  >
                    Insert
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* --- DB Image Library --- */}
          <TabsContent value="library">
            <ScrollArea className="h-64 rounded border p-3">
              {dbImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dbImages.map((img) => (
                    <button
                      key={img}
                      onClick={() => handleInsertImage(img)}
                      className="relative group rounded-md overflow-hidden border hover:ring-2 hover:ring-primary transition"
                    >
                      <img
                        src={img}
                        alt="DB"
                        className="object-cover w-full h-28"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <ImageIcon className="text-white w-5 h-5" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No images available in library.
                </p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export const MoreTools: React.FC<MoreToolsProps> = ({ show, onShow }) => {
  return (
    <Popover open={show} onOpenChange={onShow}>
      <PopoverTrigger className="font-medium h-7 px-1.5 min-w-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground">
        <ButtonWithTooltip label="More.." icon="moreHorizontal" />
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 px-2 py-2 rounded">
        Tools
      </PopoverContent>
    </Popover>
  );
};
