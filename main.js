// Main Scene Loop, Academic 3D Heart Leader-Line Labels, Solar System, Eye Tracking & Zoom Auto-Explain
(function () {
  const { SOLAR_DATA, HEART_PARTS } = window.STUDY_DATA;

  const state = {
    mode: 'buddy',
    selectedSolar: 'earth',
    selectedHeart: 'overview',
    currentFocus: null,
    heartFlowOn: true,
    voiceMuted: false,
    isListening: false,
    isSpeaking: false,
    gestureEnabled: false,
    camTheta: 0,
    camPhi: 1.05,
    camDist: 22,
    targetCamTheta: 0,
    targetCamPhi: 1.05,
    targetCamDist: 22,
    lookTarget: new THREE.Vector3(0, 0, 0),
    targetLookTarget: new THREE.Vector3(0, 0, 0),
    mouseX: 0,
    mouseY: 0,
    smoothMouseX: 0,
    smoothMouseY: 0,
    lastAutoSpokenKey: null
  };

  const canvas = document.getElementById('scene-canvas');
  const bgLayer = document.getElementById('bg-layer');
  const buddyStage = document.getElementById('buddy-stage');
  const buddyCard = document.getElementById('buddy-card');
  const buddyGlow = document.getElementById('buddy-speaking-glow');
  const eyeLeft = document.getElementById('buddy-eye-left');
  const eyeRight = document.getElementById('buddy-eye-right');
  const heroOverlay = document.getElementById('buddy-hero-overlay');
  const topicPanel = document.getElementById('topic-panel');
  const stopSpeechBtn = document.getElementById('stop-speech-btn');
  const heartLabelsLayer = document.getElementById('heart-labels-layer');
  const heartLeadersSvg = document.getElementById('heart-leaders-svg');
  const heartPinsContainer = document.getElementById('heart-pins-container');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03050d);
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 350);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.05);
  keyLight.position.set(6, 10, 8);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.55);
  fillLight.position.set(-8, -4, 6);
  scene.add(fillLight);
  const sunPointLight = new THREE.PointLight(0xffe8b3, 3.0, 90);
  scene.add(sunPointLight);

  const starGroup = new THREE.Group();
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1200;
  const starPos = new Float32Array(starCount * 3);
  const starCol = new Float32Array(starCount * 3);
  const palette = [[1, 1, 1], [0.72, 0.88, 1], [1, 0.9, 0.7], [0.85, 0.78, 1]];
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 240;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 240;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 240;
    const col = palette[i % palette.length];
    starCol[i * 3] = col[0];
    starCol[i * 3 + 1] = col[1];
    starCol[i * 3 + 2] = col[2];
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
  const starField = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.25, vertexColors: true, transparent: true, opacity: 0.92 }));
  starGroup.add(starField);
  scene.add(starGroup);

  const solarGroup = new THREE.Group();
  scene.add(solarGroup);
  const explorers = window.createExplorers(solarGroup);

  const heartGroup = new THREE.Group();
  scene.add(heartGroup);
  const heartExplorer = window.createHeartExplorer(heartGroup);

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => t.classList.add('hidden'), 3600);
  }

  function selectHeartPart(partId, shouldSpeak = true) {
    const hp = HEART_PARTS.find(x => x.id === partId) || HEART_PARTS[0];
    state.selectedHeart = hp.id;
    heartExplorer.highlightPart(hp.id);
    renderTopicPanel();
    if (shouldSpeak) {
      const spoken = `${hp.name}! ${hp.desc}`;
      voice.recordContextEvent(`Human Heart > ${hp.name}`, spoken);
      voice.speakText(spoken);
    }
  }

  // Create clickable HTML pins & SVG leader lines for each Heart anchor
  const pinElements = {};
  const lineElements = {};
  heartExplorer.anchors.forEach((anc) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', '#d0f601');
    line.setAttribute('stroke-width', '1.75');
    line.setAttribute('stroke-dasharray', '3 3');
    heartLeadersSvg.appendChild(line);
    lineElements[anc.id] = line;

    const btn = document.createElement('button');
    btn.className = 'pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full glass text-[11px] font-bold text-[#f5f1c6] hover:bg-[#d0f601] hover:text-[#002e62] transition shadow-lg whitespace-nowrap';
    btn.textContent = anc.label;
    btn.addEventListener('click', () => selectHeartPart(anc.id, true));
    heartPinsContainer.appendChild(btn);
    pinElements[anc.id] = btn;
  });

  function updateHeartLabels() {
    if (state.mode !== 'biology') return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const tempV = new THREE.Vector3();

    heartExplorer.anchors.forEach((anc) => {
      anc.obj.getWorldPosition(tempV);
      tempV.project(camera);
      const sx = (tempV.x * 0.5 + 0.5) * w;
      const sy = (-tempV.y * 0.5 + 0.5) * h;
      const lx = Math.max(80, Math.min(w - 80, sx + anc.offset.dx));
      const ly = Math.max(76, Math.min(h - 140, sy + anc.offset.dy));

      const line = lineElements[anc.id];
      line.setAttribute('x1', sx.toFixed(1));
      line.setAttribute('y1', sy.toFixed(1));
      line.setAttribute('x2', lx.toFixed(1));
      line.setAttribute('y2', ly.toFixed(1));

      const btn = pinElements[anc.id];
      btn.style.left = `${lx}px`;
      btn.style.top = `${ly}px`;
      const isSelected = state.selectedHeart === anc.id;
      btn.className = isSelected
        ? 'pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-[#d0f601] text-[#002e62] text-[11px] font-bold transition shadow-lg whitespace-nowrap'
        : 'pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full glass text-[11px] font-bold text-[#f5f1c6] hover:bg-[#d0f601] hover:text-[#002e62] transition shadow-lg whitespace-nowrap';
    });
  }

  function renderTopicPanel() {
    const catEl = document.getElementById('panel-category');
    const titleEl = document.getElementById('panel-title');
    const descEl = document.getElementById('panel-desc');
    const itemsEl = document.getElementById('panel-items');
    const detailsEl = document.getElementById('panel-details');
    itemsEl.innerHTML = '';
    detailsEl.innerHTML = '';

    const list = state.mode === 'biology' ? HEART_PARTS : SOLAR_DATA;
    const selectedId = state.mode === 'biology' ? state.selectedHeart : state.selectedSolar;
    const item = list.find(x => x.id === selectedId) || list[0];

    catEl.textContent = item.category;
    titleEl.textContent = item.name;
    descEl.textContent = item.desc;

    list.forEach(p => {
      const btn = document.createElement('button');
      const active = p.id === item.id;
      btn.className = `px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${active ? 'bg-[#d0f601] text-[#002e62]' : 'bg-white/10 text-[#f5f1c6] hover:bg-white/20'}`;
      btn.textContent = p.name;
      btn.addEventListener('click', () => {
        if (state.mode === 'solar') {
          state.selectedSolar = p.id;
          state.targetCamDist = p.id === 'sun' ? 8.5 : Math.max(3.4, p.size * 4.2);
          state.lastAutoSpokenKey = `solar:${p.id}`;
          renderTopicPanel();
          const spoken = `${p.name}! ${p.desc}`;
          voice.recordContextEvent(`Solar System > ${p.name}`, spoken);
          voice.speakText(spoken);
        } else {
          selectHeartPart(p.id, true);
        }
      });
      itemsEl.appendChild(btn);
    });

    Object.entries(item.stats).forEach(([k, v]) => {
      detailsEl.innerHTML += `<div class="flex justify-between gap-2"><span class="text-slate-300">${k}</span><span class="text-[#f5f1c6] font-semibold text-right">${v}</span></div>`;
    });

    if (state.mode === 'biology') {
      const flowBtn = document.createElement('button');
      flowBtn.className = 'mt-2 w-full py-1.5 rounded-full bg-[#e90c0c] text-[#f5f1c6] text-xs font-bold';
      flowBtn.textContent = `Blood Flow: ${state.heartFlowOn ? 'ON' : 'OFF'}`;
      flowBtn.addEventListener('click', () => {
        state.heartFlowOn = !state.heartFlowOn;
        flowBtn.textContent = `Blood Flow: ${state.heartFlowOn ? 'ON' : 'OFF'}`;
      });
      detailsEl.appendChild(flowBtn);

      const bioLinks = document.createElement('div');
      bioLinks.className = 'flex gap-1.5 pt-1';
      bioLinks.innerHTML = `
        <a href="https://www.biodigital.com/" target="_blank" rel="noopener noreferrer" class="flex-1 text-center py-1.5 rounded-full bg-[#d0f601] text-[#002e62] text-[11px] font-bold">BioDigital 3D ↗</a>
        <a href="https://developer.biodigital.com/" target="_blank" rel="noopener noreferrer" class="flex-1 text-center py-1.5 rounded-full bg-white/15 text-[#f5f1c6] text-[11px] font-semibold">API Docs ↗</a>
      `;
      detailsEl.appendChild(bioLinks);
    }
  }

  function cycleTopicItem() {
    if (state.mode === 'solar') {
      const idx = SOLAR_DATA.findIndex(p => p.id === state.selectedSolar);
      const next = SOLAR_DATA[(idx + 1) % SOLAR_DATA.length];
      state.selectedSolar = next.id;
      state.targetCamDist = next.id === 'sun' ? 8.5 : Math.max(3.4, next.size * 4.2);
      state.lastAutoSpokenKey = `solar:${next.id}`;
      renderTopicPanel();
      const spoken = `${next.name}! ${next.desc}`;
      voice.recordContextEvent(`Solar System > ${next.name}`, spoken);
      voice.speakText(spoken);
    } else if (state.mode === 'biology') {
      const idx = HEART_PARTS.findIndex(b => b.id === state.selectedHeart);
      const next = HEART_PARTS[(idx + 1) % HEART_PARTS.length];
      selectHeartPart(next.id, true);
    }
  }

  function setMode(newMode, subItemId = null) {
    state.mode = newMode;
    state.lastAutoSpokenKey = null;
    const isBuddy = newMode === 'buddy';
    const isSolar = newMode === 'solar';
    const isBio = newMode === 'biology';

    buddyStage.classList.toggle('hidden', !isBuddy);
    bgLayer.classList.toggle('hidden', !isBuddy);
    canvas.classList.toggle('hidden', isBuddy);
    heartLabelsLayer.classList.toggle('hidden', !isBio);
    document.body.style.background = isBuddy ? '#d0f601' : '#03050d';

    heroOverlay.classList.toggle('hidden', !isBuddy);
    topicPanel.classList.toggle('hidden', isBuddy);

    solarGroup.visible = isSolar;
    heartGroup.visible = isBio;

    document.querySelectorAll('.nav-btn').forEach(btn => {
      const active = btn.dataset.mode === newMode;
      btn.className = active
        ? 'nav-btn px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all bg-[#d0f601] text-[#002e62] shadow whitespace-nowrap'
        : 'nav-btn px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all text-[#f5f1c6]/85 hover:text-white hover:bg-white/10 whitespace-nowrap';
    });

    if (isSolar) {
      if (subItemId) state.selectedSolar = subItemId;
      state.targetCamDist = subItemId ? 5.5 : 22;
      state.targetCamPhi = 1.05;
      state.targetLookTarget.set(0, 0, 0);
    } else if (isBio) {
      if (subItemId && HEART_PARTS.some(x => x.id === subItemId)) {
        state.selectedHeart = subItemId;
      }
      heartExplorer.highlightPart(state.selectedHeart);
      state.targetLookTarget.set(0, 0, 0);
      state.targetCamDist = 6.2;
      state.targetCamPhi = 1.38;
      state.targetCamTheta = 0.15;
    }

    if (!isBuddy) renderTopicPanel();
  }

  const app = { state, setMode, showToast, cycleTopicItem, toggleHandGestures: null };
  const voice = window.createVoiceEngine(app);
  const gestures = window.createGestureController(app);
  app.toggleHandGestures = gestures.toggleHandGestures;

  let isDragging = false;
  let prevPointer = { x: 0, y: 0 };
  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();

  window.addEventListener('pointermove', (e) => {
    state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    state.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    if (isDragging && state.mode !== 'buddy') {
      state.targetCamTheta -= (e.clientX - prevPointer.x) * 0.008;
      state.targetCamPhi = Math.max(0.2, Math.min(2.85, state.targetCamPhi - (e.clientY - prevPointer.y) * 0.008));
      prevPointer = { x: e.clientX, y: e.clientY };
    }
  });

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    prevPointer = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('pointerup', (e) => {
    const moved = Math.hypot(e.clientX - prevPointer.x, e.clientY - prevPointer.y);
    isDragging = false;
    if (moved < 5 && e.target === canvas && state.mode !== 'buddy') {
      pointerNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointerNDC, camera);
      if (state.mode === 'solar') {
        const hit = raycaster.intersectObjects(solarGroup.children, true).find(h => h.object.userData && h.object.userData.type === 'solar');
        if (hit) {
          const p = SOLAR_DATA.find(x => x.id === hit.object.userData.id);
          if (p) {
            state.selectedSolar = p.id;
            state.targetCamDist = p.id === 'sun' ? 8.5 : Math.max(3.4, p.size * 4.2);
            state.lastAutoSpokenKey = `solar:${p.id}`;
            renderTopicPanel();
            const spoken = `${p.name}! ${p.desc}`;
            voice.recordContextEvent(`Solar System > ${p.name}`, spoken);
            voice.speakText(spoken);
          }
        }
      } else if (state.mode === 'biology') {
        const hit = raycaster.intersectObjects(heartGroup.children, true).find(h => h.object.userData && h.object.userData.type === 'heart');
        if (hit) {
          selectHeartPart(hit.object.userData.id, true);
        }
      }
    }
  });

  canvas.addEventListener('wheel', (e) => {
    if (state.mode === 'buddy') return;
    e.preventDefault();
    state.targetCamDist = Math.max(2.4, Math.min(35, state.targetCamDist + e.deltaY * 0.012));
  }, { passive: false });

  document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
  document.getElementById('gesture-toggle-btn').addEventListener('click', gestures.toggleHandGestures);
  document.getElementById('gesture-close-btn').addEventListener('click', gestures.toggleHandGestures);
  document.getElementById('meet-buddy-btn').addEventListener('click', () => {
    voice.speakText("Hey! I'm your Study Buddy. Ask me math like 2 plus 2, or open the Academic 3D Heart and Solar System!");
  });

  document.getElementById('voice-mute-btn').addEventListener('click', () => {
    state.voiceMuted = !state.voiceMuted;
    if (state.voiceMuted) { if (window._activeAudio) window._activeAudio.pause(); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }
    document.getElementById('voice-mute-btn').innerHTML = state.voiceMuted
      ? '<i data-lucide="volume-x" class="w-4 h-4"></i>'
      : '<i data-lucide="volume-2" class="w-4 h-4"></i>';
    if (window.lucide) lucide.createIcons();
  });

  stopSpeechBtn.addEventListener('click', () => {
    if (window._activeAudio) { window._activeAudio.pause(); window._activeAudio = null; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    state.isSpeaking = false;
    stopSpeechBtn.classList.add('hidden');
    document.getElementById('voice-speaker-label').textContent = 'Study Buddy · Ready';
  });

  document.getElementById('panel-speak-btn').addEventListener('click', () => {
    const title = document.getElementById('panel-title').textContent;
    const desc = document.getElementById('panel-desc').textContent;
    const spoken = `${title}! ${desc}`;
    voice.recordContextEvent(title, spoken);
    voice.speakText(spoken);
  });

  document.querySelectorAll('.quick-voice-btn').forEach(btn => {
    btn.addEventListener('click', () => voice.handleVoiceQuery(btn.dataset.prompt));
  });

  document.getElementById('fallback-kbd-btn').addEventListener('click', () => {
    const f = document.getElementById('fallback-form');
    f.classList.toggle('hidden');
    if (!f.classList.contains('hidden')) document.getElementById('fallback-input').focus();
  });

  document.getElementById('fallback-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = document.getElementById('fallback-input');
    if (inp.value.trim()) {
      voice.handleVoiceQuery(inp.value.trim());
      inp.value = '';
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  let blinkTimer = 0;

  function checkZoomAutoExplain() {
    if (state.mode !== 'solar') return;
    if (state.camDist < 7.2) {
      const key = `solar:${state.selectedSolar}`;
      if (state.lastAutoSpokenKey !== key) {
        state.lastAutoSpokenKey = key;
        const p = SOLAR_DATA.find(x => x.id === state.selectedSolar);
        if (p) {
          const spoken = `${p.name}! ${p.desc}`;
          voice.recordContextEvent(`Solar System > ${p.name}`, spoken);
          voice.speakText(spoken);
        }
      }
    } else if (state.camDist > 12) {
      state.lastAutoSpokenKey = null;
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    state.smoothMouseX += (state.mouseX - state.smoothMouseX) * 0.12;
    state.smoothMouseY += (state.mouseY - state.smoothMouseY) * 0.12;

    if (state.mode === 'buddy') {
      const breatheY = Math.sin(elapsed * 2.2) * 2.5;
      const speakBounce = state.isSpeaking ? Math.abs(Math.sin(elapsed * 12)) * 0.014 : 0;
      const scaleX = 1.0 - speakBounce * 0.35;
      const scaleY = 1.0 + speakBounce + Math.sin(elapsed * 2.2) * 0.004;

      buddyCard.style.transform = `translate3d(0, ${breatheY}px, 0) scale(${scaleX}, ${scaleY})`;
      buddyGlow.style.opacity = state.isSpeaking ? '0.85' : '0';

      blinkTimer += dt;
      const isBlinking = (blinkTimer % 4.2) > 4.08;
      const eyeOffsetX = state.smoothMouseX * 11;
      const eyeOffsetY = -state.smoothMouseY * 7.5;
      const eyeTransform = `translate(${eyeOffsetX}px, ${eyeOffsetY}px) scaleY(${isBlinking ? 0.1 : 1})`;
      eyeLeft.style.transform = eyeTransform;
      eyeRight.style.transform = eyeTransform;
    } else {
      starGroup.rotation.y += dt * 0.01;
      if (state.mode === 'solar') {
        SOLAR_DATA.forEach(p => {
          const mesh = explorers.planetMeshes[p.id];
          if (!mesh) return;
          if (p.dist > 0) {
            explorers.planetAngles[p.id] += dt * p.speed * 0.25;
            mesh.position.x = Math.cos(explorers.planetAngles[p.id]) * p.dist;
            mesh.position.z = Math.sin(explorers.planetAngles[p.id]) * p.dist;
          }
          mesh.rotation.y += dt * 0.42;
          if (p.id === state.selectedSolar) state.targetLookTarget.copy(mesh.position);
        });
      } else if (state.mode === 'biology') {
        heartExplorer.update(dt, elapsed, state.heartFlowOn);
      }

      state.camTheta += (state.targetCamTheta - state.camTheta) * 0.08;
      state.camPhi += (state.targetCamPhi - state.camPhi) * 0.08;
      state.camDist += (state.targetCamDist - state.camDist) * 0.08;
      state.lookTarget.lerp(state.targetLookTarget, 0.08);

      camera.position.x = state.lookTarget.x + state.camDist * Math.sin(state.camPhi) * Math.sin(state.camTheta);
      camera.position.y = state.lookTarget.y + state.camDist * Math.cos(state.camPhi);
      camera.position.z = state.lookTarget.z + state.camDist * Math.sin(state.camPhi) * Math.cos(state.camTheta);
      camera.lookAt(state.lookTarget);

      if (Math.floor(elapsed * 4) !== window._lastZoomTick) { window._lastZoomTick = Math.floor(elapsed * 4); checkZoomAutoExplain(); }
      renderer.render(scene, camera);
      updateHeartLabels();
    }

    document.querySelectorAll('.eq-bar').forEach((b, idx) => {
      if (state.isSpeaking) b.style.height = `${4 + Math.abs(Math.sin(elapsed * 12 + idx * 0.9)) * 12}px`;
      else if (state.isListening) b.style.height = `${4 + Math.abs(Math.sin(elapsed * 6 + idx)) * 8}px`;
      else b.style.height = idx % 2 === 0 ? '6px' : '10px';
    });
  }

  if (window.lucide) lucide.createIcons();
  setMode('buddy');
  animate();
})();
