"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Upload,
  ExternalLink,
  Github,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  techStack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectForm {
  title: string;
  description: string;
  imageUrl: string;
  techStack: string;
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
}

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  imageUrl: "",
  techStack: "",
  demoUrl: "",
  repoUrl: "",
  featured: false,
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = "http://localhost:3001";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const projectData = {
      title: form.title,
      description: form.description,
      imageUrl: form.imageUrl || null,
      techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
      demoUrl: form.demoUrl || null,
      repoUrl: form.repoUrl || null,
      featured: form.featured,
    };

    try {
      const url = editingId
        ? `${API_URL}/projects/${editingId}`
        : `${API_URL}/projects`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        fetchProjects();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || "",
      techStack: project.techStack.join(", "),
      demoUrl: project.demoUrl || "",
      repoUrl: project.repoUrl || "",
      featured: project.featured,
    });
    setEditingId(project.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/uploads`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setForm((prev) => ({ ...prev, imageUrl: `${API_URL}${data.url}` }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FolderKanban className="text-blue-500" />
            Proyectos
          </h1>
          <p className="text-neutral-500 mt-1">
            Administra los proyectos de tu portfolio
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Nuevo Proyecto
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center">
          <FolderKanban className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500">No hay proyectos todavía</p>
          <button
            onClick={openCreateModal}
            className="mt-4 text-blue-500 hover:text-blue-400 text-sm"
          >
            Crear tu primer proyecto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group hover:border-neutral-700 transition-colors"
            >
              {/* Image */}
              <div className="aspect-video bg-neutral-800 relative">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderKanban className="w-12 h-12 text-neutral-700" />
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <Star size={12} />
                    Destacado
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-neutral-400 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techStack.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="px-2 py-0.5 text-neutral-500 text-xs">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                  <div className="flex items-center gap-2">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-neutral-500 hover:text-white transition-colors"
                        title="Ver demo"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-neutral-500 hover:text-white transition-colors"
                        title="Ver código"
                      >
                        <Github size={16} />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 text-neutral-500 hover:text-blue-500 transition-colors"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? "Editar Proyecto" : "Nuevo Proyecto"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-neutral-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Mi Proyecto"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Describe tu proyecto..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Imagen
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all",
                    dragActive
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-neutral-700 hover:border-neutral-500"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                  ) : form.imageUrl ? (
                    <div className="space-y-2">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="max-h-32 mx-auto rounded"
                      />
                      <p className="text-xs text-neutral-500">
                        Click para cambiar
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-6 h-6 text-neutral-500 mx-auto" />
                      <p className="text-sm text-neutral-400">
                        Arrastra o haz clic para subir
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full mt-2 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="O ingresa URL de imagen"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Tech Stack
                </label>
                <input
                  type="text"
                  value={form.techStack}
                  onChange={(e) =>
                    setForm({ ...form, techStack: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="React, Node.js, PostgreSQL (separados por coma)"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    value={form.demoUrl}
                    onChange={(e) =>
                      setForm({ ...form, demoUrl: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Repo URL
                  </label>
                  <input
                    type="url"
                    value={form.repoUrl}
                    onChange={(e) =>
                      setForm({ ...form, repoUrl: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              {/* Featured */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-neutral-700 bg-neutral-800 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-neutral-300">Proyecto destacado</span>
              </label>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {editingId ? "Guardar Cambios" : "Crear Proyecto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
