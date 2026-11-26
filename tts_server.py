import asyncio
import io
import json
import os
import re
import urllib.request
import urllib.error
import edge_tts
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

VOICE_NAME = "en-US-AvaNeural"
MEMORY_FILE = os.path.join(os.path.dirname(__file__), "chat_memory.json")
MAX_MEMORY_TURNS = 20

SYSTEM_PROMPT = """You are Study Buddy, a warm, encouraging, high-school AI tutor.
Your responses are spoken aloud by voice, so use clear, natural spoken English with NO Markdown symbols (no asterisks, hashtags, or bullet lists).
Follow this teaching style:
1. Start with a simple everyday analogy or intuition when introducing a concept.
2. Explain the step-by-step mechanism clearly.
3. End with one short check-in question or curiosity hook.
When the student asks follow-ups like "go further in detail", "why?", or "explain simpler", use the conversation history and current 3D scene context to continue seamlessly.
If the student asks to view a 3D model, start your reply with ONE tag:
[ACTION:biology:overview], [ACTION:biology:ra], [ACTION:biology:rv], [ACTION:biology:la], [ACTION:biology:lv], [ACTION:biology:aorta], [ACTION:biology:pulm],
[ACTION:solar:sun], [ACTION:solar:mercury], [ACTION:solar:venus], [ACTION:solar:earth], [ACTION:solar:mars], [ACTION:solar:jupiter], [ACTION:solar:saturn], [ACTION:solar:uranus], [ACTION:solar:neptune], or [ACTION:buddy]."""


def load_memory():
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data[-MAX_MEMORY_TURNS:]
        except Exception:
            pass
    return []


def save_memory(history):
    try:
        with open(MEMORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history[-MAX_MEMORY_TURNS:], f, indent=2)
    except Exception:
        pass


def call_gemini(messages, api_key):
    model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    contents = []
    for m in messages:
        role = "model" if m["role"] == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": m["content"]}]})

    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 420}
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()


def call_ollama(messages):
    model = os.environ.get("OLLAMA_MODEL", "llama3.2")
    url = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/chat")
    payload = {
        "model": model,
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + messages,
        "stream": False
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["message"]["content"].strip()


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_msg = (data.get("message") or "").strip()
    scene_ctx = (data.get("sceneContext") or "").strip()
    if not user_msg:
        return jsonify({"error": "Empty message"}), 400

    history = load_memory()
    ctx_note = f"[3D Scene Context: {scene_ctx}] " if scene_ctx else ""
    history.append({"role": "user", "content": f"{ctx_note}{user_msg}"})

    gemini_key = os.environ.get("GEMINI_API_KEY", "").strip()
    reply = None
    backend = "none"

    if gemini_key:
        try:
            reply = call_gemini(history, gemini_key)
            backend = "gemini"
        except Exception as e:
            print("Gemini error:", e)

    if reply is None:
        try:
            reply = call_ollama(history)
            backend = "ollama"
        except Exception as e:
            print("Ollama unavailable:", e)

    if not reply:
        return jsonify({"error": "No LLM backend available (set GEMINI_API_KEY or run Ollama)"}), 503

    action = None
    match = re.match(r"^\s*\[ACTION:([a-z]+)(?::([a-z0-9_]+))?\]\s*", reply, re.IGNORECASE)
    if match:
        action = {"mode": match.group(1).lower(), "sub": match.group(2).lower() if match.group(2) else None}
        reply = reply[match.end():].strip()

    history.append({"role": "assistant", "content": reply})
    save_memory(history)

    return jsonify({"reply": reply, "action": action, "backend": backend})


@app.route("/memory/clear", methods=["POST"])
def clear_memory():
    save_memory([])
    return jsonify({"status": "cleared"})


@app.route("/tts", methods=["POST"])
def tts():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    if not text:
        return ("", 400)

    buf = io.BytesIO()

    async def generate():
        communicate = edge_tts.Communicate(text, VOICE_NAME, rate="-4%")
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                buf.write(chunk["data"])

    asyncio.run(generate())
    buf.seek(0)
    return send_file(buf, mimetype="audio/mpeg")


if __name__ == "__main__":
    mode = "Gemini Free Tier" if os.environ.get("GEMINI_API_KEY") else "Local Ollama (llama3.2)"
    print(f"Study Buddy AI & Voice Server ({VOICE_NAME} | LLM: {mode}) running on http://localhost:5050")
    app.run(port=5050)
