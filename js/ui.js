const chatContainer = document.getElementById('chat-container');
const aiCore = document.getElementById('ai-core');
const coreText = document.getElementById('core-text');

const coreStateText = {
    idle: 'TALK',
    listening: 'LISTENING',
    thinking: 'THINKING',
    speaking: 'SPEAKING'
};

/**
 * Creates a typewriter effect for the AI's response.
 * @param {HTMLElement} element The element to type into.
 * @param {string} text The text to type.
 */
function typeWriter(element, text) {
    return new Promise((resolve) => {
        let i = 0;
        const cursor = `<span class="cursor"></span>`;
        element.innerHTML = cursor; // Start with a cursor

        function typing() {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1) + cursor;
                i++;
                setTimeout(typing, 50); // Adjust typing speed here
            } else {
                element.innerHTML = text; // Remove cursor when done
                resolve();
            }
        }
        typing();
    });
}

/**
 * Adds a message to the UI with a smooth animation.
 * @param {string} message The message content.
 * @param {string} sender 'user' or 'assistant'.
 */
export async function addMessageToUI(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.dataset.sender = sender;

    const prefix = document.createElement('span');
    prefix.className = 'prefix';
    prefix.textContent = sender === 'user' ? 'YOU > ' : 'AI > ';

    const content = document.createElement('span');
    content.className = 'content';

    messageElement.appendChild(prefix);
    messageElement.appendChild(content);
    chatContainer.appendChild(messageElement);

    // Trigger the animation
    requestAnimationFrame(() => {
        messageElement.classList.add('visible');
    });

    if (sender === 'assistant') {
        await typeWriter(content, message);
    } else {
        content.textContent = message;
    }
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}


/**
 * Sets the state of the AI Core, updating its class and text.
 * @param {string} state 'idle', 'listening', 'thinking', or 'speaking'.
 */
export function setCoreState(state) {
    aiCore.className = state;
    coreText.textContent = coreStateText[state] || '';
}