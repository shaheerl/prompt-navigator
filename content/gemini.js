// prompt navigator - gemini
initNavigator({
  name: "gemini",
  theme: { color: "#1a73e8", colorHover: "#1558b0", colorTint: "#e8f0fe",
           darkTint: "#1a2a4d", darkText: "#7b9fee", bubbleRadius: "8px" },
  collectPrompts() {
    setPrompts(Array.from(document.querySelectorAll("user-query-content")));
  },
  getLabel(prompt, index) {
    const hasImage = prompt.querySelector('img[data-test-id="uploaded-img"], img.preview-image');
    const textEl = prompt.querySelector("div.query-text, span.user-query-bubble-with-background");
    let text = textEl
      ? truncateText(textEl.innerText.replace(/^You said[:\s]*/i, ""))
      : "";
    if (!text && hasImage) return "📸 [Image only]";
    if (!text) return `Prompt ${index + 1}`;
    return (hasImage ? "📸 " : "") + text;
  },
  theme: { color: "#1a73e8", colorHover: "#1558b0", colorTint: "#e8f0fe",
         darkTint: "#1a2a4d", darkText: "#7b9fee", bubbleRadius: "8px" }
  
});