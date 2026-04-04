// prompt navigator - copilot
initNavigator({
  name: "copilot",
  collectPrompts() {
    setPrompts(Array.from(document.querySelectorAll('div[id$="-user-message"], .group\\/user-message')));
  },
  getLabel(prompt, index) {
    const hasImage = prompt.querySelector("img");
    const textEl = prompt.querySelector('[data-content="user-message"]') || prompt;
    let text = truncateText((textEl?.innerText || "").replace(/^You said[:\s]*/i, ""));
    if (!text && hasImage) return "📸 [Image only]";
    if (!text) return `Prompt ${index + 1}`;
    return (hasImage ? "📸 " : "") + text;
  },
  theme: { color: "#0f6cbd", colorHover: "#0c5696", colorTint: "#f0f6ff",
         darkTint: "#172b4d", darkText: "#4ba1ff", bubbleRadius: "16px" }
});