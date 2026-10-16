
(function () {
  'use strict';

  // ==========================================
  // 1. AUTOMATIC COPYRIGHT YEAR
  // ==========================================
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  

  // ==========================================
  // 3. CHATBOT ELEMENTS
  // ==========================================
  const launcher = document.getElementById('chat-launcher');
  const panel = document.getElementById('portfolio-chat');
  const closeButton = document.getElementById('chat-close');
  const messages = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  // Find the submit button inside the chat form.
  const sendButton = form
    ? form.querySelector('button[type="submit"]')
    : null;

  // Prevent multiple questions from being processed at once.
  let isSending = false;

  // ==========================================
  // 4. OPEN AND CLOSE THE CHATBOT
  // ==========================================
  function setChatOpen(open) {
    if (!panel || !launcher) {
      return;
    }

    panel.classList.toggle('open', open);
    launcher.setAttribute('aria-expanded', String(open));

    if (open && input && !isSending) {
      input.focus();
    }
  }

  // ==========================================
  // 5. DISPLAY CHAT MESSAGES
  // ==========================================
  function addMessage(text, role) {
    if (!messages) {
      return null;
    }

    const message = document.createElement('div');

    message.className = 'chat-message ' + role;
    message.textContent = text;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    return message;
  }

  // ==========================================
  // 6. SHOW LOADING STATE
  // ==========================================
  function setLoading(loading) {
    isSending = loading;

    if (input) {
      input.disabled = loading;
      input.placeholder = loading
        ? 'Waiting for a response...'
        : 'Ask a question…';
    }

    if (sendButton) {
      sendButton.disabled = loading;
      sendButton.textContent = loading ? 'Sending...' : 'Send';
    }

    // Prevent suggestion buttons from sending duplicate questions.
    if (panel) {
      panel.querySelectorAll('[data-question]').forEach(
        function (suggestion) {
          suggestion.disabled = loading;
        }
      );
    }

    if (form) {
      form.setAttribute('aria-busy', String(loading));
    }
  }

  // ==========================================
  // 7. SEND QUESTION TO LARAVEL
  // ==========================================
  async function askLaravel(question) {
    let response;

    try {
      response = await fetch(
        'http://127.0.0.1:8000/api/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            question: question
          })
        }
      );
    } catch (error) {
      // Usually a connection issue, such as Laravel being offline.
      throw new Error(
        'Cannot reach the Laravel server. Make sure it is running.'
      );
    }

    // Try to read the JSON returned by Laravel.
    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error(
        'The server returned an invalid response. Please try again.'
      );
    }

    // Handle unsuccessful HTTP responses.
    if (!response.ok) {
      if (response.status === 422) {
        throw new Error(
          'Your question was invalid. Please try a shorter question.'
        );
      }

      if (response.status >= 500) {
        throw new Error(
          'The server encountered a problem. Please try again later.'
        );
      }

      throw new Error(
        data.message ||
        'The request failed with status ' + response.status + '.'
      );
    }

    // Validate the expected response structure.
    if (typeof data.answer !== 'string') {
      throw new Error(
        'The server did not return a valid answer.'
      );
    }

    return data.answer;
  }

  // ==========================================
  // 8. PROCESS A QUESTION
  // ==========================================
  async function sendQuestion(question) {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || isSending) {
      return;
    }

    // Display the question immediately.
    addMessage(cleanQuestion, 'user');

    // Clear the input field.
    if (input) {
      input.value = '';
    }

    // Show the temporary loading message.
    const loadingMessage = addMessage(
      'Thinking...',
      'bot'
    );

    // Disable the form until the request finishes.
    setLoading(true);

    try {
      // Wait for Laravel to process the question.
      const answer = await askLaravel(cleanQuestion);

      // Replace the loading message with the answer.
      if (loadingMessage) {
        loadingMessage.textContent = answer;
      }
    } catch (error) {
      console.error('Chatbot API error:', error);

      // Display the actual, user-friendly error message.
      if (loadingMessage) {
        loadingMessage.textContent =
          'Sorry! ' + error.message;
      }
    } finally {
      // Always restore the form, even when the request fails.
      setLoading(false);

      if (messages) {
        messages.scrollTop = messages.scrollHeight;
      }

      if (
        panel &&
        panel.classList.contains('open') &&
        input
      ) {
        input.focus();
      }
    }
  }

  // ==========================================
  // 9. INITIALIZE CHATBOT EVENTS
  // ==========================================
  if (
    launcher &&
    panel &&
    closeButton &&
    messages &&
    form &&
    input
  ) {
    // Open or toggle the chatbot.
    launcher.addEventListener('click', function () {
      setChatOpen(!panel.classList.contains('open'));
    });

    // Close the chatbot.
    closeButton.addEventListener('click', function () {
      setChatOpen(false);
      launcher.focus();
    });

    // Handle questions submitted through the form.
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const question = input.value.trim();

      if (!question || isSending) {
        return;
      }

      sendQuestion(question);
    });

    // Handle the suggested question buttons.
    panel.querySelectorAll('[data-question]').forEach(
      function (suggestion) {
        suggestion.addEventListener('click', function () {
          if (isSending) {
            return;
          }

          const question =
            suggestion.getAttribute('data-question');

          if (question) {
            sendQuestion(question);
          }
        });
      }
    );
  }
})();
