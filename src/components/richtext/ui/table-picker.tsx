import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table } from "lucide-react";
import * as React from "react";
import { ToolbarButton } from "../toolbar/toolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui";

interface TablePickerProps
  extends Omit<React.ComponentProps<typeof Button>, "onSelect"> {
  onSelect?: (rows: number, cols: number) => void;
}

export const TablePicker = React.forwardRef<
  HTMLButtonElement,
  TablePickerProps
>(({ onSelect, ...buttonProps }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [table, setTable] = React.useState({ rows: 2, cols: 2 });

  const maxRows = 10;
  const maxCols = 10;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          ref={ref}
          toolButtonSize="xs"
          tooltip="Insert Table"
          data-active={open}
          {...buttonProps}
        >
          <Table />
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Array.from({ length: maxRows }).map((_, r) => (
          <div key={r} className="flex space-y-0.5 space-x-0.5 mx-auto w-full">
            {Array.from({ length: maxCols }).map((_, c) => {
              // active if less or equal, so user can see rectangular selection
              const active = r <= table.rows && c <= table.cols;
              return (
                <div
                  key={c}
                  onMouseEnter={() => setTable({ rows: r, cols: c })}
                  onClick={() => {
                    onSelect?.(r + 1, c + 1);
                    setOpen(false);
                  }}
                  data-active={active}
                  className={`w-5 h-5 border cursor-pointer bg-transparent hover:bg-gray-200 data-[active=true]:ring-1 data-[active=true]:ring-blue-500 data-[active=true]:bg-accent`}
                />
              );
            })}
          </div>
        ))}
        <Separator className="w-full" />
        <div className="text-xs text-muted-foreground mt-2">
          {table.rows + 1} × {table.cols + 1}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

TablePicker.displayName = "TablePicker";
