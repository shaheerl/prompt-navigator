// prompt navigator - deepseek
initNavigator({
  name: "deepseek",
  collectPrompts() {
    const all = Array.from(document.querySelectorAll(".ds-message"));
    setPrompts(all.filter(msg => !msg.querySelector('.ds-markdown, .markdown-body, [class*="markdown"]')));
  },
  getLabel(prompt, index) {
    const rawText = prompt.innerText || "";
    const hasImage = /\.(png|jpe?g|gif|webp|heic)\s+[A-Z]*\s*[\d.]+\s*(KB|MB)/i.test(rawText);
    let text = truncateText(
      rawText.replace(/.*?\.(png|jpe?g|gif|webp|heic)\s+[A-Z]*\s*[\d.]+\s*(KB|MB)/i, "")
    );
    if (!text && hasImage) return "📸 [Image only]";
    if (!text) return `Prompt ${index + 1}`;
    return (hasImage ? "📸 " : "") + text;
  },
  theme: { color: "#4d6bfe", colorHover: "#3b55d9", colorTint: "#ebf0ff",
         darkTint: "#1a234d", darkText: "#7b94ff", bubbleRadius: "16px" }
});