import React, { useMemo, useState } from "react";
import "./ImageCardGallery.css";

export function ImageCardGallery({ images, mapPlaceholderUrl, className }) {
  const [selection, setSelection] = useState({ type: "image", index: 0 });

  const mainImage =
    selection.type === "map" ? mapPlaceholderUrl : images?.[selection.index] ?? "";

  const thumbCandidates = useMemo(() => {
    const all = (images || []).map((src, index) => ({ src, index }));

    if (selection.type !== "image") return all;
    return all.filter((x) => x.index !== selection.index);
  }, [images, selection.type, selection.index]);

  // Slot 1 reserved for map placeholder => remaining 3 slots for images
  const visibleImages = useMemo(() => thumbCandidates.slice(0, 3), [thumbCandidates]);
  const remainingCount = Math.max(0, thumbCandidates.length - 3);
  const thumbCols = 1 + visibleImages.length;

  return (
    <div className={["icg-card", className].filter(Boolean).join(" ")}>
      <div className="icg-main">
        {mainImage ? (
          <img src={mainImage} alt="Selected" className="icg-main-img" />
        ) : (
          <div className="icg-main-placeholder">No image</div>
        )}
      </div>

      <div className="icg-thumbs" style={{ "--icg-cols": thumbCols }}>
        <button
          type="button"
          className={
            selection.type === "map" ? "icg-thumb-btn icg-thumb--selected" : "icg-thumb-btn"
          }
          aria-label="Map"
          onClick={() => setSelection({ type: "map" })}
        >
          <div className="icg-thumb-wrap">
            <img src={mapPlaceholderUrl} alt="Map" className="icg-thumb-img" />
          </div>
        </button>

        {visibleImages.map(({ src, index }, i) => {
          const isLastVisibleSlot = i === 2;
          const showOverlay = isLastVisibleSlot && remainingCount > 0;

          return (
            <button
              key={src + index}
              type="button"
              className="icg-thumb-btn"
              onClick={() => setSelection({ type: "image", index })}
            >
              <div className="icg-thumb-wrap">
                <img src={src} alt={`Thumbnail ${i + 1}`} className="icg-thumb-img" />
                {showOverlay && <div className="icg-overlay">+{remainingCount}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
