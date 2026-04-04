// prompt navigator - core

let prompts = [];
let currentIndex = -1;
let activeConfig = null;

function setPrompts(p) { prompts = p; }

function navigateTo(index) {
  if (index < 0 || index >= prompts.length) return;
  currentIndex = index;
  prompts[index].scrollIntoView({ behavior: "smooth", block: "center" });
  highlightPrompt(index);
}

function navigatePrevious() {
  activeConfig.collectPrompts();
  if (prompts.length === 0) return;
  navigateTo(currentIndex <= 0 ? prompts.length - 1 : currentIndex - 1);
}

function navigateNext() {
  activeConfig.collectPrompts();
  if (prompts.length === 0) return;
  navigateTo(currentIndex >= prompts.length - 1 ? 0 : currentIndex + 1);
}

function highlightPrompt(index) {
  prompts.forEach(p => activeConfig.getBubble(p).classList.remove("pn-active-prompt"));
  const bubble = activeConfig.getBubble(prompts[index]);
  bubble.classList.add("pn-active-prompt");
  setTimeout(() => bubble.classList.remove("pn-active-prompt"), 1500);
}

function truncateText(text, maxLength = 72) {
  const cleaned = text.trim().replace(/\s+/g, " ");
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength) + "..." : cleaned;
}

function renderPanel() {
  const panel = document.getElementById("pn-panel");
  if (!panel) return;

  activeConfig.collectPrompts();
  panel.innerHTML = "";

  if (prompts.length === 0) {
    panel.innerHTML = "<p class='pn-empty'>No prompts found.</p>";
    return;
  }

  prompts.forEach((prompt, index) => {
    const item = document.createElement("div");
    item.className = "pn-item";
    if (index === currentIndex) item.classList.add("pn-item-active");
    item.textContent = `${index + 1}. ${activeConfig.getLabel(prompt, index)}`;
    item.addEventListener("click", () => { navigateTo(index); renderPanel(); });
    panel.appendChild(item);
  });
}

function togglePanel() {
  const panel = document.getElementById("pn-panel");
  if (!panel) return;
  if (panel.style.display === "none") {
    renderPanel();
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
}

function injectUI() {
  if (document.getElementById("pn-container")) return;

  const container = document.createElement("div");
  container.id = "pn-container";

  const upBtn = document.createElement("button");
  upBtn.id = "pn-up";
  upBtn.title = "Previous prompt";
  upBtn.innerHTML = "&#8679;";
  upBtn.addEventListener("click", () => { navigatePrevious(); renderPanel(); });

  const downBtn = document.createElement("button");
  downBtn.id = "pn-down";
  downBtn.title = "Next prompt";
  downBtn.innerHTML = "&#8681;";
  downBtn.addEventListener("click", () => { navigateNext(); renderPanel(); });

  const panelBtn = document.createElement("button");
  panelBtn.id = "pn-panel-toggle";
  panelBtn.title = "Show all prompts";
  panelBtn.innerHTML = "&#9776;";
  panelBtn.addEventListener("click", (e) => { e.stopPropagation(); togglePanel(); });

  const panel = document.createElement("div");
  panel.id = "pn-panel";
  panel.style.display = "none";

  container.appendChild(upBtn);
  container.appendChild(downBtn);
  container.appendChild(panelBtn);
  container.appendChild(panel);
  document.body.appendChild(container);

  document.addEventListener("click", (e) => {
    const panel = document.getElementById("pn-panel");
    const container = document.getElementById("pn-container");
    if (panel && panel.style.display !== "none" && !container.contains(e.target)) {
      panel.style.display = "none";
    }
  });
}

function injectTheme(theme) {
  if (document.getElementById("pn-theme")) return;
  const style = document.createElement("style");
  style.id = "pn-theme";
  style.textContent = `
    :root {
      --pn-color: ${theme.color};
      --pn-color-hover: ${theme.colorHover};
      --pn-color-tint: ${theme.colorTint};
      --pn-color-dark-tint: ${theme.darkTint ?? "#1a1a2e"};
      --pn-color-dark-text: ${theme.darkText ?? theme.color};
      --pn-bubble-radius: ${theme.bubbleRadius ?? "8px"};
    }
  `;
  document.head.appendChild(style);
}

function initNavigator(config) {
  // default getBubble to identity if adapter doesn't need it
  config.getBubble = config.getBubble || ((el) => el);
  activeConfig = config;
  injectTheme(config.theme);

  config.collectPrompts();
  if (prompts.length > 0) injectUI();

  const observer = new MutationObserver(() => {
    config.collectPrompts();
    if (prompts.length > 0 && !document.getElementById("pn-container")) injectUI();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  console.log(`pn: ${config.name} script loaded`);
  setTimeout(() => {
    console.log(`pn: ${config.name} init fired`);
    config.collectPrompts();
    console.log(`pn: found ${prompts.length} prompts`);
    if (prompts.length > 0) { injectUI(); console.log("pn: ui injected"); }
  }, 2000);
}