import { startListening, stopListening, speak } from './speech.js';
import { getAIResponse } from './openai.js';
import { addMessageToUI, setCoreState } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const aiCore = document.getElementById('ai-core');
    setCoreState('idle'); // Set initial state

    // Add a welcome message to the UI
    const welcomeMessage = document.querySelector('.chat-message .content');
    if (welcomeMessage) {
        welcomeMessage.textContent = "Awaiting command. Click the core to begin.";
    }


    aiCore.addEventListener('click', () => {
        const state = aiCore.className;
        // Allow starting a new conversation even if AI is speaking
        if (state === 'idle' || state === 'speaking') {
            startListening();
        } else if (state === 'listening') {
            stopListening();
        }
    });

    // This is where the main logic is triggered from speech.js
    window.handleVoiceResult = handleVoiceInput;
});

async function handleVoiceInput(text) {
    // If recognition ends without a result, text will be null.
    if (!text) {
        console.log("No speech detected or recognition ended.");
        setCoreState('idle');
        return;
    }

    // Set to thinking as soon as we have a result.
    setCoreState('thinking');
    await addMessageToUI(text, 'user');

    try {
        const aiResponse = await getAIResponse(text);

        // Change state to speaking right before the concurrent actions
        setCoreState('speaking');

        // Start speaking and typing concurrently
        speak(aiResponse);
        await addMessageToUI(aiResponse, 'assistant');

        // Set back to idle only after the AI has finished typing its response
        setCoreState('idle');

    } catch (error) {
        console.error("Error processing AI response:", error);
        setCoreState('speaking'); // Use speaking state to deliver error message
        await addMessageToUI("My apologies, but I've encountered an internal error.", "assistant");
        setCoreState('idle');
    }
}