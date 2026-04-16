/**
 * three-bg.js
 * Premium Three.js animated golden particle network background.
 * - Drifting, interconnected gold particles
 * - Subtle parallax on mouse move
 * - Scroll-based depth shift
 * - Fully responsive via resize listener
 */

(function () {
    "use strict";

    // ------- Safety guard -------
    if (typeof THREE === "undefined") {
        console.warn("[three-bg] THREE not loaded. Skipping 3D background.");
        return;
    }

    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    // ---- Renderer ----
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,   // keep mobile fast
        alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);

    // ---- Scene & Camera ----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 80;

    // ============================================================
    // PARTICLE SYSTEM
    // ============================================================
    const PARTICLE_COUNT = isMobile() ? 700 : 1400;
    const SPREAD         = 180;   // spatial spread
    const CONNECT_DIST   = 22;    // max connection distance
    const MAX_LINES      = 3000;  // pre-allocate line segments

    // Positions
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities= new Float32Array(PARTICLE_COUNT * 3); // drift
    const sizes     = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        positions[i3]     = (Math.random() - 0.5) * SPREAD;
        positions[i3 + 1] = (Math.random() - 0.5) * SPREAD;
        positions[i3 + 2] = (Math.random() - 0.5) * SPREAD * 0.4;

        velocities[i3]     = (Math.random() - 0.5) * 0.012;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.012;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.004;

        sizes[i] = Math.random() * 1.4 + 0.5;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("size",     new THREE.BufferAttribute(sizes, 1));

    // Shader material for perfectly round, glowing dots
    const particleMat = new THREE.ShaderMaterial({
        uniforms: {
            uTime:       { value: 0 },
            uGoldColor:  { value: new THREE.Color(0xFFD700) },
            uDimColor:   { value: new THREE.Color(0x604A00) },
        },
        vertexShader: `
            attribute float size;
            uniform float uTime;
            varying float vAlpha;

            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (280.0 / -mvPosition.z);
                gl_Position  = projectionMatrix * mvPosition;
                // Depth-based alpha
                float depth = (position.z + 36.0) / 72.0;
                vAlpha = mix(0.18, 0.85, depth);
            }
        `,
        fragmentShader: `
            uniform vec3 uGoldColor;
            uniform vec3 uDimColor;
            varying float vAlpha;

            void main() {
                vec2 uv = gl_PointCoord - 0.5;
                float dist = length(uv);
                if (dist > 0.5) discard;

                // Soft glowing disc
                float glow = 1.0 - smoothstep(0.0, 0.5, dist);
                glow = pow(glow, 1.4);

                vec3 col = mix(uDimColor, uGoldColor, glow);
                gl_FragColor = vec4(col, vAlpha * glow);
            }
        `,
        transparent: true,
        depthWrite:  false,
        blending:    THREE.AdditiveBlending,
    });

    const particleMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particleMesh);

    // ============================================================
    // LINE NETWORK (connections)
    // ============================================================
    const linePositions = new Float32Array(MAX_LINES * 6);   // 2 verts × 3
    const lineAlphas    = new Float32Array(MAX_LINES * 2);

    const lineGeo = new THREE.BufferGeometry();
    const linePosAttr   = new THREE.BufferAttribute(linePositions, 3);
    const lineAlphaAttr = new THREE.BufferAttribute(lineAlphas, 1);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    lineAlphaAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute("position", linePosAttr);
    lineGeo.setAttribute("alpha",    lineAlphaAttr);
    lineGeo.setDrawRange(0, 0);

    const lineMat = new THREE.ShaderMaterial({
        uniforms: {
            uBaseColor: { value: new THREE.Color(0xFFD700) },
        },
        vertexShader: `
            attribute float alpha;
            varying float vAlpha;
            void main() {
                vAlpha = alpha;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 uBaseColor;
            varying float vAlpha;
            void main() {
                gl_FragColor = vec4(uBaseColor, vAlpha);
            }
        `,
        transparent: true,
        depthWrite:  false,
        blending:    THREE.AdditiveBlending,
    });

    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    // ============================================================
    // MOUSE PARALLAX
    // ============================================================
    const mouse = { x: 0, y: 0 };
    const targetOffset = { x: 0, y: 0 };
    const currentOffset= { x: 0, y: 0 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        targetOffset.x = -mouse.x * 8;
        targetOffset.y =  mouse.y * 8;
    }, { passive: true });

    // ============================================================
    // SCROLL DEPTH SHIFT
    // ============================================================
    let scrollFactor = 0;
    window.addEventListener("scroll", () => {
        scrollFactor = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    }, { passive: true });

    // ============================================================
    // RESIZE
    // ============================================================
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // ============================================================
    // ANIMATION LOOP
    // ============================================================
    let lastTime = 0;

    function animate(time) {
        requestAnimationFrame(animate);

        const dt = Math.min((time - lastTime) * 0.001, 0.05); // seconds, capped
        lastTime = time;

        particleMat.uniforms.uTime.value = time * 0.001;

        // --- Move particles ---
        const pos = particleGeo.attributes.position.array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            pos[i3]     += velocities[i3];
            pos[i3 + 1] += velocities[i3 + 1];
            pos[i3 + 2] += velocities[i3 + 2];

            // Wrap
            const half = SPREAD * 0.5;
            if (pos[i3]     >  half) pos[i3]     = -half;
            if (pos[i3]     < -half) pos[i3]     =  half;
            if (pos[i3+1]   >  half) pos[i3+1]   = -half;
            if (pos[i3+1]   < -half) pos[i3+1]   =  half;
            if (pos[i3+2]   >  half * 0.4) pos[i3+2] = -half * 0.4;
            if (pos[i3+2]   < -half * 0.4) pos[i3+2] =  half * 0.4;
        }
        particleGeo.attributes.position.needsUpdate = true;

        // --- Build connections ---
        let lineIdx = 0;
        const lp = lineGeo.attributes.position.array;
        const la = lineGeo.attributes.alpha.array;
        const connectDistSq = CONNECT_DIST * CONNECT_DIST;

        outer: for (let i = 0; i < PARTICLE_COUNT - 1; i++) {
            const i3 = i * 3;
            for (let j = i + 1; j < PARTICLE_COUNT; j++) {
                if (lineIdx >= MAX_LINES) break outer;
                const j3 = j * 3;
                const dx = pos[i3]   - pos[j3];
                const dy = pos[i3+1] - pos[j3+1];
                const dz = pos[i3+2] - pos[j3+2];
                const d2 = dx*dx + dy*dy + dz*dz;

                if (d2 < connectDistSq) {
                    const alpha = (1 - Math.sqrt(d2) / CONNECT_DIST) * 0.28;
                    const base  = lineIdx * 6;
                    lp[base]   = pos[i3];   lp[base+1] = pos[i3+1]; lp[base+2] = pos[i3+2];
                    lp[base+3] = pos[j3];   lp[base+4] = pos[j3+1]; lp[base+5] = pos[j3+2];
                    la[lineIdx*2]   = alpha;
                    la[lineIdx*2+1] = alpha;
                    lineIdx++;
                }
            }
        }

        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.alpha.needsUpdate    = true;
        lineGeo.setDrawRange(0, lineIdx * 2);

        // --- Camera parallax (smooth lerp) ---
        currentOffset.x += (targetOffset.x - currentOffset.x) * 0.04;
        currentOffset.y += (targetOffset.y - currentOffset.y) * 0.04;

        camera.position.x = currentOffset.x;
        camera.position.y = currentOffset.y;

        // Scroll: pull camera slightly back and rotate scene
        camera.position.z = 80 + scrollFactor * 30;
        particleMesh.rotation.y = scrollFactor * Math.PI * 0.15;

        // Slow auto-rotation
        particleMesh.rotation.x += 0.00015;
        lineMesh.rotation.x      = particleMesh.rotation.x;
        lineMesh.rotation.y      = particleMesh.rotation.y;

        renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);

    // ---- Helper ----
    function isMobile() {
        return window.innerWidth < 768;
    }

})();
