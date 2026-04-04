// prompt navigator - meta
initNavigator({
  name: "meta",
  collectPrompts() {
    setPrompts(Array.from(document.querySelectorAll('[data-message-type="user"]')));
  },
  getLabel(prompt, index) {
    const hasImage = prompt.querySelector("img");
    const textEl = prompt.querySelector(".text-response, .whitespace-pre-wrap");
    let text = truncateText(textEl?.innerText || "");
    if (!text && hasImage) return "📸 [Image only]";
    if (!text) return `Prompt ${index + 1}`;
    return (hasImage ? "📸 " : "") + text;
  },
  theme: { color: "#0064e0", colorHover: "#004bb5", colorTint: "#e5f0ff",
         darkTint: "#1a2a4d", darkText: "#66a8ff", bubbleRadius: "22px" }
});