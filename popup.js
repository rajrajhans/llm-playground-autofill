document.getElementById('submit-btn').addEventListener('click', async () => {
  const text = document.getElementById('input-text').value;
  const shouldFillMaxTokens =
    document.getElementById('fill-max-tokens').checked;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await chrome.tabs.sendMessage(tab.id, { text, shouldFillMaxTokens });
  } catch (error) {
    console.error('[LLM_CONSOLE_AUTOFILL] Popup error:', error);
  }
});
