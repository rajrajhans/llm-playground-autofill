// Log when content script loads
console.log('Content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { text } = request;

  const systemPrompt = 'System goes here';
  const temperature = 0.69;
  const maxTokens = 1000;
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

      if (textarea) {
        textarea.value = systemPrompt;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        console.error('[LLM_CONSOLE_AUTIOFILL]System textarea not found');
      }

      const temperatureLabel = Array.from(
        document.getElementsByTagName('span')
      ).find((span) => span.textContent === 'Temperature');

      if (temperatureLabel) {
        let container = temperatureLabel;
        // navigate up through parents until we find a div containing both the label and input
        while (container && !container.querySelector('input')) {
          container = container.parentElement;
        }

        if (container) {
          const input = container.querySelector('input');
          if (input) {
            input.value = temperature;
            input.dispatchEvent(new Event('input', { bubbles: true }));

            // find the slider in the next sibling div
            const sliderContainer = container.nextElementSibling;
            if (sliderContainer) {
              const slider = sliderContainer.querySelector('[role="slider"]');
              if (slider) {
                slider.setAttribute('aria-valuenow', temperature);
                slider.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
          } else {
            console.error('[LLM_CONSOLE_AUTIOFILL]Temperature input not found');
          }
        }
      } else {
        console.error('[LLM_CONSOLE_AUTIOFILL]Temperature label not found');
      }

      console.log('[LLM_CONSOLE_AUTIOFILL] execution complete');
    }, 300); // 300ms should cover most animation durations
  } else {
    console.error(
      '[LLM_CONSOLE_AUTIOFILL] System instructions heading not found. Step 1 failed.'
    );
  }
});
