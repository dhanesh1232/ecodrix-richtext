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
import * as React7 from "react";

// src/components/editor/frame/main.tsx
import * as React from "react";
import { jsx } from "react/jsx-runtime";
var EditorFrame = React.forwardRef(({ initialContent = "<p>Start typing...</p>" }, ref) => {
  const iframeRef = React.useRef(null);
  const [doc, setDoc] = React.useState(null);
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
                height: 310px;
                max-height: 320px;
                color: #111;
                line-height: 1.6;
                background: transparent;
              }
              h1, h2, h3, h4, h5, h6 {
                margin: 0.5em 0;
              }
              blockquote {
                border-left: 3px solid #ddd;
                padding-left: 1em;
                color: #555;
                font-style: italic;
              }
              a { color: #0ea5e9; text-decoration: underline; }
              img { max-width: 100%; display: block; margin: 8px 0; }
              p { margin: 0.5em 0; }
            </style>
          </head>
          <body contenteditable="true">${initialContent}</body>
        </html>
      `);
    iframeDoc.close();
    setDoc(iframeDoc);
    iframeDoc.body.focus();
  }, []);
  React.useImperativeHandle(ref, () => ({
    handleCommand: (cmd, value) => {
      if (!doc) return;
      doc.body.focus();
      const win = doc.defaultView;
      const sel = win.getSelection();
      if (!sel) return;
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
        case "undo":
        case "redo":
          doc.execCommand(cmd);
          break;
        case "color":
          doc.execCommand("foreColor", false, value != null ? value : "#000000");
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
        default:
          console.warn("Unknown command:", cmd);
      }
    },
    getContent: () => {
      return (doc == null ? void 0 : doc.body.innerHTML) || "";
    },
    setContent: (html) => {
      if (doc) doc.body.innerHTML = html;
    }
  }));
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
import * as React6 from "react";

// src/components/editor/toolbar/ui.tsx
import * as React4 from "react";

// src/components/icons.tsx
import {
  Baseline,
  Bold,
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
  Strikethrough,
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
  table: TableIcon
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

// src/components/ui/select.tsx
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { jsx as jsx4, jsxs } from "react/jsx-runtime";
function Select(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx4(SelectPrimitive.Root, __spreadValues({ "data-slot": "select" }, props));
}
function SelectValue(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx4(SelectPrimitive.Value, __spreadValues({ "data-slot": "select-value" }, props));
}
function SelectTrigger(_a) {
  var _b = _a, {
    className,
    size = "default",
    children
  } = _b, props = __objRest(_b, [
    "className",
    "size",
    "children"
  ]);
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    __spreadProps(__spreadValues({
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 lg:data-[size=default]:h-8 data-[size=sm]:h-7 lg:data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx4(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx4(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    })
  );
}
function SelectContent(_a) {
  var _b = _a, {
    className,
    children,
    position = "popper",
    align = "center"
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "position",
    "align"
  ]);
  return /* @__PURE__ */ jsx4(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    __spreadProps(__spreadValues({
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      align
    }, props), {
      children: [
        /* @__PURE__ */ jsx4(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx4(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx4(SelectScrollDownButton, {})
      ]
    })
  ) });
}
function SelectItem(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    __spreadProps(__spreadValues({
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx4("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx4(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx4(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx4(SelectPrimitive.ItemText, { children })
      ]
    })
  );
}
function SelectScrollUpButton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx4(
    SelectPrimitive.ScrollUpButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx4(ChevronUpIcon, { className: "size-4" })
    })
  );
}
function SelectScrollDownButton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx4(
    SelectPrimitive.ScrollDownButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx4(ChevronDownIcon, { className: "size-4" })
    })
  );
}

// src/components/ui/color-picker.tsx
import * as React3 from "react";

// src/components/ui/popover.tsx
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { jsx as jsx5 } from "react/jsx-runtime";
function Popover(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx5(PopoverPrimitive.Root, __spreadValues({ "data-slot": "popover" }, props));
}
function PopoverTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx5(PopoverPrimitive.Trigger, __spreadValues({ "data-slot": "popover-trigger" }, props));
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
  return /* @__PURE__ */ jsx5(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx5(
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

// src/components/ui/color-picker.tsx
import { SketchPicker } from "react-color";
import { Check } from "lucide-react";

// src/components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx6 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx6(
    Comp,
    __spreadValues({
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className }))
    }, props)
  );
}

// src/components/ui/tabs.tsx
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { jsx as jsx7 } from "react/jsx-runtime";
function Tabs(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx7(
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
  return /* @__PURE__ */ jsx7(
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
  return /* @__PURE__ */ jsx7(
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
  return /* @__PURE__ */ jsx7(
    TabsPrimitive.Content,
    __spreadValues({
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className)
    }, props)
  );
}

// src/components/ui/color-picker.tsx
import { jsx as jsx8, jsxs as jsxs2 } from "react/jsx-runtime";
var ColorHighlighter = React3.forwardRef(({ color, onChange, disabled, className, icon = "baseLine" }, ref) => {
  const [isOpen, setIsOpen] = React3.useState(false);
  const [tempColor, setTempColor] = React3.useState(color || "#000000");
  const handleChange = (clr) => setTempColor(clr.hex);
  const handleComplete = (clr) => onChange == null ? void 0 : onChange(clr.hex);
  const applyColor = () => setIsOpen(false);
  return /* @__PURE__ */ jsxs2(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx8(
      PopoverTrigger,
      {
        className: cn("px-0.5 p-0 flex items-center", className),
        ref,
        disabled,
        children: /* @__PURE__ */ jsx8(ButtonWithTooltip, { label: "Color Picker", icon })
      }
    ),
    /* @__PURE__ */ jsxs2(
      PopoverContent,
      {
        className: "p-2 w-[260px] bg-background shadow-lg border border-border rounded",
        align: "end",
        children: [
          /* @__PURE__ */ jsxs2(Tabs, { children: [
            /* @__PURE__ */ jsx8(TabsList, { className: "rounded", children: [
              { label: "Text", id: "text-color" },
              { label: "Background", id: "background-color" }
            ].map((color2) => /* @__PURE__ */ jsx8(TabsTrigger, { value: color2.id, className: "rounded", children: color2.label }, color2.id)) }),
            /* @__PURE__ */ jsx8(TabsContent, { value: "text-color", children: /* @__PURE__ */ jsx8(
              SketchPicker,
              {
                color: tempColor,
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
                      // whole background
                      boxShadow: "none",
                      borderRadius: "12px"
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
                    },
                    alpha: {
                      color: "inherit",
                      height: "12px",
                      borderRadius: "8px"
                    }
                  }
                }
              }
            ) }),
            /* @__PURE__ */ jsx8(TabsContent, { value: "background-color", children: /* @__PURE__ */ jsx8(
              SketchPicker,
              {
                color: tempColor,
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
                      // whole background
                      boxShadow: "none",
                      borderRadius: "12px"
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
                    },
                    alpha: {
                      color: "inherit",
                      height: "12px",
                      borderRadius: "8px"
                    }
                  }
                }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx8("div", { className: "pt-2 border-t border-border mt-2", children: /* @__PURE__ */ jsxs2(
            Button,
            {
              size: "sm",
              variant: "primary",
              className: "w-full flex items-center justify-center",
              onClick: applyColor,
              children: [
                /* @__PURE__ */ jsx8(Check, { className: "h-4 w-4 mr-2" }),
                "Apply Color"
              ]
            }
          ) })
        ]
      }
    )
  ] });
});
ColorHighlighter.displayName = "ColorHighlighter";

// src/components/ui/separator.tsx
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { jsx as jsx9 } from "react/jsx-runtime";
function Separator2(_a) {
  var _b = _a, {
    className,
    orientation = "horizontal",
    decorative = true
  } = _b, props = __objRest(_b, [
    "className",
    "orientation",
    "decorative"
  ]);
  return /* @__PURE__ */ jsx9(
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
import { jsx as jsx10, jsxs as jsxs3 } from "react/jsx-runtime";
function TooltipProvider(_a) {
  var _b = _a, {
    delayDuration = 0
  } = _b, props = __objRest(_b, [
    "delayDuration"
  ]);
  return /* @__PURE__ */ jsx10(
    TooltipPrimitive.Provider,
    __spreadValues({
      "data-slot": "tooltip-provider",
      delayDuration
    }, props)
  );
}
function Tooltip(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx10(TooltipProvider, { children: /* @__PURE__ */ jsx10(TooltipPrimitive.Root, __spreadValues({ "data-slot": "tooltip" }, props)) });
}
function TooltipTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx10(TooltipPrimitive.Trigger, __spreadValues({ "data-slot": "tooltip-trigger" }, props));
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
  return /* @__PURE__ */ jsx10(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs3(
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
        /* @__PURE__ */ jsx10(TooltipPrimitive.Arrow, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    })
  ) });
}

// src/components/ui/dropdown-menu.tsx
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon as CheckIcon2, ChevronRightIcon, CircleIcon } from "lucide-react";
import { jsx as jsx11, jsxs as jsxs4 } from "react/jsx-runtime";
function DropdownMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx11(DropdownMenuPrimitive.Root, __spreadValues({ "data-slot": "dropdown-menu" }, props));
}
function DropdownMenuTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx11(
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
  return /* @__PURE__ */ jsx11(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx11(
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
  return /* @__PURE__ */ jsx11(
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
  return /* @__PURE__ */ jsx11(
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
import { ChevronDown } from "lucide-react";

// src/components/ui/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { jsx as jsx12, jsxs as jsxs5 } from "react/jsx-runtime";
function Dialog(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx12(DialogPrimitive.Root, __spreadValues({ "data-slot": "dialog" }, props));
}
function DialogTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx12(DialogPrimitive.Trigger, __spreadValues({ "data-slot": "dialog-trigger" }, props));
}
function DialogPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx12(DialogPrimitive.Portal, __spreadValues({ "data-slot": "dialog-portal" }, props));
}
function DialogOverlay(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx12(
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
  return /* @__PURE__ */ jsxs5(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx12(DialogOverlay, {}),
    /* @__PURE__ */ jsxs5(
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
          showCloseButton && /* @__PURE__ */ jsxs5(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx12(XIcon, {}),
                /* @__PURE__ */ jsx12("span", { className: "sr-only", children: "Close" })
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
  return /* @__PURE__ */ jsx12(
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
  return /* @__PURE__ */ jsx12(
    DialogPrimitive.Title,
    __spreadValues({
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className)
    }, props)
  );
}

// src/components/ui/input.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
function Input(_a) {
  var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
  return /* @__PURE__ */ jsx13(
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

// src/components/ui/scroll-area.tsx
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { jsx as jsx14, jsxs as jsxs6 } from "react/jsx-runtime";
function ScrollArea(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs6(
    ScrollAreaPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "scroll-area",
      className: cn("relative", className)
    }, props), {
      children: [
        /* @__PURE__ */ jsx14(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsx14(ScrollBar, {}),
        /* @__PURE__ */ jsx14(ScrollAreaPrimitive.Corner, {})
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
  return /* @__PURE__ */ jsx14(
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
      children: /* @__PURE__ */ jsx14(
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
import { jsx as jsx15, jsxs as jsxs7 } from "react/jsx-runtime";
var Space = () => {
  return /* @__PURE__ */ jsx15(
    Separator2,
    {
      orientation: "vertical",
      role: "separator",
      style: { height: "1.5rem" },
      className: "border border-border border-l-0 border-y-0 w-px"
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
  const Icon2 = icon ? Icons[icon] : null;
  return /* @__PURE__ */ jsxs7(Tooltip, { children: [
    /* @__PURE__ */ jsxs7(TooltipTrigger, { className: "flex items-center gap-1", children: [
      Icon2 ? /* @__PURE__ */ jsx15(Icon2, { className: "w-4 h-4", strokeWidth: 2 }) : null,
      isArrow && /* @__PURE__ */ jsx15(
        ChevronDown,
        {
          className: "w-4 h-4 text-muted-foreground",
          strokeWidth: 2
        }
      )
    ] }),
    /* @__PURE__ */ jsx15(TooltipContent, __spreadProps(__spreadValues({}, props), { children: label }))
  ] });
};
var HistoryFormat = ({
  buttons,
  onCommand
}) => {
  return /* @__PURE__ */ jsx15(ToggleGroup, { type: "single", variant: "default", children: buttons == null ? void 0 : buttons.map((btn) => {
    return /* @__PURE__ */ jsx15(
      ToggleGroupItem,
      {
        value: btn.cmd,
        onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
        className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
        children: /* @__PURE__ */ jsx15(ButtonWithTooltip, { label: btn.label, icon: btn.icon })
      },
      btn.cmd
    );
  }) });
};
var TextFormat = ({
  formatting = ["h1", "h2", "h3", "p"],
  onFormat,
  buttons
}) => {
  const formatBlocks = buttons == null ? void 0 : buttons.filter(
    (btn) => {
      var _a;
      return formatting.includes((_a = btn.cmd) == null ? void 0 : _a.split(":")[1]);
    }
  );
  return /* @__PURE__ */ jsxs7(Select, { onValueChange: (f) => onFormat == null ? void 0 : onFormat(f), children: [
    /* @__PURE__ */ jsx15(
      SelectTrigger,
      {
        size: "sm",
        className: "focus:ring-0 min-w-28 px-2 py-1 h-7 lg:h-8 focus:outline-0 rounded focus-visible:ring-0 focus-visible:outline-0",
        children: /* @__PURE__ */ jsxs7(Tooltip, { children: [
          /* @__PURE__ */ jsx15(TooltipTrigger, { children: /* @__PURE__ */ jsx15(SelectValue, { placeholder: formatBlocks == null ? void 0 : formatBlocks[0].label }) }),
          /* @__PURE__ */ jsx15(TooltipContent, { children: "Formatting" })
        ] })
      }
    ),
    /* @__PURE__ */ jsx15(SelectContent, { className: "rounded", children: formatBlocks == null ? void 0 : formatBlocks.map((btn) => /* @__PURE__ */ jsx15(
      SelectItem,
      {
        value: btn.cmd,
        className: cn("rounded", btn == null ? void 0 : btn.style),
        children: btn.label
      },
      btn.cmd
    )) })
  ] });
};
var StyleFormat = ({
  buttons,
  onCommand
}) => {
  const handleChange = (c) => {
    console.log(c);
  };
  return /* @__PURE__ */ jsx15(ToggleGroup, { type: "single", variant: "default", children: buttons == null ? void 0 : buttons.map((btn) => {
    if (btn.cmd === "color") {
      return /* @__PURE__ */ jsx15(
        ToggleGroupItem,
        {
          value: btn.cmd,
          className: "px-0.5 w-7 h-7 lg:w-8 lg:h-8",
          children: /* @__PURE__ */ jsx15(ColorHighlighter, { icon: btn.icon, onChange: handleChange })
        },
        btn.cmd
      );
    }
    return /* @__PURE__ */ jsx15(
      ToggleGroupItem,
      {
        value: btn.cmd,
        onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
        className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
        children: /* @__PURE__ */ jsx15(ButtonWithTooltip, { label: btn.label, icon: btn.icon })
      },
      btn.cmd
    );
  }) });
};
var TextAlign = ({ buttons, onCommand }) => {
  const [active, setActive] = React4.useState("justifyStart");
  return /* @__PURE__ */ jsxs7(DropdownMenu, { children: [
    /* @__PURE__ */ jsx15(DropdownMenuTrigger, { className: "font-medium h-7 px-1.5 min-w-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground", children: /* @__PURE__ */ jsx15(
      ButtonWithTooltip,
      {
        label: "Text Align",
        icon: active,
        isArrow: true
      }
    ) }),
    /* @__PURE__ */ jsx15(DropdownMenuContent, { className: "w-full", children: buttons == null ? void 0 : buttons.map((btn) => {
      return /* @__PURE__ */ jsx15(
        DropdownMenuItem,
        {
          onClick: () => {
            setActive(btn.cmd);
            console.log(btn.cmd);
            onCommand == null ? void 0 : onCommand(btn.cmd);
          },
          className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
          children: /* @__PURE__ */ jsx15(
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
var MediaAndLink = ({
  buttons,
  onCommand
}) => {
  const [linkOpen, setLinkOpen] = React4.useState(false);
  return /* @__PURE__ */ jsx15(ToggleGroup, { type: "single", variant: "default", children: buttons == null ? void 0 : buttons.map((btn) => {
    if (btn.cmd === "link") {
      return /* @__PURE__ */ jsx15(
        ToggleGroupItem,
        {
          value: btn.cmd,
          className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
          children: /* @__PURE__ */ jsxs7(DropdownMenu, { open: linkOpen, onOpenChange: setLinkOpen, children: [
            /* @__PURE__ */ jsx15(DropdownMenuTrigger, { className: "font-medium px-1 min-w-7 min-h-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground", children: /* @__PURE__ */ jsx15(
              ButtonWithTooltip,
              {
                label: btn.label,
                icon: btn.icon
              }
            ) }),
            /* @__PURE__ */ jsxs7(DropdownMenuContent, { align: "end", className: "min-w-64", children: [
              /* @__PURE__ */ jsx15(DropdownMenuLabel, { className: "px-1", children: "URL" }),
              /* @__PURE__ */ jsx15(
                Input,
                {
                  className: "h-7 py-2 px-2 rounded focus-visible:ring-0 focus-visible:outline-0",
                  size: 14
                }
              ),
              /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2 justify-end mt-1.5", children: [
                /* @__PURE__ */ jsx15(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setLinkOpen(!linkOpen),
                    size: "sm",
                    className: "rounded-sm",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx15(
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
    return /* @__PURE__ */ jsx15(
      ToggleGroupItem,
      {
        value: btn.cmd,
        className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
        children: /* @__PURE__ */ jsx15(MediaHandler, {})
      },
      btn.cmd
    );
  }) });
};
var MediaHandler = ({ onCommand }) => {
  const [open, setOpen] = React4.useState(false);
  const [imageUrl, setImageUrl] = React4.useState("");
  const [uploadedImage, setUploadedImage] = React4.useState(null);
  const [activeTab, setActiveTab] = React4.useState("upload");
  const [dbImages, setDbImages] = React4.useState([
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
  return /* @__PURE__ */ jsxs7(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx15(DialogTrigger, { children: /* @__PURE__ */ jsx15(ButtonWithTooltip, { label: "Media", icon: "image" }) }),
    /* @__PURE__ */ jsxs7(DialogContent, { className: "sm:max-w-lg rounded-lg p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx15(DialogHeader, { className: "border-b px-4 py-3", children: /* @__PURE__ */ jsx15(DialogTitle, { className: "text-base font-semibold", children: "Add Image" }) }),
      /* @__PURE__ */ jsxs7(
        Tabs,
        {
          value: activeTab,
          onValueChange: setActiveTab,
          className: "w-full px-4 pb-4",
          children: [
            /* @__PURE__ */ jsxs7(TabsList, { className: "grid grid-cols-2 mb-3 rounded-md bg-muted", children: [
              /* @__PURE__ */ jsx15(TabsTrigger, { value: "upload", children: "Upload / URL" }),
              /* @__PURE__ */ jsx15(TabsTrigger, { value: "library", children: "From Library" })
            ] }),
            /* @__PURE__ */ jsx15(TabsContent, { value: "upload", children: /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsx15("div", { className: "flex flex-col items-center justify-center border border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary transition", children: !uploadedImage ? /* @__PURE__ */ jsxs7("div", { className: "relative flex flex-col items-center justify-center", children: [
                /* @__PURE__ */ jsx15(Upload, { className: "h-8 w-8 mb-2 text-muted-foreground" }),
                /* @__PURE__ */ jsx15("p", { className: "text-sm text-muted-foreground", children: "Click or drop image to upload" }),
                /* @__PURE__ */ jsx15(
                  Input,
                  {
                    type: "file",
                    accept: "image/*",
                    className: "opacity-0 absolute h-full w-full cursor-pointer",
                    onChange: handleFileUpload
                  }
                )
              ] }) : /* @__PURE__ */ jsxs7("div", { className: "flex flex-col items-center gap-2", children: [
                /* @__PURE__ */ jsx15(
                  "img",
                  {
                    src: uploadedImage,
                    alt: "Uploaded",
                    className: "max-h-48 rounded border object-contain"
                  }
                ),
                /* @__PURE__ */ jsx15(
                  Button,
                  {
                    size: "sm",
                    onClick: () => handleInsertImage(uploadedImage),
                    children: "Insert Image"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs7("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx15("p", { className: "text-xs text-muted-foreground", children: "Or insert via URL" }),
                /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx15(
                    Input,
                    {
                      placeholder: "https://example.com/image.jpg",
                      value: imageUrl,
                      onChange: (e) => setImageUrl(e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx15(
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
            /* @__PURE__ */ jsx15(TabsContent, { value: "library", children: /* @__PURE__ */ jsx15(ScrollArea, { className: "h-64 rounded border p-3", children: dbImages.length > 0 ? /* @__PURE__ */ jsx15("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: dbImages.map((img) => /* @__PURE__ */ jsxs7(
              "button",
              {
                onClick: () => handleInsertImage(img),
                className: "relative group rounded-md overflow-hidden border hover:ring-2 hover:ring-primary transition",
                children: [
                  /* @__PURE__ */ jsx15(
                    "img",
                    {
                      src: img,
                      alt: "DB",
                      className: "object-cover w-full h-28"
                    }
                  ),
                  /* @__PURE__ */ jsx15("div", { className: "absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition", children: /* @__PURE__ */ jsx15(ImageIcon, { className: "text-white w-5 h-5" }) })
                ]
              },
              img
            )) }) : /* @__PURE__ */ jsx15("p", { className: "text-sm text-muted-foreground text-center py-6", children: "No images available in library." }) }) })
          ]
        }
      )
    ] })
  ] });
};
var MoreTools = ({ show, onShow }) => {
  return /* @__PURE__ */ jsxs7(Popover, { open: show, onOpenChange: onShow, children: [
    /* @__PURE__ */ jsx15(PopoverTrigger, { className: "font-medium h-7 px-1.5 min-w-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground", children: /* @__PURE__ */ jsx15(ButtonWithTooltip, { label: "More..", icon: "moreHorizontal" }) }),
    /* @__PURE__ */ jsx15(PopoverContent, { align: "end", className: "p-0 px-2 py-2 rounded", children: "Tools" })
  ] });
};

// src/components/editor/ToolbarSection.tsx
import * as React5 from "react";
import { jsx as jsx16 } from "react/jsx-runtime";
var ToolbarSection = React5.forwardRef((_a, ref) => {
  var _b = _a, { section, className = "", children } = _b, props = __objRest(_b, ["section", "className", "children"]);
  return /* @__PURE__ */ jsx16(
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

// src/components/editor/toolbar/main.tsx
import { jsx as jsx17, jsxs as jsxs8 } from "react/jsx-runtime";
var TOOL_SECTIONS = [
  "historyTabs",
  "textFormatTabs",
  "textStyleTabs",
  "textAlignTabs",
  "mediaAndLinksTabs"
];
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
  ]
};
var Toolbar = ({ formatting, onCommand }) => {
  const containerRef = React6.useRef(null);
  const sectionRefs = React6.useRef(
    {
      historyTabs: null,
      textFormatTabs: null,
      textStyleTabs: null,
      textAlignTabs: null,
      mediaAndLinksTabs: null
    }
  );
  const [hidden, setHidden] = React6.useState([]);
  React6.useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const measure = () => {
      if (!container) return;
      const containerWidth = container.clientWidth;
      const reserved = 56;
      let used = 0;
      const newlyVisible = [];
      for (const key of TOOL_SECTIONS) {
        const el = sectionRefs.current[key];
        if (!el) continue;
        const width = el.offsetWidth;
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
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    const id = window.requestAnimationFrame(measure);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  const show = (sec) => !hidden.includes(sec);
  return /* @__PURE__ */ jsxs8(
    "div",
    {
      ref: containerRef,
      className: "relative flex items-center gap-1 border-b bg-muted/25 px-2 py-1 overflow-hidden transition-all duration-200\n                 after:pointer-events-none after:absolute after:right-10 after:top-0 after:h-full after:w-6\n                 after:bg-linear-to-l after:from-muted/25 after:to-transparent",
      "aria-label": "Editor Toolbar",
      children: [
        /* @__PURE__ */ jsxs8(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.historyTabs = el;
            },
            section: "historyTabs",
            className: show("historyTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full",
            children: [
              /* @__PURE__ */ jsx17(HistoryFormat, { buttons: allTools.historyTabs, onCommand }),
              /* @__PURE__ */ jsx17(Space, {})
            ]
          }
        ),
        /* @__PURE__ */ jsx17(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.textFormatTabs = el;
            },
            section: "textFormatTabs",
            className: show("textFormatTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full",
            children: /* @__PURE__ */ jsx17(
              TextFormat,
              {
                formatting,
                buttons: allTools.textFormatTabs,
                onFormat: (f) => onCommand == null ? void 0 : onCommand(f)
              }
            )
          }
        ),
        /* @__PURE__ */ jsx17(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.textStyleTabs = el;
            },
            section: "textStyleTabs",
            className: show("textStyleTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full",
            children: /* @__PURE__ */ jsx17(StyleFormat, { buttons: allTools.textStyleTabs, onCommand })
          }
        ),
        /* @__PURE__ */ jsxs8(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.textAlignTabs = el;
            },
            section: "textAlignTabs",
            className: show("textAlignTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full",
            children: [
              /* @__PURE__ */ jsx17(Space, {}),
              /* @__PURE__ */ jsx17(TextAlign, { buttons: allTools.textAlignTabs, onCommand })
            ]
          }
        ),
        /* @__PURE__ */ jsxs8(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.mediaAndLinksTabs = el;
            },
            section: "mediaAndLinksTabs",
            className: show("mediaAndLinksTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full",
            children: [
              /* @__PURE__ */ jsx17(Space, {}),
              /* @__PURE__ */ jsx17(
                MediaAndLink,
                {
                  buttons: allTools.mediaAndLinksTabs,
                  onCommand
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx17("div", { className: "ml-auto pr-1", children: /* @__PURE__ */ jsx17(MoreTools, { tools: allTools, showTools: hidden }) })
      ]
    }
  );
};

// src/components/editor/editor.tsx
import { jsx as jsx18, jsxs as jsxs9 } from "react/jsx-runtime";
var RichtextEditor = ({
  initialContent = "Start typing...",
  toolbar
}) => {
  const editorRef = React7.useRef(null);
  const handleCommand = (cmd, value) => {
    var _a;
    (_a = editorRef.current) == null ? void 0 : _a.handleCommand(cmd, value);
  };
  return /* @__PURE__ */ jsxs9("div", { className: "border border-border w-full rounded-sm overflow-hidden bg-inherit mx-4", children: [
    /* @__PURE__ */ jsx18(Toolbar, { formatting: toolbar == null ? void 0 : toolbar.formatting, onCommand: handleCommand }),
    /* @__PURE__ */ jsx18(EditorFrame, { ref: editorRef, initialContent })
  ] });
};
export {
  EditorFrame,
  RichtextEditor,
  Toolbar
};
//# sourceMappingURL=index.js.map