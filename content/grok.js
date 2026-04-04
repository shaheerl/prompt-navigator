// prompt navigator - grok
initNavigator({
  name: "grok",
  collectPrompts() {
    setPrompts(Array.from(document.querySelectorAll(".message-bubble.rounded-br-lg")));
  },
  getLabel(prompt, index) {
    const hasImage = prompt.querySelector(".inline-media-container img, img");
    const textEl = prompt.querySelector(".response-content-markdown") || prompt;
    let text = truncateText(textEl?.innerText || "");
    if (!text && hasImage) return "📸 [Image only]";
    if (!text) return `Prompt ${index + 1}`;
    return (hasImage ? "📸 " : "") + text;
  },
  theme: { color: "#0f1419", colorHover: "#272c30", colorTint: "#e7e9ea",
         darkTint: "#202327", darkText: "#ffffff", bubbleRadius: "24px 24px 8px 24px" }
});