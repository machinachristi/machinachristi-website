// Chat functionality
const FUNCTION_URL = 'https://YOUR-FUNCTION-APP-NAME.azurewebsites.net/api/chat';

function toggleChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatButton = document.getElementById('chat-button');

    if (chatWidget.classList.contains('chat-hidden')) {
        chatWidget.classList.remove('chat-hidden');
        chatWidget.classList.add('chat-visible');
        chatButton.style.display = 'none';
    } else {
        chatWidget.classList.remove('chat-visible');
        chatWidget.classList.add('chat-hidden');
        chatButton.style.display = 'flex';
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Clear input
    input.value = '';

    // Add user message to chat
    addMessage(message, 'user');

    // Disable send button while waiting
    const sendButton = document.getElementById('send-button');
    sendButton.disabled = true;
    sendButton.textContent = '...';

    try {
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Extract the AI response
        const aiMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

        // Add AI message to chat
        addMessage(aiMessage, 'assistant');

    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, there was an error processing your request.', 'assistant');
    } finally {
        // Re-enable send button
        sendButton.disabled = false;
        sendButton.textContent = 'Send';
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
