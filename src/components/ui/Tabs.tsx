import * as React from "react";
import {
  Tab as HeadlessTab,
  TabGroup as HeadlessTabGroup,
  TabList as HeadlessTabList,
  TabPanel as HeadlessTabPanel,
} from "@headlessui/react";
import { cn } from "../../lib/utils";

// ── Tabs container ───────────────────────────────────────────────────────

export interface TabsProps {
  children: React.ReactNode;
  className?: string;
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
}

function Tabs({
  children,
  className,
  defaultIndex,
  selectedIndex,
  onChange,
}: TabsProps) {
  return (
    <HeadlessTabGroup
      defaultIndex={defaultIndex}
      selectedIndex={selectedIndex}
      onChange={onChange}
      className={className}
    >
      {children}
    </HeadlessTabGroup>
  );
}

// ── TabsList ─────────────────────────────────────────────────────────────

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <HeadlessTabList
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {children}
    </HeadlessTabList>
  );
}

// ── TabsTrigger ──────────────────────────────────────────────────────────

export interface TabsTriggerProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

function TabsTrigger({ children, className, disabled }: TabsTriggerProps) {
  return (
    <HeadlessTab
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-card data-[selected]:text-foreground data-[selected]:shadow-sm",
        className
      )}
    >
      {children}
    </HeadlessTab>
  );
}

// ── TabsContent ──────────────────────────────────────────────────────────

export interface TabsContentProps {
  children: React.ReactNode;
  className?: string;
}

function TabsContent({ children, className }: TabsContentProps) {
  return (
    <HeadlessTabPanel
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </HeadlessTabPanel>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
