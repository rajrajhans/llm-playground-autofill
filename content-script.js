// Log when content script loads
console.log('Content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { text } = request;

  const systemPrompt = 'System goes here';
  const temperature = 0.69;
  const userPrompt = text;

  const systemInstructionsHeading = Array.from(
    document.getElementsByTagName('h3')
  ).find((el) => el.textContent === 'System instructions');

  if (systemInstructionsHeading) {
    systemInstructionsHeading.click();
    // Wait for animation to complete and textarea to be visible
    setTimeout(() => {
      // Find the textarea by its placeholder text
      const textareas = document.getElementsByTagName('textarea');

      const textarea = Array.from(textareas).find(
        (el) => el.placeholder === 'You are a helpful assistant...'
      );

      console.log('Found matching textarea:', textarea);

      if (textarea) {
        textarea.value = systemPrompt;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        console.error('System textarea not found');
      }
      console.log('done');
    }, 300); // 300ms should cover most animation durations
  } else {
    console.error('System instructions heading not found. Step 1 failed.');
  }
});
