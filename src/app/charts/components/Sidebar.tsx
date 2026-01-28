"use client";

import React, { useState, createContext, useContext } from "react";
import { motion } from "motion/react";
import { cn } from "../../../../lib/utils";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

/* ================= DESKTOP ONLY ================= */

export const SidebarBody = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <motion.div
      className={cn(
        `
        h-full flex flex-col shrink-0
        px-4 py-4
        bg-gradient-to-b from-[#050b2e] via-[#0f172a] to-[#1b0f3a]
        backdrop-blur-xl
        border-r border-white/10
        `,
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "64px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* ================= SIDEBAR LINK ================= */

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();

  return (
    <a
      href={link.href}
      className={cn(
        `
        flex items-center gap-3 px-2 py-2 rounded-lg
        text-gray-200
        hover:bg-white/10
        transition
        group/sidebar
        `,
        className
      )}
      {...props}
    >
      <div className="text-gray-300 group-hover/sidebar:text-purple-400 transition">
        {link.icon}
      </div>

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="
          text-sm whitespace-nowrap
          group-hover/sidebar:translate-x-1
          transition duration-150
        "
      >
        {link.label}
      </motion.span>
    </a>
  );
};
