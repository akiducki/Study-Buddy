// 3D Solar System Explorer + Clean Color-Coded Academic 3D Heart Model with Anchor Pins
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
  const flowParticles = [];
  const partMeshes = {};
  const anchors = [];

  // Clean, bright academic color-coded materials (never black or overly bloody)
  const matRightAtrium = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.42, metalness: 0.05 });
  const matRightVentricle = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.42, metalness: 0.05 });
  const matPulmonary = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.4, metalness: 0.05 });
  const matLeftAtrium = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.42, metalness: 0.05 });
  const matLeftVentricle = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.42, metalness: 0.05 });
  const matAorta = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.38, metalness: 0.05 });
  const matValve = new THREE.MeshStandardMaterial({ color: 0xf5f1c6, roughness: 0.5 });

  function addAnchor(id, label, posVec, labelOffset) {
    const obj = new THREE.Object3D();
    obj.position.copy(posVec);
    heartGroup.add(obj);
    anchors.push({ id, label, obj, offset: labelOffset });
  }

  // 1. Right Atrium (Blue, Upper Right)
  const ra = new THREE.Mesh(new THREE.SphereGeometry(0.62, 28, 24), matRightAtrium);
  ra.scale.set(0.88, 0.92, 0.78);
  ra.position.set(-0.78, 0.62, 0.1);
  ra.userData = { type: 'heart', id: 'ra' };
  heartGroup.add(ra);
  partMeshes.ra = ra;
  addAnchor('ra', 'Right Atrium', new THREE.Vector3(-0.95, 0.68, 0.15), { dx: -115, dy: -20 });

  // Superior & Inferior Vena Cava
  const svc = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 1.05, 16), matRightAtrium);
  svc.position.set(-0.85, 1.32, -0.02);
  svc.userData = { type: 'heart', id: 'ra' };
  heartGroup.add(svc);

  const ivc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.75, 16), matRightAtrium);
  ivc.position.set(-0.76, -0.95, -0.15);
  ivc.userData = { type: 'heart', id: 'ra' };
  heartGroup.add(ivc);

  // 2. Right Ventricle (Blue, Lower Right)
  const rv = new THREE.Mesh(new THREE.SphereGeometry(0.88, 32, 28), matRightVentricle);
  rv.scale.set(0.76, 1.12, 0.72);
  rv.position.set(-0.46, -0.35, 0.22);
  rv.rotation.z = 0.16;
  rv.userData = { type: 'heart', id: 'rv' };
  heartGroup.add(rv);
  partMeshes.rv = rv;
  addAnchor('rv', 'Right Ventricle', new THREE.Vector3(-0.62, -0.55, 0.38), { dx: -120, dy: 38 });

  // 3. Left Atrium (Coral Red, Upper Left)
  const la = new THREE.Mesh(new THREE.SphereGeometry(0.58, 28, 24), matLeftAtrium);
  la.scale.set(0.88, 0.85, 0.8);
  la.position.set(0.68, 0.68, -0.05);
  la.userData = { type: 'heart', id: 'la' };
  heartGroup.add(la);
  partMeshes.la = la;
  addAnchor('la', 'Left Atrium', new THREE.Vector3(0.86, 0.72, 0.05), { dx: 95, dy: -15 });

  // 4. Left Ventricle (Crimson Red, Lower Left)
  const lv = new THREE.Mesh(new THREE.SphereGeometry(1.02, 32, 28), matLeftVentricle);
  lv.scale.set(0.78, 1.28, 0.76);
  lv.position.set(0.35, -0.45, 0.08);
  lv.rotation.z = -0.24;
  lv.userData = { type: 'heart', id: 'lv' };
  heartGroup.add(lv);
  partMeshes.lv = lv;
  addAnchor('lv', 'Left Ventricle', new THREE.Vector3(0.62, -0.62, 0.25), { dx: 100, dy: 42 });

  // Visible Tricuspid & Mitral Valve Rings (Cream/Ivory academic indicators)
  const triValve = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.045, 10, 24), matValve);
  triValve.rotation.x = Math.PI / 2;
  triValve.position.set(-0.62, 0.14, 0.25);
  heartGroup.add(triValve);

  const mitValve = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.045, 10, 24), matValve);
  mitValve.rotation.x = Math.PI / 2;
  mitValve.position.set(0.52, 0.16, 0.15);
  heartGroup.add(mitValve);

  // 5. Aortic Arch + 3 Ascending Branches (Scarlet Red)
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.12, 0.45, 0.06),
    new THREE.Vector3(0.24, 1.38, 0.1),
    new THREE.Vector3(0.04, 1.75, -0.06),
    new THREE.Vector3(-0.24, 1.48, -0.32),
    new THREE.Vector3(-0.2, -0.8, -0.48)
  ]);
  const aorta = new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 40, 0.21, 16, false), matAorta);
  aorta.userData = { type: 'heart', id: 'aorta' };
  heartGroup.add(aorta);
  partMeshes.aorta = aorta;
  addAnchor('aorta', 'Aorta', new THREE.Vector3(0.1, 1.78, 0.05), { dx: 85, dy: -45 });

  [-0.12, 0.04, 0.2].forEach((bx, idx) => {
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.44, 12), matAorta);
    branch.position.set(bx, 1.88, -0.06 - idx * 0.05);
    branch.rotation.z = (idx - 1) * -0.15;
    branch.userData = { type: 'heart', id: 'aorta' };
    heartGroup.add(branch);
  });

  // 6. Pulmonary Trunk (Sky Blue)
  const pulmCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, 0.35, 0.34),
    new THREE.Vector3(-0.1, 1.08, 0.34),
    new THREE.Vector3(0.45, 1.24, 0.12)
  ]);
  const pulmTrunk = new THREE.Mesh(new THREE.TubeGeometry(pulmCurve, 24, 0.17, 14, false), matPulmonary);
  pulmTrunk.userData = { type: 'heart', id: 'pulm' };
  heartGroup.add(pulmTrunk);
  partMeshes.pulm = pulmTrunk;
  addAnchor('pulm', 'Pulmonary Artery', new THREE.Vector3(-0.12, 1.08, 0.42), { dx: -115, dy: -62 });

  // 7. Animated Blood Flow Particles
  const flowDeoxy = [new THREE.Vector3(-0.85, 1.55, -0.02), new THREE.Vector3(-0.78, 0.62, 0.1), new THREE.Vector3(-0.46, -0.35, 0.22), new THREE.Vector3(-0.1, 1.12, 0.34)];
  const flowOxy = [new THREE.Vector3(0.68, 0.68, -0.05), new THREE.Vector3(0.35, -0.45, 0.08), new THREE.Vector3(0.24, 1.45, 0.1), new THREE.Vector3(-0.24, 1.48, -0.32)];
  for (let i = 0; i < 12; i++) {
    const isOxy = i >= 6;
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 10, 10),
      new THREE.MeshBasicMaterial({ color: isOxy ? 0xfef08a : 0xd0f601 })
    );
    heartGroup.add(p);
    flowParticles.push({ mesh: p, path: isOxy ? flowOxy : flowDeoxy, t: (i % 6) / 6 });
  }

  function highlightPart(partId) {
    Object.entries(partMeshes).forEach(([id, mesh]) => {
      if (mesh.material && mesh.material.emissive) {
        mesh.material.emissive.setHex(id === partId ? 0x3f3f10 : 0x000000);
      }
    });
  }

  function update(dt, elapsed, flowOn) {
    const phase = (elapsed * 1.15) % 1.0;
    const lub = Math.exp(-Math.pow((phase - 0.12) / 0.055, 2));
    const dub = Math.exp(-Math.pow((phase - 0.28) / 0.05, 2)) * 0.7;
    heartGroup.scale.setScalar(1.0 + (lub + dub) * 0.05);

    flowParticles.forEach(p => {
      p.mesh.visible = flowOn;
      if (!flowOn) return;
      p.t = (p.t + dt * 0.36) % 1;
      const seg = p.t * (p.path.length - 1);
      const idx = Math.floor(seg);
      p.mesh.position.lerpVectors(p.path[idx], p.path[Math.min(idx + 1, p.path.length - 1)], seg - idx);
    });
  }

  return { highlightPart, update, anchors };
};
