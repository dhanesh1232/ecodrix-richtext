"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ECODEditor: () => ECODEditor,
  EditorFrame: () => EditorFrame,
  RichtextEditor: () => RichtextEditor,
  Toolbar: () => Toolbar
});
module.exports = __toCommonJS(index_exports);
var import_globals = require("./globals.css");

// src/components/editor/editor.tsx
var React6 = __toESM(require("react"), 1);

// src/components/editor/frame/main.tsx
var React = __toESM(require("react"), 1);
var import_jsx_runtime = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full min-h-[350px] border-t border-border bg-background relative overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var React5 = __toESM(require("react"), 1);

// src/components/editor/toolbar/ui.tsx
var React3 = __toESM(require("react"), 1);

// src/components/icons.tsx
var import_lucide_react = require("lucide-react");
var Icons = {
  undo: import_lucide_react.Undo2,
  redo: import_lucide_react.Redo2,
  heading1: import_lucide_react.Heading1,
  heading2: import_lucide_react.Heading2,
  heading3: import_lucide_react.Heading3,
  heading4: import_lucide_react.Heading4,
  heading5: import_lucide_react.Heading5,
  heading6: import_lucide_react.Heading6,
  paragraph: import_lucide_react.Pilcrow,
  blockquote: import_lucide_react.Quote,
  bold: import_lucide_react.Bold,
  underline: import_lucide_react.Underline,
  italic: import_lucide_react.Italic,
  strikeThrough: import_lucide_react.Strikethrough,
  baseLine: import_lucide_react.Baseline,
  palette: import_lucide_react.Palette,
  justifyStart: import_lucide_react.TextAlignStart,
  justifyCenter: import_lucide_react.TextAlignCenter,
  justifyEnd: import_lucide_react.TextAlignEnd,
  link: import_lucide_react.Link,
  image: import_lucide_react.Image,
  video: import_lucide_react.Video,
  ellipsis: import_lucide_react.Ellipsis,
  moreHorizontal: import_lucide_react.MoreHorizontal,
  orderList: import_lucide_react.ListOrdered,
  list: import_lucide_react.List,
  indent: import_lucide_react.Indent,
  outdent: import_lucide_react.Outdent,
  table: import_lucide_react.TableIcon,
  code: import_lucide_react.Code2,
  superscript: import_lucide_react.Superscript,
  reset: import_lucide_react.RotateCcw
};

// src/components/ui/toggle-group.tsx
var React2 = __toESM(require("react"), 1);
var ToggleGroupPrimitive = __toESM(require("@radix-ui/react-toggle-group"), 1);

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/ui/toggle.tsx
var TogglePrimitive = __toESM(require("@radix-ui/react-toggle"), 1);
var import_class_variance_authority = require("class-variance-authority");
var import_jsx_runtime2 = require("react/jsx-runtime");
var toggleVariants = (0, import_class_variance_authority.cva)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    TogglePrimitive.Root,
    __spreadValues({
      "data-slot": "toggle",
      className: cn(toggleVariants({ variant, size, className }))
    }, props)
  );
}

// src/components/ui/toggle-group.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ToggleGroupContext.Provider, { value: { variant, size, spacing }, children })
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
var SeparatorPrimitive = __toESM(require("@radix-ui/react-separator"), 1);
var import_jsx_runtime4 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
var TooltipPrimitive = __toESM(require("@radix-ui/react-tooltip"), 1);
var import_jsx_runtime5 = require("react/jsx-runtime");
function TooltipProvider(_a) {
  var _b = _a, {
    delayDuration = 0
  } = _b, props = __objRest(_b, [
    "delayDuration"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    TooltipPrimitive.Provider,
    __spreadValues({
      "data-slot": "tooltip-provider",
      delayDuration
    }, props)
  );
}
function Tooltip(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TooltipPrimitive.Root, __spreadValues({ "data-slot": "tooltip" }, props)) });
}
function TooltipTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TooltipPrimitive.Trigger, __spreadValues({ "data-slot": "tooltip-trigger" }, props));
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TooltipPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TooltipPrimitive.Arrow, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    })
  ) });
}

// src/components/ui/dropdown-menu.tsx
var DropdownMenuPrimitive = __toESM(require("@radix-ui/react-dropdown-menu"), 1);
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime6 = require("react/jsx-runtime");
function DropdownMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DropdownMenuPrimitive.Root, __spreadValues({ "data-slot": "dropdown-menu" }, props));
}
function DropdownMenuTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
var import_lucide_react4 = require("lucide-react");

// src/components/ui/dialog.tsx
var DialogPrimitive = __toESM(require("@radix-ui/react-dialog"), 1);
var import_lucide_react3 = require("lucide-react");
var import_jsx_runtime7 = require("react/jsx-runtime");
function Dialog(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DialogPrimitive.Root, __spreadValues({ "data-slot": "dialog" }, props));
}
function DialogTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DialogPrimitive.Trigger, __spreadValues({ "data-slot": "dialog-trigger" }, props));
}
function DialogPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DialogPrimitive.Portal, __spreadValues({ "data-slot": "dialog-portal" }, props));
}
function DialogOverlay(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DialogOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
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
          showCloseButton && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react3.XIcon, {}),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "sr-only", children: "Close" })
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    DialogPrimitive.Title,
    __spreadValues({
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className)
    }, props)
  );
}

// src/components/ui/popover.tsx
var PopoverPrimitive = __toESM(require("@radix-ui/react-popover"), 1);
var import_jsx_runtime8 = require("react/jsx-runtime");
function Popover(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(PopoverPrimitive.Root, __spreadValues({ "data-slot": "popover" }, props));
}
function PopoverTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(PopoverPrimitive.Trigger, __spreadValues({ "data-slot": "popover-trigger" }, props));
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(PopoverPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
var import_jsx_runtime9 = require("react/jsx-runtime");
function Input(_a) {
  var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
var import_react_slot = require("@radix-ui/react-slot");
var import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime10 = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority2.cva)(
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
  const Comp = asChild ? import_react_slot.Slot : "button";
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    Comp,
    __spreadValues({
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className }))
    }, props)
  );
}

// src/components/ui/tabs.tsx
var TabsPrimitive = __toESM(require("@radix-ui/react-tabs"), 1);
var import_jsx_runtime11 = require("react/jsx-runtime");
function Tabs(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    TabsPrimitive.Content,
    __spreadValues({
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className)
    }, props)
  );
}

// src/components/ui/scroll-area.tsx
var ScrollAreaPrimitive = __toESM(require("@radix-ui/react-scroll-area"), 1);
var import_jsx_runtime12 = require("react/jsx-runtime");
function ScrollArea(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
    ScrollAreaPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "scroll-area",
      className: cn("relative", className)
    }, props), {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollBar, {}),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollAreaPrimitive.Corner, {})
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
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
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
      children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
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
var import_lucide_react5 = require("lucide-react");
var import_jsx_runtime13 = require("react/jsx-runtime");
var Space = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Tooltip, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(TooltipTrigger, { className: "flex items-center gap-1 cursor-pointer", children: [
      Icon ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Icon, { className: "w-4 h-4", strokeWidth: 2 }) : null,
      isArrow && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        import_lucide_react4.ChevronDown,
        {
          className: "w-4 h-4 text-muted-foreground",
          strokeWidth: 2
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TooltipContent, __spreadProps(__spreadValues({}, props), { children: label }))
  ] });
};
var HistoryFormat = ({
  buttons,
  onCommand
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ToggleGroup, { type: "single", variant: "default", children: buttons == null ? void 0 : buttons.map((btn) => {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      ToggleGroupItem,
      {
        value: btn.cmd,
        onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
        className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
        children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ButtonWithTooltip, { label: btn.label, icon: btn.icon })
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(DropdownMenu, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DropdownMenuTrigger, { className: "focus:ring-0 min-w-24 px-1 h-7 lg:h-8 focus:outline-0 focus-visible:ring-0 focus-visible:outline-0 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Tooltip, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(TooltipTrigger, { className: "flex items-center gap-1 text-sm font-medium text-muted-foreground", children: [
        activeFormat,
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          import_lucide_react4.ChevronDown,
          {
            className: "w-4 h-4 text-muted-foreground/80",
            strokeWidth: 2
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TooltipContent, { children: "Formatting" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      DropdownMenuContent,
      {
        className: "rounded space-y-0.5 min-w-48",
        align: "start",
        children: formatBlocks == null ? void 0 : formatBlocks.map((btn) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
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
              activeFormat === btn.label && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react4.Check, { className: "ml-auto size-4 text-blue-600" })
            ]
          },
          btn.cmd
        ))
      }
    )
  ] });
};
var StyleFormat = ({ buttons, onCommand, activeFormats }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ToggleGroup, { type: "single", variant: "default", children: buttons == null ? void 0 : buttons.map((btn) => {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      ToggleGroupItem,
      {
        value: btn.cmd,
        onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
        className: cn(
          "px-2 w-7 h-7 lg:w-8 lg:h-8",
          (activeFormats == null ? void 0 : activeFormats[btn.cmd]) && "bg-accent text-accent-foreground"
        ),
        children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ButtonWithTooltip, { label: btn.label, icon: btn.icon })
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { ref: containerRef, className: "flex items-center transition-all", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(DropdownMenu, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DropdownMenuTrigger, { className: "font-medium h-7 px-1.5 min-w-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground focus-visible:ring-0 focus:outline-0", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      ButtonWithTooltip,
      {
        label: "Text Align",
        icon: activeAlign,
        isArrow: true
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DropdownMenuContent, { className: "w-full", children: buttons == null ? void 0 : buttons.map((btn) => {
      return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        DropdownMenuItem,
        {
          onClick: () => {
            console.log(btn.cmd);
            onCommand == null ? void 0 : onCommand(btn.cmd);
          },
          className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
          children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ToggleGroup, { type: "single", variant: "default", children: buttons == null ? void 0 : buttons.map((btn) => {
    if (btn.cmd === "link") {
      return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        ToggleGroupItem,
        {
          value: btn.cmd,
          "data-state": btn.cmd === "link" && (activeFormats == null ? void 0 : activeFormats.link) ? "on" : "off",
          className: cn(
            "px-2 w-7 h-7 lg:w-8 lg:h-8",
            btn.cmd === "link" && (activeFormats == null ? void 0 : activeFormats.link) && "bg-accent text-accent-foreground"
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(DropdownMenu, { open: linkOpen, onOpenChange: setLinkOpen, children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DropdownMenuTrigger, { className: "font-medium px-1 min-w-7 min-h-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              ButtonWithTooltip,
              {
                label: btn.label,
                icon: btn.icon
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(DropdownMenuContent, { align: "end", className: "min-w-64", children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DropdownMenuLabel, { className: "px-1", children: "URL" }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                Input,
                {
                  className: "h-7 py-2 px-2 rounded focus-visible:ring-0 focus-visible:outline-0",
                  size: 14
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center gap-2 justify-end mt-1.5", children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setLinkOpen(!linkOpen),
                    size: "sm",
                    className: "rounded-sm",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      ToggleGroupItem,
      {
        value: btn.cmd,
        className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
        children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MediaHandler, { mediaUrl })
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DialogTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ButtonWithTooltip, { label: "Media", icon: "image" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(DialogContent, { className: "sm:max-w-lg rounded-lg p-0 overflow-hidden", children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DialogHeader, { className: "border-b px-4 py-3", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(DialogTitle, { className: "text-base font-semibold", children: "Add Image" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
        Tabs,
        {
          value: activeTab,
          onValueChange: setActiveTab,
          className: "w-full px-4 pb-4",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(TabsList, { className: "grid grid-cols-2 mb-3 rounded-md bg-muted", children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TabsTrigger, { value: "upload", children: "Upload / URL" }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TabsTrigger, { value: "library", children: "From Library" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TabsContent, { value: "upload", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "flex flex-col items-center justify-center border border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary transition", children: !uploadedImage ? /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "relative flex flex-col items-center justify-center", children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react5.Upload, { className: "h-8 w-8 mb-2 text-muted-foreground" }),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-sm text-muted-foreground", children: "Click or drop image to upload" }),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                  Input,
                  {
                    type: "file",
                    accept: "image/*",
                    className: "opacity-0 absolute h-full w-full cursor-pointer",
                    onChange: handleFileUpload
                  }
                )
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex flex-col items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                  "img",
                  {
                    src: uploadedImage,
                    alt: "Uploaded",
                    className: "max-h-48 rounded border object-contain"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                  Button,
                  {
                    size: "sm",
                    onClick: () => handleInsertImage(uploadedImage),
                    children: "Insert Image"
                  }
                )
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-xs text-muted-foreground", children: "Or insert via URL" }),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                    Input,
                    {
                      placeholder: "https://example.com/image.jpg",
                      value: imageUrl,
                      onChange: (e) => setImageUrl(e.target.value)
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TabsContent, { value: "library", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ScrollArea, { className: "h-64 rounded border p-3", children: dbImages.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: dbImages.map((img) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
              "button",
              {
                onClick: () => handleInsertImage(img),
                className: "relative group rounded-md overflow-hidden border hover:ring-2 hover:ring-primary transition",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                    "img",
                    {
                      src: img,
                      alt: "DB",
                      className: "object-cover w-full h-28"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react5.ImageIcon, { className: "text-white w-5 h-5" }) })
                ]
              },
              img
            )) }) : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-sm text-muted-foreground text-center py-6", children: "No images available in library." }) }) })
          ]
        }
      )
    ] })
  ] });
};
var TextAdjust = React3.forwardRef((_a, ref) => {
  var _b = _a, { buttons, onCommand, className = "" } = _b, props = __objRest(_b, ["buttons", "onCommand", "className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", __spreadProps(__spreadValues({ ref }, props), { className: `shrink-0 ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ToggleGroup, { type: "single", variant: "default", children: buttons == null ? void 0 : buttons.map((btn) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    ToggleGroupItem,
    {
      value: btn.cmd,
      onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
      className: "px-2 w-7 h-7 lg:w-8 lg:h-8",
      children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ButtonWithTooltip, { label: btn.label, icon: btn.icon })
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Popover, { open: show, onOpenChange: onShow, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(PopoverTrigger, { className: "font-medium cursor-pointer h-7 px-1.5 min-w-7 hover:bg-muted hover:text-muted-foreground rounded data-[state=open]:bg-muted data-[state=open]:text-muted-foreground", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ButtonWithTooltip, { label: "More..", icon: "moreHorizontal" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
      PopoverContent,
      {
        align: "end",
        className: "p-0 px-1 py-1 rounded flex flex-wrap items-center gap-2",
        children: [
          (_all == null ? void 0 : _all.length) > 0 && _all.map((item) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Toggle, { className: "w-7 h-7 lg:w-8 lg:h-8 rounded", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ButtonWithTooltip, { label: item.label, icon: item.icon }) }, item.cmd)),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Toggle, { className: "w-7 h-7 lg:w-8 lg:h-8 rounded", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ButtonWithTooltip, { label: "Reset", icon: "reset" }) })
        ]
      }
    )
  ] });
};

// src/components/editor/ToolbarSection.tsx
var React4 = __toESM(require("react"), 1);
var import_jsx_runtime14 = require("react/jsx-runtime");
var ToolbarSection = React4.forwardRef((_a, ref) => {
  var _b = _a, { section, className = "", children } = _b, props = __objRest(_b, ["section", "className", "children"]);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
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
var import_jsx_runtime15 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
    "div",
    {
      ref: containerRef,
      className: "relative flex items-center bg-muted/30 px-2 py-1 overflow-hidden transition-all duration-200\n                 after:pointer-events-none after:absolute after:right-10 after:top-0 after:h-full after:w-6\n                 after:bg-linear-to-l after:from-muted/25 after:to-transparent",
      "aria-label": "Editor Toolbar",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.historyTabs = el;
            },
            section: "historyTabs",
            className: `${show("historyTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(HistoryFormat, { buttons: (_a = allTools) == null ? void 0 : _a.historyTabs, onCommand }),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Space, {})
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.textFormatTabs = el;
            },
            section: "textFormatTabs",
            className: `${show("textFormatTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.textStyleTabs = el;
            },
            section: "textStyleTabs",
            className: `${show("textStyleTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
              ResponsiveStyleFormat,
              {
                buttons: allTools.textStyleTabs,
                onCommand,
                activeFormats
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.textAlignTabs = el;
            },
            section: "textAlignTabs",
            className: `${show("textAlignTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Space, {}),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.mediaAndLinksTabs = el;
            },
            section: "mediaAndLinksTabs",
            className: `${show("mediaAndLinksTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Space, {}),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
          ToolbarSection,
          {
            ref: (el) => {
              sectionRefs.current.textAdjustTabs = el;
            },
            section: "textAdjustTabs",
            className: `${show("textAdjustTabs") ? "opacity-100" : "opacity-0 pointer-events-none absolute -left-full"}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Space, {}),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(TextAdjust, { buttons: allTools.textAdjustTabs, onCommand })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "mr-auto pr-1 flex items-center gap-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Space, {}),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
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
var import_jsx_runtime16 = require("react/jsx-runtime");
function Skeleton(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
    "div",
    __spreadValues({
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className)
    }, props)
  );
}

// src/components/editor/loader.tsx
var import_jsx_runtime17 = require("react/jsx-runtime");
var EditorSkeleton = ({
  animation = "pulse"
}) => {
  const base = "w-full bg-muted";
  const animationClass = animation === "shine" ? "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent" : "animate-pulse";
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
    "div",
    {
      className: `border border-border w-full rounded-md overflow-hidden bg-background ${animationClass}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center gap-2 relative px-2 py-1", children: [
          [1, 2, 3, 4, 5, 6, 7, 8].map((width) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            Skeleton,
            {
              className: `${base} h-7 ${width === 3 ? "w-16 lg:w-20" : "w-7 lg:w-8"}  lg:h-8`
            },
            width
          )),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Skeleton, { className: "absolute right-1" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "h-px bg-border" }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: `${base} h-64` })
      ]
    }
  );
};

// src/components/editor/editor.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
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
  if (!isMounted) return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(EditorSkeleton, {});
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
    "div",
    {
      className: cn(
        "border border-border w-full rounded-md overflow-hidden bg-inherit transition-all duration-300",
        isFocused && "ring-1 ring-blue-500"
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          Toolbar,
          __spreadProps(__spreadValues({}, toolbar), {
            onCommand: handleCommand,
            activeFormats
          })
        ),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(EditorFrame, { ref: editorRef, initialContent })
      ]
    }
  );
};

// src/components/richtext/provider.tsx
var import_react = __toESM(require("react"), 1);
var import_jsx_runtime19 = require("react/jsx-runtime");
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
var EditorContext = (0, import_react.createContext)(null);
var EditorProvider = ({
  children
}) => {
  const iframeRef = (0, import_react.useRef)(null);
  const [html, setHtml] = (0, import_react.useState)("<p>Start typing\u2026</p>");
  const [ctx, setCtx] = (0, import_react.useState)(defaultCtx);
  const refreshCtx = (0, import_react.useCallback)(() => {
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
  (0, import_react.useEffect)(() => {
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
  import_react.default.useEffect(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
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
  const ctx = (0, import_react.useContext)(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside <EditorProvider>");
  return ctx;
};

// src/components/richtext/toolbar/ToolbarChain.tsx
var React15 = __toESM(require("react"), 1);

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
var import_lucide_react13 = require("lucide-react");

// src/components/richtext/ui/table-picker.tsx
var import_lucide_react6 = require("lucide-react");
var React9 = __toESM(require("react"), 1);

// src/components/richtext/toolbar/toolbar.tsx
var React8 = __toESM(require("react"), 1);
var import_jsx_runtime20 = require("react/jsx-runtime");
var ToolbarWrapper = React8.forwardRef(
  (_a, ref) => {
    var _b = _a, { children, className } = _b, props = __objRest(_b, ["children", "className"]);
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", __spreadProps(__spreadValues({ ref, className: cn("flex items-center", className) }, props), { children }));
  }
);
ToolbarWrapper.displayName = "ToolbarWrapper";
var ToolbarGroup = React8.forwardRef(
  (_a, ref) => {
    var _b = _a, { children, className } = _b, props = __objRest(_b, ["children", "className"]);
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
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
    const button = /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(TooltipProvider, { delayDuration: 250, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(Tooltip, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
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
var import_jsx_runtime21 = require("react/jsx-runtime");
var TablePicker = React9.forwardRef((_a, ref) => {
  var _b = _a, { onSelect } = _b, buttonProps = __objRest(_b, ["onSelect"]);
  const [open, setOpen] = React9.useState(false);
  const [table, setTable] = React9.useState({ rows: 2, cols: 2 });
  const maxRows = 10;
  const maxCols = 10;
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
      ToolbarButton,
      __spreadProps(__spreadValues({
        ref,
        toolButtonSize: "xs",
        tooltip: "Insert Table",
        "data-active": open
      }, buttonProps), {
        children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react6.Table, {})
      })
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(PopoverContent, { children: [
      Array.from({ length: maxRows }).map((_, r) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "flex space-y-0.5 space-x-0.5 mx-auto w-full", children: Array.from({ length: maxCols }).map((_2, c) => {
        const active = r <= table.rows && c <= table.cols;
        return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Separator, { className: "w-full" }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "text-xs text-muted-foreground mt-2", children: [
        table.rows + 1,
        " \xD7 ",
        table.cols + 1
      ] })
    ] })
  ] });
});
TablePicker.displayName = "TablePicker";

// src/hooks/chain-execute.ts
var React10 = __toESM(require("react"), 1);
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
var import_lucide_react7 = require("lucide-react");
var import_jsx_runtime22 = require("react/jsx-runtime");
var HistorySection = ({
  ctx,
  size = "sm"
}) => {
  const { execute } = useEditorChain();
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(ToolbarGroup, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      ToolbarButton,
      {
        tooltip: "Undo",
        disabled: !ctx.canUndo,
        onClick: () => execute("undo"),
        toolButtonSize: size,
        className: "rounded",
        children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_lucide_react7.Undo2, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      ToolbarButton,
      {
        tooltip: "Redo",
        toolButtonSize: size,
        disabled: !ctx.canRedo,
        onClick: () => execute("redo"),
        className: "rounded",
        children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_lucide_react7.Redo2, {})
      }
    )
  ] });
};

// src/components/richtext/ui/text-style.tsx
var React12 = __toESM(require("react"), 1);
var import_lucide_react9 = require("lucide-react");

// src/components/richtext/ui/color-picker.tsx
var React11 = __toESM(require("react"), 1);
var import_react_color = require("react-color");
var import_lucide_react8 = require("lucide-react");
var import_jsx_runtime23 = require("react/jsx-runtime");
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
    const IconComponent = icon || import_lucide_react8.Check;
    const handleChange = (clr) => {
      setTempColor(clr.hex);
    };
    const handleComplete = (clr) => {
      setTempColor(clr.hex);
      onChange == null ? void 0 : onChange(clr.hex);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
        PopoverTrigger,
        {
          className: cn(
            "px-0.5 p-0 flex items-center data-[state=open]:bg-accent",
            className
          ),
          ref,
          disabled,
          asChild: true,
          children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(ToolbarButton, __spreadProps(__spreadValues({ toolButtonSize: size, tooltip: "Color" }, props), { children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(IconComponent, { color: "currentColor" }) }))
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
        PopoverContent,
        {
          className: "p-2 w-[260px] bg-background shadow-lg border border-border rounded",
          align: "end",
          children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
            Tabs,
            {
              value: isBack,
              onValueChange: (value) => onChangeIsBackground == null ? void 0 : onChangeIsBackground(value),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(TabsList, { className: "w-full rounded bg-accent", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
                    TabsTrigger,
                    {
                      value: "text",
                      className: "w-full cursor-pointer rounded",
                      children: "Text"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
                    TabsTrigger,
                    {
                      value: "background",
                      className: "w-full cursor-pointer rounded",
                      children: "Background"
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(TabsContent, { value: "text", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
                  Picker,
                  {
                    handleChange,
                    handleComplete,
                    color: tempColor
                  }
                ) }),
                /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(TabsContent, { value: "background", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    import_react_color.SketchPicker,
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
var import_jsx_runtime24 = require("react/jsx-runtime");
var styleButtons = [
  {
    type: "bold",
    cmd: "bold",
    tooltip: "Bold",
    icon: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react9.Bold, {}),
    activeKey: "bold",
    action_type: "button"
  },
  {
    type: "italic",
    cmd: "italic",
    tooltip: "Italic",
    icon: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react9.Italic, {}),
    activeKey: "italic",
    action_type: "button"
  },
  {
    type: "underline",
    cmd: "underline",
    tooltip: "Underline",
    icon: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react9.Underline, {}),
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
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(ToolbarGroup, { children: [
    styleButtons.map((btn) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
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
    highlighter && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      ColorHighlighter,
      {
        size: "xs",
        color: ctx.foreColor,
        icon: import_lucide_react9.Palette,
        onChange: handleUpdateColor,
        isBack: isBackground,
        onChangeIsBackground: () => setIsBackground(isBackground === "text" ? "background" : "text")
      }
    )
  ] });
};

// src/components/richtext/ui/text-format.tsx
var React13 = __toESM(require("react"), 1);
var import_lucide_react10 = require("lucide-react");
var import_jsx_runtime25 = require("react/jsx-runtime");
var allFormats = [
  {
    type: "heading",
    cmd: "heading",
    args: [1],
    tooltip: "Heading 1",
    icon: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Heading1, {}),
    activeKey: "isHeading1"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [2],
    tooltip: "Heading 2",
    icon: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Heading2, {}),
    activeKey: "isHeading2"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [3],
    tooltip: "Heading 3",
    icon: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Heading3, {}),
    activeKey: "isHeading3"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [4],
    tooltip: "Heading 4",
    icon: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Heading4, {}),
    activeKey: "isHeading4"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [5],
    tooltip: "Heading 5",
    icon: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Heading5, {}),
    activeKey: "isHeading5"
  },
  {
    type: "heading",
    cmd: "heading",
    args: [6],
    tooltip: "Heading 6",
    icon: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Heading6, {}),
    activeKey: "isHeading6"
  },
  {
    type: "paragraph",
    cmd: "paragraph",
    tooltip: "Paragraph",
    icon: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Pilcrow, {}),
    activeKey: "isParagraph"
  },
  {
    type: "blockquote",
    cmd: "quote",
    tooltip: "Blockquote",
    icon: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Quote, {}),
    activeKey: "isBlockquote"
  },
  {
    type: "code",
    cmd: "codeBlock",
    tooltip: "Code Block",
    icon: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Code, {}),
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
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(DropdownMenu, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(Tooltip, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
        DropdownMenuTrigger,
        {
          className: `flex items-center justify-between gap-1 border border-border rounded ${sizeClasses[size]} text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:ring-1 focus-visible:ring-ring focus:outline-none min-w-[6rem]`,
          children: [
            currentLabel,
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.ChevronDown, { className: "w-4 h-4 opacity-70", strokeWidth: 2 })
          ]
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(TooltipContent, { side: "bottom", children: "Select Text format" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(DropdownMenuContent, { align: "center", className: "min-w-10 space-y-0.5", children: visibleFormats.map((btn) => {
      const active = Boolean(ctx[btn.activeKey]);
      return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
        DropdownMenuItem,
        {
          onClick: () => execute(btn.cmd, ...btn.args || []),
          "data-active": active,
          className: `flex hover:bg-muted/70 data-[active=true]:text-accent-foreground data-[active=true]:bg-accent items-center justify-between gap-2 px-2 py-1.5 cursor-pointer transition-colors ease-in-out duration-150`,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("span", { className: "flex items-center gap-2", children: [
              btn.icon,
              btn.tooltip
            ] }),
            active && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_lucide_react10.Check, { className: "w-4 h-4 text-blue-500" })
          ]
        },
        btn.tooltip
      );
    }) })
  ] });
};

// src/components/richtext/ui/list-selector.tsx
var import_lucide_react11 = require("lucide-react");
var import_jsx_runtime26 = require("react/jsx-runtime");
var ListSelectorSection = ({
  ctx,
  size = "sm"
}) => {
  const { execute } = useEditorChain();
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(ToolbarGroup, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
      ToolbarButton,
      {
        onClick: () => execute("bulletList"),
        active: ctx.unorderedList,
        toolButtonSize: size,
        tooltip: "Unordered List",
        children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react11.List, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
      ToolbarButton,
      {
        onClick: () => execute("orderedList"),
        active: ctx.orderedList,
        toolButtonSize: size,
        tooltip: "Ordered List",
        children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react11.ListOrdered, {})
      }
    )
  ] });
};

// src/components/richtext/ui/indent-outdent.tsx
var import_jsx_runtime27 = require("react/jsx-runtime");
var IndentOutdentSection = ({
  ctx,
  size
}) => {
  const { execute } = useEditorChain();
  console.log(ctx);
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(ToolbarGroup, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
      ToolbarButton,
      {
        toolButtonSize: size,
        disabled: ctx == null ? void 0 : ctx.isIndented,
        onClick: () => execute("indent"),
        children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Indent2, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
      ToolbarButton,
      {
        toolButtonSize: size,
        disabled: !(ctx == null ? void 0 : ctx.isIndented),
        onClick: () => execute("outdent"),
        children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Outdent2, {})
      }
    )
  ] });
};
var Indent2 = (_a) => {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
    "svg",
    __spreadProps(__spreadValues({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16"
    }, props), {
      fill: "currentColor",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: "M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: "M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: "M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: "M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: "M1 10.407c0 .473.55.755.96.493l3.765-2.408a.578.578 0 0 0 0-.985l-3.765-2.407c-.41-.262-.96.02-.96.493z" })
      ]
    })
  );
};
var Outdent2 = (_a) => {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
    "svg",
    __spreadProps(__spreadValues({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16"
    }, props), {
      fill: "currentColor",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: "M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: "M8.75 5.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: "M8 9.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: "M1.75 12.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: "M6 10.407c0 .473-.55.755-.96.493l-3.765-2.408a.578.578 0 0 1 0-.985l3.765-2.407c.41-.262.96.02.96.493z" })
      ]
    })
  );
};

// src/components/richtext/ui/text-aligner.tsx
var React14 = __toESM(require("react"), 1);
var import_lucide_react12 = require("lucide-react");
var import_jsx_runtime28 = require("react/jsx-runtime");
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
      icon: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react12.TextAlignStart, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyLeft
    },
    {
      cmd: "alignCenter",
      tooltip: "Align Center",
      icon: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react12.TextAlignCenter, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyCenter
    },
    {
      cmd: "alignRight",
      tooltip: "Align Right",
      icon: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react12.TextAlignEnd, { className: "w-4 h-4" }),
      active: ctx == null ? void 0 : ctx.justifyRight
    }
  ];
  const activeAlign = ((_a = alignOptions.find((a) => a.active)) == null ? void 0 : _a.icon) || /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react12.TextAlignStart, { className: "w-4 h-4" });
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(DropdownMenu, { open: _open, onOpenChange: _setOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      ToolbarButton,
      {
        tooltip: "Text Alignment",
        "data-active": _open,
        toolButtonSize: size,
        children: activeAlign
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      DropdownMenuContent,
      {
        align: "center",
        className: "flex gap-1 p-2 min-w-0 bg-background/95 backdrop-blur-md rounded shadow-sm border",
        children: alignOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
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
var import_jsx_runtime29 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(ToolbarWrapper, { className: "flex flex-wrap gap-2 border-b pb-2 mb-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(HistorySection, { ctx, size: "xs" }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(ToolbarButtonSeparator, { orientation: "vertical" }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(TextFormatSection, { ctx, size: "xs" }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(StyleFormatSection, { ctx, size: "xs" }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(ToolbarButtonSeparator, {}),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(ListSelectorSection, { ctx, size: "xs" }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(IndentOutdentSection, { size: "xs", ctx }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(TextAlignerSection, { ctx, size: "xs" }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      ToolbarButton,
      {
        toolButtonSize: "xs",
        tooltip: "Add Divider",
        onClick: () => {
          var _a;
          return (_a = chain == null ? void 0 : chain.insertHTML("<hr>")) == null ? void 0 : _a.run();
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react13.Minus, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      ToolbarButton,
      {
        toolButtonSize: "xs",
        tooltip: "Clear",
        onClick: () => {
          var _a;
          return (_a = chain == null ? void 0 : chain.clear()) == null ? void 0 : _a.run();
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react13.Ban, {})
      }
    )
  ] });
};

// src/components/richtext/editor.tsx
var import_jsx_runtime30 = require("react/jsx-runtime");
var ECODEditor = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(EditorProvider, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(ToolbarChain, {}),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(EditorFrame, {})
  ] });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ECODEditor,
  EditorFrame,
  RichtextEditor,
  Toolbar
});
//# sourceMappingURL=index.cjs.map