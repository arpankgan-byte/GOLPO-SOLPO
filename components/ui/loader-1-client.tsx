import * as React from "react";
import { createRoot } from "react-dom/client";
import { Component } from "./loader-1";

function mount(scope: ParentNode = document) {
  const nodes = Array.from(scope.querySelectorAll<HTMLElement>("[data-pencil-loader-root]"));
  if (scope instanceof HTMLElement && scope.matches("[data-pencil-loader-root]")) nodes.unshift(scope);
  nodes.forEach((node) => {
    if (node.dataset.pencilMounted) return;
    node.dataset.pencilMounted = "true";
    createRoot(node).render(<Component />);
  });
}
mount();
new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
  if (node instanceof HTMLElement) mount(node);
}))).observe(document.documentElement, { subtree: true, childList: true });
