# Study Buddy — Voice AI Agent, Academic 3D Heart & Solar System

## Quick Start (Free Conversational Agent + Voice)

1. Install Python dependencies (if not already installed):
   ```bash
   pip install flask flask-cors edge-tts
   ```

2. Choose a **free** LLM backend for the `/chat` agent (with persistent memory in `chat_memory.json`):
   - **Option A — Google Gemini Free Tier:**
     ```bash
     export GEMINI_API_KEY="your-free-google-ai-studio-key"
     python tts_server.py
     ```
   - **Option B — 100% Offline Local Ollama:**
     ```bash
     ollama run llama3.2
     python tts_server.py
     ```

3. Serve the website locally (required for microphone & camera permissions):
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in Chrome or Edge.
