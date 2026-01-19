"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  Wrench,
  Briefcase,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    label: "Hero",
    href: "/admin/hero",
    icon: Sparkles,
    description: "Título, subtítulo, CTA"
  },
  {
    label: "Proyectos",
    href: "/admin/projects",
    icon: FolderKanban,
    description: "Portfolio de trabajos"
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Wrench,
    description: "Tecnologías y habilidades"
  },
  {
    label: "Experiencia",
    href: "/admin/experience",
    icon: Briefcase,
    description: "Historial laboral"
  },
  {
    label: "Perfil",
    href: "/admin/profile",
    icon: User,
    description: "Información personal"
  },
  {
    label: "Configuración",
    href: "/admin/settings",
    icon: Settings,
    description: "Tema, colores, etc."
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-neutral-900 border-r border-neutral-800 flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-4">
          {!collapsed && (
            <span className="text-white font-semibold tracking-wide">
              Admin Panel
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                  isActive
                    ? "bg-[#FF3B30] text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                )}
              >
                <item.icon size={20} />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.label}</div>
                    {item.description && (
                      <div className={cn(
                        "text-xs truncate",
                        isActive ? "text-white/70" : "text-neutral-600"
                      )}>
                        {item.description}
                      </div>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800">
          {!collapsed && (
            <div className="text-xs text-neutral-600">
              Portfolio Admin v1.0
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
