import { setCoreState } from './ui.js';

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;

recognition.onstart = () => {
    setCoreState('listening');
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    // window.handleVoiceResult is defined in main.js
    if (window.handleVoiceResult) {
        window.handleVoiceResult(transcript);
    }
};

recognition.onend = () => {
    // If recognition ends automatically (e.g., silence), ensure we reset the state
    // The check for aiCore's class prevents resetting state if we're already 'thinking'
    const aiCore = document.getElementById('ai-core');
    if (aiCore && aiCore.className === 'listening') {
        setCoreState('idle');
    }
};

recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    if(event.error !== 'no-speech') {
        alert(`Speech Error: ${event.error}`);
    }
    setCoreState('idle');
};

export function startListening() {
    // The callback is now handled globally via window.handleVoiceResult
    recognition.start();
}

export function stopListening() {
    recognition.stop();
}

export function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    // Optional: find a good voice
    const voices = speechSynthesis.getVoices();
    // utterance.voice = voices.find(voice => voice.name === "Google UK English Male");
    speechSynthesis.speak(utterance);
}