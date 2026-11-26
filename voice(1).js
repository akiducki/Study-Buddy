// Voice AI Companion: Local Agent Server (/chat with Memory) + Instant Math + Academic Depth + Free Voice
window.createVoiceEngine = function (app) {
  const { SOLAR_DATA, HEART_PARTS } = window.STUDY_DATA;
  const captionLabel = document.getElementById('voice-speaker-label');
  const captionText = document.getElementById('voice-caption-text');
  const sourceLinkEl = document.getElementById('voice-source-link');
  const stopSpeechBtn = document.getElementById('stop-speech-btn');
  const micBtn = document.getElementById('mic-btn');
  const micPulse = document.getElementById('mic-pulse');
  const micLabel = document.getElementById('mic-label');

  function recordContextEvent(topicName, _spokenText) {
    app.state.currentFocus = topicName;
  }

  function buildSceneContext() {
    if (app.state.mode === 'solar') {
      const p = SOLAR_DATA.find(x => x.id === app.state.selectedSolar);
      return p ? `Solar System > ${p.name} (${p.category})` : 'Solar System';
    }
    if (app.state.mode === 'biology') {
      const h = HEART_PARTS.find(x => x.id === app.state.selectedHeart);
      return h ? `Biology > Human Heart > ${h.name}` : 'Biology > Human Heart';
    }
    return app.state.currentFocus || 'Study Buddy Home';
  }

  async function speakText(text, sourceUrl = null, sourceTitle = null) {
    captionLabel.textContent = 'Study Buddy · Speaking';
    captionText.textContent = text;

    if (sourceLinkEl) {
      if (sourceUrl) {
        sourceLinkEl.href = sourceUrl;
        sourceLinkEl.textContent = sourceTitle ? `Source: ${sourceTitle}` : 'Read more online';
        sourceLinkEl.classList.remove('hidden');
      } else {
        sourceLinkEl.classList.add('hidden');
      }
    }

    if (app.state.voiceMuted || !('speechSynthesis' in window)) {
      app.state.isSpeaking = false;
      stopSpeechBtn.classList.add('hidden');
      return;
    }

    if (window._activeAudio) {
      window._activeAudio.pause();
      window._activeAudio = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 1800);
        const res = await fetch('http://localhost:5050/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
          signal: ctrl.signal
        });
        clearTimeout(timer);
        if (res.ok) {
          const blob = await res.blob();
          const audio = new Audio(URL.createObjectURL(blob));
          window._activeAudio = audio;
          audio.onplay = () => {
            app.state.isSpeaking = true;
            stopSpeechBtn.classList.remove('hidden');
          };
          audio.onended = audio.onerror = () => {
            app.state.isSpeaking = false;
            stopSpeechBtn.classList.add('hidden');
            captionLabel.textContent = 'Study Buddy · Ready';
          };
          await audio.play();
          return;
        }
      } catch (_) {}
    }

    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.96;
      utter.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(v => /en/i.test(v.lang) && /ava|emma|aria|jenny|natural|samantha|google us english/i.test(v.name)) ||
        voices.find(v => /en/i.test(v.lang));
      if (preferred) utter.voice = preferred;

      utter.onstart = () => {
        app.state.isSpeaking = true;
        stopSpeechBtn.classList.remove('hidden');
      };
      utter.onend = utter.onerror = () => {
        app.state.isSpeaking = false;
        stopSpeechBtn.classList.add('hidden');
        captionLabel.textContent = 'Study Buddy · Ready';
      };
      window.speechSynthesis.speak(utter);
    } catch (_) {
      app.state.isSpeaking = false;
    }
  }

  function tryMathEvaluation(query) {
    const wordMap = {
      zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5',
      six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
      eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15',
      sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20',
      thirty: '30', forty: '40', fifty: '50', sixty: '60', seventy: '70', eighty: '80', ninety: '90'
    };

    let expr = query.toLowerCase()
      .replace(/what('s| is| was)|calculate|compute|evaluate|solve|equals|how much is|\?/g, ' ')
      .replace(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b/g, m => wordMap[m])
      .replace(/\bplus\b/g, '+')
      .replace(/\bminus\b/g, '-')
      .replace(/\b(times|multiplied by|into)\b/g, '*')
      .replace(/(\d+)\s*[x×]\s*(\d+)/gi, '$1 * $2')
      .replace(/\b(divided by|over)\b/g, '/')
      .replace(/\b(to the power of|power)\b/g, '**')
      .replace(/\bsquared\b/g, '** 2')
      .replace(/\bcubed\b/g, '** 3')
      .replace(/square root of\s*([0-9.]+)/g, 'Math.sqrt($1)')
      .replace(/([0-9.]+)\s*percent of\s*([0-9.]+)/g, '($1 / 100) * $2')
      .trim();

    if (/^[0-9+\-*/().\s*Mathsqrt]+$/.test(expr) && /[0-9]/.test(expr) && /[+\-*/]|\bMath\.sqrt\b/.test(expr)) {
      try {
        const result = Function('"use strict"; return (' + expr + ')')();
        if (typeof result === 'number' && Number.isFinite(result)) {
          const formatted = Number.isInteger(result) ? result : Number(result.toFixed(4));
          return `The answer is ${formatted}! Want to try another calculation or ask a science question?`;
        }
      } catch (_) {}
    }
    return null;
  }

  function getDeepAcademicFollowUp() {
    if (app.state.mode === 'biology') {
      const hp = HEART_PARTS.find(x => x.id === app.state.selectedHeart) || HEART_PARTS[0];
      return `${hp.name} in detail: ${hp.deep}`;
    }
    if (app.state.mode === 'solar') {
      const sp = SOLAR_DATA.find(x => x.id === app.state.selectedSolar) || SOLAR_DATA[3];
      return `${sp.name} in detail: ${sp.deep}`;
    }
    if (app.state.currentFocus) {
      const hp = HEART_PARTS.find(x => app.state.currentFocus.includes(x.name));
      if (hp) return `${hp.name} in detail: ${hp.deep}`;
      const sp = SOLAR_DATA.find(x => app.state.currentFocus.includes(x.name));
      if (sp) return `${sp.name} in detail: ${sp.deep}`;
    }
    return null;
  }

  async function tryLocalAgentServer(userQuery) {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return null;
    }
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch('http://localhost:5050/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userQuery, sceneContext: buildSceneContext() }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (data.action && (data.action.mode === 'biology' || data.action.mode === 'solar' || data.action.mode === 'buddy')) {
          app.setMode(data.action.mode, data.action.sub || null);
        }
        return data.reply || null;
      }
    } catch (_) {}
    return null;
  }

  const POP_CULTURE_BLOCK = /\b(beyonce|beyoncé|taylor swift|kardashian|kanye|drake|bieber|rihanna|selena gomez|bts|blackpink|tiktok|netflix|movie|album|song|lyrics|celebrity|gossip|oscars|grammy|billboard|influencer|youtuber)\b/i;

  async function lookupWikipedia(rawQuery) {
    const topic = rawQuery
      .replace(/^(who is|who was|what is|what are|what was|tell me about|explain|how does|how do|why is|why does|where is|when was|define|search for|look up)\s+/i, '')
      .replace(/[?!.]+$/, '')
      .trim() || rawQuery;

    try {
      const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(topic)}&limit=2&namespace=0&format=json&origin=*`);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const title = searchData && searchData[1] && searchData[1][0];
        if (title) {
          const sumRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
          if (sumRes.ok) {
            const sumData = await sumRes.json();
            if (sumData.extract && sumData.type !== 'disambiguation') {
              const parts = sumData.extract.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]+/g) || [sumData.extract];
              const spoken = parts.slice(0, 3).join(' ').trim();
              const pageUrl = sumData.content_urls && sumData.content_urls.desktop ? sumData.content_urls.desktop.page : null;
              recordContextEvent(sumData.title, spoken);
              speakText(spoken, pageUrl, `Wikipedia · ${sumData.title}`);
              return true;
            }
          }
        }
      }
    } catch (_) {}
    return false;
  }

  async function handleVoiceQuery(rawText) {
    const q = (rawText || '').trim();
    if (!q) return;
    const lower = q.toLowerCase();

    if (POP_CULTURE_BLOCK.test(lower)) {
      speakText("Let's stay focused on studying! Ask me any math, science, Human Heart, or Solar System question.");
      return;
    }

    if (lower.includes('hand gesture') || lower.includes('turn on camera') || lower.includes('enable gesture')) {
      app.toggleHandGestures();
      return;
    }

    // 1. Try local Python Agent Server (/chat with persistent memory via Gemini Free Tier or Ollama)
    captionLabel.textContent = 'Study Buddy · Thinking...';
    captionText.textContent = `"${q}"`;
    const agentReply = await tryLocalAgentServer(q);
    if (agentReply) {
      speakText(agentReply);
      return;
    }

    // 2. Instant offline math evaluation
    const mathAns = tryMathEvaluation(lower);
    if (mathAns) {
      speakText(mathAns);
      return;
    }

    // 3. Follow-up depth ("go further in detail")
    if (/(further in detail|more detail|go deeper|explain more|tell me more|elaborate)/.test(lower)) {
      const deepAns = getDeepAcademicFollowUp();
      if (deepAns) {
        speakText(deepAns);
        return;
      }
    }

    // 4. Biology Heart routing
    const matchedHeart = HEART_PARTS.find(h => h.id !== 'overview' && lower.includes(h.name.toLowerCase()));
    if (matchedHeart) {
      app.setMode('biology', matchedHeart.id);
      const msg = `${matchedHeart.name}! ${matchedHeart.desc}`;
      recordContextEvent(`Human Heart > ${matchedHeart.name}`, msg);
      speakText(msg);
      return;
    }
    if (/heart|blood|chamber|ventricle|atrium|aorta|pulmonary|biology/.test(lower)) {
      app.setMode('biology', 'overview');
      const hp = HEART_PARTS[0];
      const msg = `${hp.desc} Click any label on the 3D heart or ask me to go further in detail!`;
      recordContextEvent('Human Heart', msg);
      speakText(msg);
      return;
    }

    // 5. Solar System routing
    const matchedPlanet = SOLAR_DATA.find(p => new RegExp(`\\b${p.id}\\b`, 'i').test(lower));
    if (lower.includes('open solar') || lower.includes('show solar') || lower.includes('solar system') || (matchedPlanet && (lower.includes('open') || lower.includes('zoom') || lower.includes('show') || lower.includes('tell me about') || lower.includes('why does')))) {
      const target = matchedPlanet ? matchedPlanet.id : null;
      app.setMode('solar', target);
      const msg = matchedPlanet ? `${matchedPlanet.name}! ${matchedPlanet.desc}` : "Welcome to the 3D Solar System! Spread your fingers or scroll to zoom in on any planet.";
      recordContextEvent(matchedPlanet ? `Solar System > ${matchedPlanet.name}` : 'Solar System', msg);
      speakText(msg);
      return;
    }

    // 6. Greeting
    if (/^(hi|hello|hey|good morning|good evening|who are you)\b/i.test(lower)) {
      speakText("Hey! I'm your Study Buddy. Ask me math, science, or open the Academic 3D Heart and Solar System!");
      return;
    }

    // 7. Wikipedia fallback
    const wikiOk = await lookupWikipedia(q);
    if (!wikiOk) {
      speakText("Try asking me a math problem, a science topic like photosynthesis, or open the 3D Heart and Solar System!");
    }
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  if (SpeechRec) {
    recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      app.state.isListening = true;
      micPulse.classList.remove('hidden');
      micLabel.textContent = 'Listening...';
      captionLabel.textContent = 'Study Buddy · Listening';
    };
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      captionText.textContent = `"${transcript}"`;
      if (event.results[event.results.length - 1].isFinal) {
        handleVoiceQuery(transcript);
      }
    };
    recognition.onerror = (e) => {
      app.state.isListening = false;
      micPulse.classList.add('hidden');
      micLabel.textContent = 'Tap to Speak';
      const err = (e && e.error) || '';
      if (err === 'no-speech') {
        app.showToast('No speech heard — tap the mic and speak clearly.');
        return;
      }
      app.showToast('Mic unavailable here — type your question below.');
      document.getElementById('fallback-form').classList.remove('hidden');
    };
    recognition.onend = () => {
      app.state.isListening = false;
      micPulse.classList.add('hidden');
      micLabel.textContent = 'Tap to Speak';
    };
  }

  micBtn.addEventListener('click', () => {
    if (!recognition) {
      app.showToast('Voice recognition unavailable in this browser — type below.');
      document.getElementById('fallback-form').classList.remove('hidden');
      return;
    }
    if (app.state.isListening) {
      recognition.stop();
    } else {
      try {
        if (window._activeAudio) { window._activeAudio.pause(); window._activeAudio = null; }
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        recognition.start();
      } catch (_) {
        app.showToast('Allow Microphone in your browser address bar or type below.');
        document.getElementById('fallback-form').classList.remove('hidden');
      }
    }
  });

  return { speakText, handleVoiceQuery, recordContextEvent };
};
