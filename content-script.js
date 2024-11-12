// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { text } = request;

  // Find the divs and insert the text
  const div1 = document.getElementById('div-1');
  const div2 = document.getElementById('div-2');

  if (div1) div1.textContent = text;
  if (div2) div2.textContent = text;
});
