
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const clearChat = document.getElementById("clearChat");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");

const robotCharacter = document.getElementById("robotCharacter");
const robotWaveArm = document.getElementById("robotWaveArm");
const voiceStatusTitle = document.getElementById("voiceStatusTitle");
const voiceStatus = document.getElementById("voiceStatus");
const voiceWave = document.getElementById("voiceWave");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
let isListening = false;

/* VOICE INPUT */

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        isListening = true;
        micButton.textContent = "🔴";
        micButton.title = "Listening...";

        if (voiceStatusTitle) {
            voiceStatusTitle.textContent = "Listening to you";
        }

        if (voiceStatus) {
            voiceStatus.textContent = "Speak your question...";
        }
    };

    recognition.onend = function () {
        isListening = false;
        micButton.textContent = "🎙️";
        micButton.title = "Speak your message";

        if (voiceStatusTitle &&
            voiceStatusTitle.textContent === "Listening to you") {
            voiceStatusTitle.textContent = "Ready to listen";
        }

        if (voiceStatus &&
            voiceStatus.textContent === "Speak your question...") {
            voiceStatus.textContent = "Click the microphone to speak";
        }
    };

    recognition.onresult = function (event) {
        userInput.value = event.results[0][0].transcript;
        chatForm.requestSubmit();
    };

    recognition.onerror = function (event) {
        addMessage("bot", "Microphone error: " + event.error);
    };

    micButton.addEventListener("click", function () {
        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
            } catch (error) {
                console.error("Microphone error:", error);
            }
        }
    });
} else {
    micButton.disabled = true;
    micButton.title =
        "Speech recognition is not supported in this browser";
}

/* ADD A CHAT MESSAGE */

function addMessage(sender, message) {
    const messageRow = document.createElement("div");

    messageRow.className =
        sender === "user"
            ? "message user-message"
            : "message bot-message";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = sender === "user" ? "Y" : "R";

    const content = document.createElement("div");
    content.className = "message-content";

    const name = document.createElement("span");
    name.className = "message-name";
    name.textContent = sender === "user" ? "You" : "RoboMind";

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    content.appendChild(name);
    content.appendChild(paragraph);
    messageRow.appendChild(avatar);
    messageRow.appendChild(content);
    chatMessages.appendChild(messageRow);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageRow;
}

/* THINKING INDICATOR */

function showThinkingIndicator() {
    const row = addMessage("bot", "RoboMind is thinking...");
    row.id = "thinkingIndicator";
    row.classList.add("thinking-message");
}

function removeThinkingIndicator() {
    const indicator = document.getElementById("thinkingIndicator");

    if (indicator) {
        indicator.remove();
    }
}

/* ROBOT SPEAKING ANIMATION */

function speakReply(message) {
    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    speech.onstart = function () {
        if (robotCharacter) {
            robotCharacter.classList.add("robot-speaking");
        }

        if (robotWaveArm) {
            robotWaveArm.classList.add("robot-waving");
        }

        if (voiceStatusTitle) {
            voiceStatusTitle.textContent = "RoboMind is speaking";
        }

        if (voiceStatus) {
            voiceStatus.textContent = "Listen to my response...";
        }

        if (voiceWave) {
            voiceWave.classList.add("voice-wave-active");
        }
    };

    speech.onend = function () {
        stopRobotSpeaking();
    };

    speech.onerror = function () {
        stopRobotSpeaking();
    };

    window.speechSynthesis.speak(speech);
}

function stopRobotSpeaking() {
    if (robotCharacter) {
        robotCharacter.classList.remove("robot-speaking");
    }

    if (robotWaveArm) {
        robotWaveArm.classList.remove("robot-waving");
    }

    if (voiceStatusTitle) {
        voiceStatusTitle.textContent = "Ready to listen";
    }

    if (voiceStatus) {
        voiceStatus.textContent = "Click the microphone to speak";
    }

    if (voiceWave) {
        voiceWave.classList.remove("voice-wave-active");
    }
}

/* SEND MESSAGE TO THE AI */

chatForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = userInput.value.trim();

    if (!message || sendButton.disabled) {
        return;
    }

    addMessage("user", message);
    userInput.value = "";

    sendButton.disabled = true;
    sendButton.textContent = "Thinking...";

    if (voiceStatusTitle) {
        voiceStatusTitle.textContent = "RoboMind is thinking";
    }

    if (voiceStatus) {
        voiceStatus.textContent = "Preparing your answer...";
    }

    showThinkingIndicator();

    try {
        const response = await fetch("chat", {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8"
            },
            body: new URLSearchParams({
                message: message
            })
        });

        const responseText = await response.text();
        let data;

        try {
            data = JSON.parse(responseText);
        } catch (error) {
            console.error("RoboMind server response:", responseText);

            throw new Error(
                "The server returned an invalid response. Please check Tomcat."
            );
        }

        if (!response.ok) {
            throw new Error(
                data.error || "The server could not process your message."
            );
        }

        removeThinkingIndicator();

        if (data.reply) {
            addMessage("bot", data.reply);
            speakReply(data.reply);
        } else {
            throw new Error("The AI returned an empty response.");
        }

    } catch (error) {
        removeThinkingIndicator();

        addMessage(
            "bot",
            "Sorry, I couldn't get a response. " + error.message
        );

        if (voiceStatusTitle) {
            voiceStatusTitle.textContent = "Ready to listen";
        }

        if (voiceStatus) {
            voiceStatus.textContent = "Click the microphone to speak";
        }

    } finally {
        sendButton.disabled = false;
        sendButton.textContent = "Send ↗";
        userInput.focus();
    }
});

/* CLEAR CONVERSATION */

clearChat.addEventListener("click", function () {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    stopRobotSpeaking();
    removeThinkingIndicator();

    chatMessages.replaceChildren();

    addMessage(
        "bot",
        "Chat cleared! What would you like to talk about?"
    );

    userInput.focus();
});

userInput.focus();
