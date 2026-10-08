"use client";

import React, { useState, useRef } from "react";
import { uploadProductImage } from "../../../utils/api";

export function ImageInputControl({
  label,
  required,
  value,
  onChange,
  mode,
  setMode,
  helperText,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP, AVIF).");
      return;
    }
    setUploading(true);
    setFileName(file.name);
    try {
      const result = await uploadProductImage(file, file.name);
      onChange(result.url);
    } catch (err) {
      console.error("Upload error:", err);
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result);
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="image-option-card">
      <div className="image-option-header">
        <div className="image-option-label">
          <span>{label}</span>
          {required && <span style={{ color: "#e63946" }}>*</span>}
        </div>
        <div className="image-mode-toggle">
          <button
            type="button"
            className={`image-mode-btn ${mode === "url" ? "active" : ""}`}
            onClick={() => setMode("url")}
          >
            🔗 Image URL
          </button>
          <button
            type="button"
            className={`image-mode-btn ${mode === "file" ? "active" : ""}`}
            onClick={() => setMode("file")}
          >
            📁 Upload File
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <input
              type="url"
              className="admin-input"
              required={required && !value}
              placeholder="https://images.unsplash.com/... or image link"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            />
            {value && (
              <img
                src={value}
                alt="Preview"
                className="image-preview-box"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
          </div>
          {helperText && <div className="stat-desc">{helperText}</div>}
        </div>
      ) : (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden-file-input"
            accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0]);
              }
            }}
          />

          {!value ? (
            <div
              className={`image-dropzone ${dragOver ? "dragover" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="dropzone-icon">
                {uploading ? "⏳" : "☁️"}
              </div>
              <div className="dropzone-title">
                {uploading ? "Uploading image..." : "Click to browse or drag & drop image"}
              </div>
              <div className="dropzone-subtitle">
                Supports PNG, JPG, WEBP, AVIF up to 10MB
              </div>
            </div>
          ) : (
            <div className="image-preview-detail">
              <img
                src={value}
                alt="Uploaded Preview"
                className="image-preview-detail-img"
              />
              <div className="image-preview-info">
                <div className="image-preview-name">
                  {fileName || "Image attached"}
                </div>
                <div className="image-preview-source">
                  ✓ Ready for product catalog
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  className="admin-action-btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Replace
                </button>
                <button
                  type="button"
                  className="image-remove-btn"
                  onClick={() => {
                    onChange("");
                    setFileName("");
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageInputControl;
