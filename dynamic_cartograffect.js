/**
 * CARTOGRAFFECT DYNAMIQUE - Visualiseur 3D Octaédrique & Plan de Manhattan
 * Basé sur l'Algorithme du Système Émotionnel du Dr Manuel Cabelguen (OPIC n° 1233199)
 * 176 entrées • 8 Opérateurs Centraux • 6 Couronnes de Manhattan (|X|+|Y| = 2Z - 2)
 * Inférence Active & Traitement Prédictif en temps réel (Veille -> Surprise -> Anticipation -> Résolution)
 */

(function(root) {
    const Visualizer = {
        canvas: null,
        ctx: null,
        container: null,
        animFrameId: null,
        isInitialized: false,

        // Camera & Projection state
        camera: {
            azimuth: 0.65,        // Yaw rotation around vertical axis (radians)
            elevation: 1.05,      // Pitch angle (radians) ~ 60 degrees
            targetAzimuth: 0.65,
            targetElevation: 1.05,
            distance: 38,
            targetDistance: 38,
            autoRotate: true,
            rotateSpeed: 0.0035,
            mode: '3D',           // '3D' or '2D'
            zFlatten: 1.0,        // 1.0 for 3D, 0.0 for 2D flat
            targetZFlatten: 1.0,
            isDragging: false,
            lastMouseX: 0,
            lastMouseY: 0,
            hasDragged: false
        },

        // Data & Filtering
        points: [],
        strataFilter: 'all',      // 'all', '2', '3', '4', '5', '6', '7'
        hoveredPoint: null,
        selectedPoint: null,
        showLabels: true,

        // Active Inference Cycle state
        inference: {
            active: true,
            phase: 0,             // 0: Veille, 1: Surprise, 2: Anticipation, 3: Resolution, 4: Integration
            timer: 0,
            cycleDuration: 6.5,   // Seconds per full active inference loop
            particlePos: { x: 0, y: 0, z: 0 },
            trail: [],
            targetAffect: null,
            shockwaveRadius: 0,
            shockwaveAlpha: 0
        },

        // DOM Elements cache
        dom: {
            btn3D: null,
            btn2D: null,
            btnRotate: null,
            btnPulse: null,
            rotateIcon: null,
            hud: null,
            hudDot: null,
            hudName: null,
            hudCode: null,
            hudType: null,
            hudDesc: null,
            hudFormula: null,
            hudSym: null,
            statusText: null,
            stepVeille: null,
            stepSurprise: null,
            stepAnticipation: null,
            stepResolution: null,
            stepTargetLabel: null,
            dragHint: null,
            strataButtons: []
        }
    };

    // Color definitions
    const GROUP_COLORS = {
        "Joie": "#facc15",
        "Tristesse": "#38bdf8",
        "Peur": "#c084fc",
        "Courage": "#4ade80",
        "Colère": "#f87171",
        "Calme": "#22d3ee",
        "Désir": "#f472b6",
        "Dégoût": "#94a3b8",
        "Veille": "#38bdf8",
        "Surprise": "#fbbf24",
        "Anticipation": "#a855f7",
        "Émoi": "#ec4899",
        "Réserve": "#818cf8",
        "Recul": "#06b6d4",
        "Saisie": "#10b981",
        "Suspension": "#f43f5e"
    };

    // Candidate target affects for active inference cycling
    const DEMO_TARGET_NAMES = [
        "Désir", "Colère", "Joie", "Peur", "Courage", "Calme",
        "Euphorie", "Consternation", "Sérénité", "Amour", "Fierté",
        "Patience", "Espoir", "Émerveillement", "Transcendance"
    ];

    Visualizer.init = function() {
        this.canvas = document.getElementById('heroCartograffectCanvas');
        this.container = document.getElementById('heroVisualizerContainer');
        if (!this.canvas || !this.container) return;

        this.ctx = this.canvas.getContext('2d');
        this.cacheDOMElements();
        this.loadModelData();
        this.setupEventListeners();
        this.resize();

        // Default selected affect = Désir (1,1,2)
        const defaultAffect = this.points.find(p => p.name === "Désir") || this.points[8] || this.points[0];
        this.selectPoint(defaultAffect, false);

        if (!this.isInitialized) {
            this.isInitialized = true;
            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);
        }
    };

    Visualizer.cacheDOMElements = function() {
        const d = this.dom;
        d.btn3D = document.getElementById('btnView3D');
        d.btn2D = document.getElementById('btnView2D');
        d.btnRotate = document.getElementById('btnAutoRotate');
        d.btnPulse = document.getElementById('btnPulseWave');
        d.rotateIcon = document.getElementById('rotateIcon');
        d.hud = document.getElementById('heroAffectHud');
        d.hudDot = document.getElementById('hudAffectDot');
        d.hudName = document.getElementById('hudAffectName');
        d.hudCode = document.getElementById('hudAffectCode');
        d.hudType = document.getElementById('hudAffectType');
        d.hudDesc = document.getElementById('hudAffectDesc');
        d.hudFormula = document.getElementById('hudAffectFormula');
        d.hudSym = document.getElementById('hudAffectSym');
        d.statusText = document.getElementById('activeInferenceStatus');
        d.stepVeille = document.getElementById('stepVeille');
        d.stepSurprise = document.getElementById('stepSurprise');
        d.stepAnticipation = document.getElementById('stepAnticipation');
        d.stepResolution = document.getElementById('stepResolution');
        d.stepTargetLabel = document.getElementById('stepTargetLabel');
        d.dragHint = document.getElementById('dragHint');
        d.strataButtons = document.querySelectorAll('.hero-strata-btn');
    };

    Visualizer.loadModelData = function() {
        if (!window.CartograffectModel || !window.CartograffectModel.emotions) {
            // Fallback points if model file not yet loaded
            this.points = [
                { id: 0, name: "Point de Veille", x: 0, y: 0, z: 0, group: "Veille", type: "operator", code: "X0/Y0/Z0", desc: "Origine structurale (0,0,0) - Bassin attracteur homéostatique de fond." },
                { id: 1, name: "Surprise", x: 0, y: 0, z: 1, group: "Surprise", type: "operator", code: "X0/Y0/Z1", desc: "Opérateur ascendant de saillance et de rupture d'attente." },
                { id: 2, name: "Anticipation", x: 0, y: 0, z: 2, group: "Anticipation", type: "operator", code: "X0/Y0/Z2", desc: "Opérateur descendant d'orientation épistémique vers l'action." },
                { id: 8, name: "Joie", x: 0, y: 2, z: 2, group: "Joie", type: "axial", code: "X0/Y+2/Z2", desc: "Orientation axiale Y+2 (contrôlabilité maximale)." },
                { id: 9, name: "Tristesse", x: 0, y: -2, z: 2, group: "Tristesse", type: "axial", code: "X0/Y-2/Z2", desc: "Orientation axiale Y-2 (incontrôlabilité constatée)." },
                { id: 10, name: "Peur", x: -2, y: 0, z: 2, group: "Peur", type: "axial", code: "X-2/Y0/Z2", desc: "Orientation axiale X-2 (modèle interne rigide face à la menace)." },
                { id: 11, name: "Courage", x: 2, y: 0, z: 2, group: "Courage", type: "axial", code: "X+2/Y0/Z2", desc: "Orientation axiale X+2 (modèle révisable, engagement de mise à jour)." },
                { id: 12, name: "Colère", x: -1, y: 1, z: 2, group: "Colère", type: "diagonal", code: "X-1/Y+1/Z2", desc: "Modèle non révisable (X-1) et tentative de contrôle sur le monde (Y+1)." },
                { id: 13, name: "Calme", x: 1, y: -1, z: 2, group: "Calme", type: "diagonal", code: "X+1/Y-1/Z2", desc: "Modèle révisable (X+1) et acceptation du non-contrôle (Y-1)." },
                { id: 14, name: "Désir", x: 1, y: 1, z: 2, group: "Désir", type: "diagonal", code: "X+1/Y+1/Z2", desc: "Modèle révisable (X+1) et monde contrôlable (Y+1) : congruence." },
                { id: 15, name: "Dégoût", x: -1, y: -1, z: 2, group: "Dégoût", type: "diagonal", code: "X-1/Y-1/Z2", desc: "Modèle non révisable (X-1) et rejet d'un monde non contrôlable (Y-1)." }
            ];
            return;
        }

        this.points = window.CartograffectModel.emotions.map(e => ({
            id: e.id,
            name: e.name,
            x: e.x,
            y: e.y,
            z: e.z,
            group: e.group,
            type: e.type,
            code: e.code,
            desc: e.desc || ""
        }));
    };

    Visualizer.resize = function() {
        if (!this.canvas || !this.container) return;
        const rect = this.container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const w = rect.width;
        const h = rect.height;

        if (w <= 0 || h <= 0) return;

        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
        this.width = w;
        this.height = h;
        this.dpr = dpr;
    };

    Visualizer.setupEventListeners = function() {
        window.addEventListener('resize', () => this.resize());
        if (window.ResizeObserver && this.container) {
            try {
                new ResizeObserver(() => this.resize()).observe(this.container);
            } catch(e) {}
        }

        const c = this.container;

        // Pointer drag rotation
        const onPointerDown = (e) => {
            this.camera.isDragging = true;
            this.camera.lastMouseX = e.clientX || (e.touches && e.touches[0].clientX);
            this.camera.lastMouseY = e.clientY || (e.touches && e.touches[0].clientY);
            this.camera.autoRotate = false;
            this.updateRotateBtnState();
            if (this.dom.dragHint) {
                this.dom.dragHint.style.opacity = '0';
                setTimeout(() => this.dom.dragHint && this.dom.dragHint.remove(), 400);
            }
        };

        const onPointerMove = (e) => {
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            if (this.camera.isDragging) {
                const dx = clientX - this.camera.lastMouseX;
                const dy = clientY - this.camera.lastMouseY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                    this.camera.hasDragged = true;
                }

                // If in 3D mode, rotate camera
                if (this.camera.mode === '3D') {
                    this.camera.targetAzimuth -= dx * 0.008;
                    this.camera.targetElevation = Math.max(0.15, Math.min(1.52, this.camera.targetElevation + dy * 0.008));
                } else {
                    // In 2D mode, slightly tilt or pan
                    this.camera.targetAzimuth -= dx * 0.004;
                }

                this.camera.lastMouseX = clientX;
                this.camera.lastMouseY = clientY;
            } else if (e.clientX && e.clientY) {
                // Hover check
                this.handleHover(e.clientX, e.clientY);
            }
        };

        const onPointerUp = (e) => {
            if (!this.camera.hasDragged && e) {
                // Direct click without dragging
                const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
                const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
                if (clientX && clientY) {
                    this.handleClick(clientX, clientY);
                }
            }
            this.camera.isDragging = false;
            this.camera.hasDragged = false;
        };

        c.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);

        c.addEventListener('touchstart', onPointerDown, { passive: true });
        window.addEventListener('touchmove', onPointerMove, { passive: true });
        window.addEventListener('touchend', onPointerUp, { passive: true });

        // Wheel zoom (Desktop)
        c.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = Math.sign(e.deltaY) * 2.5;
            this.camera.targetDistance = Math.max(22, Math.min(60, this.camera.targetDistance + delta));
        }, { passive: false });

        // Pinch-to-zoom (Mobile / Tablet)
        let initialPinchDist = null;
        c.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                initialPinchDist = Math.sqrt(dx * dx + dy * dy);
            }
        }, { passive: true });

        c.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length === 2 && initialPinchDist) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const diff = initialPinchDist - dist;
                if (Math.abs(diff) > 2) {
                    this.camera.targetDistance = Math.max(22, Math.min(60, this.camera.targetDistance + diff * 0.05));
                    initialPinchDist = dist;
                }
            }
        }, { passive: true });

        c.addEventListener('touchend', (e) => {
            if (!e.touches || e.touches.length < 2) {
                initialPinchDist = null;
            }
        }, { passive: true });

        // Toolbar Button handlers
        if (this.dom.btn3D) {
            this.dom.btn3D.addEventListener('click', () => this.setMode('3D'));
        }
        if (this.dom.btn2D) {
            this.dom.btn2D.addEventListener('click', () => this.setMode('2D'));
        }
        if (this.dom.btnRotate) {
            this.dom.btnRotate.addEventListener('click', () => {
                this.camera.autoRotate = !this.camera.autoRotate;
                this.updateRotateBtnState();
            });
        }
        if (this.dom.btnPulse) {
            this.dom.btnPulse.addEventListener('click', () => {
                this.triggerActiveInferenceCycle();
            });
        }

        // Strata filters
        if (this.dom.strataButtons) {
            this.dom.strataButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const z = btn.getAttribute('data-z');
                    this.setStrataFilter(z);
                });
            });
        }
    };

    Visualizer.setMode = function(mode) {
        this.camera.mode = mode;
        if (mode === '3D') {
            this.camera.targetElevation = 1.05;
            this.camera.targetZFlatten = 1.0;
            this.camera.autoRotate = true;
            if (this.dom.btn3D) {
                this.dom.btn3D.className = "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all bg-purple-600 text-white shadow-sm flex items-center gap-1";
            }
            if (this.dom.btn2D) {
                this.dom.btn2D.className = "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all text-slate-300 hover:text-white hover:bg-slate-700/60 flex items-center gap-1";
            }
        } else {
            // 2D Top-Down View
            this.camera.targetElevation = 1.5707; // 90 degrees top down
            this.camera.targetAzimuth = 0.0;     // Diamond orientation
            this.camera.targetZFlatten = 0.0;     // Flatten strata heights
            this.camera.autoRotate = false;
            if (this.dom.btn2D) {
                this.dom.btn2D.className = "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all bg-purple-600 text-white shadow-sm flex items-center gap-1";
            }
            if (this.dom.btn3D) {
                this.dom.btn3D.className = "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all text-slate-300 hover:text-white hover:bg-slate-700/60 flex items-center gap-1";
            }
        }
        this.updateRotateBtnState();
    };

    Visualizer.setStrataFilter = function(z) {
        this.strataFilter = z;
        if (this.dom.strataButtons) {
            this.dom.strataButtons.forEach(b => {
                if (b.getAttribute('data-z') === String(z)) {
                    b.className = "hero-strata-btn active px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white transition-all";
                } else {
                    b.className = "hero-strata-btn px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all";
                }
            });
        }
    };

    Visualizer.updateRotateBtnState = function() {
        if (!this.dom.btnRotate) return;
        if (this.camera.autoRotate) {
            this.dom.btnRotate.className = "p-1.5 px-2 text-[11px] font-semibold text-purple-300 bg-purple-900/50 border border-purple-500/40 rounded-lg transition-all flex items-center gap-1 shadow-sm";
            if (this.dom.rotateIcon) this.dom.rotateIcon.className = "inline-block animate-spin";
        } else {
            this.dom.btnRotate.className = "p-1.5 px-2 text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/70 rounded-lg transition-all flex items-center gap-1";
            if (this.dom.rotateIcon) this.dom.rotateIcon.className = "inline-block";
        }
    };

    Visualizer.handleHover = function(clientX, clientY) {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        let closest = null;
        let minDist = 18; // 18px radius

        for (const p of this.points) {
            if (!this.isPointVisible(p)) continue;
            if (p.screenX === undefined || p.screenY === undefined) continue;

            const dx = p.screenX - mouseX;
            const dy = p.screenY - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                closest = p;
            }
        }

        if (closest !== this.hoveredPoint) {
            this.hoveredPoint = closest;
            this.canvas.style.cursor = closest ? 'pointer' : (this.camera.isDragging ? 'grabbing' : 'grab');
            if (closest) {
                this.updateHud(closest);
            } else if (this.selectedPoint) {
                this.updateHud(this.selectedPoint);
            }
        }
    };

    Visualizer.handleClick = function(clientX, clientY) {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        let closest = null;
        let minDist = 22;

        for (const p of this.points) {
            if (!this.isPointVisible(p)) continue;
            if (p.screenX === undefined || p.screenY === undefined) continue;

            const dx = p.screenX - mouseX;
            const dy = p.screenY - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                closest = p;
            }
        }

        if (closest) {
            this.selectPoint(closest, true);
        }
    };

    Visualizer.selectPoint = function(point, triggerPulse = true) {
        this.selectedPoint = point;
        this.updateHud(point);
        if (triggerPulse) {
            this.triggerActiveInferenceCycle(point);
        }
    };

    Visualizer.updateHud = function(point) {
        const d = this.dom;
        if (!point || !d.hud) return;

        const color = GROUP_COLORS[point.group] || "#8b5cf6";
        if (d.hudDot) {
            d.hudDot.style.backgroundColor = color;
            d.hudDot.style.boxShadow = `0 0 10px ${color}`;
        }
        if (d.hudName) d.hudName.textContent = point.name;
        if (d.hudCode) d.hudCode.textContent = point.code || `X${point.x}/Y${point.y}/Z${point.z}`;

        if (d.hudType) {
            let typeLabel = "Affect";
            if (point.type === "operator") typeLabel = "Opérateur Central";
            else if (point.type === "axial") typeLabel = "Axiale (Gradient pur)";
            else if (point.type === "diagonal") typeLabel = "Diagonale (Congruence)";
            else if (point.type === "lateral") typeLabel = "Latérale";
            d.hudType.textContent = typeLabel;
        }

        if (d.hudDesc) {
            d.hudDesc.textContent = point.desc || `Position affective à (X=${point.x}, Y=${point.y}, Z=${point.z}).`;
        }

        if (d.hudFormula) {
            if (point.z === 0) d.hudFormula.textContent = "Origine (0,0,0)";
            else if (point.z === 1) d.hudFormula.textContent = "Saillance (0,0,1)";
            else {
                const r = 2 * point.z - 2;
                d.hudFormula.textContent = `|X|+|Y| = ${r} (Z=${point.z})`;
            }
        }

        if (d.hudSym) {
            let sym = null;
            if (window.CartograffectModel && window.CartograffectModel.getSymmetryPair) {
                sym = window.CartograffectModel.getSymmetryPair(point.name);
            }
            d.hudSym.textContent = sym ? `Opposé : ${sym}` : `Groupe ${point.group}`;
        }
    };

    Visualizer.isPointVisible = function(p) {
        if (this.strataFilter === 'all') return true;
        if (this.strataFilter === '2') {
            return p.z <= 2;
        }
        return p.z === Number(this.strataFilter);
    };

    Visualizer.triggerActiveInferenceCycle = function(targetAffect = null) {
        if (!targetAffect) {
            // Pick a random prominent target affect
            const candidates = this.points.filter(p => p.z >= 2 && DEMO_TARGET_NAMES.includes(p.name));
            targetAffect = candidates[Math.floor(Math.random() * candidates.length)] || this.points[8];
        }

        this.inference.targetAffect = targetAffect;
        this.inference.timer = 0;
        this.inference.trail = [];
        this.inference.shockwaveRadius = 0;
        this.inference.shockwaveAlpha = 0;

        if (this.dom.stepTargetLabel) {
            this.dom.stepTargetLabel.textContent = `${targetAffect.name} (${targetAffect.x},${targetAffect.y},${targetAffect.z})`;
        }
    };

    // 3D Projection Math
    Visualizer.project3D = function(x, y, z, cx, cy, scale) {
        const cam = this.camera;
        // Azimuth (yaw)
        const cosA = Math.cos(cam.azimuth);
        const sinA = Math.sin(cam.azimuth);
        const x1 = x * cosA - y * sinA;
        const y1 = x * sinA + y * cosA;

        // Elevation (pitch) & vertical Z scale
        const effectiveZ = z * cam.zFlatten;
        const cosE = Math.cos(cam.elevation);
        const sinE = Math.sin(cam.elevation);

        const y2 = y1 * cosE - effectiveZ * sinE;
        const z2 = y1 * sinE + effectiveZ * cosE;

        // Perspective division
        const dist = cam.distance;
        const perspective = dist / (dist + y2 * 0.45);

        return {
            x: cx + x1 * scale * perspective,
            y: cy - z2 * scale * perspective,
            depth: y2,
            scale: perspective
        };
    };

    Visualizer.animate = function(timestamp) {
        requestAnimationFrame(this.animate);
        if (!this.canvas || !this.ctx) return;

        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        const dpr = this.dpr || 1;

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        // Smooth camera dampening
        const cam = this.camera;
        if (cam.autoRotate && !cam.isDragging) {
            cam.targetAzimuth += cam.rotateSpeed;
        }

        cam.azimuth += (cam.targetAzimuth - cam.azimuth) * 0.08;
        cam.elevation += (cam.targetElevation - cam.elevation) * 0.08;
        cam.distance += (cam.targetDistance - cam.distance) * 0.08;
        cam.zFlatten += (cam.targetZFlatten - cam.zFlatten) * 0.08;

        const cx = w / 2;
        const cy = h / 2 + (cam.mode === '3D' ? 15 : 0);
        // Base scale: span 26 units (-13 to +13)
        const baseScale = Math.min(w, h) / 32 * (38 / cam.distance);

        // Advance Active Inference timer
        this.updateActiveInference(0.016);

        // 1. Draw Subtle Nebula Gradients for 4 Quadrants
        this.drawQuadrantAmbience(ctx, cx, cy, baseScale);

        // 2. Draw Central Vertical Z Axis
        this.drawVerticalZAxis(ctx, cx, cy, baseScale);

        // 3. Draw Concentric Manhattan Diamond Rings (|X|+|Y| = 2Z - 2)
        this.drawManhattanRings(ctx, cx, cy, baseScale);

        // 4. Draw Orthogonal Axes (Gradient Contrôle Y & Attente X)
        this.drawOrthogonalAxes(ctx, cx, cy, baseScale);

        // 5. Draw Active Inference Particle & Energy Wave
        this.drawActiveInferenceWave(ctx, cx, cy, baseScale);

        // 6. Project & Depth-Sort Points
        const renderList = [];
        for (const p of this.points) {
            if (!this.isPointVisible(p)) continue;

            // Height mapping: Z=0..5 -> zUnits = (Z - 2) * 1.5
            const zUnits = (p.z - 2) * 1.5;
            const proj = this.project3D(p.x, p.y, zUnits, cx, cy, baseScale);

            p.screenX = proj.x;
            p.screenY = proj.y;
            p.depth = proj.depth;
            p.projScale = proj.scale;

            renderList.push(p);
        }

        // Depth sort from farthest (deepest in screen) to closest
        renderList.sort((a, b) => b.depth - a.depth);

        // 7. Render Affect Nodes
        for (const p of renderList) {
            this.drawAffectNode(ctx, p);
        }

        // 8. Render Labels for Prototypes & Operators
        if (this.showLabels) {
            for (const p of renderList) {
                if (p.z <= 2 || p.type === 'operator' || p === this.selectedPoint || p === this.hoveredPoint) {
                    this.drawNodeLabel(ctx, p);
                }
            }
        }

        ctx.restore();
    };

    Visualizer.drawQuadrantAmbience = function(ctx, cx, cy, scale) {
        if (this.camera.mode !== '3D' && this.camera.elevation > 1.5) {
            // In 2D Top-Down, draw 4 quadrants subtle tint
            const r = 12 * scale;
            ctx.save();
            ctx.globalAlpha = 0.05;

            // Q1: +X, +Y (Désir / Rose)
            ctx.fillStyle = "#ec4899";
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + r, cy);
            ctx.lineTo(cx, cy - r);
            ctx.closePath();
            ctx.fill();

            // Q2: -X, +Y (Colère / Rouge)
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx - r, cy);
            ctx.lineTo(cx, cy - r);
            ctx.closePath();
            ctx.fill();

            // Q3: -X, -Y (Dégoût / Nacre)
            ctx.fillStyle = "#94a3b8";
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx - r, cy);
            ctx.lineTo(cx, cy + r);
            ctx.closePath();
            ctx.fill();

            // Q4: +X, -Y (Calme / Cyan)
            ctx.fillStyle = "#06b6d4";
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + r, cy);
            ctx.lineTo(cx, cy + r);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    };

    Visualizer.drawVerticalZAxis = function(ctx, cx, cy, scale) {
        const p0 = this.project3D(0, 0, (0 - 2) * 1.5, cx, cy, scale);
        const p7 = this.project3D(0, 0, (7 - 2) * 1.5, cx, cy, scale);

        ctx.save();
        // Glowing vertical beam
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();

        // Subtle outer glow
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.strokeStyle = "rgba(168, 85, 247, 0.15)";
        ctx.lineWidth = 6;
        ctx.setLineDash([]);
        ctx.stroke();

        ctx.restore();
    };

    Visualizer.drawManhattanRings = function(ctx, cx, cy, scale) {
        ctx.save();
        const strataR = [
            { z: 2, r: 2, color: "rgba(167, 139, 250, 0.55)", width: 1.5, dash: [] },
            { z: 3, r: 4, color: "rgba(96, 165, 250, 0.35)", width: 1.0, dash: [4, 4] },
            { z: 4, r: 6, color: "rgba(129, 140, 248, 0.30)", width: 1.0, dash: [4, 4] },
            { z: 5, r: 8, color: "rgba(6, 182, 212, 0.25)", width: 0.9, dash: [3, 4] },
            { z: 6, r: 10, color: "rgba(232, 121, 249, 0.22)", width: 0.9, dash: [3, 5] },
            { z: 7, r: 12, color: "rgba(244, 63, 94, 0.20)", width: 0.8, dash: [2, 6] }
        ];

        for (const ring of strataR) {
            if (this.strataFilter !== 'all' && this.strataFilter !== String(ring.z)) {
                if (!(this.strataFilter === '2' && ring.z === 2)) {
                    continue;
                }
            }

            const zUnits = (ring.z - 2) * 1.5;
            const r = ring.r;

            // 4 vertices of the Manhattan diamond: (0, r), (r, 0), (0, -r), (-r, 0)
            const ptN = this.project3D(0, r, zUnits, cx, cy, scale);
            const ptE = this.project3D(r, 0, zUnits, cx, cy, scale);
            const ptS = this.project3D(0, -r, zUnits, cx, cy, scale);
            const ptW = this.project3D(-r, 0, zUnits, cx, cy, scale);

            ctx.beginPath();
            ctx.moveTo(ptN.x, ptN.y);
            ctx.lineTo(ptE.x, ptE.y);
            ctx.lineTo(ptS.x, ptS.y);
            ctx.lineTo(ptW.x, ptW.y);
            ctx.closePath();

            ctx.strokeStyle = ring.color;
            ctx.lineWidth = ring.width;
            ctx.setLineDash(ring.dash);
            ctx.stroke();

            // Diamond corner cross links for Z=2 (Prototypes)
            if (ring.z === 2) {
                // Diagonals
                const ptNE = this.project3D(1, 1, zUnits, cx, cy, scale);
                const ptNW = this.project3D(-1, 1, zUnits, cx, cy, scale);
                const ptSW = this.project3D(-1, -1, zUnits, cx, cy, scale);
                const ptSE = this.project3D(1, -1, zUnits, cx, cy, scale);

                ctx.beginPath();
                ctx.moveTo(ptNW.x, ptNW.y);
                ctx.lineTo(ptSE.x, ptSE.y);
                ctx.moveTo(ptNE.x, ptNE.y);
                ctx.lineTo(ptSW.x, ptSW.y);
                ctx.strokeStyle = "rgba(167, 139, 250, 0.25)";
                ctx.lineWidth = 0.8;
                ctx.setLineDash([2, 4]);
                ctx.stroke();
            }
        }
        ctx.restore();
    };

    Visualizer.drawOrthogonalAxes = function(ctx, cx, cy, scale) {
        ctx.save();
        const maxR = 12.5;
        const z0 = 0; // Baseline Z=2 level

        // Axe Y: Gradient de Contrôle (-12.5 to +12.5)
        const pY_pos = this.project3D(0, maxR, z0, cx, cy, scale);
        const pY_neg = this.project3D(0, -maxR, z0, cx, cy, scale);

        // Axe X: Gradient d'Attente (-12.5 to +12.5)
        const pX_pos = this.project3D(maxR, 0, z0, cx, cy, scale);
        const pX_neg = this.project3D(-maxR, 0, z0, cx, cy, scale);

        ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);

        // Draw Y Axis
        ctx.beginPath();
        ctx.moveTo(pY_neg.x, pY_neg.y);
        ctx.lineTo(pY_pos.x, pY_pos.y);
        ctx.stroke();

        // Draw X Axis
        ctx.beginPath();
        ctx.moveTo(pX_neg.x, pX_neg.y);
        ctx.lineTo(pX_pos.x, pX_pos.y);
        ctx.stroke();

        ctx.restore();
    };

    Visualizer.updateActiveInference = function(dt) {
        const inf = this.inference;
        if (!inf.active) return;

        inf.timer += dt;
        if (inf.timer > inf.cycleDuration) {
            inf.timer = 0;
            // Switch target on each cycle to illustrate diverse trajectories
            if (!this.selectedPoint || Math.random() > 0.4) {
                const candidates = this.points.filter(p => p.z >= 2 && DEMO_TARGET_NAMES.includes(p.name));
                inf.targetAffect = candidates[Math.floor(Math.random() * candidates.length)] || this.points[8];
                if (this.dom.stepTargetLabel && inf.targetAffect) {
                    this.dom.stepTargetLabel.textContent = `${inf.targetAffect.name} (${inf.targetAffect.x},${inf.targetAffect.y},${inf.targetAffect.z})`;
                }
            }
        }

        const t = inf.timer;
        const target = inf.targetAffect || this.points.find(p => p.name === "Désir") || this.points[8];

        // 5-Phase Schedule:
        // 0.0 - 1.2s: Veille (0,0,0) - Homeostatic pulse
        // 1.2 - 2.2s: Surprise (0,0,0) -> (0,0,1) - Prediction error saillance surge
        // 2.2 - 3.2s: Anticipation (0,0,1) -> (0,0,2) - Epistemic orientation
        // 3.2 - 5.2s: Resolution (0,0,2) -> (target.x, target.y, target.z)
        // 5.2 - 6.5s: Integration / Sentiment (shockwave + fading back)

        let currentPhase = 0;
        let pos = { x: 0, y: 0, z: 0 };

        if (t < 1.2) {
            currentPhase = 1; // Veille
            pos = { x: 0, y: 0, z: 0 };
        } else if (t < 2.2) {
            currentPhase = 2; // Surprise
            const progress = (t - 1.2) / 1.0;
            const ease = progress * progress; // Acceleration upward
            pos = { x: 0, y: 0, z: ease * 1.0 };
        } else if (t < 3.2) {
            currentPhase = 3; // Anticipation
            const progress = (t - 2.2) / 1.0;
            pos = { x: 0, y: 0, z: 1.0 + progress * 1.0 };
        } else if (t < 5.2) {
            currentPhase = 4; // Resolution
            const progress = (t - 3.2) / 2.0;
            const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
            pos = {
                x: ease * target.x,
                y: ease * target.y,
                z: 2.0 + ease * (target.z - 2.0)
            };

            // Trigger shockwave at impact
            if (progress > 0.85 && inf.shockwaveAlpha === 0) {
                inf.shockwaveRadius = 4;
                inf.shockwaveAlpha = 1.0;
            }
        } else {
            currentPhase = 5; // Integration
            pos = { x: target.x, y: target.y, z: target.z };
        }

        inf.phase = currentPhase;
        inf.particlePos = pos;

        // Trail handling
        inf.trail.push({ ...pos, alpha: 1.0 });
        if (inf.trail.length > 24) inf.trail.shift();
        for (const pt of inf.trail) {
            pt.alpha *= 0.92;
        }

        // Expand shockwave
        if (inf.shockwaveAlpha > 0.01) {
            inf.shockwaveRadius += 0.8;
            inf.shockwaveAlpha *= 0.92;
        }

        // Update UI Telemetry DOM Elements
        this.updateTelemetryDOM(currentPhase, target);
    };

    Visualizer.updateTelemetryDOM = function(phase, target) {
        const d = this.dom;
        if (!d.statusText) return;

        const resetSteps = () => {
            const defaultClass = "p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 transition-all";
            if (d.stepVeille) d.stepVeille.className = defaultClass;
            if (d.stepSurprise) d.stepSurprise.className = defaultClass;
            if (d.stepAnticipation) d.stepAnticipation.className = defaultClass;
            if (d.stepResolution) d.stepResolution.className = defaultClass;
        };

        resetSteps();

        const activeClass = (bg, border, text) =>
            `p-1.5 rounded-lg ${bg} ${border} ${text} font-bold shadow-md transition-all scale-[1.02]`;

        if (phase === 1) {
            d.statusText.textContent = "1. Éveil Homéostatique de Fond (0,0,0)";
            d.statusText.className = "text-sky-300 font-bold animate-pulse";
            if (d.stepVeille) d.stepVeille.className = activeClass("bg-sky-950/80", "border-sky-500", "text-sky-200");
        } else if (phase === 2) {
            d.statusText.textContent = "2. Écart de Prédiction / Rupture de Saillance (0,0,1)";
            d.statusText.className = "text-amber-300 font-bold animate-pulse";
            if (d.stepSurprise) d.stepSurprise.className = activeClass("bg-amber-950/80", "border-amber-500", "text-amber-200");
        } else if (phase === 3) {
            d.statusText.textContent = "3. Orientation Épistémique / Anticipation (0,0,2)";
            d.statusText.className = "text-purple-300 font-bold animate-pulse";
            if (d.stepAnticipation) d.stepAnticipation.className = activeClass("bg-purple-950/80", "border-purple-500", "text-purple-200");
        } else if (phase >= 4) {
            const targetName = target ? target.name : "Affect";
            d.statusText.textContent = `4. Résolution d'Inférence : ${targetName} (${target.x}, ${target.y}, ${target.z})`;
            d.statusText.className = "text-emerald-300 font-bold";
            if (d.stepResolution) d.stepResolution.className = activeClass("bg-emerald-950/80", "border-emerald-500", "text-emerald-200");
        }
    };

    Visualizer.drawActiveInferenceWave = function(ctx, cx, cy, scale) {
        const inf = this.inference;
        if (!inf.active) return;

        ctx.save();

        // 1. Draw glowing particle trail
        if (inf.trail.length > 1) {
            ctx.beginPath();
            for (let i = 0; i < inf.trail.length; i++) {
                const pt = inf.trail[i];
                const zUnits = (pt.z - 2) * 1.5;
                const proj = this.project3D(pt.x, pt.y, zUnits, cx, cy, scale);
                if (i === 0) ctx.moveTo(proj.x, proj.y);
                else ctx.lineTo(proj.x, proj.y);
            }
            ctx.strokeStyle = "rgba(244, 114, 182, 0.65)";
            ctx.lineWidth = 2.5;
            ctx.setLineDash([]);
            ctx.stroke();

            // Broad outer neon glow
            ctx.strokeStyle = "rgba(244, 114, 182, 0.2)";
            ctx.lineWidth = 7;
            ctx.stroke();
        }

        // 2. Draw head particle (Photon)
        const pz = (inf.particlePos.z - 2) * 1.5;
        const headProj = this.project3D(inf.particlePos.x, inf.particlePos.y, pz, cx, cy, scale);

        // Radial glow
        const glowGrad = ctx.createRadialGradient(headProj.x, headProj.y, 0, headProj.x, headProj.y, 14);
        glowGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
        glowGrad.addColorStop(0.3, "rgba(244, 114, 182, 0.9)");
        glowGrad.addColorStop(0.7, "rgba(168, 85, 247, 0.4)");
        glowGrad.addColorStop(1, "rgba(168, 85, 247, 0)");

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(headProj.x, headProj.y, 14, 0, Math.PI * 2);
        ctx.fill();

        // Core white bead
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(headProj.x, headProj.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // 3. Shockwave at target impact
        if (inf.shockwaveAlpha > 0.01 && inf.targetAffect) {
            const tz = (inf.targetAffect.z - 2) * 1.5;
            const tProj = this.project3D(inf.targetAffect.x, inf.targetAffect.y, tz, cx, cy, scale);

            ctx.beginPath();
            ctx.arc(tProj.x, tProj.y, inf.shockwaveRadius * headProj.scale, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(244, 114, 182, ${inf.shockwaveAlpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.restore();
    };

    Visualizer.drawAffectNode = function(ctx, p) {
        const x = p.screenX;
        const y = p.screenY;
        const projScale = p.projScale || 1.0;

        const isHovered = (p === this.hoveredPoint);
        const isSelected = (p === this.selectedPoint);
        const isOperator = (p.type === 'operator');
        const isPrototype = (p.z === 2);

        // Base Radius
        let r = 3.2 * projScale;
        if (isOperator) r = 4.8 * projScale;
        else if (isPrototype) r = 4.2 * projScale;

        if (isHovered) r += 3.5;
        if (isSelected) r += 2.5;

        const baseColor = GROUP_COLORS[p.group] || "#818cf8";

        ctx.save();

        // 1. Outer Glow on Hover / Selection / Prototypes
        if (isHovered || isSelected || isOperator || isPrototype) {
            const glowR = r * (isHovered ? 3.0 : 2.2);
            const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, glowR);
            grad.addColorStop(0, baseColor);
            grad.addColorStop(0.5, baseColor.replace(')', ', 0.35)').replace('rgb', 'rgba'));
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, glowR, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. Node Body
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        if (isOperator) {
            // Diamond / Octahedral beacon for central operators
            ctx.moveTo(x, y - r * 1.3);
            ctx.lineTo(x + r * 1.3, y);
            ctx.lineTo(x, y + r * 1.3);
            ctx.lineTo(x - r * 1.3, y);
            ctx.closePath();
        } else {
            ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fill();

        // 3. Highlight Core / Ring
        if (isHovered || isSelected) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Targeting Reticle
            if (isHovered) {
                ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(x, y, r + 5, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else {
            // Subtle dark border for crisp definition
            ctx.strokeStyle = "rgba(7, 11, 20, 0.85)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.restore();
    };

    Visualizer.drawNodeLabel = function(ctx, p) {
        const isHovered = (p === this.hoveredPoint);
        const isSelected = (p === this.selectedPoint);
        const isOperator = (p.type === 'operator');
        const isTarget = (this.inference.targetAffect === p);

        // In 3D mode, only show operators Z=0,1,2,7 unless hovered/selected, to keep view pristine
        if (this.camera.mode === '3D' && !isHovered && !isSelected && !isTarget) {
            if (isOperator && p.z > 2 && p.z < 7) return;
        }

        const color = GROUP_COLORS[p.group] || "#e2e8f0";
        const fontSize = isHovered ? 12 : (isSelected ? 11 : 9);

        ctx.save();
        ctx.font = `${isHovered || isSelected ? 'bold' : '600'} ${fontSize}px "DM Sans", system-ui, sans-serif`;

        let text = p.name;
        if (isOperator && (p.z <= 2 || p.z === 7)) {
            text = `${p.name} (Z${p.z})`;
        }

        const metrics = ctx.measureText(text);
        const padX = 5;
        const padY = 2.5;
        const bgW = metrics.width + padX * 2;
        const bgH = fontSize + padY * 2;

        let lx = p.screenX;
        let ly = p.screenY;

        if (isOperator) {
            // Place operator label cleanly to the right of the vertical Z axis
            lx = p.screenX + 10 + bgW / 2;
            ly = p.screenY;
        } else if (p.z === 2) {
            // Smart radial offsets for the 8 prototypes
            if (p.x === 0 && p.y > 0) { ly -= 14; } // Joie (Top)
            else if (p.x === 0 && p.y < 0) { ly += 14; } // Tristesse (Bottom)
            else if (p.x > 0 && p.y === 0) { lx += 10 + bgW / 2; } // Courage (Right)
            else if (p.x < 0 && p.y === 0) { lx -= (10 + bgW / 2); } // Peur (Left)
            else if (p.x > 0 && p.y > 0) { lx += 8; ly -= 12; } // Désir (Top-Right)
            else if (p.x < 0 && p.y > 0) { lx -= 8; ly -= 12; } // Colère (Top-Left)
            else if (p.x > 0 && p.y < 0) { lx += 8; ly += 12; } // Calme (Bottom-Right)
            else if (p.x < 0 && p.y < 0) { lx -= 8; ly += 12; } // Dégoût (Bottom-Left)
        } else {
            ly += (p.y >= 0 ? -12 : 12);
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const rx = lx - bgW / 2;
        const ry = ly - bgH / 2;

        ctx.fillStyle = isHovered ? "rgba(15, 23, 42, 0.95)" : "rgba(7, 11, 20, 0.88)";
        ctx.strokeStyle = isHovered ? color : (isSelected ? "#ffffff" : "rgba(148, 163, 184, 0.3)");
        ctx.lineWidth = isHovered || isSelected ? 1.2 : 0.75;

        ctx.beginPath();
        ctx.roundRect(rx, ry, bgW, bgH, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isHovered ? "#ffffff" : (isSelected ? "#ffffff" : color);
        ctx.fillText(text, lx, ly);

        ctx.restore();
    };

    // Public export
    root.CartograffectVisualizer = Visualizer;

    if (typeof document !== 'undefined') {
        const autoInit = () => {
            if (document.getElementById('heroCartograffectCanvas') && !Visualizer.isInitialized) {
                const titleScreen = document.getElementById('title-screen');
                if (!titleScreen || titleScreen.classList.contains('intro-hidden') || titleScreen.style.display === 'none') {
                    Visualizer.init();
                }
            }
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoInit);
        } else {
            autoInit();
        }
    }

})(typeof window !== 'undefined' ? window : this);
