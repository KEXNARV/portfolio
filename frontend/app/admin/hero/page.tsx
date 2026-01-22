"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Save, Eye, Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroData {
  title: string;
  subtitle: string;
  location?: string;
  description: string;
  ctaPrimary: {
    text: string;
    link: string;
  };
  ctaSecondary: {
    text: string;
    link: string;
  };
  backgroundType: "solid" | "gradient" | "image";
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
}

const defaultHeroData: HeroData = {
  title: "Kevin Narvaez",
  subtitle: "AI Product System Engineer",
  location: "Panama",
  description: "I architect the bridge between AI research and production systems. Building the infrastructure that turns AI potential into business impact.",
  ctaPrimary: {
    text: "View Projects",
    link: "#systems"
  },
  ctaSecondary: {
    text: "About Me",
    link: "#architect"
  },
  backgroundType: "solid",
  backgroundColor: "#0a0a0a",
  gradientFrom: "#0a0a0a",
  gradientTo: "#1a1a2e",
  backgroundImage: ""
};

export default function HeroAdmin() {
  const [heroData, setHeroData] = useState<HeroData>(defaultHeroData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data from backend on mount
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const response = await fetch("http://localhost:3001/hero");
        if (response.ok) {
          const data = await response.json();
          setHeroData(data);
        }
      } catch (error) {
        console.log("Using default hero data");
      }
    };
    loadHeroData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("http://localhost:3001/hero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(heroData),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Error saving hero data:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setHeroData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateCTA = (type: "ctaPrimary" | "ctaSecondary", field: "text" | "link", value: string) => {
    setHeroData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/uploads', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // MinIO returns full URL, use it directly
        updateField('backgroundImage', data.url);
      } else {
        alert('Error al subir la imagen');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error al subir la imagen');
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Sparkles className="text-[#FF3B30]" />
            Hero Section
          </h1>
          <p className="text-neutral-500 mt-1">
            Configura el contenido principal de tu landing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open("/landing1", "_blank")}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Eye size={18} />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
              saved
                ? "bg-green-600 text-white"
                : "bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white"
            )}
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saved ? "Guardado!" : "Guardar"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-8">
        {/* Text Content */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Contenido de Texto</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Título Principal
              </label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#FF3B30] transition-colors"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Subtítulo / Rol
              </label>
              <input
                type="text"
                value={heroData.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#FF3B30] transition-colors"
                placeholder="Tu rol o título profesional"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={heroData.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#FF3B30] transition-colors"
                placeholder="Ej: Panama"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Descripción
              </label>
              <textarea
                value={heroData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#FF3B30] transition-colors resize-none"
                placeholder="Una breve descripción sobre ti"
              />
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Botones de Acción (CTA)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary CTA */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-[#FF3B30]">CTA Primario</div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Texto</label>
                <input
                  type="text"
                  value={heroData.ctaPrimary.text}
                  onChange={(e) => updateCTA("ctaPrimary", "text", e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF3B30]"
                  placeholder="Ver Proyectos"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Link</label>
                <input
                  type="text"
                  value={heroData.ctaPrimary.link}
                  onChange={(e) => updateCTA("ctaPrimary", "link", e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF3B30]"
                  placeholder="#systems (IDs disponibles: #architect, #systems)"
                />
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-neutral-400">CTA Secundario</div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Texto</label>
                <input
                  type="text"
                  value={heroData.ctaSecondary.text}
                  onChange={(e) => updateCTA("ctaSecondary", "text", e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF3B30]"
                  placeholder="Contacto"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Link</label>
                <input
                  type="text"
                  value={heroData.ctaSecondary.link}
                  onChange={(e) => updateCTA("ctaSecondary", "link", e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF3B30]"
                  placeholder="#architect (IDs disponibles: #architect, #systems)"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Background Settings */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Fondo</h2>

          {/* Background Type Selector */}
          <div className="flex gap-2 mb-6">
            {(["solid", "gradient", "image"] as const).map((type) => (
              <button
                key={type}
                onClick={() => updateField("backgroundType", type)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                  heroData.backgroundType === type
                    ? "bg-[#FF3B30] text-white"
                    : "bg-neutral-800 text-neutral-400 hover:text-white"
                )}
              >
                {type === "solid" ? "Color Sólido" : type === "gradient" ? "Gradiente" : "Imagen"}
              </button>
            ))}
          </div>

          {/* Background Options */}
          {heroData.backgroundType === "solid" && (
            <div>
              <label className="block text-sm text-neutral-400 mb-2">Color de Fondo</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={heroData.backgroundColor}
                  onChange={(e) => updateField("backgroundColor", e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={heroData.backgroundColor}
                  onChange={(e) => updateField("backgroundColor", e.target.value)}
                  className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF3B30]"
                />
              </div>
            </div>
          )}

          {heroData.backgroundType === "gradient" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Color Inicial</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={heroData.gradientFrom}
                    onChange={(e) => updateField("gradientFrom", e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={heroData.gradientFrom}
                    onChange={(e) => updateField("gradientFrom", e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Color Final</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={heroData.gradientTo}
                    onChange={(e) => updateField("gradientTo", e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={heroData.gradientTo}
                    onChange={(e) => updateField("gradientTo", e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>
              </div>
            </div>
          )}

          {heroData.backgroundType === "image" && (
            <div className="space-y-4">
              {/* Drag & Drop Upload Area */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Subir Imagen</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                    dragActive
                      ? "border-[#FF3B30] bg-[#FF3B30]/10"
                      : "border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800/50"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-[#FF3B30]" />
                      <span className="text-neutral-400 text-sm">Subiendo...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-neutral-500" />
                      <span className="text-neutral-400 text-sm">
                        Arrastra una imagen aquí o haz clic para seleccionar
                      </span>
                      <span className="text-neutral-600 text-xs">
                        PNG, JPG, GIF, WebP (máx. 10MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">O ingresa URL</label>
                <input
                  type="text"
                  value={heroData.backgroundImage}
                  onChange={(e) => updateField("backgroundImage", e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#FF3B30]"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Current Image Preview */}
              {heroData.backgroundImage && (
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Imagen Actual</label>
                  <div className="relative inline-block">
                    <img
                      src={heroData.backgroundImage}
                      alt="Background preview"
                      className="max-h-40 rounded-lg border border-neutral-700"
                    />
                    <button
                      onClick={() => updateField("backgroundImage", "")}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview */}
          <div className="mt-6">
            <label className="block text-sm text-neutral-400 mb-2">Vista Previa</label>
            <div
              className="h-32 rounded-lg border border-neutral-700 flex items-center justify-center"
              style={{
                background:
                  heroData.backgroundType === "solid"
                    ? heroData.backgroundColor
                    : heroData.backgroundType === "gradient"
                      ? `linear-gradient(135deg, ${heroData.gradientFrom}, ${heroData.gradientTo})`
                      : heroData.backgroundImage
                        ? `url(${heroData.backgroundImage}) center/cover`
                        : "#0a0a0a"
              }}
            >
              <span className="text-white/50 text-sm">Preview del fondo</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
