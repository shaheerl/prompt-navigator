// prompt navigator - perplexity
initNavigator({
  name: "perplexity",
  collectPrompts() {
    setPrompts(Array.from(document.querySelectorAll(".group\\/query")));
  },
  getLabel(prompt, index) {
    const messageBlock = prompt.closest(".bg-base") || prompt.parentElement?.parentElement;
    const hasImage = messageBlock?.querySelector('img[alt="Attachment"]');
    const textEl = prompt.querySelector("span.text-foreground") || prompt;
    let text = truncateText((textEl?.innerText || "").replace(/^You said[:\s]*/i, ""));
    if (/^.*\.(jpg|jpeg|png|gif|webp|heic)$/i.test(text) && hasImage) return "📸 [Image only]";
    if (!text && hasImage) return "📸 [Image only]";
    if (!text) return `Prompt ${index + 1}`;
    return (hasImage ? "📸 " : "") + text;
  },
  theme: { color: "#20b8cd", colorHover: "#1793a6", colorTint: "#e5f7f9",
         darkTint: "#1a3c40", darkText: "#4cd3e6", bubbleRadius: "16px 16px 0px 16px" }
});