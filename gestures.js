// MediaPipe Hands Webcam Gesture Controller (Pinch Zoom, Palm Orbit, Point-to-Cycle)
window.createGestureController = function (app) {
  let mpHands = null;
  let webcamStream = null;
  let lastPinchDist = null;
  let lastHandX = null;
  let lastHandY = null;
  let lastCycleTime = 0;

  async function toggleHandGestures() {
    const pip = document.getElementById('gesture-pip');
    const btn = document.getElementById('gesture-toggle-btn');
    const video = document.getElementById('webcam-video');
    const overlay = document.getElementById('hand-overlay');
    const statusEl = document.getElementById('gesture-status');

    if (app.state.gestureEnabled) {
      app.state.gestureEnabled = false;
      pip.classList.add('hidden');
      btn.classList.remove('bg-[#d0f601]', 'text-[#002e62]');
      if (webcamStream) {
        webcamStream.getTracks().forEach(t => t.stop());
        webcamStream = null;
      }
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      app.showToast('Webcam unavailable here — scroll or pinch trackpad to zoom and trigger voice explanations.');
      return;
    }

    try {
      webcamStream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      video.srcObject = webcamStream;
      await video.play();
      app.state.gestureEnabled = true;
      pip.classList.remove('hidden');
      btn.classList.add('bg-[#d0f601]', 'text-[#002e62]');

      if (typeof Hands !== 'undefined' && !mpHands) {
        mpHands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`
        });
        mpHands.setOptions({ maxNumHands: 1, modelComplexity: 0, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
        mpHands.onResults((results) => {
          const ctx = overlay.getContext('2d');
          overlay.width = video.videoWidth || 320;
          overlay.height = video.videoHeight || 240;
          ctx.clearRect(0, 0, overlay.width, overlay.height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const lm = results.multiHandLandmarks[0];
            ctx.fillStyle = '#d0f601';
            lm.forEach(pt => {
              ctx.beginPath();
              ctx.arc(pt.x * overlay.width, pt.y * overlay.height, 3, 0, Math.PI * 2);
              ctx.fill();
            });

            const thumb = lm[4];
            const index = lm[8];
            const middle = lm[12];
            const ring = lm[16];
            const palm = lm[9];
            const pinch = Math.hypot(thumb.x - index.x, thumb.y - index.y);

            // Detect pointing gesture (index extended, middle & ring curled) to cycle parts
            const indexExtended = index.y < lm[6].y;
            const middleCurled = middle.y > lm[10].y;
            const ringCurled = ring.y > lm[14].y;
            const now = Date.now();
            if (indexExtended && middleCurled && ringCurled && now - lastCycleTime > 1600) {
              lastCycleTime = now;
              statusEl.textContent = 'Point Gesture -> Next Part!';
              if (app.cycleTopicItem) app.cycleTopicItem();
            }

            // Pinch / Spread to Zoom In & Out
            if (lastPinchDist !== null) {
              const deltaPinch = pinch - lastPinchDist;
              if (Math.abs(deltaPinch) > 0.004) {
                app.state.targetCamDist = Math.max(2.4, Math.min(35, app.state.targetCamDist - deltaPinch * 30));
                statusEl.textContent = deltaPinch > 0 ? 'Spread -> Zooming In' : 'Pinch -> Zooming Out';
              }
            }

            // Open Palm Move to Orbit 3D Camera
            if (lastHandX !== null && lastHandY !== null) {
              app.state.targetCamTheta += (palm.x - lastHandX) * 3.5;
              app.state.targetCamPhi = Math.max(0.25, Math.min(2.8, app.state.targetCamPhi + (palm.y - lastHandY) * 2.5));
            }

            lastPinchDist = pinch;
            lastHandX = palm.x;
            lastHandY = palm.y;
          } else {
            lastPinchDist = null;
            lastHandX = null;
            lastHandY = null;
            statusEl.textContent = 'Spread: Zoom In · Pinch: Zoom Out · Point: Next';
          }
        });
      }

      const processFrame = async () => {
        if (!app.state.gestureEnabled) return;
        if (mpHands && video.readyState >= 2) {
          try { await mpHands.send({ image: video }); } catch (_) {}
        }
        requestAnimationFrame(processFrame);
      };
      requestAnimationFrame(processFrame);
    } catch (_) {
      app.showToast('Camera permission denied — drag & scroll to zoom and orbit 3D models.');
    }
  }

  return { toggleHandGestures };
};
