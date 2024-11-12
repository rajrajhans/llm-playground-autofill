document.getElementById('submit-btn').addEventListener('click', async () => {
  const text = document.getElementById('input-text').value;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await chrome.tabs.sendMessage(tab.id, { text });
  } catch (error) {
    console.error('[LLM_CONSOLE_AUTOFILL] Popup error:', error);
  }
});
