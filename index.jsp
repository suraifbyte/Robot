
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#080d1b">
    <title>RoboMind AI Assistant</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="app">

    <!-- HEADER -->
    <header class="topbar">
        <div class="brand">
            <div class="brand-icon">R</div>
            <div class="brand-text">
                <h1>RoboMind</h1>
                <p>Your personal AI companion</p>
            </div>
        </div>

        <div class="status">
            <span class="status-dot"></span>
            <span>AI Assistant Online</span>
        </div>
    </header>

    <!-- MAIN WORKSPACE -->
    <main class="workspace">

        <!-- ROBOT PANEL -->
        <section class="robot-panel">
            <div class="robot-panel-heading">
                <span class="section-label">YOUR AI COMPANION</span>
                <span class="robot-live-indicator">LIVE</span>
            </div>

            <div class="robot-stage">
                <div class="robot-glow"></div>
                <div class="robot-platform"></div>

                
<!-- NEW ROBOMIND CUTE ROBOT -->
<div class="cute-robot" id="robotCharacter" aria-label="RoboMind cute robot">

    <div class="cute-antenna"><span></span></div>

    <div class="cute-ear cute-ear-left"></div>
    <div class="cute-ear cute-ear-right"></div>

    <div class="cute-head">
        <div class="cute-eye cute-eye-left"></div>
        <div class="cute-eye cute-eye-right"></div>
        <div class="cute-cheek cute-cheek-left"></div>
        <div class="cute-cheek cute-cheek-right"></div>
        <div class="cute-smile"></div>
    </div>

    <div class="cute-neck"></div>

    <div class="cute-body">
        <div class="cute-chest-light"></div>
        <div class="cute-chest-dot"></div>
    </div>

    <div class="cute-arm cute-arm-left">
        <div class="cute-hand"></div>
    </div>

    <div class="cute-arm cute-arm-right" id="robotWaveArm">
        <div class="cute-hand"></div>
    </div>

    <div class="cute-leg cute-leg-left">
        <div class="cute-foot"></div>
    </div>

    <div class="cute-leg cute-leg-right">
        <div class="cute-foot"></div>
    </div>

    <div class="cute-shadow"></div>
</div>

            </div>

            <!-- ROBOT INTRODUCTION -->
            <div class="robot-introduction">
                <span class="robot-greeting">HELLO, HUMAN</span>
                <h2>Meet RoboMind<span class="accent-dot">.</span></h2>

                <p>
                    Your personal AI assistant, ready to explore ideas,
                    answer questions, and learn with you.
                </p>
            </div>

            <!-- FEATURES -->
            <div class="feature-tags">
                <span><span class="tag-icon">✦</span> AI Powered</span>
                <span><span class="tag-icon">◉</span> Voice Chat</span>
                <span><span class="tag-icon">⌘</span> Smart Assistant</span>
            </div>

            <!-- VOICE STATUS -->
            <div class="voice-status-card">
                <div class="voice-status-icon" id="voiceStatusIcon">◉</div>

                <div class="voice-status-text">
                    <strong id="voiceStatusTitle">Ready to listen</strong>
                    <p id="voiceStatus">Click the microphone to speak</p>
                </div>

                <div class="voice-wave" id="voiceWave"
                     aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </section>

        <!-- CHAT PANEL -->
        <section class="chat-panel">

            <!-- CHAT HEADER -->
            <div class="chat-heading">
                <div class="chat-heading-main">
                    <div class="chat-heading-avatar">R</div>

                    <div>
                        <h2>AI Conversation</h2>
                        <p>
                            <span class="small-status-dot"></span>
                            RoboMind is ready to help
                        </p>
                    </div>
                </div>

                <button id="clearChat"
                        class="clear-button"
                        type="button"
                        title="Clear conversation">
                    <span aria-hidden="true">↻</span>
                    Clear
                </button>
            </div>

            <!-- CHAT MESSAGES -->
            <div id="chatMessages"
                 class="chat-messages"
                 aria-live="polite"
                 aria-relevant="additions text">

                <div class="message bot-message">
                    <div class="message-avatar">R</div>

                    <div class="message-content">
                        <span class="message-name">RoboMind</span>
                        <p>
                            Hello! I'm RoboMind, your personal AI assistant.
                            You can type a question or use the microphone
                            to talk with me. How can I help you today?
                        </p>
                    </div>
                </div>
            </div>

            <!-- INPUT AREA -->
            <div class="chat-input-area">
                <p class="input-label">MESSAGE ROBO MIND</p>

                <form id="chatForm" class="chat-form">
                    <input
                        id="userInput"
                        name="message"
                        type="text"
                        placeholder="Ask anything or use your voice..."
                        autocomplete="off"
                        aria-label="Your message"
                        required
                    >

                    <button
                        id="micButton"
                        class="mic-button"
                        type="button"
                        title="Speak your message"
                        aria-label="Start voice input">
                        <span aria-hidden="true">🎙️</span>
                    </button>

                    <button
                        id="sendButton"
                        class="send-button"
                        type="submit">
                        <span>Send</span>
                        <span aria-hidden="true">↗</span>
                    </button>
                </form>

                <p class="chat-note">
                    <span aria-hidden="true">✦</span>
                    Powered by AI · Built for learning and discovery
                </p>
            </div>
        </section>
    </main>

    <!-- FOOTER -->
    <footer class="app-footer">
        <span>ROBOMIND AI</span>
        <span>Personal AI Assistant Project</span>
        <span>Designed for learning</span>
    </footer>
</div>

<!-- EXISTING CHAT AND VOICE LOGIC -->
<script src="chat.js"></script>

</body>
</html>
