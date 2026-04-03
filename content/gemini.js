// prompt navigator - gemini (combined)

const GEMINI_PROMPT_SELECTOR = "user-query-content";

let prompts = [];
let currentIndex = -1;

function collectPrompts() {
  prompts = Array.from(document.querySelectorAll(GEMINI_PROMPT_SELECTOR));
  return prompts;
}

function navigateTo(index) {
  if (index < 0 || index >= prompts.length) return;
  currentIndex = index;
  prompts[index].scrollIntoView({ behavior: "smooth", block: "center" });
  highlightPrompt(index);
}

function navigatePrevious() {
  collectPrompts();
  if (prompts.length === 0) return;
  const target = currentIndex <= 0 ? prompts.length - 1 : currentIndex - 1;
  navigateTo(target);
}

function navigateNext() {
  collectPrompts();
  if (prompts.length === 0) return;
  const target = currentIndex >= prompts.length - 1 ? 0 : currentIndex + 1;
  navigateTo(target);
}

function highlightPrompt(index) {
  prompts.forEach(p => p.classList.remove("pn-active-prompt"));
  prompts[index].classList.add("pn-active-prompt");
  setTimeout(() => {
    prompts[index]?.classList.remove("pn-active-prompt");
  }, 1500);
}

function truncateText(text, maxLength = 72) {
  // 1. Trim whitespace and condense multiple spaces
  const cleaned = text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^You said[:\s]*/i, ""); 
    
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength) + "..." : cleaned;
}

function injectUI() {
  if (document.getElementById("pn-container")) return;

  const container = document.createElement("div");
  container.id = "pn-container";

  const upBtn = document.createElement("button");
  upBtn.id = "pn-up";
  upBtn.title = "Previous prompt";
  upBtn.innerHTML = "&#8679;";
  upBtn.addEventListener("click", () => {
    navigatePrevious();
    renderPanel();
  });

  const downBtn = document.createElement("button");
  downBtn.id = "pn-down";
  downBtn.title = "Next prompt";
  downBtn.innerHTML = "&#8681;";
  downBtn.addEventListener("click", () => {
    navigateNext();
    renderPanel();
  });

  const panelBtn = document.createElement("button");
  panelBtn.id = "pn-panel-toggle";
  panelBtn.title = "Show all prompts";
  panelBtn.innerHTML = "&#9776;";
  panelBtn.addEventListener("click", togglePanel);

  const panel = document.createElement("div");
  panel.id = "pn-panel";
  panel.style.display = "none";

  container.appendChild(upBtn);
  container.appendChild(downBtn);
  container.appendChild(panelBtn);
  container.appendChild(panel);
  document.body.appendChild(container);
}

function renderPanel() {
  const panel = document.getElementById("pn-panel");
  if (!panel) return;

  collectPrompts();
  panel.innerHTML = "";

  if (prompts.length === 0) {
    panel.innerHTML = "<p class='pn-empty'>No prompts found.</p>";
    return;
  }

  prompts.forEach((prompt, index) => {
    const item = document.createElement("div");
    item.className = "pn-item";
    if (index === currentIndex) item.classList.add("pn-item-active");

    // Because 'prompt' is now the outer wrapper, we can just look directly inside it
    const hasImage = prompt.querySelector('img[data-test-id="uploaded-img"], img.preview-image');
    const imageIndicator = hasImage ? "📸 " : "";

    // Look for the text bubble inside this wrapper
    const textEl = prompt.querySelector("div.query-text, span.user-query-bubble-with-background");
    let text = textEl ? truncateText(textEl.innerText) : "";
    
    // Fallbacks
    if (!text && hasImage) {
        text = "[Image only]";
    } else if (!text && !hasImage) {
        text = `Prompt ${index + 1}`;
    }

    item.textContent = `${index + 1}. ${imageIndicator}${text}`;
    
    item.addEventListener("click", () => {
      navigateTo(index);
      renderPanel();
    });

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

// Close the panel when clicking outside of it
document.addEventListener("click", (event) => {
  const panel = document.getElementById("pn-panel");
  const panelBtn = document.getElementById("pn-panel-toggle");

  // If the panel isn't open, or the elements don't exist yet, do nothing
  if (!panel || panel.style.display === "none") return;

  // If the click happened outside the panel AND outside the toggle button, close it
  if (!panel.contains(event.target) && !panelBtn.contains(event.target)) {
    panel.style.display = "none";
  }
});

function init() {
  collectPrompts();
  if (prompts.length > 0) {
    injectUI();
  }
}

const observer = new MutationObserver(() => {
  collectPrompts();
  if (prompts.length > 0 && !document.getElementById("pn-container")) {
    injectUI();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

console.log("pn: script loaded");
setTimeout(() => {
  console.log("pn: init fired");
  collectPrompts();
  console.log("pn: found", prompts.length, "prompts");
  if (prompts.length > 0) {
    injectUI();
    console.log("pn: ui injected");
  }
}, 2000);