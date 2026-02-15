// Chat functionality
const FUNCTION_URL = 'https://machinachristi-api-cghtfmdweffxf8ez.centralus-01.azurewebsites.net/api/chat';

async function sendMessage(sourceInput) {
    // Detect which input to use (homepage or chat input)
    const input = sourceInput || document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Transition from homepage to chat view if needed
    const homepageView = document.getElementById('homepage-view');
    const chatView = document.getElementById('chat-view');
    if (homepageView && !homepageView.classList.contains('hidden')) {
        homepageView.classList.add('hidden');
        chatView.classList.remove('hidden');
    }

    // Clear input
    input.value = '';

    // Add user message to chat
    addMessage(message, 'user');

    // Disable send button while waiting
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
        sendButton.disabled = true;
        sendButton.textContent = '...';
    }

    try {
        // ✅ IDENTICAL API CALL - NO CHANGES
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        // ✅ IDENTICAL - NO CHANGES
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // ✅ IDENTICAL - NO CHANGES
        const data = await response.json();

        // ✅ IDENTICAL - NO CHANGES
        const aiMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

        // ✅ IDENTICAL - NO CHANGES
        addMessage(aiMessage, 'assistant');

    } catch (error) {
        // ✅ IDENTICAL - NO CHANGES
        console.error('Error:', error);
        addMessage('Sorry, there was an error processing your request.', 'assistant');
    } finally {
        // Re-enable send button
        if (sendButton) {
            sendButton.disabled = false;
            sendButton.textContent = 'Send';
        }
    }
}

function addMessage(text, role) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', `chat-message-${role}`);

    const messageText = document.createElement('div');
    messageText.classList.add('chat-message-text');
    messageText.textContent = text;

    messageDiv.appendChild(messageText);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
