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
  EditorFrame: () => EditorFrame,
  RichtextEditor: () => RichtextEditor,
  Toolbar: () => Toolbar
});
module.exports = __toCommonJS(index_exports);
var import_globals = require("./globals.css");

// src/components/editor/frame/main.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var EditorFrame = ({ initialContent }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border rounded-md overflow-hidden bg-inherit", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      contentEditable: true,
      suppressContentEditableWarning: true,
      className: "min-h-[200px] p-3 outline-none",
      children: initialContent
    }
  ) });
};

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
  quote: import_lucide_react.Quote,
  bold: import_lucide_react.Bold,
  underline: import_lucide_react.Underline,
  italic: import_lucide_react.Italic,
  strikeThrough: import_lucide_react.Strikethrough,
  baseLine: import_lucide_react.Baseline
};

// src/components/ui/toggle-group.tsx
var React = __toESM(require("react"), 1);
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
var ToggleGroupContext = React.createContext({
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
  const context = React.useContext(ToggleGroupContext);
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

// src/components/ui/select.tsx
var SelectPrimitive = __toESM(require("@radix-ui/react-select"), 1);
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function Select(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SelectPrimitive.Root, __spreadValues({ "data-slot": "select" }, props));
}
function SelectValue(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SelectPrimitive.Value, __spreadValues({ "data-slot": "select-value" }, props));
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    SelectPrimitive.Trigger,
    __spreadProps(__spreadValues({
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react2.ChevronDownIcon, { className: "size-4 opacity-50" }) })
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SelectPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SelectScrollUpButton, {}),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SelectScrollDownButton, {})
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    SelectPrimitive.Item,
    __spreadProps(__spreadValues({
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react2.CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SelectPrimitive.ItemText, { children })
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    SelectPrimitive.ScrollUpButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react2.ChevronUpIcon, { className: "size-4" })
    })
  );
}
function SelectScrollDownButton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    SelectPrimitive.ScrollDownButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react2.ChevronDownIcon, { className: "size-4" })
    })
  );
}

// src/components/ui/color-picker.tsx
var React2 = __toESM(require("react"), 1);

// src/components/ui/popover.tsx
var PopoverPrimitive = __toESM(require("@radix-ui/react-popover"), 1);
var import_jsx_runtime5 = require("react/jsx-runtime");
function Popover(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PopoverPrimitive.Root, __spreadValues({ "data-slot": "popover" }, props));
}
function PopoverTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PopoverPrimitive.Trigger, __spreadValues({ "data-slot": "popover-trigger" }, props));
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PopoverPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
var import_react_color = require("react-color");
var import_lucide_react3 = require("lucide-react");

// src/components/ui/button.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    Comp,
    __spreadValues({
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className }))
    }, props)
  );
}

// src/components/ui/color-picker.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var ColorHighlighter = React2.forwardRef(({ color, onChange, disabled, className, icon = "baseLine" }, ref) => {
  const [isOpen, setIsOpen] = React2.useState(false);
  const [tempColor, setTempColor] = React2.useState(color || "#000000");
  const handleChange = (clr) => setTempColor(clr.hex);
  const handleComplete = (clr) => onChange == null ? void 0 : onChange(clr.hex);
  const applyColor = () => setIsOpen(false);
  const Icon2 = Icons[icon];
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      PopoverTrigger,
      {
        className: cn("px-0 p-0 flex items-center gap-0", className),
        ref,
        disabled,
        style: { color: tempColor },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon2, { size: 15, strokeWidth: 2 }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react3.ChevronDown, { className: "text-muted-foreground", size: 12 })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      PopoverContent,
      {
        className: "p-2 w-[260px] bg-background shadow-lg border border-border rounded",
        align: "end",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            import_react_color.SketchPicker,
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
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "pt-2 border-t border-border mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
            Button,
            {
              size: "sm",
              variant: "primary",
              className: "w-full flex items-center justify-center",
              onClick: applyColor,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react3.Check, { className: "h-4 w-4 mr-2" }),
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
var SeparatorPrimitive = __toESM(require("@radix-ui/react-separator"), 1);
var import_jsx_runtime8 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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

// src/components/editor/toolbar/ui.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var Space = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    Separator2,
    {
      orientation: "vertical",
      role: "separator",
      style: { height: "1.5rem" },
      className: "bg-muted-foreground border border-muted-foreground w-px"
    }
  );
};
var defaultButtons = [
  { cmd: "undo", label: "Undo", icon: "undo" },
  { cmd: "redo", label: "Redo", icon: "redo" }
];
var HistoryFormat = ({
  buttons = defaultButtons,
  onCommand
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ToggleGroup, { type: "single", variant: "default", children: buttons.map((btn) => {
    const Icon2 = Icons[btn.icon];
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      ToggleGroupItem,
      {
        value: btn.cmd,
        onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
        title: btn.label,
        className: "px-2",
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Icon2, { size: 14, strokeWidth: 2 })
      },
      btn.cmd
    );
  }) });
};
var textFormatButtons = [
  { cmd: "formatBlock:h1", label: "Heading 1", icon: "heading1" },
  { cmd: "formatBlock:h2", label: "Heading 2", icon: "heading2" },
  { cmd: "formatBlock:h3", label: "Heading 3", icon: "heading3" },
  { cmd: "formatBlock:h4", label: "Heading 4", icon: "heading4" },
  { cmd: "formatBlock:h5", label: "Heading 5", icon: "heading5" },
  { cmd: "formatBlock:h6", label: "Heading 6", icon: "heading6" },
  { cmd: "formatBlock:p", label: "Paragraph", icon: "paragraph" },
  { cmd: "formatBlock:blockquote", label: "Quote", icon: "quote" }
];
var TextFormat = ({
  formatting = ["h1", "h2", "h3", "p"],
  onFormat
}) => {
  const formatBlocks = textFormatButtons.filter(
    (btn) => formatting.includes(btn.cmd.split(":")[1])
  );
  const handleChange = (value) => {
    console.log(value);
    const format = value.split(":")[1];
    if (onFormat) onFormat(format);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Toggle, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(Select, { onValueChange: handleChange, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      SelectTrigger,
      {
        size: "sm",
        className: "focus:ring-0 min-w-28 focus:outline-0 rounded focus-visible:ring-0 focus-visible:outline-0",
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SelectValue, { placeholder: formatBlocks[0].label })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SelectContent, { className: "rounded", children: formatBlocks.map((btn) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SelectItem, { value: btn.cmd, className: "rounded", children: btn.label }, btn.cmd)) })
  ] }) });
};
var styleFormatButtons = [
  { cmd: "bold", label: "Bold", icon: "bold" },
  { cmd: "italic", label: "Italic", icon: "italic" },
  { cmd: "underline", label: "Underline", icon: "underline" },
  { cmd: "strikeThrough", label: "Strikethrough", icon: "strikeThrough" },
  { cmd: "textColor", label: "Text Color", icon: "baseLine" }
];
var StyleFormat = ({ onCommand }) => {
  const handleChange = (c) => {
    console.log(c);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ToggleGroup, { type: "single", variant: "default", children: styleFormatButtons.map((btn) => {
    const Icon2 = Icons[btn.icon];
    if (btn.cmd === "textColor") {
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ToggleGroupItem, { value: btn.cmd, className: "px-0.5", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ColorHighlighter, { icon: btn.icon, onChange: handleChange }) }, btn.cmd);
    }
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      ToggleGroupItem,
      {
        value: btn.cmd,
        onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
        title: btn.label,
        className: "px-2",
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Icon2, { size: 14, strokeWidth: 2 })
      },
      btn.cmd
    );
  }) });
};

// src/components/editor/toolbar/main.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
var Toolbar = ({
  historyTabs,
  formatting
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center gap-2 border-b px-2 py-1 bg-background overflow-x-auto", children: [
    historyTabs && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(HistoryFormat, {}),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Space, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(TextFormat, { formatting }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(StyleFormat, {}),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Space, {})
  ] });
};

// src/components/editor/editor.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
var RichtextEditor = ({
  initialContent = "Start typing...",
  toolbar
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "border border-border w-full", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      Toolbar,
      {
        historyTabs: toolbar == null ? void 0 : toolbar.historyTabs,
        formatting: toolbar == null ? void 0 : toolbar.formatting
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(EditorFrame, { initialContent })
  ] });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EditorFrame,
  RichtextEditor,
  Toolbar
});
//# sourceMappingURL=index.cjs.map