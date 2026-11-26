window.STUDY_DATA = {
  SOLAR_DATA: [
    {
      id: 'sun', name: 'Sun', color: 0xffaa22, emissive: 0xff5500, size: 2.3, dist: 0, speed: 0,
      category: 'G-Type Main-Sequence Star',
      stats: { 'Diameter': '1.39 million km', 'Surface Temp': '5,500 °C', 'Gravity': '274 m/s²', 'Age': '4.6 billion yrs' },
      desc: 'The Sun holds 99.86% of all mass in our solar system. Nuclear fusion in its core converts 600 million tons of hydrogen into helium every second!',
      deep: 'Deep inside the Sun’s 15-million-degree core, intense gravity squeezes hydrogen nuclei together through the proton-proton chain, releasing gamma-ray photons that take over 100,000 years to reach the surface and 8 minutes to reach Earth.'
    },
    {
      id: 'mercury', name: 'Mercury', color: 0xa8a29e, emissive: 0x1c1917, size: 0.36, dist: 3.6, speed: 1.6,
      category: 'Terrestrial Planet',
      stats: { 'Orbit Period': '88 Earth days', 'Temp Range': '-180 to 430 °C', 'Moons': '0', 'Distance': '0.39 AU' },
      desc: 'Mercury is the smallest and innermost planet. With almost no atmosphere to trap heat, temperatures swing wildly between day and night.',
      deep: 'Mercury has an unusually huge iron core making up about 85% of its radius. Because it lacks a thick atmosphere, heat escapes immediately on the night side, creating a 600-degree temperature swing.'
    },
    {
      id: 'venus', name: 'Venus', color: 0xfde047, emissive: 0x713f12, size: 0.56, dist: 5.0, speed: 1.15,
      category: 'Terrestrial Planet',
      stats: { 'Orbit Period': '225 Earth days', 'Surface Temp': '465 °C', 'Moons': '0', 'Rotation': 'Retrograde' },
      desc: 'Venus is the hottest planet due to a runaway greenhouse effect from its thick carbon dioxide atmosphere, and it spins backward compared to most planets.',
      deep: 'Venus’s atmosphere is 96% carbon dioxide with sulfuric acid clouds, creating surface pressure 92 times Earth’s. Infrared heat cannot escape, making Venus hotter than Mercury even though it is farther from the Sun.'
    },
    {
      id: 'earth', name: 'Earth', color: 0x38bdf8, emissive: 0x0369a1, size: 0.6, dist: 6.8, speed: 0.95,
      category: 'Terrestrial Planet',
      stats: { 'Orbit Period': '365.25 days', 'Surface Water': '71%', 'Moons': '1 (Luna)', 'Distance': '1.00 AU' },
      desc: 'Earth is the only known world with liquid surface water and life. Its magnetic field shields the atmosphere from solar wind.',
      deep: 'Earth’s 23.5-degree axial tilt gives us our four seasons as different hemispheres lean toward or away from the Sun. Meanwhile, molten iron churning in the outer core generates a magnetosphere that deflects harmful solar radiation.'
    },
    {
      id: 'mars', name: 'Mars', color: 0xf97316, emissive: 0x7c2d12, size: 0.45, dist: 8.6, speed: 0.75,
      category: 'Terrestrial Planet',
      stats: { 'Orbit Period': '687 Earth days', 'Tallest Peak': 'Olympus Mons (21.9 km)', 'Moons': '2', 'Distance': '1.52 AU' },
      desc: 'Known as the Red Planet because of iron oxide dust, Mars hosts Olympus Mons, the largest volcano in the solar system.',
      deep: 'Ancient river deltas and minerals on Mars show it once had liquid water billions of years ago. Today its thin CO₂ atmosphere cannot hold warmth, though water ice still remains locked at both poles.'
    },
    {
      id: 'jupiter', name: 'Jupiter', color: 0xfdba74, emissive: 0x7c2d12, size: 1.25, dist: 11.4, speed: 0.45,
      category: 'Gas Giant',
      stats: { 'Orbit Period': '11.86 years', 'Day Length': '9h 55m', 'Moons': '95+', 'Feature': 'Great Red Spot' },
      desc: 'Jupiter is the largest planet, more than twice as massive as all other planets combined, famous for its centuries-old Great Red Spot storm.',
      deep: 'Spinning once every 10 hours, Jupiter’s rapid rotation stretches ammonia clouds into alternating dark belts and bright zones. Deep inside, extreme pressure squeezes hydrogen into a liquid metallic ocean that powers a massive magnetic field.'
    },
    {
      id: 'saturn', name: 'Saturn', color: 0xfef08a, emissive: 0x713f12, size: 1.05, dist: 14.8, speed: 0.32, hasRings: true,
      category: 'Gas Giant',
      stats: { 'Orbit Period': '29.45 years', 'Ring Span': '282,000 km', 'Moons': '146+', 'Density': '0.687 g/cm³' },
      desc: 'Saturn is famous for its dazzling ring system made of billions of ice and rock particles, and its density is lower than liquid water.',
      deep: 'Saturn’s rings are mostly pure water ice ranging from dust grains to house-sized boulders, held in razor-thin bands by the gravity of tiny shepherd moons. Its moon Titan even has liquid methane lakes and a thick nitrogen sky.'
    },
    {
      id: 'uranus', name: 'Uranus', color: 0x67e8f9, emissive: 0x155e75, size: 0.78, dist: 18.0, speed: 0.22,
      category: 'Ice Giant',
      stats: { 'Orbit Period': '84 years', 'Axial Tilt': '97.8°', 'Moons': '28', 'Atmosphere': 'Methane & H₂' },
      desc: 'Uranus is an ice giant tilted nearly sideways at 98 degrees, causing 42-year-long polar summers and winters.',
      deep: 'Methane gas in Uranus’s upper atmosphere absorbs red sunlight and reflects cyan-blue light back into space. Scientists think a giant Earth-sized collision early in the solar system knocked it onto its side.'
    },
    {
      id: 'neptune', name: 'Neptune', color: 0x3b82f6, emissive: 0x1e3a8a, size: 0.76, dist: 21.0, speed: 0.16,
      category: 'Ice Giant',
      stats: { 'Orbit Period': '164.8 years', 'Wind Speed': '2,100 km/h', 'Moons': '16', 'Distance': '30.1 AU' },
      desc: 'Neptune is the farthest major planet from the Sun and has the fastest supersonic winds in the solar system.',
      deep: 'Unlike Earth’s weather driven by sunlight, Neptune’s supersonic storms are powered by internal heat radiating from its deep icy mantle of water, ammonia, and methane.'
    }
  ],

  HEART_PARTS: [
    {
      id: 'overview', name: 'Full Heart', category: 'Biology · Academic Heart Model',
      stats: { 'Chambers': '4 (2 Atria, 2 Ventricles)', 'Heart Rate': '60–100 bpm', 'Output': '~5 L/min', '3D Platform': 'BioDigital Compatible' },
      desc: 'Think of the heart as two pumps side by side: the blue right side sends used blood to your lungs for oxygen, and the red left side pumps oxygen-rich blood to your entire body.',
      deep: 'Each heartbeat follows a precise electrical rhythm starting at the SA node (natural pacemaker). First both atria contract to top off the ventricles; a split-second later, both ventricles squeeze—producing the classic lub-dub sound as valves snap shut.'
    },
    {
      id: 'ra', name: 'Right Atrium', category: 'Upper Right Chamber (Blue)',
      stats: { 'Blood Type': 'Deoxygenated', 'Receives From': 'Vena Cava', 'Valve': 'Tricuspid Valve' },
      desc: 'The Right Atrium is the receiving dock for oxygen-poor blood returning from your body through the superior and inferior vena cava.',
      deep: 'The Right Atrium also houses the sinoatrial (SA) node, which fires electrical impulses ~70 times per minute. When it contracts, blood passes through the one-way tricuspid valve into the Right Ventricle.'
    },
    {
      id: 'rv', name: 'Right Ventricle', category: 'Lower Right Chamber (Blue)',
      stats: { 'Blood Type': 'Deoxygenated', 'Sends To': 'Pulmonary Artery -> Lungs', 'Pressure': 'Low (~25 mmHg)' },
      desc: 'The Right Ventricle pumps oxygen-poor blood upward through the pulmonary artery straight to the lungs to pick up fresh oxygen and drop off carbon dioxide.',
      deep: 'Because the lungs sit right next to the heart, the Right Ventricle has a thinner muscular wall than the Left Ventricle—gentle pressure protects delicate lung capillaries.'
    },
    {
      id: 'la', name: 'Left Atrium', category: 'Upper Left Chamber (Red)',
      stats: { 'Blood Type': 'Oxygenated', 'Receives From': '4 Pulmonary Veins', 'Valve': 'Mitral (Bicuspid)' },
      desc: 'The Left Atrium collects bright, oxygen-rich blood returning from the lungs and channels it downward into the Left Ventricle.',
      deep: 'Blood enters the Left Atrium continuously from four pulmonary veins and flows through the mitral (bicuspid) valve, which prevents backflow when the Left Ventricle squeezes.'
    },
    {
      id: 'lv', name: 'Left Ventricle', category: 'Lower Left Chamber (Red)',
      stats: { 'Blood Type': 'Oxygenated', 'Wall Thickness': 'Thickest (~12 mm)', 'Pressure': 'High (~120 mmHg)' },
      desc: 'The Left Ventricle is the powerhouse of the heart—its thick muscular wall squeezes oxygen-rich blood out through the aorta to your entire body.',
      deep: 'Because it must push blood from your head down to your toes, the Left Ventricle has roughly three times the muscle mass of the Right Ventricle, generating systolic blood pressure around 120 mmHg.'
    },
    {
      id: 'aorta', name: 'Aorta', category: 'Main Systemic Artery (Red)',
      stats: { 'Origin': 'Left Ventricle', 'Branches': '3 Upper Arch Arteries', 'Role': 'Systemic Delivery' },
      desc: 'The Aorta is the main highway of oxygenated blood, arching out of the Left Ventricle with three upper branches feeding your head and arms.',
      deep: 'Its thick elastic walls stretch like a rubber band when the Left Ventricle pumps, then recoil smoothly between beats to keep blood flowing steadily to every organ.'
    },
    {
      id: 'pulm', name: 'Pulmonary Artery', category: 'Pulmonary Trunk (Blue)',
      stats: { 'Origin': 'Right Ventricle', 'Carries': 'Deoxygenated Blood', 'Destination': 'Left & Right Lungs' },
      desc: 'The Pulmonary Artery carries oxygen-poor blood from the Right Ventricle and splits into left and right branches leading to each lung.',
      deep: 'It is one of the only arteries in the body that carries deoxygenated blood—remember that arteries always carry blood AWAY from the heart, while veins carry blood TO the heart.'
    }
  ]
};
