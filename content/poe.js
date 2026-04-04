// prompt navigator - poe
initNavigator({
  name: "poe",
  collectPrompts() {
    setPrompts(Array.from(document.querySelectorAll('[class*="ChatMessage_rightSideMessageWrapper"]')));
  },
  getLabel(prompt, index) {
    const hasImage = prompt.querySelector("img");
    const textEl = prompt.querySelector('[class*="Prose_prose"]');
    let text = truncateText(textEl?.innerText || "");
    if (!text && hasImage) return "📸 [Image only]";
    if (!text) return `Prompt ${index + 1}`;
    return (hasImage ? "📸 " : "") + text;
  },
  theme: { color: "#6842ff", colorHover: "#5533d6", colorTint: "#f3f0ff",
         darkTint: "#261a4d", darkText: "#9b81ff", bubbleRadius: "18px" }
});