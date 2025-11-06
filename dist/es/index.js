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

// src/components/editor/frame/main.tsx
import { jsx } from "react/jsx-runtime";
var EditorFrame = ({ initialContent }) => {
  return /* @__PURE__ */ jsx("div", { className: "border rounded-md overflow-hidden bg-inherit", children: /* @__PURE__ */ jsx(
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
import {
  Baseline,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2
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
  quote: Quote,
  bold: Bold,
  underline: Underline,
  italic: Italic,
  strikeThrough: Strikethrough,
  baseLine: Baseline
};

// src/components/ui/toggle-group.tsx
import * as React from "react";
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
  const context = React.useContext(ToggleGroupContext);
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
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
import * as React2 from "react";

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
import { Check, ChevronDown } from "lucide-react";

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

// src/components/ui/color-picker.tsx
import { jsx as jsx7, jsxs as jsxs2 } from "react/jsx-runtime";
var ColorHighlighter = React2.forwardRef(({ color, onChange, disabled, className, icon = "baseLine" }, ref) => {
  const [isOpen, setIsOpen] = React2.useState(false);
  const [tempColor, setTempColor] = React2.useState(color || "#000000");
  const handleChange = (clr) => setTempColor(clr.hex);
  const handleComplete = (clr) => onChange == null ? void 0 : onChange(clr.hex);
  const applyColor = () => setIsOpen(false);
  const Icon2 = Icons[icon];
  return /* @__PURE__ */ jsxs2(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsxs2(
      PopoverTrigger,
      {
        className: cn("px-0 p-0 flex items-center gap-0", className),
        ref,
        disabled,
        style: { color: tempColor },
        children: [
          /* @__PURE__ */ jsx7(Icon2, { size: 15, strokeWidth: 2 }),
          /* @__PURE__ */ jsx7(ChevronDown, { className: "text-muted-foreground", size: 12 })
        ]
      }
    ),
    /* @__PURE__ */ jsxs2(
      PopoverContent,
      {
        className: "p-2 w-[260px] bg-background shadow-lg border border-border rounded",
        align: "end",
        children: [
          /* @__PURE__ */ jsx7(
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
          ),
          /* @__PURE__ */ jsx7("div", { className: "pt-2 border-t border-border mt-2", children: /* @__PURE__ */ jsxs2(
            Button,
            {
              size: "sm",
              variant: "primary",
              className: "w-full flex items-center justify-center",
              onClick: applyColor,
              children: [
                /* @__PURE__ */ jsx7(Check, { className: "h-4 w-4 mr-2" }),
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
import { jsx as jsx8 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx8(
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
import { jsx as jsx9, jsxs as jsxs3 } from "react/jsx-runtime";
var Space = () => {
  return /* @__PURE__ */ jsx9(
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
  return /* @__PURE__ */ jsx9(ToggleGroup, { type: "single", variant: "default", children: buttons.map((btn) => {
    const Icon2 = Icons[btn.icon];
    return /* @__PURE__ */ jsx9(
      ToggleGroupItem,
      {
        value: btn.cmd,
        onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
        title: btn.label,
        className: "px-2",
        children: /* @__PURE__ */ jsx9(Icon2, { size: 14, strokeWidth: 2 })
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
  return /* @__PURE__ */ jsx9(Toggle, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs3(Select, { onValueChange: handleChange, children: [
    /* @__PURE__ */ jsx9(
      SelectTrigger,
      {
        size: "sm",
        className: "focus:ring-0 min-w-28 focus:outline-0 rounded focus-visible:ring-0 focus-visible:outline-0",
        children: /* @__PURE__ */ jsx9(SelectValue, { placeholder: formatBlocks[0].label })
      }
    ),
    /* @__PURE__ */ jsx9(SelectContent, { className: "rounded", children: formatBlocks.map((btn) => /* @__PURE__ */ jsx9(SelectItem, { value: btn.cmd, className: "rounded", children: btn.label }, btn.cmd)) })
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
  return /* @__PURE__ */ jsx9(ToggleGroup, { type: "single", variant: "default", children: styleFormatButtons.map((btn) => {
    const Icon2 = Icons[btn.icon];
    if (btn.cmd === "textColor") {
      return /* @__PURE__ */ jsx9(ToggleGroupItem, { value: btn.cmd, className: "px-0.5", children: /* @__PURE__ */ jsx9(ColorHighlighter, { icon: btn.icon, onChange: handleChange }) }, btn.cmd);
    }
    return /* @__PURE__ */ jsx9(
      ToggleGroupItem,
      {
        value: btn.cmd,
        onClick: () => onCommand == null ? void 0 : onCommand(btn.cmd),
        title: btn.label,
        className: "px-2",
        children: /* @__PURE__ */ jsx9(Icon2, { size: 14, strokeWidth: 2 })
      },
      btn.cmd
    );
  }) });
};

// src/components/editor/toolbar/main.tsx
import { Fragment, jsx as jsx10, jsxs as jsxs4 } from "react/jsx-runtime";
var Toolbar = ({
  historyTabs,
  formatting
}) => {
  return /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2 border-b px-2 py-1 bg-background overflow-x-auto", children: [
    historyTabs && /* @__PURE__ */ jsxs4(Fragment, { children: [
      /* @__PURE__ */ jsx10(HistoryFormat, {}),
      /* @__PURE__ */ jsx10(Space, {})
    ] }),
    /* @__PURE__ */ jsx10(TextFormat, { formatting }),
    /* @__PURE__ */ jsx10(StyleFormat, {}),
    /* @__PURE__ */ jsx10(Space, {})
  ] });
};

// src/components/editor/editor.tsx
import { jsx as jsx11, jsxs as jsxs5 } from "react/jsx-runtime";
var RichtextEditor = ({
  initialContent = "Start typing...",
  toolbar
}) => {
  return /* @__PURE__ */ jsxs5("div", { className: "border border-border w-full", children: [
    /* @__PURE__ */ jsx11(
      Toolbar,
      {
        historyTabs: toolbar == null ? void 0 : toolbar.historyTabs,
        formatting: toolbar == null ? void 0 : toolbar.formatting
      }
    ),
    /* @__PURE__ */ jsx11(EditorFrame, { initialContent })
  ] });
};
export {
  EditorFrame,
  RichtextEditor,
  Toolbar
};
//# sourceMappingURL=index.js.map