"use client";

import React from "react";
import { CATEGORIES } from "./constants";
import { ImageInputControl } from "./ImageInputControl";

export function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  productFormData,
  setProductFormData,
  frontImageMode,
  setFrontImageMode,
  backImageMode,
  setBackImageMode,
  handleSaveProduct,
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">
            {editingProduct ? `Edit Product: ${editingProduct.name}` : "Create New Streetwear Drop"}
          </h3>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSaveProduct}>
          <div className="admin-form-group">
            <label>Product Title / Name</label>
            <input
              type="text"
              className="admin-input"
              required
              placeholder="e.g. Raglan Half Sleeve Forest Green"
              value={productFormData.name}
              onChange={(e) =>
                setProductFormData({ ...productFormData, name: e.target.value })
              }
            />
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Category</label>
              <select
                className="admin-select"
                value={productFormData.category}
                onChange={(e) => {
                  const found = CATEGORIES.find((c) => c.id === e.target.value);
                  setProductFormData({
                    ...productFormData,
                    category: e.target.value,
                    categoryName: found ? found.name : e.target.value,
                  });
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Color Accent</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Green & Cream"
                value={productFormData.color}
                onChange={(e) =>
                  setProductFormData({ ...productFormData, color: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Selling Price (₹)</label>
              <input
                type="number"
                className="admin-input"
                required
                placeholder="699"
                value={productFormData.price}
                onChange={(e) =>
                  setProductFormData({ ...productFormData, price: e.target.value })
                }
              />
            </div>

            <div className="admin-form-group">
              <label>Original Price (₹)</label>
              <input
                type="number"
                className="admin-input"
                placeholder="999"
                value={productFormData.originalPrice}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    originalPrice: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Discount Tag</label>
              <input
                type="text"
                className="admin-input"
                placeholder="30% OFF"
                value={productFormData.discount}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    discount: e.target.value,
                  })
                }
              />
            </div>

            <div className="admin-form-group">
              <label>Stock Units</label>
              <input
                type="number"
                className="admin-input"
                placeholder="50"
                value={productFormData.stock}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    stock: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Fabric / GSM</label>
              <input
                type="text"
                className="admin-input"
                placeholder="240 GSM Combed Cotton"
                value={productFormData.gsm}
                onChange={(e) =>
                  setProductFormData({ ...productFormData, gsm: e.target.value })
                }
              />
            </div>

            <div className="admin-form-group">
              <label>Silhouette / Fit</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Box-Fit Oversized"
                value={productFormData.fit}
                onChange={(e) =>
                  setProductFormData({ ...productFormData, fit: e.target.value })
                }
              />
            </div>
          </div>

          {/* Dual-Option Front Image (URL / File Upload) */}
          <ImageInputControl
            label="Front Image"
            required={true}
            value={productFormData.frontImage}
            mode={frontImageMode}
            setMode={setFrontImageMode}
            onChange={(val) =>
              setProductFormData({ ...productFormData, frontImage: val })
            }
            helperText="Select 'Image URL' to link an image or 'Upload File' to upload from your PC."
          />

          {/* Dual-Option Back Image (URL / File Upload) */}
          <ImageInputControl
            label="Back Image (Optional)"
            required={false}
            value={productFormData.backImage}
            mode={backImageMode}
            setMode={setBackImageMode}
            onChange={(val) =>
              setProductFormData({ ...productFormData, backImage: val })
            }
            helperText="Secondary angle or back design shot."
          />

          <div className="admin-form-group">
            <label>Description</label>
            <textarea
              className="admin-textarea"
              placeholder="Signature two-tone Raglan cut featuring heavy ribbed collar..."
              value={productFormData.description}
              onChange={(e) =>
                setProductFormData({
                  ...productFormData,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={productFormData.isBestseller}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    isBestseller: e.target.checked,
                  })
                }
              />
              <span>Mark as Bestseller</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={productFormData.isNew}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    isNew: e.target.checked,
                  })
                }
              />
              <span>Mark as New Drop</span>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary">
              {editingProduct ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
