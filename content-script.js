// Log when content script loads
console.log('Content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { text, shouldFillMaxTokens } = request;

  const data = JSON.parse(text);

  const systemPrompt = data.system;
  const temperature = data.temperature;
  const maxTokens = data.max_tokens;
  const userPrompt = data.user;
  const model = data.model;

  const systemInstructionsHeading = Array.from(
    document.getElementsByTagName('h3')
  ).find((el) => el.textContent === 'System instructions');

  if (systemInstructionsHeading) {
    systemInstructionsHeading.click();
    // wait for animation to complete and textarea to be visible
    setTimeout(() => {
      // find the textarea by its placeholder text
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

      if (shouldFillMaxTokens) {
        const maxLengthLabel = Array.from(
          document.getElementsByTagName('span')
        ).find((span) => span.textContent === 'Maximum length');

        if (maxLengthLabel) {
          let container = maxLengthLabel;
          while (container && !container.querySelector('input')) {
            container = container.parentElement;
          }

          if (container) {
            const input = container.querySelector('input');
            if (input) {
              input.value = maxTokens;
              input.dispatchEvent(new Event('input', { bubbles: true }));

              const sliderContainer = container.nextElementSibling;
              if (sliderContainer) {
                const slider = sliderContainer.querySelector('[role="slider"]');
                if (slider) {
                  slider.setAttribute('aria-valuenow', maxTokens);
                  slider.dispatchEvent(new Event('input', { bubbles: true }));
                }
              }
            } else {
              console.error(
                '[LLM_CONSOLE_AUTIOFILL] Max tokens input not found'
              );
            }
          }
        } else {
          console.error('[LLM_CONSOLE_AUTIOFILL] Max length label not found');
        }
      }

      const userPromptElement = Array.from(
        document.getElementsByTagName('p')
      ).find(
        (p) => p.getAttribute('data-placeholder') === 'Enter user message...'
      );

      if (userPromptElement) {
        userPromptElement.textContent = userPrompt;
        userPromptElement.classList.remove('is-empty', 'is-editor-empty');
        userPromptElement.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        console.error('[LLM_CONSOLE_AUTIOFILL] User prompt input not found');
      }

      console.log('[LLM_CONSOLE_AUTIOFILL] execution complete');
    }, 300); // 300ms should cover most animation durations
  } else {
    console.error(
      '[LLM_CONSOLE_AUTIOFILL] System instructions heading not found. Step 1 failed.'
    );
  }
});
