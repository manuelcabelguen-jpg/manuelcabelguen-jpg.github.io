/**
 * CARTOGRAFFECT® - Hero 3D Octahedron & Free Energy Particles
 * Intégration sur index.html et pages de présentation via Three.js (r128)
 * Conçu pour respecter l'architecture Zero-Build et la performance 60 FPS
 */
(function () {
  'use strict';

  function initHero3D() {
    const container = document.getElementById('hero-3d-wrapper');
    if (!container || typeof THREE === 'undefined') return;

    // Éviter double initialisation
    if (container.dataset.initialized === 'true') return;
    container.dataset.initialized = 'true';

    // 1. Initialisation scène, caméra, moteur WebGL
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0); // Transparent pour laisser passer le fond cosmique
    container.innerHTML = ''; // Nettoyer placeholder
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 2. Géométrie de l'Octaèdre central (Norme L1 de Manhattan)
    const octaGeometry = new THREE.OctahedronGeometry(1.2, 0);

    // Surface semi-transparente cosmique aux reflets indigo/violet
    const octaMaterial = new THREE.MeshPhongMaterial({
      color: 0x0f172a,
      emissive: 0x312e81,
      specular: 0x818cf8,
      shininess: 90,
      transparent: true,
      opacity: 0.85,
      flatShading: true
    });
    const octaMesh = new THREE.Mesh(octaGeometry, octaMaterial);
    group.add(octaMesh);

    // Arêtes lumineuses wireframe haute précision
    const wireGeometry = new THREE.WireframeGeometry(octaGeometry);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.65
    });
    const wireframe = new THREE.LineSegments(wireGeometry, wireMaterial);
    group.add(wireframe);

    // 3. Cercles concentriques des strates Z (équateur et méridiens discrets)
    const ringGroup = new THREE.Group();
    const ringMaterial = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.3 });
    for (let r = 0.4; r <= 1.4; r += 0.35) {
      const ringGeo = new THREE.BufferGeometry();
      const pts = [];
      for (let theta = 0; theta <= Math.PI * 2; theta += Math.PI / 32) {
        pts.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
      }
      ringGeo.setFromPoints(pts);
      const ring = new THREE.Line(ringGeo, ringMaterial);
      ringGroup.add(ring);
    }
    group.add(ringGroup);

    // 4. Nuage de particules "Énergie Libre" (Flux allostatique variationnel)
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.4 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i] = radius * Math.cos(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi);
      particlePositions[i + 2] = radius * Math.cos(phi) * Math.sin(theta);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 0.038,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particleField = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particleField);

    // Éclairage studio avec reflets violets
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x818cf8, 2.2, 10);
    pointLight.position.set(2, 3, 3);
    scene.add(pointLight);

    const pointLightCyan = new THREE.PointLight(0x38bdf8, 1.5, 10);
    pointLightCyan.position.set(-2, -2, 2);
    scene.add(pointLightCyan);

    // Suivi de la souris et gestes tactiles
    let targetRotX = 0;
    let targetRotY = 0;
    let isAutoRotating = true;

    function handlePointer(clientX, clientY) {
      const rect = container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = normX * 0.55;
      targetRotX = normY * 0.45;
    }

    window.addEventListener('mousemove', (e) => {
      handlePointer(e.clientX, e.clientY);
    });

    container.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // Boucle d'animation avec coupure hors écran (IntersectionObserver)
    let isVisible = true;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();

      // Rotation autonome de base
      if (isAutoRotating) {
        group.rotation.y += delta * 0.28;
      }

      // Amorti fluide (Lerp) vers la direction du pointeur
      group.rotation.x += (targetRotX - group.rotation.x) * 0.05;
      group.rotation.z += (targetRotY - group.rotation.z) * 0.05;

      // Ondulation contre-rotative des particules d'énergie libre
      particleField.rotation.y -= delta * 0.12;
      particleField.rotation.x += delta * 0.04;

      renderer.render(scene, camera);
    }
    animate();

    // Redimensionnement adaptatif
    function onResize() {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth || 300;
      const height = container.clientHeight || 300;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    // API globale pour contrôler l'objet 3D
    window.CartograffectHero3D = {
      toggleAutoRotate: function () {
        isAutoRotating = !isAutoRotating;
        return isAutoRotating;
      },
      pulse: function () {
        // Effet de pulsation d'énergie libre
        let progress = 0;
        const baseScale = group.scale.x;
        const interval = setInterval(() => {
          progress += 0.1;
          const factor = 1 + Math.sin(progress * Math.PI) * 0.15;
          group.scale.set(factor, factor, factor);
          if (progress >= 1) {
            clearInterval(interval);
            group.scale.set(baseScale, baseScale, baseScale);
          }
        }, 16);
      }
    };
  }

  // Chargement conditionnel au DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3D);
  } else {
    initHero3D();
  }
})();
