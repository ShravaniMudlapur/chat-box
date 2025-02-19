const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

const predefinedResponses = {
    "hello": "Hello, how can I help you?",
    "how are you": "I'm doing great! Thanks for asking. 😊",
    "what's your name": "I'm Shravani, your friendly chatbot! 🤖",
    "who created you": "I was created by an software engineer named Shravani! 🚀",
    "what can you do": "I can chat, answer questions, and even talk using voice recognition!",
    "tell me a joke": "Why did the programmer go broke? Because he used up all his cache! 😂",
    "bye": "Goodbye! Have a great day! 👋"
};

async function sendMessage() {
    const message = userInput.value.trim().toLowerCase();
    if (message === "") return;

    appendMessage("user", message);
    userInput.value = "";

    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("bot-message");
    typingIndicator.textContent = "🤖 Typing...";
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    let response;
    if (predefinedResponses[message]) {
        response = predefinedResponses[message];
    } else {
        response = await getAIResponse(message);
    }

    chatBox.removeChild(typingIndicator);
    appendMessage("bot", response);
}

function appendMessage(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");

    if (sender === "bot") {
        simulateTypingEffect(messageDiv, text);
    } else {
        messageDiv.textContent = text;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getAIResponse(userMessage) {
    const API_KEY = "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";
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        return "⚠️ Oops! Something went wrong. Try again later.";
    }
}
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function simulateTypingEffect(element, text) {
    let i = 0;
    function typeLetter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeLetter, 50);
        }
    }
    typeLetter();
}

function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = function(event) {
        userInput.value = event.results[0][0].transcript;
        sendMessage();
    };
    recognition.start();
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}
