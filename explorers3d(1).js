// 3D Solar System, Uploaded heart.glb Academic Loader & 3D Doraemon Buddy
window.createExplorers = function (solarGroup) {
  const { SOLAR_DATA } = window.STUDY_DATA;
  const planetMeshes = {};
  const planetAngles = {};

  function makePlanetTexture(id) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext('2d');

    if (id === 'sun') {
      const g = ctx.createRadialGradient(256, 128, 10, 256, 128, 256);
      g.addColorStop(0, '#fff7cc');
      g.addColorStop(0.5, '#ffaa1d');
      g.addColorStop(1, '#e8490c');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 450; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,245,180,0.22)' : 'rgba(220,50,10,0.2)';
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 256, 3 + Math.random() * 14, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (id === 'mercury') {
      ctx.fillStyle = '#8c8881';
      ctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 220; i++) {
        const r = 2 + Math.random() * 12;
        const x = Math.random() * 512, y = Math.random() * 256;
        ctx.fillStyle = 'rgba(55,52,48,0.45)';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(210,205,198,0.3)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    } else if (id === 'venus') {
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#d6a354');
      g.addColorStop(0.5, '#f5d487');
      g.addColorStop(1, '#c98b3b');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);
      for (let y = 0; y < 256; y += 8) {
        ctx.fillStyle = `rgba(255, 240, 200, ${0.08 + Math.random() * 0.14})`;
        ctx.fillRect(0, y, 512, 4 + Math.random() * 6);
      }
    } else if (id === 'earth') {
      ctx.fillStyle = '#0c4a8a';
      ctx.fillRect(0, 0, 512, 256);
      const lands = [
        [95, 90, 48, 35], [130, 150, 32, 46], [240, 80, 55, 38],
        [270, 145, 42, 48], [365, 95, 68, 44], [405, 175, 35, 24]
      ];
      ctx.fillStyle = '#2d8a4e';
      lands.forEach(([lx, ly, rx, ry]) => {
        ctx.beginPath();
        ctx.ellipse(lx, ly, rx, ry, Math.random() * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, 512, 18);
      ctx.fillRect(0, 238, 512, 18);
      for (let i = 0; i < 65; i++) {
        ctx.fillStyle = 'rgba(255,255,255,0.32)';
        ctx.beginPath();
        ctx.ellipse(Math.random() * 512, 20 + Math.random() * 216, 18 + Math.random() * 35, 4 + Math.random() * 7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (id === 'mars') {
      ctx.fillStyle = '#c24921';
      ctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 120; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(92,28,12,0.35)' : 'rgba(240,128,74,0.28)';
        ctx.beginPath();
        ctx.ellipse(Math.random() * 512, Math.random() * 256, 8 + Math.random() * 30, 5 + Math.random() * 18, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 512, 12);
      ctx.fillRect(0, 244, 512, 12);
    } else if (id === 'jupiter') {
      const bands = ['#d8c3a5', '#b87d56', '#eadbc8', '#9e5435', '#dfd0b8', '#c4865a', '#e8d8c3'];
      for (let y = 0; y < 256; y += 12) {
        ctx.fillStyle = bands[(y / 12) % bands.length];
        ctx.fillRect(0, y, 512, 13);
      }
      ctx.fillStyle = '#c84b31';
      ctx.beginPath();
      ctx.ellipse(310, 162, 34, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f5e1c8';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (id === 'saturn') {
      const bands = ['#ebd9a7', '#d8be82', '#f3e5bc', '#c9ac6c', '#e6d29e'];
      for (let y = 0; y < 256; y += 10) {
        ctx.fillStyle = bands[(y / 10) % bands.length];
        ctx.fillRect(0, y, 512, 11);
      }
    } else if (id === 'uranus') {
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#7de2ee');
      g.addColorStop(0.5, '#a5f3fc');
      g.addColorStop(1, '#58c9d8');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);
    } else if (id === 'neptune') {
      const g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#1d4ed8');
      g.addColorStop(0.5, '#2563eb');
      g.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 25; i++) {
        ctx.fillStyle = 'rgba(191, 219, 254, 0.32)';
        ctx.fillRect(Math.random() * 440, 30 + Math.random() * 196, 30 + Math.random() * 70, 3);
      }
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }

  function makeSaturnRingTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 32;
    const ctx = c.getContext('2d');
    for (let x = 0; x < 512; x++) {
      const t = x / 512;
      let alpha = 0.75;
      if (t > 0.56 && t < 0.63) alpha = 0.08;
      if (t < 0.08 || t > 0.96) alpha = 0.0;
      const shade = 205 + Math.sin(x * 0.45) * 35;
      ctx.fillStyle = `rgba(${shade}, ${shade - 15}, ${shade - 45}, ${alpha})`;
      ctx.fillRect(x, 0, 1, 32);
    }
    return new THREE.CanvasTexture(c);
  }

  SOLAR_DATA.forEach((p, idx) => {
    const meshGroup = new THREE.Group();
    const tex = makePlanetTexture(p.id);
    const geo = new THREE.SphereGeometry(p.size, 28, 28);
    const mat = p.id === 'sun'
      ? new THREE.MeshBasicMaterial({ map: tex })
      : new THREE.MeshStandardMaterial({ map: tex, roughness: 0.72, metalness: 0.06 });

    const sphere = new THREE.Mesh(geo, mat);
    sphere.userData = { type: 'solar', id: p.id };
    meshGroup.add(sphere);

    if (p.id === 'sun') {
      const glowGeo = new THREE.SphereGeometry(p.size * 1.18, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xffaa33, transparent: true, opacity: 0.25, side: THREE.BackSide
      });
      meshGroup.add(new THREE.Mesh(glowGeo, glowMat));
    }

    if (p.id === 'earth') {
      const atmoGeo = new THREE.SphereGeometry(p.size * 1.06, 32, 32);
      const atmoMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8, transparent: true, opacity: 0.18, side: THREE.BackSide
      });
      meshGroup.add(new THREE.Mesh(atmoGeo, atmoMat));
    }

    if (p.hasRings || p.id === 'uranus') {
      const innerR = p.size * 1.35;
      const outerR = p.id === 'uranus' ? p.size * 1.75 : p.size * 2.35;
      const ringGeo = new THREE.RingGeometry(innerR, outerR, 48);
      const pos = ringGeo.attributes.position;
      const uv = ringGeo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i), vy = pos.getY(i);
        const r = Math.sqrt(vx * vx + vy * vy);
        uv.setXY(i, (r - innerR) / (outerR - innerR), 0.5);
      }
      const ringMat = new THREE.MeshStandardMaterial({
        map: makeSaturnRingTexture(),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: p.id === 'uranus' ? 0.35 : 0.88,
        roughness: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = p.id === 'uranus' ? 0.1 : Math.PI / 2 - 0.38;
      ring.userData = { type: 'solar', id: p.id };
      meshGroup.add(ring);
    }

    if (p.dist > 0) {
      const orbitGeo = new THREE.RingGeometry(p.dist - 0.025, p.dist + 0.025, 64);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0x64748b, side: THREE.DoubleSide, transparent: true, opacity: 0.25
      });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.x = Math.PI / 2;
      solarGroup.add(orbit);
    }

    planetAngles[p.id] = idx * 0.9;
    planetMeshes[p.id] = meshGroup;
    solarGroup.add(meshGroup);
  });

  const beltGeo = new THREE.BufferGeometry();
  const beltCount = 220;
  const beltPos = new Float32Array(beltCount * 3);
  for (let i = 0; i < beltCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const rad = 9.6 + (Math.random() - 0.5) * 0.9;
    beltPos[i * 3] = Math.cos(ang) * rad;
    beltPos[i * 3 + 1] = (Math.random() - 0.5) * 0.35;
    beltPos[i * 3 + 2] = Math.sin(ang) * rad;
  }
  beltGeo.setAttribute('position', new THREE.BufferAttribute(beltPos, 3));
  solarGroup.add(new THREE.Points(beltGeo, new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.07, transparent: true, opacity: 0.7 })));

  return { planetMeshes, planetAngles };
};

window.createHeartExplorer = function (heartGroup) {
  const anchors = [];
  const namedMeshes = [];

  function addAnchor(id, label, posVec, labelOffset) {
    const obj = new THREE.Object3D();
    obj.position.copy(posVec);
    heartGroup.add(obj);
    anchors.push({ id, label, obj, offset: labelOffset });
  }

  addAnchor('aorta', 'Aorta', new THREE.Vector3(0.05, 1.45, 0.05), { dx: 95, dy: -45 });
  addAnchor('pulm', 'Pulmonary Artery', new THREE.Vector3(-0.2, 0.85, 0.45), { dx: -120, dy: -55 });
  addAnchor('ra', 'Right Atrium', new THREE.Vector3(-0.85, 0.45, 0.2), { dx: -125, dy: -5 });
  addAnchor('rv', 'Right Ventricle', new THREE.Vector3(-0.45, -0.55, 0.45), { dx: -120, dy: 45 });
  addAnchor('la', 'Left Atrium', new THREE.Vector3(0.75, 0.5, -0.1), { dx: 105, dy: -10 });
  addAnchor('lv', 'Left Ventricle', new THREE.Vector3(0.45, -0.65, 0.35), { dx: 105, dy: 45 });

  // Load the user's uploaded heart.glb
  if (typeof THREE.GLTFLoader !== 'undefined') {
    const loader = new THREE.GLTFLoader();
    loader.load(
      'assets/heart.glb',
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 3.5 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        model.traverse((child) => {
          if (child.isMesh) {
            if (child.material) {
              child.material = child.material.clone();
              child.material.metalness = Math.min(child.material.metalness || 0, 0.12);
              child.material.roughness = Math.max(child.material.roughness || 0.4, 0.35);
            }
            const rawName = (child.name || child.parent?.name || 'Heart Structure').replace(/_/g, ' ');
            let partId = 'overview';
            const low = rawName.toLowerCase();
            if (low.includes('aort') || low.includes('brachio') || low.includes('carotid') || low.includes('subclavian')) partId = 'aorta';
            else if (low.includes('pulmonary artery') || low.includes('pulmonary trunk')) partId = 'pulm';
            else if (low.includes('vena cava')) partId = 'ra';
            else if (low.includes('pulmonary vein')) partId = 'la';
            child.userData = { type: 'heart', id: partId, meshName: rawName };
            namedMeshes.push(child);
          }
        });
        heartGroup.add(model);
      },
      undefined,
      (err) => console.error('Failed to load heart.glb:', err)
    );
  }

  function highlightPart(partId) {
    namedMeshes.forEach((m) => {
      if (m.material && m.material.emissive) {
        m.material.emissive.setHex(m.userData.id === partId ? 0x443308 : 0x000000);
      }
    });
  }

  function update(_dt, elapsed) {
    const phase = (elapsed * 1.15) % 1.0;
    const lub = Math.exp(-Math.pow((phase - 0.12) / 0.055, 2));
    const dub = Math.exp(-Math.pow((phase - 0.28) / 0.05, 2)) * 0.7;
    heartGroup.scale.setScalar(1.0 + (lub + dub) * 0.045);
  }

  return { highlightPart, update, anchors };
};

window.createDoraemonBuddy = function (buddyGroup) {
  const procRoot = new THREE.Group();
  buddyGroup.add(procRoot);

  const matBlue = new THREE.MeshStandardMaterial({ color: 0x0093dd, roughness: 0.35 });
  const matWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
  const matRed = new THREE.MeshStandardMaterial({ color: 0xe90c0c, roughness: 0.35 });
  const matGold = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.25, metalness: 0.3 });
  const matBlack = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2 });

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.92, 32, 28), matBlue);
  head.position.y = 0.88;
  procRoot.add(head);

  // White face patch
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.8, 28, 24), matWhite);
  face.scale.set(0.95, 0.85, 0.55);
  face.position.set(0, 0.78, 0.54);
  procRoot.add(face);

  // Eyes (track cursor)
  const eyesGroup = new THREE.Group();
  eyesGroup.position.set(0, 1.16, 0.84);
  const pupils = [];
  [-0.2, 0.2].forEach((ex) => {
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.21, 20, 18), matWhite);
    sclera.scale.set(0.85, 1.18, 0.45);
    sclera.position.set(ex, 0, 0);
    eyesGroup.add(sclera);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 14), matBlack);
    pupil.scale.set(0.85, 1.1, 0.5);
    pupil.position.set(ex, 0, 0.09);
    eyesGroup.add(pupil);
    pupils.push({ mesh: pupil, baseX: ex });
  });
  procRoot.add(eyesGroup);

  // Red Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 16), matRed);
  nose.position.set(0, 0.96, 1.0);
  procRoot.add(nose);

  // Whiskers
  [-1, 1].forEach((side) => {
    [-0.14, 0, 0.14].forEach((ang, idx) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 6), matBlack);
      w.rotation.z = Math.PI / 2 + side * ang;
      w.position.set(side * 0.48, 0.84 - (idx - 1) * 0.09, 0.88);
      procRoot.add(w);
    });
  });

  // Body + White Belly + 4D Pocket
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.74, 1.1, 28), matBlue);
  body.position.y = -0.22;
  procRoot.add(body);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 20), matWhite);
  belly.scale.set(0.92, 0.95, 0.45);
  belly.position.set(0, -0.22, 0.48);
  procRoot.add(belly);

  const pocket = new THREE.Mesh(new THREE.CircleGeometry(0.36, 24, Math.PI, Math.PI), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, side: THREE.DoubleSide }));
  pocket.position.set(0, -0.24, 0.77);
  procRoot.add(pocket);

  // Red Collar & Golden Bell
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.08, 12, 32), matRed);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.25;
  procRoot.add(collar);

  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 16), matGold);
  bell.position.set(0, 0.14, 0.72);
  procRoot.add(bell);

  // Arms & White Hands
  const arms = [];
  [-1, 1].forEach((side) => {
    const arm = new THREE.Group();
    arm.position.set(side * 0.72, 0.05, 0);
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.55, 16), matBlue);
    sleeve.rotation.z = side * 0.55;
    sleeve.position.set(side * 0.22, -0.15, 0);
    arm.add(sleeve);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), matWhite);
    hand.position.set(side * 0.45, -0.32, 0);
    arm.add(hand);
    procRoot.add(arm);
    arms.push(arm);
  });

  // Legs & White Feet
  [-0.32, 0.32].forEach((lx) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.35, 16), matBlue);
    leg.position.set(lx, -0.88, 0);
    procRoot.add(leg);
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 16), matWhite);
    foot.scale.set(0.95, 0.55, 1.3);
    foot.position.set(lx, -1.08, 0.12);
    procRoot.add(foot);
  });

  // Optional: if user exports Doraemon_Spaceport.blend -> assets/doraemon.glb, load it automatically!
  if (typeof THREE.GLTFLoader !== 'undefined') {
    const loader = new THREE.GLTFLoader();
    loader.load(
      'assets/doraemon.glb',
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.9 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        buddyGroup.add(model);
        procRoot.visible = false;
      },
      undefined,
      () => {
        procRoot.visible = true;
      }
    );
  }

  let blinkTimer = 0;
  function update(dt, elapsed, isSpeaking, mouseX, mouseY) {
    buddyGroup.position.y = Math.sin(elapsed * 2.1) * 0.05 + (isSpeaking ? Math.abs(Math.sin(elapsed * 12)) * 0.06 : 0);
    arms[0].rotation.x = Math.sin(elapsed * 1.8) * 0.12;
    arms[1].rotation.x = -Math.sin(elapsed * 1.8) * 0.12;

    blinkTimer += dt;
    const blink = (blinkTimer % 4.0) > 3.88 ? 0.12 : 1.0;
    eyesGroup.scale.y += (blink - eyesGroup.scale.y) * 0.35;
    pupils.forEach(p => {
      p.mesh.position.x = p.baseX + mouseX * 0.055;
      p.mesh.position.y = mouseY * 0.045;
    });
  }

  return { update };
};
