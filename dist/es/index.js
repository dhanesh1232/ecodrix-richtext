var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/index.ts
import "./globals.css";

// src/components/editor/editor.tsx
import * as React6 from "react";

// src/components/editor/frame/main.tsx
import * as React from "react";
import { jsx } from "react/jsx-runtime";
var EditorFrame = React.forwardRef(({ initialContent = "<p>Start typing...</p>" }, ref) => {
  const iframeRef = React.useRef(null);
  const [doc, setDoc] = React.useState(null);
  const focusListeners = React.useRef([]);
  const blurListeners = React.useRef([]);
  React.useEffect(() => {
    var _a;
    const iframe = iframeRef.current;
    if (!iframe) return;
    const iframeDoc = iframe.contentDocument || ((_a = iframe.contentWindow) == null ? void 0 : _a.document);
    if (!iframeDoc) return;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: system-ui, sans-serif;
              padding: 12px;
              margin: 0;
              min-height: 100%;
              color: #111;
              line-height: 1.6;
              background: transparent;
              height: 320px;
            }
            h1, h2, h3, h4, h5, h6 { margin: 0.5em 0; }
            p { margin: 0.5em 0; }
            a { color: #0ea5e9; text-decoration: underline; }
            blockquote { border-left: 3px solid #ddd; padding-left: 1em; color: #555; font-style: italic; }
          </style>
        </head>
        <body contenteditable="true">${initialContent}</body>
      </html>
    `);
    iframeDoc.close();
    setDoc(iframeDoc);
  }, []);
  React.useEffect(() => {
    if (!doc) return;
    let selectionTimeout;
    const handleSelectionChange = () => {
      clearTimeout(selectionTimeout);
      selectionTimeout = setTimeout(() => {
        var _a;
        const selection = doc.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        const node = range.startContainer.parentElement;
        if (!node) return;
        const block = ((_a = node.closest("h1,h2,h3,h4,h5,h6,p,blockquote,pre,div")) == null ? void 0 : _a.tagName.toLowerCase()) || "p";
        const formats = {
          block,
          bold: doc.queryCommandState("bold"),
          italic: doc.queryCommandState("italic"),
          underline: doc.queryCommandState("underline"),
          strikeThrough: doc.queryCommandState("strikeThrough"),
          justifyStart: doc.queryCommandState("justifyLeft"),
          justifyCenter: doc.queryCommandState("justifyCenter"),
          justifyEnd: doc.queryCommandState("justifyRight"),
          foreColor: doc.queryCommandValue("foreColor"),
          link: !!node.closest("a")
        };
        window.dispatchEvent(
          new CustomEvent("editor-format-change", { detail: formats })
        );
      }, 50);
    };
    doc.addEventListener("selectionchange", handleSelectionChange);
    return () => doc.removeEventListener("selectionchange", handleSelectionChange);
  }, [doc]);
  React.useImperativeHandle(ref, () => ({
    handleCommand: (cmd, value) => {
      if (!doc) return;
      doc.body.focus();
      if (cmd.startsWith("formatBlock:")) {
        const tag = cmd.split(":")[1];
        doc.execCommand("formatBlock", false, `<${tag}>`);
        return;
      }
      switch (cmd) {
        case "bold":
        case "italic":
        case "underline":
        case "strikeThrough":
        case "undo":
        case "redo":
          doc.execCommand(cmd);
          break;
        case "justifyStart":
          doc.execCommand("justifyLeft");
          break;
        case "justifyCenter":
          doc.execCommand("justifyCenter");
          break;
        case "justifyEnd":
          doc.execCommand("justifyRight");
          break;
        case "color":
          doc.execCommand("foreColor", false, value != null ? value : "#000");
          break;
        case "link": {
          const url = prompt("Enter URL:");
          if (url) doc.execCommand("createLink", false, url);
          break;
        }
        case "image": {
          const img = prompt("Enter Image URL:");
          if (img) doc.execCommand("insertImage", false, img);
          break;
        }
      }
    },
    getContent: () => (doc == null ? void 0 : doc.body.innerHTML) || "",
    setContent: (html) => {
      if (doc) doc.body.innerHTML = html;
    },
    subscribeFocus: (cb) => {
      focusListeners.current.push(cb);
      return () => {
        focusListeners.current = focusListeners.current.filter((f) => f !== cb);
      };
    },
    subscribeBlur: (cb) => {
      blurListeners.current.push(cb);
      return () => {
        blurListeners.current = blurListeners.current.filter((f) => f !== cb);
      };
    }
  }));
  React.useEffect(() => {
    if (!doc) return;
    const handleFocus = () => focusListeners.current.forEach((cb) => cb());
    const handleBlur = () => blurListeners.current.forEach((cb) => cb());
    doc.body.addEventListener("focus", handleFocus);
    doc.body.addEventListener("blur", handleBlur);
    return () => {
      doc.body.removeEventListener("focus", handleFocus);
      doc.body.removeEventListener("blur", handleBlur);
    };
  }, [doc]);
  return /* @__PURE__ */ jsx("div", { className: "w-full min-h-[350px] border-t border-border bg-background relative overflow-hidden", children: /* @__PURE__ */ jsx(
    "iframe",
    {
      ref: iframeRef,
      className: "w-full h-[350px] bg-transparent outline-none border-0",
      sandbox: "allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
    }
  ) });
});
EditorFrame.displayName = "EditorFrame";

// src/components/editor/toolbar/main.tsx
import * as React5 from "react";

// src/components/editor/toolbar/ui.tsx
import * as React3 from "react";

// src/components/icons.tsx
import {
  Baseline,
  Bold,
  Code2,
  Ellipsis,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Image,
  Indent,
  Italic,
  Link,
  List,
  ListOrdered,
  MoreHorizontal,
  Outdent,
  Palette,
  Pilcrow,
  Quote,
  Redo2,
  RotateCcw,
  Strikethrough,
  Superscript,
  TableIcon,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  Underline,
  Undo2,
  Video
} from "lucide-react";
var Icons = {
  undo: Undo2,
  redo: Redo2,
  heading1: Heading1,
  heading2: Heading2,
  heading3: Heading3,
  heading4: Heading4,
  heading5: Heading5,
  heading6: Heading6,
  paragraph: Pilcrow,
  blockquote: Quote,
  bold: Bold,
  underline: Underline,
  italic: Italic,
  strikeThrough: Strikethrough,
  baseLine: Baseline,
  palette: Palette,
  justifyStart: TextAlignStart,
  justifyCenter: TextAlignCenter,
  justifyEnd: TextAlignEnd,
  link: Link,
  image: Image,
  video: Video,
  ellipsis: Ellipsis,
  moreHorizontal: MoreHorizontal,
  orderList: ListOrdered,
  list: List,
  indent: Indent,
  outdent: Outdent,
  table: TableIcon,
  code: Code2,
  superscript: Superscript,
  reset: RotateCcw
};

// src/components/ui/toggle-group.tsx
import * as React2 from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/ui/toggle.tsx
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";
import { jsx as jsx2 } from "react/jsx-runtime";
var toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground"
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Toggle(_a) {
  var _b = _a, {
    className,
    variant,
    size
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size"
  ]);
  return /* @__PURE__ */ jsx2(
    TogglePrimitive.Root,
    __spreadValues({
      "data-slot": "toggle",
      className: cn(toggleVariants({ variant, size, className }))
    }, props)
  );
}

// src/components/ui/toggle-group.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var ToggleGroupContext = React2.createContext({
  size: "default",
  variant: "default",
  spacing: 0
});
function ToggleGroup(_a) {
  var _b = _a, {
    className,
    variant,
    size,
    spacing = 0,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size",
    "spacing",
    "children"
  ]);
  return /* @__PURE__ */ jsx3(
    ToggleGroupPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "toggle-group",
      "data-variant": variant,
      "data-size": size,
      "data-spacing": spacing,
      style: { "--gap": spacing },
      className: cn(
        "group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx3(ToggleGroupContext.Provider, { value: { variant, size, spacing }, children })
    })
  );
}
function ToggleGroupItem(_a) {
  var _b = _a, {
    className,
    children,
    variant,
    size
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "variant",
    "size"
  ]);
  const context = React2.useContext(ToggleGroupContext);
  return /* @__PURE__ */ jsx3(
    ToggleGroupPrimitive.Item,
    __spreadProps(__spreadValues({
      "data-slot": "toggle-group-item",
      "data-variant": context.variant || variant,
      "data-size": context.size || size,
      "data-spacing": context.spacing,
      className: cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size
        }),
        "w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
        "data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l",
        className
      )
    }, props), {
      children
    })
  );
}

// src/components/ui/separator.tsx
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { jsx as jsx4 } from "react/jsx-runtime";
function Separator(_a) {
  var _b = _a, {
    className,
    orientation = "horizontal",
    decorative = true
  } = _b, props = __objRest(_b, [
    "className",
    "orientation",
    "decorative"
  ]);
  return /* @__PURE__ */ jsx4(
    SeparatorPrimitive.Root,
    __spreadValues({
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )
    }, props)
  );
}

// src/components/ui/tooltip.tsx
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { jsx as jsx5, jsxs } from "react/jsx-runtime";
function TooltipProvider(_a) {
  var _b = _a, {
    delayDuration = 0
  } = _b, props = __objRest(_b, [
    "delayDuration"
  ]);
  return /* @__PURE__ */ jsx5(
    TooltipPrimitive.Provider,
    __spreadValues({
      "data-slot": "tooltip-provider",
      delayDuration
    }, props)
  );
}
function Tooltip(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx5(TooltipProvider, { children: /* @__PURE__ */ jsx5(TooltipPrimitive.Root, __spreadValues({ "data-slot": "tooltip" }, props)) });
}
function TooltipTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx5(TooltipPrimitive.Trigger, __spreadValues({ "data-slot": "tooltip-trigger" }, props));
}
function TooltipContent(_a) {
  var _b = _a, {
    className,
    sideOffset = 0,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "sideOffset",
    "children"
  ]);
  return /* @__PURE__ */ jsx5(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    TooltipPrimitive.Content,
    __spreadProps(__spreadValues({
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx5(TooltipPrimitive.Arrow, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    })
  ) });
}

// src/components/ui/dropdown-menu.tsx
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
function DropdownMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx6(DropdownMenuPrimitive.Root, __spreadValues({ "data-slot": "dropdown-menu" }, props));
}
function DropdownMenuTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx6(
    DropdownMenuPrimitive.Trigger,
    __spreadValues({
      "data-slot": "dropdown-menu-trigger"
    }, props)
  );
}
function DropdownMenuContent(_a) {
  var _b = _a, {
    className,
    sideOffset = 4
  } = _b, props = __objRest(_b, [
    "className",
    "sideOffset"
  ]);
  return /* @__PURE__ */ jsx6(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx6(
    DropdownMenuPrimitive.Content,
    __spreadValues({
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-0 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded border p-1 shadow-md",
        className
      )
    }, props)
  ) });
}
function DropdownMenuItem(_a) {
  var _b = _a, {
    className,
    inset,
    variant = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "variant"
  ]);
  return /* @__PURE__ */ jsx6(
    DropdownMenuPrimitive.Item,
    __spreadValues({
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}
function DropdownMenuLabel(_a) {
  var _b = _a, {
    className,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "inset"
  ]);
  return /* @__PURE__ */ jsx6(
    DropdownMenuPrimitive.Label,
    __spreadValues({
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )
    }, props)
  );
}

// src/components/editor/toolbar/ui.tsx
import { Check, ChevronDown } from "lucide-react";

// src/components/ui/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
function Dialog(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx7(DialogPrimitive.Root, __spreadValues({ "data-slot": "dialog" }, props));
}
function DialogTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx7(DialogPrimitive.Trigger, __spreadValues({ "data-slot": "dialog-trigger" }, props));
}
function DialogPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx7(DialogPrimitive.Portal, __spreadValues({ "data-slot": "dialog-portal" }, props));
}
function DialogOverlay(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx7(
    DialogPrimitive.Overlay,
    __spreadValues({
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )
    }, props)
  );
}
function DialogContent(_a) {
  var _b = _a, {
    className,
    children,
    showCloseButton = true
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "showCloseButton"
  ]);
  return /* @__PURE__ */ jsxs3(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx7(DialogOverlay, {}),
    /* @__PURE__ */ jsxs3(
      DialogPrimitive.Content,
      __spreadProps(__spreadValues({
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )
      }, props), {
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs3(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx7(XIcon, {}),
                /* @__PURE__ */ jsx7("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      })
    )
  ] });
}
function DialogHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx7(
    "div",
    __spreadValues({
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className)
    }, props)
  );
}
function DialogTitle(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx7(
    DialogPrimitive.Title,
    __spreadValues({
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className)
    }, props)
  );
}

// src/components/ui/popover.tsx
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { jsx as jsx8 } from "react/jsx-runtime";
function Popover(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx8(PopoverPrimitive.Root, __spreadValues({ "data-slot": "popover" }, props));
}
function PopoverTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx8(PopoverPrimitive.Trigger, __spreadValues({ "data-slot": "popover-trigger" }, props));
}
function PopoverContent(_a) {
  var _b = _a, {
    className,
    align = "center",
    sideOffset = 4
  } = _b, props = __objRest(_b, [
    "className",
    "align",
    "sideOffset"
  ]);
  return /* @__PURE__ */ jsx8(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx8(
    PopoverPrimitive.Content,
    __spreadValues({
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      )
    }, props)
  ) });
}

// src/components/ui/input.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
function Input(_a) {
  var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
  return /* @__PURE__ */ jsx9(
    "input",
    __spreadValues({
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )
    }, props)
  );
}

// src/components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx10 } from "react/jsx-runtime";
var buttonVariants = cva2(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-blue-600 hover:bg-blue-600/70 text-white"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button(_a) {
  var _b = _a, {
    className,
    variant,
    size,
    asChild = false
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size",
    "asChild"
  ]);
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx10(
    Comp,
    __spreadValues({
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className }))
    }, props)
  );
}

// src/components/ui/tabs.tsx
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { jsx as jsx11 } from "react/jsx-runtime";
function Tabs(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx11(
    TabsPrimitive.Root,
    __spreadValues({
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className)
    }, props)
  );
}
function TabsList(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx11(
    TabsPrimitive.List,
    __spreadValues({
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )
    }, props)
  );
}
function TabsTrigger(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx11(
    TabsPrimitive.Trigger,
    __spreadValues({
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}
function TabsContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx11(
    TabsPrimitive.Content,
    __spreadValues({
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className)
    }, props)
  );
}

// src/components/ui/scroll-area.tsx
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { jsx as jsx12, jsxs as jsxs4 } from "react/jsx-runtime";
function ScrollArea(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs4(
    ScrollAreaPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "scroll-area",
      className: cn("relative", className)
    }, props), {
      children: [
        /* @__PURE__ */ jsx12(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsx12(ScrollBar, {}),
        /* @__PURE__ */ jsx12(ScrollAreaPrimitive.Corner, {})
      ]
    })
  );
}
function ScrollBar(_a) {
  var _b = _a, {
    className,
    orientation = "vertical"
  } = _b, props = __objRest(_b, [
    "className",
    "orientation"
  ]);
  return /* @__PURE__ */ jsx12(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    __spreadProps(__spreadValues({
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx12(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    })
  );
}

// src/components/editor/toolbar/ui.tsx
import { Upload, ImageIcon } from "lucide-react";
import { jsx as jsx13, jsxs as jsxs5 } from "react/jsx-runtime";
var Space = () => {
  return /* @__PURE__ */ jsx13(
    Separator,
    {
      orientation: "vertical",
      role: "separator",
      style: { height: "1.5rem" },
      className: "border border-border border-l-0 border-y-0 w-px mx-1"
    }
  );
};
var ButtonWithTooltip = (_a) => {
  var _b = _a, {
    label,
    icon,
    withIcon = false,
    isArrow = false
  } = _b, props = __objRest(_b, [
    "label",
    "icon",
    "withIcon",
    "isArrow"
  ]);
  const Icon = icon ? Icons[icon] : null;
  return /* @__PURE__ */ jsxs5(Tooltip, { children: [
    /* @__PURE__ */ jsxs5(TooltipTrigger, { className: "flex items-center gap-1 cursor-pointer", children: [
      Icon ? /* @__PURE__ */ jsx13(Icon, { className: "w-4 h-4", strokeWidth: 2 }) : null,
      isArrow && /* @__PURE__ */ jsx13(
        ChevronDown,
        {
          className: "w-4 h-4 text-muted-foreground",
          strokeWidth: 2
        }
      )
    ] }),
    /* @__PURE__ */ jsx13(TooltipContent, __spreadProps(__spreadValues({}, props), { children: label }))
  ] });
};
var HistoryFormat = ({
  buttons,
  onCommand
}) => {
  return /* @__PURE__ */ jsx13(ToggleGroup, { type: "single", variant: "default", children: buttons == null ? void 0 : buttons.map((btn) => {
    return /* @__PURE__ */ jsx13(
      ToggleGroupItem,
      {
        value: btn.cmd,
        onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
        className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
        children: /* @__PURE__ */ jsx13(ButtonWithTooltip, { label: btn.label, icon: btn.icon })
      },
      btn.cmd
    );
  }) });
};
var TextFormat = ({
  formatting = ["h1", "h2", "h3", "p"],
  onFormat,
  buttons,
  activeFormats
}) => {
  const [activeFormat, setActiveFormat] = React3.useState("Paragraph");
  React3.useEffect(() => {
    if (activeFormats == null ? void 0 : activeFormats.block) {
      const found = buttons == null ? void 0 : buttons.find(
        (btn) => {
          var _a;
          return (_a = btn.cmd) == null ? void 0 : _a.toLowerCase().includes(String(activeFormats.block).toLowerCase());
        }
      );
      setActiveFormat(found ? found.label : "Paragraph");
    }
  }, [activeFormats]);
  const formatBlocks = buttons == null ? void 0 : buttons.filter(
    (btn) => {
      var _a;
      return formatting.includes((_a = btn.cmd) == null ? void 0 : _a.split(":")[1]);
    }
  );
  const handleFormatChange = (format) => {
    setActiveFormat(format.label);
    onFormat == null ? void 0 : onFormat(format.cmd);
  };
  return /* @__PURE__ */ jsxs5(DropdownMenu, { children: [
    /* @__PURE__ */ jsx13(DropdownMenuTrigger, { className: "focus:ring-0 min-w-24 px-1 h-7 lg:h-8 focus:outline-0 focus-visible:ring-0 focus-visible:outline-0 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground", children: /* @__PURE__ */ jsxs5(Tooltip, { children: [
      /* @__PURE__ */ jsxs5(TooltipTrigger, { className: "flex items-center gap-1 text-sm font-medium text-muted-foreground", children: [
        activeFormat,
        /* @__PURE__ */ jsx13(
          ChevronDown,
          {
            className: "w-4 h-4 text-muted-foreground/80",
            strokeWidth: 2
          }
        )
      ] }),
      /* @__PURE__ */ jsx13(TooltipContent, { children: "Formatting" })
    ] }) }),
    /* @__PURE__ */ jsx13(
      DropdownMenuContent,
      {
        className: "rounded space-y-0.5 min-w-48",
        align: "start",
        children: formatBlocks == null ? void 0 : formatBlocks.map((btn) => /* @__PURE__ */ jsxs5(
          DropdownMenuItem,
          {
            onClick: () => handleFormatChange == null ? void 0 : handleFormatChange(btn),
            className: cn(
              "rounded py-1",
              btn == null ? void 0 : btn.style,
              activeFormat === btn.label && "bg-accent"
            ),
            children: [
              btn.label,
              activeFormat === btn.label && /* @__PURE__ */ jsx13(Check, { className: "ml-auto size-4 text-blue-600" })
            ]
          },
          btn.cmd
        ))
      }
    )
  ] });
};
var StyleFormat = ({ buttons, onCommand, activeFormats }) => {
  return /* @__PURE__ */ jsx13(ToggleGroup, { type: "single", variant: "default", children: buttons == null ? void 0 : buttons.map((btn) => {
    return /* @__PURE__ */ jsx13(
      ToggleGroupItem,
      {
        value: btn.cmd,
        onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
        className: cn(
          "px-2 w-7 h-7 lg:w-8 lg:h-8",
          (activeFormats == null ? void 0 : activeFormats[btn.cmd]) && "bg-accent text-accent-foreground"
        ),
        children: /* @__PURE__ */ jsx13(ButtonWithTooltip, { label: btn.label, icon: btn.icon })
      },
      btn.cmd
    );
  }) });
};
var ResponsiveStyleFormat = ({ buttons, onCommand, activeFormats }) => {
  const containerRef = React3.useRef(null);
  const [visibleCount, setVisibleCount] = React3.useState(buttons.length);
  React3.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const containerWidth = container.clientWidth;
      const buttonWidth = 42;
      const maxButtons = Math.floor(containerWidth / buttonWidth);
      setVisibleCount((prev) => {
        if (maxButtons >= buttons.length) return buttons.length;
        if (maxButtons > prev) return prev + 1;
        if (maxButtons < prev) return Math.max(4, prev - 1);
        return prev;
      });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [buttons.length]);
  const visibleButtons = buttons.slice(0, visibleCount);
  return /* @__PURE__ */ jsx13("div", { ref: containerRef, className: "flex items-center transition-all", children: /* @__PURE__ */ jsx13(
    StyleFormat,
    {
      buttons: visibleButtons,
      onCommand,
      activeFormats
    }
  ) });
};
var TextAlign = ({ buttons, onCommand, activeFormats }) => {
  const activeAlign = (activeFormats == null ? void 0 : activeFormats.justifyCenter) ? "justifyCenter" : (activeFormats == null ? void 0 : activeFormats.justifyEnd) ? "justifyEnd" : "justifyStart";
  return /* @__PURE__ */ jsxs5(DropdownMenu, { children: [
    /* @__PURE__ */ jsx13(DropdownMenuTrigger, { className: "font-medium h-7 px-1.5 min-w-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground focus-visible:ring-0 focus:outline-0", children: /* @__PURE__ */ jsx13(
      ButtonWithTooltip,
      {
        label: "Text Align",
        icon: activeAlign,
        isArrow: true
      }
    ) }),
    /* @__PURE__ */ jsx13(DropdownMenuContent, { className: "w-full", children: buttons == null ? void 0 : buttons.map((btn) => {
      return /* @__PURE__ */ jsx13(
        DropdownMenuItem,
        {
          onClick: () => {
            console.log(btn.cmd);
            onCommand == null ? void 0 : onCommand(btn.cmd);
          },
          className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
          children: /* @__PURE__ */ jsx13(
            ButtonWithTooltip,
            {
              label: btn.label,
              icon: btn.icon,
              side: "left"
            }
          )
        },
        btn.cmd
      );
    }) })
  ] });
};
var MediaAndLink = ({ buttons, onCommand, mediaUrl, activeFormats }) => {
  const [linkOpen, setLinkOpen] = React3.useState(false);
  return /* @__PURE__ */ jsx13(ToggleGroup, { type: "single", variant: "default", children: buttons == null ? void 0 : buttons.map((btn) => {
    if (btn.cmd === "link") {
      return /* @__PURE__ */ jsx13(
        ToggleGroupItem,
        {
          value: btn.cmd,
          "data-state": btn.cmd === "link" && (activeFormats == null ? void 0 : activeFormats.link) ? "on" : "off",
          className: cn(
            "px-2 w-7 h-7 lg:w-8 lg:h-8",
            btn.cmd === "link" && (activeFormats == null ? void 0 : activeFormats.link) && "bg-accent text-accent-foreground"
          ),
          children: /* @__PURE__ */ jsxs5(DropdownMenu, { open: linkOpen, onOpenChange: setLinkOpen, children: [
            /* @__PURE__ */ jsx13(DropdownMenuTrigger, { className: "font-medium px-1 min-w-7 min-h-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground", children: /* @__PURE__ */ jsx13(
              ButtonWithTooltip,
              {
                label: btn.label,
                icon: btn.icon
              }
            ) }),
            /* @__PURE__ */ jsxs5(DropdownMenuContent, { align: "end", className: "min-w-64", children: [
              /* @__PURE__ */ jsx13(DropdownMenuLabel, { className: "px-1", children: "URL" }),
              /* @__PURE__ */ jsx13(
                Input,
                {
                  className: "h-7 py-2 px-2 rounded focus-visible:ring-0 focus-visible:outline-0",
                  size: 14
                }
              ),
              /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2 justify-end mt-1.5", children: [
                /* @__PURE__ */ jsx13(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setLinkOpen(!linkOpen),
                    size: "sm",
                    className: "rounded-sm",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx13(
                  Button,
                  {
                    onClick: () => setLinkOpen(!linkOpen),
                    size: "sm",
                    variant: "primary",
                    className: "rounded-sm",
                    children: "Insert"
                  }
                )
              ] })
            ] })
          ] })
        },
        btn.cmd
      );
    }
    return /* @__PURE__ */ jsx13(
      ToggleGroupItem,
      {
        value: btn.cmd,
        className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
        children: /* @__PURE__ */ jsx13(MediaHandler, { mediaUrl })
      },
      btn.cmd
    );
  }) });
};
var MediaHandler = ({
  onCommand,
  mediaUrl = false
}) => {
  const [open, setOpen] = React3.useState(false);
  const [imageUrl, setImageUrl] = React3.useState("");
  const [uploadedImage, setUploadedImage] = React3.useState(null);
  const [activeTab, setActiveTab] = React3.useState("upload");
  const [dbImages, setDbImages] = React3.useState([
    "https://picsum.photos/300/200?random=1",
    "https://picsum.photos/300/200?random=2",
    "https://picsum.photos/300/200?random=3",
    "https://picsum.photos/300/200?random=4"
  ]);
  const handleFileUpload = (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a2;
      setUploadedImage((_a2 = e.target) == null ? void 0 : _a2.result);
    };
    reader.readAsDataURL(file);
  };
  const handleInsertImage = (url) => {
    onCommand == null ? void 0 : onCommand("image", url);
    setOpen(false);
    setImageUrl("");
    setUploadedImage(null);
  };
  return /* @__PURE__ */ jsxs5(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx13(DialogTrigger, { children: /* @__PURE__ */ jsx13(ButtonWithTooltip, { label: "Media", icon: "image" }) }),
    /* @__PURE__ */ jsxs5(DialogContent, { className: "sm:max-w-lg rounded-lg p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx13(DialogHeader, { className: "border-b px-4 py-3", children: /* @__PURE__ */ jsx13(DialogTitle, { className: "text-base font-semibold", children: "Add Image" }) }),
      /* @__PURE__ */ jsxs5(
        Tabs,
        {
          value: activeTab,
          onValueChange: setActiveTab,
          className: "w-full px-4 pb-4",
          children: [
            /* @__PURE__ */ jsxs5(TabsList, { className: "grid grid-cols-2 mb-3 rounded-md bg-muted", children: [
              /* @__PURE__ */ jsx13(TabsTrigger, { value: "upload", children: "Upload / URL" }),
              /* @__PURE__ */ jsx13(TabsTrigger, { value: "library", children: "From Library" })
            ] }),
            /* @__PURE__ */ jsx13(TabsContent, { value: "upload", children: /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsx13("div", { className: "flex flex-col items-center justify-center border border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary transition", children: !uploadedImage ? /* @__PURE__ */ jsxs5("div", { className: "relative flex flex-col items-center justify-center", children: [
                /* @__PURE__ */ jsx13(Upload, { className: "h-8 w-8 mb-2 text-muted-foreground" }),
                /* @__PURE__ */ jsx13("p", { className: "text-sm text-muted-foreground", children: "Click or drop image to upload" }),
                /* @__PURE__ */ jsx13(
                  Input,
                  {
                    type: "file",
                    accept: "image/*",
                    className: "opacity-0 absolute h-full w-full cursor-pointer",
                    onChange: handleFileUpload
                  }
                )
              ] }) : /* @__PURE__ */ jsxs5("div", { className: "flex flex-col items-center gap-2", children: [
                /* @__PURE__ */ jsx13(
                  "img",
                  {
                    src: uploadedImage,
                    alt: "Uploaded",
                    className: "max-h-48 rounded border object-contain"
                  }
                ),
                /* @__PURE__ */ jsx13(
                  Button,
                  {
                    size: "sm",
                    onClick: () => handleInsertImage(uploadedImage),
                    children: "Insert Image"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs5("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx13("p", { className: "text-xs text-muted-foreground", children: "Or insert via URL" }),
                /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx13(
                    Input,
                    {
                      placeholder: "https://example.com/image.jpg",
                      value: imageUrl,
                      onChange: (e) => setImageUrl(e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx13(
                    Button,
                    {
                      onClick: () => handleInsertImage(imageUrl),
                      disabled: !imageUrl,
                      children: "Insert"
                    }
                  )
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx13(TabsContent, { value: "library", children: /* @__PURE__ */ jsx13(ScrollArea, { className: "h-64 rounded border p-3", children: dbImages.length > 0 ? /* @__PURE__ */ jsx13("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: dbImages.map((img) => /* @__PURE__ */ jsxs5(
              "button",
              {
                onClick: () => handleInsertImage(img),
                className: "relative group rounded-md overflow-hidden border hover:ring-2 hover:ring-primary transition",
                children: [
                  /* @__PURE__ */ jsx13(
                    "img",
                    {
                      src: img,
                      alt: "DB",
                      className: "object-cover w-full h-28"
                    }
                  ),
                  /* @__PURE__ */ jsx13("div", { className: "absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition", children: /* @__PURE__ */ jsx13(ImageIcon, { className: "text-white w-5 h-5" }) })
                ]
              },
              img
            )) }) : /* @__PURE__ */ jsx13("p", { className: "text-sm text-muted-foreground text-center py-6", children: "No images available in library." }) }) })
          ]
        }
      )
    ] })
  ] });
};
var TextAdjust = React3.forwardRef((_a, ref) => {
  var _b = _a, { buttons, onCommand, className = "" } = _b, props = __objRest(_b, ["buttons", "onCommand", "className"]);
  return /* @__PURE__ */ jsx13("div", __spreadProps(__spreadValues({ ref }, props), { className: `shrink-0 ${className}`, children: /* @__PURE__ */ jsx13(ToggleGroup, { type: "single", variant: "default", children: buttons == null ? void 0 : buttons.map((btn) => /* @__PURE__ */ jsx13(
    ToggleGroupItem,
    {
      value: btn.cmd,
      onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
      className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
      children: /* @__PURE__ */ jsx13(ButtonWithTooltip, { label: btn.label, icon: btn.icon })
    },
    btn.cmd
  )) }) }));
});
TextAdjust.displayName = "TextAdjust";
var MoreTools = ({
  show,
  onShow,
  tools,
  showTools
}) => {
  const [_all, _setAll] = React3.useState([]);
  React3.useEffect(() => {
    if (!tools) return;
    const uniqueTools = /* @__PURE__ */ new Set();
    Object.entries(tools).forEach(([key, value]) => {
      const isHidden = showTools == null ? void 0 : showTools.includes(key);
      if (isHidden && value) {
        value.forEach((item) => uniqueTools.add(item));
      }
    });
    _setAll(Array.from(uniqueTools));
  }, [tools, showTools]);
  return /* @__PURE__ */ jsxs5(Popover, { open: show, onOpenChange: onShow, children: [
    /* @__PURE__ */ jsx13(PopoverTrigger, { className: "font-medium cursor-pointer h-7 px-1.5 min-w-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground", children: /* @__PURE__ */ jsx13(ButtonWithTooltip, { label: "More..", icon: "moreHorizontal" }) }),
    /* @__PURE__ */ jsxs5(
      PopoverContent,
      {
        align: "end",
        className: "p-0 px-1 py-1 rounded flex flex-wrap items-center gap-2",
        children: [
          (_all == null ? void 0 : _all.length) > 0 && _all.map((item) => /* @__PURE__ */ jsx13(Toggle, { className: "w-7 h-7 lg:w-8 lg:h-8 rounded", children: /* @__PURE__ */ jsx13(ButtonWithTooltip, { label: item.label, icon: item.icon }) }, item.cmd)),
          /* @__PURE__ */ jsx13(Toggle, { className: "w-7 h-7 lg:w-8 lg:h-8 rounded", children: /* @__PURE__ */ jsx13(ButtonWithTooltip, { label: "Reset", icon: "reset" }) })
        ]
      }
    )
  ] });
};

// src/components/editor/ToolbarSection.tsx
import * as React4 from "react";
import { jsx as jsx14 } from "react/jsx-runtime";
var ToolbarSection = React4.forwardRef((_a, ref) => {
  var _b = _a, { section, className = "", children } = _b, props = __objRest(_b, ["section", "className", "children"]);
  return /* @__PURE__ */ jsx14(
    "div",
    __spreadProps(__spreadValues({
      ref,
      "data-section": section,
      className: `flex items-center shrink-0 ${className}`
    }, props), {
      children
    })
  );
});
ToolbarSection.displayName = "ToolbarSection";

// src/components/editor/toolbar/toolbar.ts
var allTools = {
  historyTabs: [
    { cmd: "undo", label: "Undo", icon: "undo" },
    { cmd: "redo", label: "Redo", icon: "redo" }
  ],
  textFormatTabs: [
    {
      cmd: "formatBlock:p",
      label: "Paragraph",
      style: "text-base text-gray-800"
    },
    {
      cmd: "formatBlock:h1",
      label: "Heading 1",
      style: "text-2xl font-bold text-gray-900 leading-tight"
    },
    {
      cmd: "formatBlock:h2",
      label: "Heading 2",
      style: "text-xl font-semibold text-gray-900 leading-tight"
    },
    {
      cmd: "formatBlock:h3",
      label: "Heading 3",
      style: "text-lg font-semibold text-gray-900 leading-tight"
    },
    {
      cmd: "formatBlock:h4",
      label: "Heading 4",
      style: "text-base font-medium text-gray-900 leading-tight"
    },
    {
      cmd: "formatBlock:h5",
      label: "Heading 5",
      style: "text-sm font-medium text-gray-900 leading-tight"
    },
    {
      cmd: "formatBlock:h6",
      label: "Heading 6",
      style: "text-xs font-medium text-gray-900 leading-tight"
    },
    {
      cmd: "formatBlock:blockquote",
      label: "Blockquote",
      style: "pl-3 border-l-2 border-gray-400 italic text-gray-600 leading-snug"
    }
  ],
  textStyleTabs: [
    { cmd: "bold", label: "Bold", icon: "bold" },
    { cmd: "italic", label: "Italic", icon: "italic" },
    { cmd: "underline", label: "Underline", icon: "underline" },
    { cmd: "color", label: "Color", icon: "palette" }
  ],
  textAlignTabs: [
    { cmd: "justifyStart", label: "Start", icon: "justifyStart" },
    { cmd: "justifyCenter", label: "Center", icon: "justifyCenter" },
    { cmd: "justifyEnd", label: "End", icon: "justifyEnd" }
  ],
  mediaAndLinksTabs: [
    { cmd: "link", label: "Link", icon: "link" },
    { cmd: "image", label: "Image", icon: "image" }
  ],
  textAdjustTabs: [
    { cmd: "orderedList", label: "List", icon: "orderList" },
    { cmd: "unorderedList", label: "Bullet List", icon: "list" }
  ],
  extraTabs: [
    { cmd: "indent", label: "Indent", icon: "indent" },
    { cmd: "outdent", label: "Outdent", icon: "outdent" },
    { cmd: "table", label: "Table", icon: "table" },
    { cmd: "superScript", label: "Super Script", icon: "superscript" }
  ]
};

// src/components/editor/toolbar/main.tsx
import { jsx as jsx15, jsxs as jsxs6 } from "react/jsx-runtime";
var TOOL_SECTIONS = [
  "historyTabs",
  "textFormatTabs",
  "textStyleTabs",
  "textAlignTabs",
  "mediaAndLinksTabs",
  "textAdjustTabs",
  "extraTabs"
];
var Toolbar = ({ formatting, onCommand, mediaUrl, activeFormats }) => {
  var _a;
  const [_open, _setOpen] = React5.useState(false);
  const containerRef = React5.useRef(null);
  const sectionRefs = React5.useRef(
    {
      historyTabs: null,
      textFormatTabs: null,
      textStyleTabs: null,
      textAlignTabs: null,
      mediaAndLinksTabs: null,
      textAdjustTabs: null,
      extraTabs: null
    }
  );
  const [hidden, setHidden] = React5.useState([]);
  React5.useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const measure = () => {
      const containerWidth = container.clientWidth;
      const reserved = 64;
      let used = 0;
      const visible = [];
      for (const key of TOOL_SECTIONS) {
        const el = sectionRefs.current[key];
        if (!el) continue;
        const width = el.offsetWidth;
        if (used + width + reserved < containerWidth) {
          visible.push(key);
          used += width;
        } else {
          break;
        }
      }
      const newlyHidden = TOOL_SECTIONS.filter(
        (k) => !visible.includes(k)
      ).reverse();
      setHidden(
        (prev) => JSON.stringify(prev) === JSON.stringify(newlyHidden) ? prev : newlyHidden
      );
    };
    const ro = new ResizeObserver(() => {
      window.requestAnimationFrame(measure);
    });
    ro.observe(container);
    window.addEventListener("resize", measure);
    const id = window.requestAnimationFrame(measure);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);
  const show = (sec) => !hidden.includes(sec);
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      ref: containerRef,
      className: "relative flex items-center bg-muted/30 px-2 py-1 overflow-hidden transition-all duration-200\n                 after:pointer-events-none after:absolute after:right-10 after:top-0 after:h-full after:w-6\n                 after:bg-linear-to-l after:from-muted/25 after:to-transparent",
      "aria-label": "Editor Toolbar",
      children: [
        /* @__PURE__ */ jsxs6(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.historyTabs = el;
            },
            section: "historyTabs",
            className: `${show("historyTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: [
              /* @__PURE__ */ jsx15(HistoryFormat, { buttons: (_a = allTools) == null ? void 0 : _a.historyTabs, onCommand }),
              /* @__PURE__ */ jsx15(Space, {})
            ]
          }
        ),
        /* @__PURE__ */ jsx15(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.textFormatTabs = el;
            },
            section: "textFormatTabs",
            className: `${show("textFormatTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: /* @__PURE__ */ jsx15(
              TextFormat,
              {
                formatting,
                buttons: allTools.textFormatTabs,
                onFormat: (f) => onCommand == null ? void 0 : onCommand(f),
                activeFormats
              }
            )
          }
        ),
        /* @__PURE__ */ jsx15(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.textStyleTabs = el;
            },
            section: "textStyleTabs",
            className: `${show("textStyleTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: /* @__PURE__ */ jsx15(
              ResponsiveStyleFormat,
              {
                buttons: allTools.textStyleTabs,
                onCommand,
                activeFormats
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs6(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.textAlignTabs = el;
            },
            section: "textAlignTabs",
            className: `${show("textAlignTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: [
              /* @__PURE__ */ jsx15(Space, {}),
              /* @__PURE__ */ jsx15(
                TextAlign,
                {
                  buttons: allTools.textAlignTabs,
                  onCommand,
                  activeFormats
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs6(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.mediaAndLinksTabs = el;
            },
            section: "mediaAndLinksTabs",
            className: `${show("mediaAndLinksTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: [
              /* @__PURE__ */ jsx15(Space, {}),
              /* @__PURE__ */ jsx15(
                MediaAndLink,
                {
                  buttons: allTools.mediaAndLinksTabs,
                  onCommand,
                  mediaUrl,
                  activeFormats: activeFormats != null ? activeFormats : {}
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs6(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.textAdjustTabs = el;
            },
            section: "textAdjustTabs",
            className: `${show("textAdjustTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: [
              /* @__PURE__ */ jsx15(Space, {}),
              /* @__PURE__ */ jsx15(TextAdjust, { buttons: allTools.textAdjustTabs, onCommand })
            ]
          }
        ),
        /* @__PURE__ */ jsxs6("div", { className: "mr-auto pr-1 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx15(Space, {}),
          /* @__PURE__ */ jsx15(
            MoreTools,
            {
              tools: allTools,
              showTools: hidden,
              show: _open,
              onShow: () => _setOpen(!_open)
            }
          )
        ] })
      ]
    }
  );
};

// src/components/ui/skeleton.tsx
import { jsx as jsx16 } from "react/jsx-runtime";
function Skeleton(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx16(
    "div",
    __spreadValues({
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className)
    }, props)
  );
}

// src/components/editor/loader.tsx
import { jsx as jsx17, jsxs as jsxs7 } from "react/jsx-runtime";
var EditorSkeleton = ({
  animation = "pulse"
}) => {
  const base = "w-full bg-muted";
  const animationClass = animation === "shine" ? "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent" : "animate-pulse";
  return /* @__PURE__ */ jsxs7(
    "div",
    {
      className: `border border-border w-full rounded-md overflow-hidden bg-background ${animationClass}`,
      children: [
        /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2 relative px-2 py-1", children: [
          [1, 2, 3, 4, 5, 6, 7, 8].map((width) => /* @__PURE__ */ jsx17(
            Skeleton,
            {
              className: `${base} h-7 ${width === 3 ? "w-16 lg:w-20" : "w-7 lg:w-8"}  lg:h-8`
            },
            width
          )),
          /* @__PURE__ */ jsx17(Skeleton, { className: "absolute right-1" })
        ] }),
        /* @__PURE__ */ jsx17("div", { className: "h-px bg-border" }),
        /* @__PURE__ */ jsx17("div", { className: `${base} h-64` })
      ]
    }
  );
};

// src/components/editor/editor.tsx
import { jsx as jsx18, jsxs as jsxs8 } from "react/jsx-runtime";
var RichtextEditor = ({
  initialContent = "Start typing...",
  toolbar,
  loader = "skeleton"
}) => {
  const editorRef = React6.useRef(null);
  const [isMounted, setIsMounted] = React6.useState(false);
  const [isFocused, setIsFocused] = React6.useState(false);
  const [activeFormats, setActiveFormats] = React6.useState(
    {
      block: "p"
    }
  );
  React6.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);
  React6.useEffect(() => {
    const handleFormatChange = (e) => setActiveFormats(e.detail);
    window.addEventListener("editor-format-change", handleFormatChange);
    return () => window.removeEventListener("editor-format-change", handleFormatChange);
  }, []);
  React6.useEffect(() => {
    var _a, _b;
    if (!editorRef.current) return;
    const unsubFocus = (_a = editorRef.current) == null ? void 0 : _a.subscribeFocus(
      () => setIsFocused(true)
    );
    const unsubBlur = (_b = editorRef.current) == null ? void 0 : _b.subscribeBlur(
      () => setIsFocused(false)
    );
    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [isMounted]);
  const handleCommand = (cmd, value) => {
    var _a;
    (_a = editorRef.current) == null ? void 0 : _a.handleCommand(cmd, value);
  };
  if (!isMounted) return /* @__PURE__ */ jsx18(EditorSkeleton, {});
  return /* @__PURE__ */ jsxs8(
    "div",
    {
      className: cn(
        "border border-border w-full rounded-md overflow-hidden bg-inherit transition-all duration-300",
        isFocused && "ring-1 ring-blue-500"
      ),
      children: [
        /* @__PURE__ */ jsx18(
          Toolbar,
          __spreadProps(__spreadValues({}, toolbar), {
            onCommand: handleCommand,
            activeFormats
          })
        ),
        /* @__PURE__ */ jsx18(EditorFrame, { ref: editorRef, initialContent })
      ]
    }
  );
};

// src/components/richtext/provider.tsx
import React7, {
  createContext as createContext2,
  useContext as useContext2,
  useRef as useRef5,
  useState as useState5,
  useEffect as useEffect5,
  useCallback
} from "react";
import { jsx as jsx19 } from "react/jsx-runtime";
var defaultCtx = {
  block: "P",
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  orderedList: false,
  unorderedList: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false,
  link: false,
  foreColor: "",
  backColor: "",
  isHeading1: false,
  isHeading2: false,
  isHeading3: false,
  isHeading4: false,
  isHeading5: false,
  isHeading6: false,
  isParagraph: true,
  isBlockquote: false,
  isCodeBlock: false,
  canUndo: false,
  canRedo: false,
  isIndented: false
};
var EditorContext = createContext2(null);
var EditorProvider = ({
  children
}) => {
  const iframeRef = useRef5(null);
  const [html, setHtml] = useState5("<p>Start typing\u2026</p>");
  const [ctx, setCtx] = useState5(defaultCtx);
  const refreshCtx = useCallback(() => {
    var _a;
    const win = (_a = iframeRef.current) == null ? void 0 : _a.contentWindow;
    if (!win) return;
    const doc = win.document;
    if (!doc) return;
    const block = (doc.queryCommandValue("formatBlock") || "P").toUpperCase();
    setCtx((prev) => __spreadProps(__spreadValues({}, prev), {
      block,
      bold: doc.queryCommandState("bold"),
      italic: doc.queryCommandState("italic"),
      underline: doc.queryCommandState("underline"),
      strike: doc.queryCommandState("strikeThrough"),
      orderedList: doc.queryCommandState("insertOrderedList"),
      unorderedList: doc.queryCommandState("insertUnorderedList"),
      justifyLeft: doc.queryCommandState("justifyLeft"),
      justifyCenter: doc.queryCommandState("justifyCenter"),
      justifyRight: doc.queryCommandState("justifyRight"),
      link: doc.queryCommandState("createLink"),
      foreColor: doc.queryCommandValue("foreColor") || "",
      backColor: doc.queryCommandValue("hiliteColor") || "",
      isHeading1: block === "H1",
      isHeading2: block === "H2",
      isHeading3: block === "H3",
      isHeading4: block === "H4",
      isHeading5: block === "H5",
      isHeading6: block === "H6",
      isParagraph: block === "P",
      isBlockquote: block === "BLOCKQUOTE",
      isCodeBlock: block === "PRE"
    }));
  }, [iframeRef]);
  useEffect5(() => {
    const onMessage = (e) => {
      const d = e.data || {};
      if (d.type === "UPDATE") setHtml(d.html);
      if (d.type === "CONTEXT") {
        setCtx((prev) => __spreadValues(__spreadValues({}, prev), d));
      }
      if (d.type === "IFRAME_ERROR") console.error("Iframe error:", d.message);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  React7.useEffect(() => {
    const handleMessage = (e) => {
      const _a = e.data, { type } = _a, data = __objRest(_a, ["type"]);
      if (type === "UNDO_REDO_STATE") {
        setCtx((prev) => __spreadProps(__spreadValues({}, prev), {
          canUndo: !!data.canUndo,
          canRedo: !!data.canRedo
        }));
      }
      if (type === "CONTEXT") {
        setCtx((prev) => __spreadValues(__spreadValues({}, prev), data));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  return /* @__PURE__ */ jsx19(
    EditorContext.Provider,
    {
      value: {
        html,
        setHtml,
        ctx,
        setCtx,
        iframeRef,
        refreshCtx
      },
      children
    }
  );
};
var useEditor = () => {
  const ctx = useContext2(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside <EditorProvider>");
  return ctx;
};

// src/components/richtext/toolbar/ToolbarChain.tsx
import * as React15 from "react";

// src/core/chain.ts
var EditorChain = class {
  constructor(target) {
    this.queue = [];
    this.target = target;
  }
  post(msg) {
    if (!this.target) return;
    this.queue.push(msg);
    return this;
  }
  // Executes queued commands in order
  run() {
    if (!this.target) return;
    for (const msg of this.queue) this.target.postMessage(msg, "*");
    this.queue = [];
  }
  // Inline commands
  exec(cmd, value) {
    return this.post({ type: "EXEC", cmd, value });
  }
  undo() {
    var _a;
    (_a = this.target) == null ? void 0 : _a.postMessage({ type: "EXEC", cmd: "undo" }, "*");
    return this;
  }
  redo() {
    var _a;
    (_a = this.target) == null ? void 0 : _a.postMessage({ type: "EXEC", cmd: "redo" }, "*");
    return this;
  }
  bold() {
    return this.exec("bold");
  }
  italic() {
    return this.exec("italic");
  }
  underline() {
    return this.exec("underline");
  }
  strike() {
    return this.exec("strikeThrough");
  }
  // Block formats
  heading(level) {
    return this.post({ type: "FORMAT_BLOCK", block: `H${level}` });
  }
  paragraph() {
    return this.post({ type: "FORMAT_BLOCK", block: "P" });
  }
  quote() {
    return this.post({ type: "FORMAT_BLOCK", block: "BLOCKQUOTE" });
  }
  codeBlock() {
    return this.post({ type: "FORMAT_BLOCK", block: "PRE" });
  }
  // Lists
  bulletList() {
    return this.exec("insertUnorderedList");
  }
  orderedList() {
    return this.exec("insertOrderedList");
  }
  indent() {
    var _a;
    (_a = this.target) == null ? void 0 : _a.postMessage({ type: "CUSTOM_INDENT" }, "*");
    return this;
  }
  outdent() {
    var _a;
    (_a = this.target) == null ? void 0 : _a.postMessage({ type: "CUSTOM_OUTDENT" }, "*");
    return this;
  }
  // Align
  alignLeft() {
    return this.exec("justifyLeft");
  }
  alignCenter() {
    return this.exec("justifyCenter");
  }
  alignRight() {
    return this.exec("justifyRight");
  }
  // Colors
  color(value) {
    return this.exec("foreColor", value);
  }
  highlight(value) {
    return this.exec("hiliteColor", value);
  }
  // Links
  link(url) {
    return this.exec("createLink", url);
  }
  unlink() {
    return this.exec("unlink");
  }
  // Raw HTML
  insertHTML(html) {
    return this.post({ type: "INSERT_HTML", html });
  }
  setHTML(html) {
    return this.post({ type: "SET_HTML", html });
  }
  insertTable(rows, cols) {
    var _a;
    (_a = this.target) == null ? void 0 : _a.postMessage({ type: "INSERT_TABLE", rows, cols }, "*");
    return this;
  }
  // Helpers
  clear() {
    return this.exec("removeFormat");
  }
};

// src/components/richtext/toolbar/ToolbarChain.tsx
import { Ban, Minus } from "lucide-react";

// src/components/richtext/ui/table-picker.tsx
import { Table } from "lucide-react";
import * as React9 from "react";

// src/components/richtext/toolbar/toolbar.tsx
import * as React8 from "react";
import { jsx as jsx20, jsxs as jsxs9 } from "react/jsx-runtime";
var ToolbarWrapper = React8.forwardRef(
  (_a, ref) => {
    var _b = _a, { children, className } = _b, props = __objRest(_b, ["children", "className"]);
    return /* @__PURE__ */ jsx20("div", __spreadProps(__spreadValues({ ref, className: cn("flex items-center", className) }, props), { children }));
  }
);
ToolbarWrapper.displayName = "ToolbarWrapper";
var ToolbarGroup = React8.forwardRef(
  (_a, ref) => {
    var _b = _a, { children, className } = _b, props = __objRest(_b, ["children", "className"]);
    return /* @__PURE__ */ jsx20(
      "div",
      __spreadProps(__spreadValues({
        ref,
        className: cn("flex items-center gap-1", className)
      }, props), {
        children
      })
    );
  }
);
ToolbarGroup.displayName = "ToolbarGroup";
var ToolbarButtonSeparator = ({
  orientation = "vertical"
}) => {
  return /* @__PURE__ */ jsx20(
    Separator,
    {
      orientation,
      role: "separator",
      style: { height: "2rem" },
      className: "border border-border border-l-0 border-y-0 w-px"
    }
  );
};
var ToolbarButton = React8.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      children,
      onClick,
      active = false,
      toolButtonSize = "sm",
      tooltip,
      className
    } = _b, props = __objRest(_b, [
      "children",
      "onClick",
      "active",
      "toolButtonSize",
      "tooltip",
      "className"
    ]);
    const sizeClasses = {
      sm: { style: "px-3 py-1 rounded-sm", size: "icon-sm" },
      md: { style: "px-4 py-2 rounded-md", size: "icon" },
      xs: { style: "px-2 py-0.5 rounded", size: "icon-xs" }
    };
    const { style, size } = sizeClasses[toolButtonSize];
    const button = /* @__PURE__ */ jsx20(
      Button,
      __spreadProps(__spreadValues({
        size,
        onMouseDown: (e) => e.preventDefault(),
        onClick,
        variant: "outline",
        ref,
        "data-active": active,
        className: cn(
          `rounded border cursor-pointer text-sm disabled:cursor-not-allowed data-[active=true]:bg-accent data-[active=true]:text-foreground text-foreground/80 hover:text-foreground`,
          className,
          style
        )
      }, props), {
        children
      })
    );
    if (!tooltip) return button;
    return /* @__PURE__ */ jsx20(TooltipProvider, { delayDuration: 250, children: /* @__PURE__ */ jsxs9(Tooltip, { children: [
      /* @__PURE__ */ jsx20(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ jsx20(
        TooltipContent,
        {
          side: "top",
          align: "end",
          className: "text-xs font-medium",
          children: tooltip
        }
      )
    ] }) });
  }
);
ToolbarButton.displayName = "ToolbarButton";

// src/components/richtext/ui/table-picker.tsx
import { jsx as jsx21, jsxs as jsxs10 } from "react/jsx-runtime";
var TablePicker = React9.forwardRef((_a, ref) => {
  var _b = _a, { onSelect } = _b, buttonProps = __objRest(_b, ["onSelect"]);
  const [open, setOpen] = React9.useState(false);
  const [table, setTable] = React9.useState({ rows: 2, cols: 2 });
  const maxRows = 10;
  const maxCols = 10;
  return /* @__PURE__ */ jsxs10(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx21(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx21(
      ToolbarButton,
      __spreadProps(__spreadValues({
        ref,
        toolButtonSize: "xs",
        tooltip: "Insert Table",
        "data-active": open
      }, buttonProps), {
        children: /* @__PURE__ */ jsx21(Table, {})
      })
    ) }),
    /* @__PURE__ */ jsxs10(PopoverContent, { children: [
      Array.from({ length: maxRows }).map((_, r) => /* @__PURE__ */ jsx21("div", { className: "flex space-y-0.5 space-x-0.5 mx-auto w-full", children: Array.from({ length: maxCols }).map((_2, c) => {
        const active = r <= table.rows && c <= table.cols;
        return /* @__PURE__ */ jsx21(
          "div",
          {
            onMouseEnter: () => setTable({ rows: r, cols: c }),
            onClick: () => {
              onSelect == null ? void 0 : onSelect(r + 1, c + 1);
              setOpen(false);
            },
            "data-active": active,
            className: `w-5 h-5 border cursor-pointer bg-transparent hover:bg-gray-200 data-[active=true]:ring-1 data-[active=true]:ring-blue-500 data-[active=true]:bg-accent`
          },
          c
        );
      }) }, r)),
      /* @__PURE__ */ jsx21(Separator, { className: "w-full" }),
      /* @__PURE__ */ jsxs10("div", { className: "text-xs text-muted-foreground mt-2", children: [
        table.rows + 1,
        " \xD7 ",
        table.cols + 1
      ] })
    ] })
  ] });
});
TablePicker.displayName = "TablePicker";

// src/hooks/chain-execute.ts
import * as React10 from "react";
function useEditorChain() {
  const { iframeRef } = useEditor();
  const [chain, setChain] = React10.useState(null);
  React10.useEffect(() => {
    var _a;
    const win = (_a = iframeRef.current) == null ? void 0 : _a.contentWindow;
    if (win && !chain) {
      setChain(new EditorChain(win));
    }
  }, [iframeRef, chain]);
  const execute = React10.useCallback(
    (action, ...args) => {
      if (!chain) return;
      const fn = chain[action];
      if (typeof fn === "function") {
        const result = fn.apply(chain, args);
        if (result == null ? void 0 : result.run) result.run();
      } else {
        console.warn(`No chain method found for: ${action}`);
      }
    },
    [chain]
  );
  return { chain, execute };
}

// src/components/richtext/ui/history.tsx
import { Redo2 as Redo22, Undo2 as Undo22 } from "lucide-react";
import { jsx as jsx22, jsxs as jsxs11 } from "react/jsx-runtime";
var HistorySection = ({
  ctx,
  size = "sm"
}) => {
  const { execute } = useEditorChain();
  return /* @__PURE__ */ jsxs11(ToolbarGroup, { children: [
    /* @__PURE__ */ jsx22(
      ToolbarButton,
      {
        tooltip: "Undo",
        disabled: !ctx.canUndo,
        onClick: () => execute("undo"),
        toolButtonSize: size,
        className: "rounded",
        children: /* @__PURE__ */ jsx22(Undo22, {})
      }
    ),
    /* @__PURE__ */ jsx22(
      ToolbarButton,
      {
        tooltip: "Redo",
        toolButtonSize: size,
        disabled: !ctx.canRedo,
        onClick: () => execute("redo"),
        className: "rounded",
        children: /* @__PURE__ */ jsx22(Redo22, {})
      }
    )
  ] });
};

// src/components/richtext/ui/text-style.tsx
import * as React12 from "react";
import { Bold as Bold2, Italic as Italic2, Palette as Palette2, Underline as Underline2 } from "lucide-react";

// src/components/richtext/ui/color-picker.tsx
import * as React11 from "react";
import { SketchPicker } from "react-color";
import { Check as Check2 } from "lucide-react";
import { jsx as jsx23, jsxs as jsxs12 } from "react/jsx-runtime";
var ColorHighlighter = React11.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      color,
      onChange,
      disabled,
      className,
      isBack,
      onChangeIsBackground,
      icon,
      size = "sm"
    } = _b, props = __objRest(_b, [
      "color",
      "onChange",
      "disabled",
      "className",
      "isBack",
      "onChangeIsBackground",
      "icon",
      "size"
    ]);
    const [isOpen, setIsOpen] = React11.useState(false);
    const [tempColor, setTempColor] = React11.useState(color || "#000000");
    const IconComponent = icon || Check2;
    const handleChange = (clr) => {
      setTempColor(clr.hex);
    };
    const handleComplete = (clr) => {
      setTempColor(clr.hex);
      onChange == null ? void 0 : onChange(clr.hex);
    };
    return /* @__PURE__ */ jsxs12(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ jsx23(
        PopoverTrigger,
        {
          className: cn(
            "px-0.5 p-0 flex items-center data-[state=open]:bg-accent",
            className
          ),
          ref,
          disabled,
          asChild: true,
          children: /* @__PURE__ */ jsx23(ToolbarButton, __spreadProps(__spreadValues({ toolButtonSize: size, tooltip: "Color" }, props), { children: /* @__PURE__ */ jsx23(IconComponent, { color: "currentColor" }) }))
        }
      ),
      /* @__PURE__ */ jsx23(
        PopoverContent,
        {
          className: "p-2 w-[260px] bg-background shadow-lg border border-border rounded",
          align: "end",
          children: /* @__PURE__ */ jsxs12(
            Tabs,
            {
              value: isBack,
              onValueChange: (value) => onChangeIsBackground == null ? void 0 : onChangeIsBackground(value),
              children: [
                /* @__PURE__ */ jsxs12(TabsList, { className: "w-full rounded bg-accent", children: [
                  /* @__PURE__ */ jsx23(
                    TabsTrigger,
                    {
                      value: "text",
                      className: "w-full cursor-pointer rounded",
                      children: "Text"
                    }
                  ),
                  /* @__PURE__ */ jsx23(
                    TabsTrigger,
                    {
                      value: "background",
                      className: "w-full cursor-pointer rounded",
                      children: "Background"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx23(TabsContent, { value: "text", children: /* @__PURE__ */ jsx23(
                  Picker,
                  {
                    handleChange,
                    handleComplete,
                    color: tempColor
                  }
                ) }),
                /* @__PURE__ */ jsx23(TabsContent, { value: "background", children: /* @__PURE__ */ jsx23(
                  Picker,
                  {
                    handleChange,
                    handleComplete,
                    color: tempColor
                  }
                ) })
              ]
            }
          )
        }
      )
    ] });
  }
);
ColorHighlighter.displayName = "ColorHighlighter";
function Picker({
  handleChange,
  handleComplete,
  color
}) {
  return /* @__PURE__ */ jsx23(
    SketchPicker,
    {
      color,
      onChange: handleChange,
      onChangeComplete: handleComplete,
      disableAlpha: true,
      presetColors: [
        "#4F46E5",
        "#7C3AED",
        "#EC4899",
        "#F43F5E",
        "#EF4444",
        "#F97316",
        "#F59E0B",
        "#10B981",
        "#06B6D4",
        "#0EA5E9",
        "#3B82F6",
        "#64748B",
        "#000000",
        "#FFFFFF"
      ],
      styles: {
        default: {
          picker: {
            padding: "0px",
            maxWidth: "100%",
            width: "250px",
            background: "inherit",
            boxShadow: "none",
            borderRadius: "12px",
            cursor: "pointer"
          },
          saturation: {
            borderRadius: "6px",
            marginBottom: "12px",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.05)"
          },
          controls: {
            display: "flex",
            justifyContent: "space-between",
            color: "inherit"
          },
          color: {
            color: "inherit",
            background: "#000",
            borderRadius: "6px"
          },
          activeColor: {
            borderRadius: "8px",
            border: "1px solid #444"
          },
          hue: {
            color: "inherit",
            height: "12px",
            borderRadius: "8px"
          }
        }
      }
    }
  );
}

// src/components/richtext/ui/text-style.tsx
import { jsx as jsx24, jsxs as jsxs13 } from "react/jsx-runtime";
var styleButtons = [
  {
    type: "bold",
    cmd: "bold",
    tooltip: "Bold",
    icon: /* @__PURE__ */ jsx24(Bold2, {}),
    activeKey: "bold",
    action_type: "button"
  },
  {
    type: "italic",
    cmd: "italic",
    tooltip: "Italic",
    icon: /* @__PURE__ */ jsx24(Italic2, {}),
    activeKey: "italic",
    action_type: "button"
  },
  {
    type: "underline",
    cmd: "underline",
    tooltip: "Underline",
    icon: /* @__PURE__ */ jsx24(Underline2, {}),
    activeKey: "underline",
    action_type: "button"
  }
];
var StyleFormatSection = ({
  ctx,
  size = "sm",
  highlighter = true
}) => {
  const [isBackground, setIsBackground] = React12.useState("text");
  const { execute } = useEditorChain();
  const handleUpdateColor = (color) => {
    const cmd = isBackground === "text" ? "color" : "highlight";
    execute(cmd, color);
  };
  return /* @__PURE__ */ jsxs13(ToolbarGroup, { children: [
    styleButtons.map((btn) => /* @__PURE__ */ jsx24(
      ToolbarButton,
      {
        tooltip: btn.tooltip,
        onClick: () => execute(btn.cmd),
        active: Boolean(ctx[btn.activeKey]),
        toolButtonSize: size,
        children: btn.icon
      },
      btn.type
    )),
    highlighter && /* @__PURE__ */ jsx24(
      ColorHighlighter,
      {
        size: "xs",
        color: ctx.foreColor,
        icon: Palette2,
        onChange: handleUpdateColor,
        isBack: isBackground,
        onChangeIsBackground: () => setIsBackground(isBackground === "text" ? "background" : "text")
      }
    )
  ] });
};

// src/components/richtext/ui/text-format.tsx
import * as React13 from "react";
import {
  Check as Check3,
  ChevronDown as ChevronDown2,
  Code,
  Heading1 as Heading12,
  Heading2 as Heading22,
  Heading3 as Heading32,
  Heading4 as Heading42,
  Heading5 as Heading52,
  Heading6 as Heading62,
  Pilcrow as Pilcrow2,
  Quote as Quote2
} from "lucide-react";
import { jsx as jsx25, jsxs as jsxs14 } from "react/jsx-runtime";
var allFormats = [
  {
    type: "heading",
    cmd: "heading",
    args: [1],
    tooltip: "Heading 1",
    icon: /* @__PURE__ */ jsx25(Heading12, {}),
    activeKey: "isHeading1"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [2],
    tooltip: "Heading 2",
    icon: /* @__PURE__ */ jsx25(Heading22, {}),
    activeKey: "isHeading2"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [3],
    tooltip: "Heading 3",
    icon: /* @__PURE__ */ jsx25(Heading32, {}),
    activeKey: "isHeading3"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [4],
    tooltip: "Heading 4",
    icon: /* @__PURE__ */ jsx25(Heading42, {}),
    activeKey: "isHeading4"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [5],
    tooltip: "Heading 5",
    icon: /* @__PURE__ */ jsx25(Heading52, {}),
    activeKey: "isHeading5"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [6],
    tooltip: "Heading 6",
    icon: /* @__PURE__ */ jsx25(Heading62, {}),
    activeKey: "isHeading6"
  },
  {
    type: "paragraph",
    cmd: "paragraph",
    tooltip: "Paragraph",
    icon: /* @__PURE__ */ jsx25(Pilcrow2, {}),
    activeKey: "isParagraph"
  },
  {
    type: "blockquote",
    cmd: "quote",
    tooltip: "Blockquote",
    icon: /* @__PURE__ */ jsx25(Quote2, {}),
    activeKey: "isBlockquote"
  },
  {
    type: "code",
    cmd: "codeBlock",
    tooltip: "Code Block",
    icon: /* @__PURE__ */ jsx25(Code, {}),
    activeKey: "isCodeBlock"
  }
];
var TextFormatSection = ({
  ctx,
  format = {
    heading: [1, 2, 3],
    code: false,
    blockquote: false,
    paragraph: true
  },
  size = "sm"
}) => {
  const { execute } = useEditorChain();
  const visibleFormats = React13.useMemo(() => {
    return allFormats.filter((btn) => {
      var _a, _b;
      switch (btn.type) {
        case "heading":
          return (_b = format.heading) == null ? void 0 : _b.includes((_a = btn.args) == null ? void 0 : _a[0]);
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
    (btn) => ctx[btn.activeKey]
  );
  const currentLabel = (currentActive == null ? void 0 : currentActive.tooltip) || "Format";
  const sizeClasses = {
    sm: "px-2 h-8 text-sm gap-1.5",
    md: "px-3 h-9 text-base gap-2",
    xs: "px-1.5 h-7 text-xs gap-1"
  };
  return /* @__PURE__ */ jsxs14(DropdownMenu, { children: [
    /* @__PURE__ */ jsxs14(Tooltip, { children: [
      /* @__PURE__ */ jsx25(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs14(
        DropdownMenuTrigger,
        {
          className: `flex items-center justify-between gap-1 border border-border rounded ${sizeClasses[size]} text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:ring-1 focus-visible:ring-ring focus:outline-none min-w-[6rem]`,
          children: [
            currentLabel,
            /* @__PURE__ */ jsx25(ChevronDown2, { className: "w-4 h-4 opacity-70", strokeWidth: 2 })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx25(TooltipContent, { side: "bottom", children: "Select Text format" })
    ] }),
    /* @__PURE__ */ jsx25(DropdownMenuContent, { align: "center", className: "min-w-10 space-y-0.5", children: visibleFormats.map((btn) => {
      const active = Boolean(ctx[btn.activeKey]);
      return /* @__PURE__ */ jsxs14(
        DropdownMenuItem,
        {
          onClick: () => execute(btn.cmd, ...btn.args || []),
          "data-active": active,
          className: `flex hover:bg-muted/70 data-[active=true]:text-accent-foreground data-[active=true]:bg-accent items-center justify-between gap-2 px-2 py-1.5 cursor-pointer transition-colors ease-in-out duration-150`,
          children: [
            /* @__PURE__ */ jsxs14("span", { className: "flex items-center gap-2", children: [
              btn.icon,
              btn.tooltip
            ] }),
            active && /* @__PURE__ */ jsx25(Check3, { className: "w-4 h-4 text-blue-500" })
          ]
        },
        btn.tooltip
      );
    }) })
  ] });
};

// src/components/richtext/ui/list-selector.tsx
import { List as List3, ListOrdered as ListOrdered2 } from "lucide-react";
import { jsx as jsx26, jsxs as jsxs15 } from "react/jsx-runtime";
var ListSelectorSection = ({
  ctx,
  size = "sm"
}) => {
  const { execute } = useEditorChain();
  return /* @__PURE__ */ jsxs15(ToolbarGroup, { children: [
    /* @__PURE__ */ jsx26(
      ToolbarButton,
      {
        onClick: () => execute("bulletList"),
        active: ctx.unorderedList,
        toolButtonSize: size,
        tooltip: "Unordered List",
        children: /* @__PURE__ */ jsx26(List3, {})
      }
    ),
    /* @__PURE__ */ jsx26(
      ToolbarButton,
      {
        onClick: () => execute("orderedList"),
        active: ctx.orderedList,
        toolButtonSize: size,
        tooltip: "Ordered List",
        children: /* @__PURE__ */ jsx26(ListOrdered2, {})
      }
    )
  ] });
};

// src/components/richtext/ui/indent-outdent.tsx
import { jsx as jsx27, jsxs as jsxs16 } from "react/jsx-runtime";
var IndentOutdentSection = ({
  ctx,
  size
}) => {
  const { execute } = useEditorChain();
  console.log(ctx);
  return /* @__PURE__ */ jsxs16(ToolbarGroup, { children: [
    /* @__PURE__ */ jsx27(
      ToolbarButton,
      {
        toolButtonSize: size,
        disabled: ctx == null ? void 0 : ctx.isIndented,
        onClick: () => execute("indent"),
        children: /* @__PURE__ */ jsx27(Indent2, {})
      }
    ),
    /* @__PURE__ */ jsx27(
      ToolbarButton,
      {
        toolButtonSize: size,
        disabled: !(ctx == null ? void 0 : ctx.isIndented),
        onClick: () => execute("outdent"),
        children: /* @__PURE__ */ jsx27(Outdent2, {})
      }
    )
  ] });
};
var Indent2 = (_a) => {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsxs16(
    "svg",
    __spreadProps(__spreadValues({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16"
    }, props), {
      fill: "currentColor",
      children: [
        /* @__PURE__ */ jsx27("path", { d: "M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ jsx27("path", { d: "M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ jsx27("path", { d: "M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" }),
        /* @__PURE__ */ jsx27("path", { d: "M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ jsx27("path", { d: "M1 10.407c0 .473.55.755.96.493l3.765-2.408a.578.578 0 0 0 0-.985l-3.765-2.407c-.41-.262-.96.02-.96.493z" })
      ]
    })
  );
};
var Outdent2 = (_a) => {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsxs16(
    "svg",
    __spreadProps(__spreadValues({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16"
    }, props), {
      fill: "currentColor",
      children: [
        /* @__PURE__ */ jsx27("path", { d: "M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ jsx27("path", { d: "M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ jsx27("path", { d: "M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" }),
        /* @__PURE__ */ jsx27("path", { d: "M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ jsx27("path", { d: "M6 10.407c0 .473-.55.755-.96.493l-3.765-2.408a.578.578 0 0 1 0-.985l3.765-2.407c.41-.262.96.02.96.493z" })
      ]
    })
  );
};

// src/components/richtext/ui/text-aligner.tsx
import * as React14 from "react";
import { TextAlignStart as TextAlignStart2, TextAlignCenter as TextAlignCenter2, TextAlignEnd as TextAlignEnd2 } from "lucide-react";
import { jsx as jsx28, jsxs as jsxs17 } from "react/jsx-runtime";
var TextAlignerSection = ({
  size = "sm",
  ctx
}) => {
  var _a;
  const [_open, _setOpen] = React14.useState(false);
  const { execute } = useEditorChain();
  const alignOptions = [
    {
      cmd: "alignLeft",
      tooltip: "Align Left",
      icon: /* @__PURE__ */ jsx28(TextAlignStart2, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyLeft
    },
    {
      cmd: "alignCenter",
      tooltip: "Align Center",
      icon: /* @__PURE__ */ jsx28(TextAlignCenter2, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyCenter
    },
    {
      cmd: "alignRight",
      tooltip: "Align Right",
      icon: /* @__PURE__ */ jsx28(TextAlignEnd2, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyRight
    }
  ];
  const activeAlign = ((_a = alignOptions.find((a) => a.active)) == null ? void 0 : _a.icon) || /* @__PURE__ */ jsx28(TextAlignStart2, { className: "w-4 h-4" });
  return /* @__PURE__ */ jsxs17(DropdownMenu, { open: _open, onOpenChange: _setOpen, children: [
    /* @__PURE__ */ jsx28(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx28(
      ToolbarButton,
      {
        tooltip: "Text Alignment",
        "data-active": _open,
        toolButtonSize: size,
        children: activeAlign
      }
    ) }),
    /* @__PURE__ */ jsx28(
      DropdownMenuContent,
      {
        align: "center",
        className: "flex gap-1 p-2 min-w-0 bg-background/95 backdrop-blur-md rounded shadow-sm border",
        children: alignOptions.map((opt) => /* @__PURE__ */ jsx28(
          ToolbarButton,
          {
            tooltip: opt.tooltip,
            toolButtonSize: "sm",
            active: opt.active,
            onClick: () => {
              execute(opt.cmd);
              _setOpen(!_open);
            },
            children: opt.icon
          },
          opt.cmd
        ))
      }
    )
  ] });
};

// src/components/richtext/toolbar/ToolbarChain.tsx
import { jsx as jsx29, jsxs as jsxs18 } from "react/jsx-runtime";
var ToolbarChain = () => {
  const { iframeRef, ctx } = useEditor();
  const [chain, setChain] = React15.useState(null);
  React15.useEffect(() => {
    const timer = setInterval(() => {
      var _a;
      if (((_a = iframeRef.current) == null ? void 0 : _a.contentWindow) && !chain) {
        setChain(new EditorChain(iframeRef.current.contentWindow));
      }
    }, 500);
    return () => clearInterval(timer);
  }, [iframeRef, chain]);
  return /* @__PURE__ */ jsxs18(ToolbarWrapper, { className: "flex flex-wrap gap-2 border-b pb-2 mb-3", children: [
    /* @__PURE__ */ jsx29(HistorySection, { ctx, size: "xs" }),
    /* @__PURE__ */ jsx29(ToolbarButtonSeparator, { orientation: "vertical" }),
    /* @__PURE__ */ jsx29(TextFormatSection, { ctx, size: "xs" }),
    /* @__PURE__ */ jsx29(StyleFormatSection, { ctx, size: "xs" }),
    /* @__PURE__ */ jsx29(ToolbarButtonSeparator, {}),
    /* @__PURE__ */ jsx29(ListSelectorSection, { ctx, size: "xs" }),
    /* @__PURE__ */ jsx29(IndentOutdentSection, { size: "xs", ctx }),
    /* @__PURE__ */ jsx29(TextAlignerSection, { ctx, size: "xs" }),
    /* @__PURE__ */ jsx29(
      TablePicker,
      {
        variant: "outline",
        size: "icon-xs",
        onSelect: (rows, cols) => {
          var _a, _b, _c;
          const win = (_a = iframeRef.current) == null ? void 0 : _a.contentWindow;
          const body = (_b = win == null ? void 0 : win.document) == null ? void 0 : _b.body;
          body == null ? void 0 : body.focus();
          (_c = chain == null ? void 0 : chain.insertTable(rows, cols)) == null ? void 0 : _c.run();
        }
      }
    ),
    /* @__PURE__ */ jsx29(
      ToolbarButton,
      {
        toolButtonSize: "xs",
        tooltip: "Add Divider",
        onClick: () => {
          var _a;
          return (_a = chain == null ? void 0 : chain.insertHTML("<hr>")) == null ? void 0 : _a.run();
        },
        children: /* @__PURE__ */ jsx29(Minus, {})
      }
    ),
    /* @__PURE__ */ jsx29(
      ToolbarButton,
      {
        toolButtonSize: "xs",
        tooltip: "Clear",
        onClick: () => {
          var _a;
          return (_a = chain == null ? void 0 : chain.clear()) == null ? void 0 : _a.run();
        },
        children: /* @__PURE__ */ jsx29(Ban, {})
      }
    )
  ] });
};

// src/components/richtext/editor.tsx
import { jsx as jsx30, jsxs as jsxs19 } from "react/jsx-runtime";
var ECODEditor = () => {
  return /* @__PURE__ */ jsxs19(EditorProvider, { children: [
    /* @__PURE__ */ jsx30(ToolbarChain, {}),
    /* @__PURE__ */ jsx30(EditorFrame, {})
  ] });
};
export {
  ECODEditor,
  EditorFrame,
  RichtextEditor,
  Toolbar
};
//# sourceMappingURL=index.js.map