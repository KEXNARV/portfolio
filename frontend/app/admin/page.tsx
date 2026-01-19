"use client";

import { LayoutDashboard, Sparkles, FolderKanban, Wrench } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  {
    label: "Editar Hero",
    href: "/admin/hero",
    icon: Sparkles,
    color: "bg-red-500/10 text-red-500 border-red-500/20"
  },
  {
    label: "Proyectos",
    href: "/admin/projects",
    icon: FolderKanban,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Wrench,
    color: "bg-green-500/10 text-green-500 border-green-500/20"
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <LayoutDashboard className="text-[#FF3B30]" />
          Dashboard
        </h1>
        <p className="text-neutral-500 mt-1">
          Administra el contenido de tu portfolio
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`p-6 rounded-xl border ${link.color} hover:scale-[1.02] transition-transform`}
          >
            <link.icon size={24} className="mb-3" />
            <div className="font-medium">{link.label}</div>
          </Link>
        ))}
      </div>

      {/* Stats placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Proyectos", value: "4" },
          { label: "Skills", value: "12" },
          { label: "Experiencias", value: "3" },
          { label: "Visitas", value: "1.2k" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6"
          >
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-neutral-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
