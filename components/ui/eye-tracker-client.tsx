import * as React from "react";
import { createRoot } from "react-dom/client";
import { EyeTracker } from "./interactive-eye-tracker";

function SiteEyeTracker() {
  return (
    <div className="gs-eye-tracker-stage" aria-hidden="false">
      <div className="gs-eye-tracker-widget">
        <EyeTracker shape="Cube" eyes="Slant" size={70} follow={72} bounce={24} />
      </div>
    </div>
  );
}

function mount() {
  document.querySelectorAll<HTMLElement>("[data-eye-tracker-root]").forEach((node) => {
    if (node.dataset.mounted) return;
    node.dataset.mounted = "true";
    createRoot(node).render(<SiteEyeTracker />);
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
else mount();
