// prompt navigator - chatgpt
initNavigator({
  name: "chatgpt",
  collectPrompts() {
    setPrompts(Array.from(document.querySelectorAll('[data-message-author-role="user"]')));
  },
  getLabel(prompt, index) {
    const hasImage = prompt.querySelector("img");
    const textEl = prompt.querySelector(".whitespace-pre-wrap") || prompt;
    let text = truncateText(
      (textEl?.innerText || "").replace(/^You said[:\s]*/i, "")
    );
    if (!text && hasImage) return "📸 [Image only]";
    if (!text) return `Prompt ${index + 1}`;
    return (hasImage ? "📸 " : "") + text;
  },
  theme: { color: "#10a37f", colorHover: "#0d8c6d", colorTint: "#e7f6f2",
         darkTint: "#1a3a32", darkText: "#10a37f", bubbleRadius: "22px" }
});