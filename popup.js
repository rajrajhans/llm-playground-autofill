document.getElementById('submit-btn').addEventListener('click', async () => {
  const text = document.getElementById('input-text').value;

  // Get the current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Send the text to our content script
  chrome.tabs.sendMessage(tab.id, { text });
});
