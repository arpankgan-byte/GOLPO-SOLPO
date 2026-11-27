import * as React from "react";
import { createRoot } from "react-dom/client";
import DancingLetters from "./dancing-letters";

const SKIP = "script,style,noscript,textarea,svg,[data-brand-font] [data-dancing-root],[data-dancing-root]";
function eligible(node: Text) {
  const parent = node.parentElement;
  if (!parent || parent.closest(SKIP)) return false;
  const value = node.nodeValue || "";
  if (!value.trim()) return false;
  const inHeading = !!parent.closest("h1,h2,h3,h4,h5,h6");
  const inBrand = !!parent.closest(".brand,.brand-name,.df-brand,.brandcol,[aria-label*='Golpo Solpo']");
  const phrase = /golpo\s+solpo/i.test(value) || (inBrand && /^(?:golpo|solpo)$/i.test(value.trim()));
  return inHeading || phrase;
}
function animateText(node: Text) {
  if (!eligible(node)) return;
  const host = document.createElement("span");
  host.setAttribute("data-dancing-root", "");
  host.className = "dancing-mount";
  const text = node.nodeValue || "";
  node.parentNode?.replaceChild(host, node);
  createRoot(host).render(<DancingLetters text={text} className="dancing-letters-root" letterClassName="dancing-letter" />);
}
function scan(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) { animateText(node as Text); return; }
  if (!(node instanceof Element) || node.matches(SKIP)) return;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);
  texts.forEach(animateText);
}
function mount() {
  scan(document.body);
  new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "characterData") scan(record.target);
      else record.addedNodes.forEach(scan);
    });
  }).observe(document.body, { subtree: true, childList: true, characterData: true });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
else mount();
