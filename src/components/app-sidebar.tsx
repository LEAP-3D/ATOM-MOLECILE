"use client";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
// import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
export function AppSidebar() {
  const [inputValue, setInputValue] = useState<string>("");
  console.log("Input Value:", inputValue);
  return (
    <Sidebar>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Data</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <h3 className="mb-4 text-lg font-semibold">Upload file</h3>
            <Input type="file" accept=".xlsx,.xls" />
            <div className="text-[]"> Supports Excel files only</div>
            <Textarea
              placeholder="AI agent"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
