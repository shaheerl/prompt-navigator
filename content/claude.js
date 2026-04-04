// prompt navigator - claude
initNavigator({
  name: "claude",
  collectPrompts() {
    // target the turn-level wrapper which exists for ALL user messages,
    // with or without text, with or without images
    setPrompts(Array.from(document.querySelectorAll('div[data-test-render-count]')).filter(el =>
      el.querySelector('div[data-testid="user-message"]') ||
      el.querySelector('div[data-testid$=".png"], div[data-testid$=".jpg"], div[data-testid$=".jpeg"], div[data-testid$=".webp"], div[data-testid$=".gif"], div[data-testid$=".heic"]')
    ));
  },
  getBubble(el) {
    return el.querySelector("div.rounded-xl") || el;
  },
  getLabel(prompt, index) {
    const hasImage = prompt.querySelector('div[data-testid$=".png"], div[data-testid$=".jpg"], div[data-testid$=".jpeg"], div[data-testid$=".webp"], div[data-testid$=".gif"], div[data-testid$=".heic"]');
    const imageIndicator = hasImage ? "📸 " : "";

    const textEl = prompt.querySelector('div[data-testid="user-message"]');
    const text = textEl ? truncateText(textEl.innerText) : "";

    if (!text && hasImage) return "📸 [Image only]";
    if (!text) return `Prompt ${index + 1}`;
    return imageIndicator + text;
  },
  theme: { color: "#D97757", colorHover: "#C06447", colorTint: "#FDF3F0",
         darkTint: "#2e1a13", darkText: "#e8956d", bubbleRadius: "8px" }
});