export function initBrainViewer(): void {
  const section = document.getElementById('brain')!;

  section.innerHTML = `
    <h2 class="section__title">3D Brain Model</h2>
    <div class="brain-viewer__container" id="brain-container">
      <div class="brain-viewer__loading">Loading 3D viewer...</div>
    </div>
    <p class="brain-viewer__controls-hint">Click and drag to rotate. Scroll to zoom. Generated from MRI scans.</p>
  `;

  // Lazy-load Three.js when section comes into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadThreeJS();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(section);
}

/** Read a CSS custom property from :root and convert to a Three.js-compatible hex int */
function cssColorToHex(varName: string, fallback: string): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback;
  return parseInt(raw.replace('#', ''), 16);
}

async function loadThreeJS(): Promise<void> {
  const container = document.getElementById('brain-container');
  if (!container) return;

  try {
    const THREE = await import('three');
    const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
    const { STLLoader } = await import('three/addons/loaders/STLLoader.js');

    // Read palette colors
    const bgColor = cssColorToHex('--bg-deep', '#0d0221');
    const tealColor = cssColorToHex('--vapor-teal', '#01cdfe');
    const pinkColor = cssColorToHex('--vapor-pink', '#ff71ce');
    const purpleColor = cssColorToHex('--vapor-purple', '#b967ff');

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(bgColor, 1);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.classList.add('brain-viewer__canvas');

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Lighting — uses palette colors
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const light1 = new THREE.DirectionalLight(tealColor, 0.8);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(pinkColor, 0.6);
    light2.position.set(-1, -0.5, -1);
    scene.add(light2);

    const light3 = new THREE.DirectionalLight(purpleColor, 0.4);
    light3.position.set(0, 1, -0.5);
    scene.add(light3);

    // Load STL
    const loader = new STLLoader();
    const BASE = import.meta.env.BASE_URL;

    loader.load(`${BASE}models/brain.stl`, (geometry) => {
      geometry.computeVertexNormals();
      geometry.center();

      // Hologram material — uses palette colors
      const material = new THREE.MeshPhongMaterial({
        color: tealColor,
        specular: purpleColor,
        shininess: 30,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Wireframe overlay
      const wireframe = new THREE.WireframeGeometry(geometry);
      const wireMat = new THREE.LineBasicMaterial({
        color: pinkColor,
        transparent: true,
        opacity: 0.15,
      });
      const wireLines = new THREE.LineSegments(wireframe, wireMat);
      mesh.add(wireLines);

      // Scale to fit
      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 100 / maxDim;
      mesh.scale.set(scale, scale, scale);

      scene.add(mesh);

      // Position camera
      camera.position.set(0, 50, 200);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
    }, undefined, () => {
      // Error loading - show fallback
      container.innerHTML = `
        <div class="brain-viewer__fallback">
          <p style="color: var(--text-secondary);">3D model could not be loaded.</p>
          <a href="${BASE}3D_brain/three.js.html" class="brain-viewer__fallback-link" target="_blank" rel="noopener noreferrer">
            Open 3D viewer in new tab
          </a>
        </div>
      `;
    });

    // Animation loop
    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    // Pause when hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
        controls.autoRotate = false;
      } else {
        controls.autoRotate = true;
        animate();
      }
    });
  } catch {
    // Three.js failed to load - show fallback
    const BASE = import.meta.env.BASE_URL;
    container.innerHTML = `
      <div class="brain-viewer__fallback">
        <p style="color: var(--text-secondary);">3D viewer requires WebGL support.</p>
        <a href="${BASE}3D_brain/three.js.html" class="brain-viewer__fallback-link" target="_blank" rel="noopener noreferrer">
          Open 3D viewer in new tab
        </a>
      </div>
    `;
  }
}
