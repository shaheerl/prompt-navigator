// prompt navigator - deepseek

// Target all message blocks, we will filter out the AI responses below
const DEEPSEEK_PROMPT_SELECTOR = '.ds-message';

let prompts = [];
let currentIndex = -1;

function collectPrompts() {
  const allMessages = Array.from(document.querySelectorAll(DEEPSEEK_PROMPT_SELECTOR));
  
  // --- THE FIX ---
  // AI responses use a markdown renderer (classes like 'ds-markdown'). 
  // User prompts are just raw text. We filter out any message that has a markdown block inside it.
  prompts = allMessages.filter(msg => {
    const isAI = msg.querySelector('.ds-markdown, .markdown-body, [class*="markdown"]');
    return !isAI; // Only keep it if it's NOT an AI message
  });
  
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
  // Removes DeepSeek's image metadata (e.g. "image.png PNG 8.45KB")
  let cleaned = text.replace(/.*?\.(png|jpe?g|gif|webp|heic)\s+[A-Z]*\s*[\d.]+\s*(KB|MB)/i, "");
  cleaned = cleaned.trim().replace(/\s+/g, " ");
  
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

    const rawText = prompt.innerText || "";
    
    // Look for image extensions paired with file sizes in the raw text
    const hasImage = /\.(png|jpe?g|gif|webp|heic)\s+[A-Z]*\s*[\d.]+\s*(KB|MB)/i.test(rawText);
    const imageIndicator = hasImage ? "📸 " : "";

    let text = truncateText(rawText);
    
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

function init() {
  collectPrompts();
  if (prompts.length > 0) {
    injectUI();
  }
}

// Global click listener to close the panel when clicking off of it
document.addEventListener("click", (event) => {
  const panel = document.getElementById("pn-panel");
  const panelBtn = document.getElementById("pn-panel-toggle");
  if (!panel || panel.style.display === "none") return;
  if (!panel.contains(event.target) && !panelBtn.contains(event.target)) {
    panel.style.display = "none";
  }
});

const observer = new MutationObserver(() => {
  collectPrompts();
  if (prompts.length > 0 && !document.getElementById("pn-container")) {
    injectUI();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

console.log("pn: deepseek script loaded");
setTimeout(() => {
  console.log("pn: deepseek init fired");
  collectPrompts();
  console.log("pn: found", prompts.length, "prompts");
  if (prompts.length > 0) {
    injectUI();
    console.log("pn: ui injected");
  }
}, 2000);