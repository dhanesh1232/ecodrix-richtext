"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import {
  Upload,
  ImagePlus,
  X,
  Check,
  Loader2,
  Search,
  Grid3X3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolbarButton } from "../toolbar/toolbar";

interface ImagePickerProps {
  onChange?: (url: string) => void;
  selected?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "free";
  maxSize?: number;
  multiple?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  onChange,
  selected,
  maxSize = 5,
  multiple = true,
}) => {
  const [open, setOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [images, setImages] = React.useState<string[]>([]);
  const [loadingImages, setLoadingImages] = React.useState(true);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedImages, setSelectedImage] = React.useState<string[]>(
    selected ? [selected] : []
  );

  const filteredImages = images.filter((img) =>
    img.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /** Simulated backend fetch */
  React.useEffect(() => {
    setLoadingImages(true);
    setTimeout(() => {
      setImages([
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop",
      ]);
      setLoadingImages(false);
    }, 1000);
  }, []);

  /** Upload Simulation */
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxSize * 1024 * 1024)
      return alert(`Max size is ${maxSize}MB`);
    if (!file.type.startsWith("image/"))
      return alert("Please upload an image file");

    setIsUploading(true);
    setUploadProgress(0);

    const progress = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progress);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        const result = reader.result as string;

        onChange?.(result);
        setIsUploading(false);
        setUploadProgress(100);
        clearInterval(progress);
      }, 1800);
    };
    reader.readAsDataURL(file);
  };

  /** Drag & Drop Upload */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  /** 🖱️ Choose from existing images */
  const handleSelectImage = (url: string) => {
    if (multiple) {
      setSelectedImage((prev) =>
        prev.includes(url)
          ? prev.filter((item) => item !== url)
          : [...prev, url]
      );
    } else {
      setSelectedImage([url]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      const event = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleUpload(event);
    }
  };

  const isSelected = (src: string) => {
    return selectedImages.find((i) => i === src);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Main Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <ToolbarButton
            tooltip="Add Media"
            toolButtonSize="xs"
            data-active={open}
          >
            <ImagePlus className="h-4 w-4" />
          </ToolbarButton>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[700px] max-h-[80vh] p-0 overflow-hidden rounded-md shadow-2xl flex flex-col">
          {/* Header */}
          <DialogHeader className="p-4 border-b border-border/50 sticky top-0 bg-background z-0">
            <DialogTitle className="text-lg font-semibold">
              Choose or Upload Image
            </DialogTitle>

            <div className="flex items-center gap-2 justify-between mt-3">
              {/* Search */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-1.5 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
              </div>

              {/* View Toggle */}
              <div className="flex border border-border rounded-md p-1 ml-3 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  data-active={viewMode === "grid"}
                  className={cn(
                    "rounded-md transition-colors border-0 data-[active=true]:bg-accent"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  data-active={viewMode === "list"}
                  className={cn(
                    "p-1.5 rounded-md transition-colors border-0 data-[active=true]:bg-accent"
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            {/* Upload Section */}
            <div
              className={cn(
                "relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/60 hover:bg-primary/5",
                isUploading && "bg-muted/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!isUploading ? (
                <>
                  <Upload className="h-8 w-8 text-primary mb-2" />
                  <p className="font-medium">
                    Drop your image or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG, WEBP — Max {maxSize}MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <div className="w-48 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            {/* File Gallery */}
            <div className="flex flex-col">
              <p className="text-sm font-medium mb-3 text-muted-foreground">
                Your Media Files
              </p>
              {loadingImages ? (
                <div
                  className={cn(
                    "gap-4",
                    viewMode === "grid" ? "grid grid-cols-3" : "space-y-3"
                  )}
                >
                  {[...Array(6)].map((_, i) =>
                    viewMode === "grid" ? (
                      <Skeleton key={i} className="h-32 rounded-lg" />
                    ) : (
                      <div key={i} className="flex gap-3 items-center">
                        <Skeleton className="h-16 w-16 rounded-lg" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    )
                  )}
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
                  <ImagePlus className="h-10 w-10 opacity-40 mb-3" />
                  <p>No images found</p>
                </div>
              ) : (
                <div
                  className={cn(
                    "gap-4",
                    viewMode === "grid"
                      ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
                      : "flex flex-col space-y-3"
                  )}
                >
                  {filteredImages.map((src, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectImage(src)}
                      className={cn(
                        "cursor-pointer relative rounded-md group transition-all duration-200 border overflow-hidden",
                        isSelected(src)
                          ? "border-blue-500 ring-2 ring-blue-500/30"
                          : "border-border hover:border-blue-500/50 hover:shadow-sm",
                        viewMode === "list" && "flex items-center gap-4 p-1"
                      )}
                    >
                      <div
                        className={cn(
                          "p-0 relative",
                          viewMode === "list" && "flex items-center gap-4"
                        )}
                      >
                        <div
                          className={cn(
                            "overflow-hidden bg-muted",
                            viewMode === "grid" ? "aspect-square" : "w-16 h-16",
                            "rounded-md"
                          )}
                        >
                          <img
                            src={src}
                            alt={`Media ${i}`}
                            className="object-cover w-full h-full group-hover:scale-105 ease-in-out duration-150 transform transition-transform"
                          />
                        </div>
                        {isSelected(src) && (
                          <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1 shadow">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                        {!isSelected(src) && (
                          <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1 shadow opacity-0 group-hover:opacity-60 transition-transform transform ease-in-out duration-100">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                        {viewMode === "list" && (
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              Image {i + 1}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {src.split("/").pop()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center border-t border-border bg-muted/10 p-3 sticky bottom-0 z-10">
            <span className="text-sm text-muted-foreground">
              {selectedImages.length > 0 ? (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Image selected{" "}
                  <span className="text-blue-500 font-bold">
                    {selectedImages.length}
                  </span>
                </span>
              ) : (
                "No image selected"
              )}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={!selectedImages.length || isUploading}
                onClick={() => setOpen(false)}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  `Select`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
