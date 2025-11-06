"use client";
import * as React from "react";
import { HistoryFormat, Space, StyleFormat, TextFormat } from "./ui";
import { Separator } from "../../../components/ui/separator";

export const Toolbar: React.FC<ToolbarProps> = ({
  historyTabs,
  formatting,
}) => {
  return (
    <div className="flex items-center gap-2 border-b px-2 py-1 bg-background overflow-x-auto">
      {historyTabs && (
        <>
          <HistoryFormat />
          <Space />
        </>
      )}
      <TextFormat formatting={formatting} />
      <StyleFormat />
      <Space />
    </div>
  );
};
