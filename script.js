import * as d3 from 'd3';

document.addEventListener("DOMContentLoaded", () => {
    const titleScreen = document.getElementById('title-screen');
    const mainContent = document.getElementById('main-content');

    function runTitleAnimation(callback) {
        const svg = d3.select("#title-animation");
        // Remove the SVG and replace with a canvas for better performance
        svg.remove();

        const titleScreen = document.getElementById('title-screen');
        const canvas = document.createElement('canvas');
        canvas.id = "title-canvas";
        titleScreen.appendChild(canvas);

        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        // --- 1. Generate text points ---
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');

        const textString = "CARTOGRAFFECT";
        const fontSize = Math.min(width / 11, 100);
        tempCtx.font = `bold ${fontSize}px "DM Sans", sans-serif`;
        tempCtx.fillStyle = "white";
        tempCtx.textAlign = "center";
        tempCtx.textBaseline = "middle";
        tempCtx.fillText(textString, width / 2, height / 2);

        const imageData = tempCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const points = [];
        const step = 4;

        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const alpha = data[((y * width + x) * 4) + 3];
                if (alpha > 128) {
                    points.push({ x: x, y: y });
                }
            }
        }

        const sampleSize = Math.min(points.length, 2500);
        const sampledPoints = d3.shuffle(points.slice()).slice(0, sampleSize);

        // --- 2. Initialize particles ---
        // Each particle has: startPos (random), targetPos (from text), currentPos, startTime
        const particles = sampledPoints.map((p, i) => ({
            targetX: p.x,
            targetY: p.y,
            x: Math.random() * width,
            y: Math.random() * height,
            r: 1,
            opacity: 0,
            delay: i * 0.75, // Stagger delay in ms
            done: false
        }));

        const startTime = performance.now();
        const duration = 1000; // Duration of each phase (fade in, move)
        const totalDuration = 2000 + (particles.length * 0.75); // Approx max time

        let animationFrameId;

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function draw(now) {
            const elapsed = now - startTime;
            context.clearRect(0, 0, width, height);

            let allFinished = true;
            let activeParticles = 0;

            particles.forEach(p => {
                // Phase 1: Fade in (0 to 1000ms)
                // The original code started fading in immediately.
                // It had: .transition().duration(1000).style("opacity", 1)

                // Phase 2: Move to target (starts at delay)
                // Original: .delay(i*0.75).transition().duration(1000)...

                // Let's replicate logic:
                // Opacity: Linear fade in over first 1000ms.
                // Position: Interpolate from start to target starting at t = p.delay, lasting 1000ms.

                // Opacity Calculation
                let opProgress = elapsed / 1000;
                if (opProgress > 1) opProgress = 1;
                p.opacity = opProgress;

                // Position Calculation
                const moveStart = p.delay;
                let moveProgress = (elapsed - moveStart) / 1000; // 1000ms duration

                if (moveProgress < 0) moveProgress = 0;
                if (moveProgress > 1) moveProgress = 1;

                if (moveProgress < 1) {
                    allFinished = false;
                    const eased = easeOutCubic(moveProgress); // Using easeOut to match default d3 transition slightly
                    // actually d3 default is cubic-in-out usually. using cubic out for snap.
                    // The original code used default transition, which is cubic-in-out.
                    // Let's stick to simple easeOut for performance/simplicity or implement cubicInOut

                    // Simple linear interpolation for position based on eased time
                    p.x = p.x + (p.targetX - p.x) * eased; // This is wrong, this is iterative.
                    // Correct lerp:
                    // start + (target - start) * t
                    // But we didn't save startX separate from current x if we update x.
                    // We need to preserve startX/Y or calculate dynamically.
                    // Let's recalculate from initial random?
                    // To save memory, we can store startX/Y in the object or just not update x/y in place until drawing.
                    // Let's just calculate render position.
                }

                if (moveProgress >= 1) {
                    p.done = true;
                    // Render at target
                    context.globalAlpha = p.opacity;
                    context.fillStyle = "#f0abfc";
                    context.beginPath();
                    context.arc(p.targetX, p.targetY, p.r, 0, 2 * Math.PI);
                    context.fill();
                } else {
                     // Render interpolated
                     // We need the original start positions.
                     // Since we didn't save them in 'p', let's assume 'x' and 'y' in 'p' are the STARTS.
                     // And we draw at a computed position.
                     const eased = easeOutCubic(moveProgress);
                     const drawX = p.x + (p.targetX - p.x) * eased;
                     const drawY = p.y + (p.targetY - p.y) * eased;

                     context.globalAlpha = p.opacity;
                     context.fillStyle = "#f0abfc";
                     context.beginPath();
                     context.arc(drawX, drawY, p.r, 0, 2 * Math.PI);
                     context.fill();
                     activeParticles++;
                }
            });

            if (!allFinished || elapsed < totalDuration) {
                animationFrameId = requestAnimationFrame(draw);
            } else {
                // Animation complete
                setTimeout(callback, 750);
            }
        }

        requestAnimationFrame(draw);
    }

    function runCartograffectLogoAnimation() {
        const svgContainer = d3.select("#logoCanvas");
        if (!svgContainer.node()) return;

        svgContainer.selectAll("*").remove();

        const specificEmotionEmojis = {
            "Attente": "⏳", "Surprise": "😮", "Anticipation": "🤔", "Joie": "😄", "Tristesse": "😢", "Peur": "😨",
            "Courage": "💪", "Colère": "😠", "Calme": "😌", "Désir": "😍", "Dégoût": "🤢", "Confusion": "😕",
            "Consternation": "😧", "Euphorie": "🥳", "Engourdissement": "😵", "Réconfort": "🤗", "Chagrin": "😥",
            "Stupeur": "😲", "Panique": "😱", "Effroi": "🥶", "Appréhension": "🧐", "Émerveillement": "🤩",
            "Enchantement": "✨", "Exaspération": "😤", "Soulagement": "😮‍💨", "Excitation": "🤪", "Déception": "😞",
            "Ambivalence": "🤷", "Envie": "😏", "Haine": "😡", "Amour": "❤️", "Assurance": "😎", "Indifférence": "😐",
            "Sérénité": "😇", "Plénitude": "🙏", "Honte": "😳", "Vide": "😶‍🌫️", "Anxiété": "😰", "Manque": "💔",
            "Mépris": "😒", "Crainte": "😟", "Doute": "🤨", "Conviction": "✅", "Fierté": "🦁", "Épanouissement": "🌸",
            "Affection": "🥰", "Admiration": "🙌", "Frustration": "😫", "Acceptation": "👌", "Engagement": "🤝",
            "Rejet": "🙅‍♂️", "Agitation": "🏃‍♀️", "Invulnérabilité": "🛡️", "Puissance": "⚡", "Confiance": "👍",
            "Intolérance": "🚫", "Injustice": "⚖️", "Imprudence": "🙈", "Apathie": "😑", "Sécurité": "🔒",
            "Quiétude": "🏞️", "Patience": "🧘‍♀️", "Pessimisme": "🌧️", "Déshonneur": "🤦‍♂️", "Désespoir": "😩",
            "Incertitude": "❓", "Insécurité": "😥", "Inquiétude": "🤔", "Impatience": "😤", "Vulnérabilité": "💔",
            "Impuissance": "🤷‍♂️", "Méfiance": "😒", "Certitude": "💯", "Optimisme": "😊", "Honneur": "🎖️",
            "Espoir": "✨", "Tolérance": "🤗", "Justice": "⚖️", "Prudence": "🧐", "Mécontentement": "😕",
            "Contentement": "😊", "Intérêt": "💡", "Désintérêt": "😴"
        };

        const pointsData = [
            { id: 0, name: "Attente", x: 0, y: 0, category: 1, group: "Orientation" },
            { id: 1, name: "Surprise", x: 0, y: 0.5, category: 1, group: "Orientation" },
            { id: 2, name: "Anticipation", x: 0, y: -0.5, category: 1, group: "Orientation" },
            { id: 3, name: "Joie", x: 0, y: 2, category: 2, group: "Joie" },
            { id: 4, name: "Tristesse", x: 0, y: -2, category: 2, group: "Tristesse" },
            { id: 5, name: "Peur", x: -2, y: 0, category: 2, group: "Peur" },
            { id: 6, name: "Courage", x: 2, y: 0, category: 2, group: "Courage" },
            { id: 7, name: "Colère", x: -1, y: 1, category: 2, group: "Colère" },
            { id: 8, name: "Calme", x: 1, y: -1, category: 2, group: "Calme" },
            { id: 9, name: "Désir", x: 1, y: 1, category: 2, group: "Désir" },
            { id: 10, name: "Dégoût", x: -1, y: -1, category: 2, group: "Dégoût" },
            { id: 11, name: "Confusion", x: 0, y: 4, category: 3, group: "Joie" },
            { id: 12, name: "Consternation", x: -1, y: 3, category: 3, group: "Joie" },
            { id: 13, name: "Euphorie", x: 1, y: 3, category: 3, group: "Joie" },
            { id: 14, name: "Engourdissement", x: 0, y: -4, category: 3, group: "Tristesse" },
            { id: 15, name: "Réconfort", x: 1, y: -3, category: 3, group: "Tristesse" },
            { id: 16, name: "Chagrin", x: -1, y: -3, category: 3, group: "Tristesse" },
            { id: 17, name: "Stupeur", x: -4, y: 0, category: 3, group: "Peur" },
            { id: 18, name: "Panique", x: -3, y: 1, category: 3, group: "Peur" },
            { id: 19, name: "Effroi", x: -3, y: -1, category: 3, group: "Peur" },
            { id: 20, name: "Appréhension", x: 4, y: 0, category: 3, group: "Courage" },
            { id: 21, name: "Émerveillement", x: 3, y: 1, category: 3, group: "Courage" },
            { id: 22, name: "Enchantement", x: 3, y: -1, category: 3, group: "Courage" },
            { id: 23, name: "Exaspération", x: -2, y: 2, category: 3, group: "Colère" },
            { id: 24, name: "Soulagement", x: 2, y: -2, category: 3, group: "Calme" },
            { id: 25, name: "Excitation", x: 2, y: 2, category: 3, group: "Désir" },
            { id: 26, name: "Déception", x: -2, y: -2, category: 3, group: "Dégoût" },
            { id: 27, name: "Ambivalence", x: 0, y: 6, category: 4, group: "Joie" },
            { id: 28, name: "Envie", x: -2, y: 4, category: 4, group: "Joie" },
            { id: 29, name: "Haine", x: -1, y: 5, category: 4, group: "Joie" },
            { id: 30, name: "Amour", x: 1, y: 5, category: 4, group: "Joie" },
            { id: 31, name: "Assurance", x: 2, y: 4, category: 4, group: "Joie" },
            { id: 32, name: "Indifférence", x: 0, y: -6, category: 4, group: "Tristesse" },
            { id: 33, name: "Sérénité", x: 2, y: -4, category: 4, group: "Tristesse" },
            { id: 34, name: "Plénitude", x: 1, y: -5, category: 4, group: "Tristesse" },
            { id: 35, name: "Honte", x: -2, y: -4, category: 4, group: "Tristesse" },
            { id: 36, name: "Vide", x: -1, y: -5, category: 4, group: "Tristesse" },
            { id: 37, name: "Anxiété", x: -4, y: 2, category: 4, group: "Peur" },
            { id: 38, name: "Manque", x: -5, y: 1, category: 4, group: "Peur" },
            { id: 39, name: "Mépris", x: -5, y: -1, category: 4, group: "Peur" },
            { id: 40, name: "Crainte", x: -4, y: -2, category: 4, group: "Peur" },
            { id: 41, name: "Doute", x: -6, y: 0, category: 4, group: "Peur" },
            { id: 42, name: "Conviction", x: 6, y: 0, category: 4, group: "Courage" },
            { id: 43, name: "Fierté", x: 4, y: 2, category: 4, group: "Courage" },
            { id: 44, name: "Épanouissement", x: 5, y: 1, category: 4, group: "Courage" },
            { id: 45, name: "Affection", x: 5, y: -1, category: 4, group: "Courage" },
            { id: 46, name: "Admiration", x: 4, y: -2, category: 4, group: "Courage" },
            { id: 47, name: "Frustration", x: -3, y: 3, category: 4, group: "Colère" },
            { id: 48, name: "Acceptation", x: 3, y: -3, category: 4, group: "Calme" },
            { id: 49, name: "Engagement", x: 3, y: 3, category: 4, group: "Désir" },
            { id: 50, name: "Rejet", x: -3, y: -3, category: 4, group: "Dégoût" },
            { id: 51, name: "Agitation", x: 0, y: 8, category: 5, group: "Joie" },
            { id: 52, name: "Invulnérabilité", x: 1, y: 7, category: 5, group: "Joie" },
            { id: 53, name: "Puissance", x: 2, y: 6, category: 5, group: "Joie" },
            { id: 54, name: "Confiance", x: 3, y: 5, category: 5, group: "Joie" },
            { id: 55, name: "Intolérance", x: -2, y: 6, category: 5, group: "Joie" },
            { id: 56, name: "Injustice", x: -3, y: 5, category: 5, group: "Joie" },
            { id: 57, name: "Imprudence", x: -1, y: 7, category: 5, group: "Joie" },
            { id: 58, name: "Apathie", x: 0, y: -8, category: 5, group: "Tristesse" },
            { id: 59, name: "Sécurité", x: 2, y: -6, category: 5, group: "Tristesse" },
            { id: 60, name: "Quiétude", x: 3, y: -5, category: 5, group: "Tristesse" },
            { id: 61, name: "Patience", x: 1, y: -7, category: 5, group: "Tristesse" },
            { id: 62, name: "Pessimisme", x: -2, y: -6, category: 5, group: "Tristesse" },
            { id: 63, name: "Déshonneur", x: -3, y: -5, category: 5, group: "Tristesse" },
            { id: 64, "name": "Désespoir", x: -1, y: -7, category: 5, group: "Tristesse" },
            { id: 65, name: "Incertitude", x: -8, y: 0, category: 5, group: "Peur" },
            { id: 66, name: "Insécurité", x: -6, y: 2, category: 5, group: "Peur" },
            { id: 67, name: "Inquiétude", x: -5, y: 3, category: 5, group: "Peur" },
            { id: 68, name: "Impatience", x: -7, y: 1, category: 5, group: "Peur" },
            { id: 69, name: "Vulnérabilité", x: -7, y: -1, category: 5, group: "Peur" },
            { id: 70, name: "Impuissance", x: -6, y: -2, category: 5, group: "Peur" },
            { id: 71, name: "Méfiance", x: -5, y: -3, category: 5, group: "Peur" },
            { id: 72, name: "Certitude", x: 8, y: 0, category: 5, group: "Courage" },
            { id: 73, name: "Optimisme", x: 6, y: 2, category: 5, group: "Courage" },
            { id: 74, name: "Honneur", x: 5, y: 3, category: 5, group: "Courage" },
            { id: 75, name: "Espoir", x: 7, y: 1, category: 5, group: "Courage" },
            { id: 76, name: "Tolérance", x: 6, y: -2, category: 5, group: "Courage" },
            { id: 77, name: "Justice", x: 5, y: -3, category: 5, group: "Courage" },
            { id: 78, name: "Prudence", x: 7, y: -1, category: 5, group: "Courage" },
            { id: 79, name: "Mécontentement", x: -4, y: 4, category: 5, group: "Colère" },
            { id: 80, name: "Contentement", x: 4, y: -4, category: 5, group: "Calme" },
            { id: 81, name: "Intérêt", x: 4, y: 4, category: 5, group: "Désir" },
            { id: 82, name: "Désintérêt", x: -4, y: -4, category: 5, group: "Dégoût" }
        ];

        const SIZE = 700;
        const MARGIN = { top: 20, right: 20, bottom: 20, left: 20 };
        const DOMAIN_LIMIT = 8.5;

        const width = SIZE - MARGIN.left - MARGIN.right;
        const height = SIZE - MARGIN.top - MARGIN.bottom;

        const svg = svgContainer
            .attr("viewBox", `0 0 ${SIZE} ${SIZE}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

        const xScale = d3.scaleLinear().domain([-DOMAIN_LIMIT, DOMAIN_LIMIT]).range([0, width]);
        const yScale = d3.scaleLinear().domain([-DOMAIN_LIMIT, DOMAIN_LIMIT]).range([height, 0]);

        const centerX = xScale(0);
        const centerY = yScale(0);


        const colorGroups = {
            "Joie": "#a78bfa", "Tristesse": "#38bdf8", "Peur": "#f472b6", "Courage": "#4ade80",
            "Colère": "#f87171", "Calme": "#67e8f9", "Désir": "#e879f9", "Dégoût": "#94a3b8",
            "Orientation": "#c4b5fd"
        };
        const colorScale = d3.scaleOrdinal().domain(Object.keys(colorGroups)).range(Object.values(colorGroups));

        const radiusScale = d3.scaleOrdinal()
            .domain([1, 2, 3, 4, 5])
            .range([5, 6, 7, 8, 9]);

        const defs = svg.append("defs");
        const filter = defs.append("filter").attr("id", "glow");
        filter.append("feGaussianBlur").attr("stdDeviation", "3.5").attr("result", "coloredBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        const rainbowGradient = defs.append("linearGradient")
            .attr("id", "rainbow-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", yScale(DOMAIN_LIMIT))
            .attr("x2", 0).attr("y2", yScale(-DOMAIN_LIMIT));

        const rainbowColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#4f46e5", "#8b5cf6"];
        rainbowGradient.selectAll("stop")
            .data(rainbowColors)
            .enter().append("stop")
            .attr("offset", (d,i) => i / (rainbowColors.length - 1))
            .attr("stop-color", d => d);

        const axisGroup = svg.append("g").attr("class", "axis-group");
        axisGroup.append("line").attr("class", "axis-line").attr("x1", 0).attr("y1", yScale(0)).attr("x2", width).attr("y2", yScale(0));
        axisGroup.append("line").attr("class", "axis-line").attr("x1", xScale(0)).attr("y1", 0).attr("x2", xScale(0)).attr("y2", height);

        let maxRadius = 0;
        pointsData.forEach(p => {
            const dist = Math.sqrt(p.x * p.x + p.y * p.y);
            if (dist > maxRadius) {
                maxRadius = dist;
            }
        });

        svg.append("circle")
            .attr("cx", centerX)
            .attr("cy", centerY)
            .attr("r", xScale(maxRadius) - centerX)
            .attr("fill", "none")
            .attr("stroke", "#6b7280")
            .attr("stroke-width", 1)
            .style("stroke-dasharray", "4, 4");

        const adjacencyList = new Map();
        pointsData.forEach(p => adjacencyList.set(p.id, []));
        const lineData = [];
        const connections = new Set();
        const centralPoints = pointsData.filter(p => p.id <= 2);
        const firstLayerPoints = pointsData.filter(p => p.category === 2);
        for (const centerP of centralPoints) {
            for (const layer1P of firstLayerPoints) {
                const connectionKey = [centerP.id, layer1P.id].sort((a,b) => a-b).join('-');
                if (!connections.has(connectionKey)) {
                    lineData.push({ source: centerP, target: layer1P });
                    adjacencyList.get(centerP.id).push(layer1P.id);
                    adjacencyList.get(layer1P.id).push(centerP.id);
                    connections.add(connectionKey);
                }
            }
        }
        const k = 3;
        const outerLayersPoints = pointsData.filter(p => p.category > 1);
        for (const p1 of outerLayersPoints) {
            const distances = [];
            for (const p2 of outerLayersPoints) {
                if (p1.id === p2.id) continue;
                const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                distances.push({ point: p2, distance: dist });
            }
            distances.sort((a, b) => a.distance - b.distance);
            const neighbors = distances.slice(0, k);
            for (const neighbor of neighbors) {
                const p2 = neighbor.point;
                const connectionKey = [p1.id, p2.id].sort((a, b) => a - b).join('-');
                if (!connections.has(connectionKey)) {
                    lineData.push({ source: p1, target: p2 });
                    adjacencyList.get(p1.id).push(p2.id);
                    adjacencyList.get(p2.id).push(p1.id);
                    connections.add(connectionKey);
                }
            }
        }

        const lines = svg.append("g").selectAll("line")
            .data(lineData)
            .enter()
            .append("line")
            .attr("class", "structural-line")
            .attr("stroke", "#4b5563")
            .attr("stroke-width", 0.75)
            .attr("opacity", 0.3)
            .attr("x1", d => xScale(d.source.x))
            .attr("y1", d => yScale(d.source.y))
            .attr("x2", d => xScale(d.target.x))
            .attr("y2", d => yScale(d.target.y));

        const points = svg.selectAll(".data-point").data(pointsData).enter().append("circle")
            .attr("class", "data-point").attr("id", d => `point-${d.id}`).attr("cx", d => xScale(d.x)).attr("cy", d => yScale(d.y))
            .attr("r", d => radiusScale(d.category)).attr("fill", d => colorScale(d.group)).style("filter", "url(#glow)");

        function findRandomWavePath(startPoint, tempTarget, adjacencyList) {
            // Find the real point closest to the temporary snapshot target
            let closestPoint = null;
            let minDistance = Infinity;
            pointsData.forEach(p => {
                if (p.id === 0) return;
                const dist = Math.sqrt(Math.pow(p.x - tempTarget.x, 2) + Math.pow(p.y - tempTarget.y, 2));
                if (dist < minDistance) {
                    minDistance = dist;
                    closestPoint = p;
                }
            });

            let path = [startPoint, tempTarget];
            let currentPoint;

            if(closestPoint) {
                path.push(closestPoint);
                currentPoint = closestPoint;
            } else {
                return [startPoint]; // Fallback
            }

            let visited = new Set([startPoint.id, currentPoint.id]);
            const maxSteps = 6 + Math.floor(Math.random() * 6); // Shorter path after the target

            for (let i = 0; i < maxSteps; i++) {
                const neighborsIds = adjacencyList.get(currentPoint.id) || [];
                const unvisitedNeighbors = neighborsIds
                    .map(id => pointsData.find(p => p.id === id))
                    .filter(p => p && !visited.has(p.id));

                if (unvisitedNeighbors.length === 0) break;

                const nextPoint = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
                path.push(nextPoint);
                visited.add(nextPoint.id);
                currentPoint = nextPoint;
            }
            return path;
        }

        function animateWave(pathPoints) {
            if (pathPoints.length < 2) return;
            const waveDuration = 1500;
            const lineGenerator = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));
            const path = svg.append("path").datum(pathPoints).attr("fill", "none").attr("stroke", "#f0abfc").attr("stroke-width", "2.5px").style("filter", "url(#glow)").attr("d", lineGenerator);
            const length = path.node().getTotalLength();
            path.attr("stroke-dasharray", `${length} ${length}`).attr("stroke-dashoffset", length).transition().duration(waveDuration).ease(d3.easeLinear).attr("stroke-dashoffset", 0).transition().duration(500).style("opacity", 0).remove();

            pathPoints.forEach((point, i) => {
                const delay = (waveDuration / (pathPoints.length - 1)) * i;
                setTimeout(() => {
                    d3.select(`#point-${point.id}`).transition().duration(200).attr("r", d => radiusScale(d.category) + 5).transition().duration(600).attr("r", d => radiusScale(d.category));

                    const startX = xScale(point.x), startY = yScale(point.y);
                    let [dirX, dirY] = [startX - xScale(0), startY - yScale(0)];
                    const mag = Math.sqrt(dirX * dirX + dirY * dirY);
                    if (mag > 0) { [dirX, dirY] = [dirX / mag, dirY / mag]; } else { [dirX, dirY] = [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2]; }

                    const labelYOffset = 25;
                    const label = svg.append("text")
                        .attr("class", "emotion-label-popup")
                        .attr("x", startX)
                        .attr("y", startY + labelYOffset)
                        .text(point.name)
                        .attr("fill", "#e5e7eb")
                        .attr("font-size", "0px")
                        .attr("font-weight", "600")
                        .attr("text-anchor", "middle")
                        .style("pointer-events", "none")
                        .style("opacity", 0);

                    label.transition()
                        .duration(800)
                        .ease(d3.easeElasticOut.amplitude(1.2).period(0.5))
                        .attr("font-size", "22px")
                        .style("opacity", 1)
                        .transition()
                        .duration(3500)
                        .ease(d3.easeQuadOut)
                        .attr("x", startX + dirX * 180)
                        .attr("y", startY + labelYOffset + dirY * 180)
                        .attr("font-size", "8px")
                        .style("opacity", 0)
                        .remove();

                    const emoji = specificEmotionEmojis[point.name];
                    if (emoji) {
                        const emojiDriftX = (Math.random() - 0.5) * 40;
                        const emojiDriftY = (Math.random() - 0.5) * 40;

                        const emojiPopup = svg.append("text")
                            .attr("class", "emotion-emoji-popup")
                            .attr("x", startX)
                            .attr("y", startY)
                            .text(emoji)
                            .attr("font-size", "0px")
                            .style("opacity", 0)
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", "central");

                        emojiPopup.transition()
                            .duration(800)
                            .delay(100)
                            .ease(d3.easeElasticOut.amplitude(1.2).period(0.5))
                            .attr("font-size", "36px")
                            .style("opacity", 1)
                            .transition()
                            .duration(3800)
                            .ease(d3.easeQuadOut)
                            .attr("x", startX + dirX * 200 + emojiDriftX)
                            .attr("y", startY + dirY * 200 + emojiDriftY)
                            .attr("font-size", "10px")
                            .attr("transform", `rotate(${(Math.random() - 0.5) * 30}, ${startX + dirX * 200 + emojiDriftX}, ${startY + dirY * 200 + emojiDriftY})`)
                            .style("opacity", 0)
                            .remove();
                    }
                }, delay);
            });
        };

        points.each(function(p) {
            const point = p;
            const selection = d3.select(this);
            function pulse() {
                selection.transition()
                    .duration(2000 + Math.random() * 1500)
                    .ease(d3.easeSinInOut)
                    .attr("r", radiusScale(point.category) + 1.5)
                    .transition()
                    .duration(2000 + Math.random() * 1500)
                    .ease(d3.easeSinInOut)
                    .attr("r", radiusScale(point.category))
                    .on("end", pulse);
            }
            pulse();
        });

        const pointEntities = pointsData.map(d => ({
            id: d.id,
            originalData: d,
            selection: d3.select(`#point-${d.id}`),
            originalCx: xScale(d.x),
            originalCy: yScale(d.y),
            orbitRadius: 2 + Math.random() * 2.5,
            orbitSpeed: (0.2 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1) * 0.0001,
            startAngle: Math.random() * 2 * Math.PI,
            // Add individual oscillation speeds for core points
            oscSpeed: 0.001 + Math.random() * 0.001,
            isAnimating: false,
        }));

        // Get the entities for Surprise and Anticipation
        const surpriseEntity = pointEntities.find(p => p.id === 1);
        const anticipationEntity = pointEntities.find(p => p.id === 2);

        if (surpriseEntity && anticipationEntity) {
            // Set Anticipation's speed to be half of Surprise's
            anticipationEntity.oscSpeed = surpriseEntity.oscSpeed / 2;
        }

        const resultantPoint = svg.append("circle")
            .attr("r", 5.5)
            .attr("fill", "white")
            .style("filter", "url(#glow)");

        const anticipationEntity2 = svg.append("circle")
            .attr("class", "data-point")
            .attr("r", radiusScale(1))
            .attr("fill", "#818CF8");

        const surpriseEntity2 = svg.append("circle")
            .attr("class", "data-point")
            .attr("r", radiusScale(1))
            .attr("fill", "#818CF8");

        const resultantPoint2 = svg.append("circle")
            .attr("r", 5.5)
            .attr("fill", "#818CF8")
            .style("filter", "url(#glow)");

        const oppositeSurpriseEntity = svg.append("circle")
            .attr("class", "data-point")
            .attr("r", radiusScale(1))
            .attr("fill", "#c4b5fd");

        const resultantPoint3 = svg.append("circle")
            .attr("r", 5.5)
            .attr("fill", "#FFD700")
            .style("filter", "url(#glow)");

        const resultantPoint4 = svg.append("circle")
            .attr("r", 5.5)
            .attr("fill", "#FFD700")
            .style("filter", "url(#glow)");

        const pointPositions = new Map();

        d3.timer(elapsed => {
            const angularSpeed = (2 * Math.PI) / 4000; // 4-second rotation

            // --- Animation for First Pulsar (Counter-Clockwise) ---
            const angle1 = elapsed * angularSpeed;
            const domainX1 = maxRadius * -Math.sin(angle1); // Shifted by 90deg
            const domainY1 = maxRadius * Math.cos(angle1);  // Shifted by 90deg

            const surpriseEntity = pointEntities.find(p => p.id === 1);
            if (surpriseEntity) {
                const newCy = yScale(domainY1);
                surpriseEntity.selection.attr('cy', newCy);
                pointPositions.set(1, { x: surpriseEntity.originalCx, y: newCy });
            }
            const anticipationEntity = pointEntities.find(p => p.id === 2);
            if (anticipationEntity) {
                const newCx = xScale(domainX1);
                const centralY = yScale(0);
                anticipationEntity.selection.attr('cx', newCx).attr('cy', centralY);
                pointPositions.set(2, { x: newCx, y: centralY });
            }
            resultantPoint.attr('cx', xScale(domainX1)).attr('cy', yScale(domainY1));
            resultantPoint3.attr('cx', xScale(-domainX1)).attr('cy', yScale(-domainY1));

            // --- Animation for Second Pulsar (Clockwise) ---
            const angle2 = -elapsed * angularSpeed;
            const domainX2 = maxRadius * -Math.sin(angle2); // Shifted by 90deg
            const domainY2 = maxRadius * Math.cos(angle2);  // Shifted by 90deg

            surpriseEntity2.attr('cx', xScale(0)).attr('cy', yScale(domainY2));
            oppositeSurpriseEntity.attr('cx', xScale(0)).attr('cy', yScale(-domainY1));
            anticipationEntity2.attr('cx', xScale(domainX2)).attr('cy', yScale(0));
            resultantPoint2.attr('cx', xScale(domainX2)).attr('cy', yScale(domainY2));
            resultantPoint4.attr('cx', xScale(-domainX2)).attr('cy', yScale(-domainY2));

            // Attente (ID 0) remains static
            const attenteEntity = pointEntities.find(p => p.id === 0);
            if (attenteEntity && !pointPositions.has(0)) {
                pointPositions.set(0, { x: attenteEntity.originalCx, y: attenteEntity.originalCy });
            }

            // --- Animate Outer Points ---
            pointEntities.forEach(p => {
                if (p.id > 2) {
                    const angle = p.startAngle + elapsed * p.orbitSpeed;
                    const newCx = p.originalCx + p.orbitRadius * Math.cos(angle);
                    const newCy = p.originalCy + p.orbitRadius * Math.sin(angle);
                    p.selection.attr('cx', newCx).attr('cy', newCy);
                    pointPositions.set(p.id, { x: newCx, y: newCy });
                }
            });

            // Update all lines
            lines
                .attr('x1', d => pointPositions.get(d.source.id)?.x || xScale(d.source.x))
                .attr('y1', d => pointPositions.get(d.source.id)?.y || yScale(d.source.y))
                .attr('x2', d => pointPositions.get(d.target.id)?.x || xScale(d.target.x))
                .attr('y2', d => pointPositions.get(d.target.id)?.y || yScale(d.target.y));

            // --- Proximity Activation ---
            const resultantPos = { x: resultantPoint.attr('cx'), y: resultantPoint.attr('cy') };
            pointEntities.forEach(p => {
                if (p.isAnimating || p.id <= 2) return;

                const currentPos = pointPositions.get(p.id);
                if (!currentPos) return;

                const dist = Math.sqrt(Math.pow(currentPos.x - resultantPos.x, 2) + Math.pow(currentPos.y - resultantPos.y, 2));
                const activation_radius = 30; // pixels

                if (dist < activation_radius) {
                    p.isAnimating = true;
                    p.selection.transition().duration(150)
                        .ease(d3.easeQuadOut)
                        .attr("r", radiusScale(p.originalData.category) + 7)
                        .transition().duration(350)
                        .ease(d3.easeQuadIn)
                        .attr("r", radiusScale(p.originalData.category))
                        .on("end", () => {
                            p.isAnimating = false;
                        });
                }
            });
        });

        // The circuit animation is now handled by drawing paths directly.

        // --- Définition de l'animation des traces ---
        const targetPoints = {
            center: [xScale(0), yScale(0)],
            joie: [xScale(0), yScale(2)],
            tristesse: [xScale(0), yScale(-2)],
            peur: [xScale(-2), yScale(0)],
            courage: [xScale(2), yScale(0)],
            colere: [xScale(-1), yScale(1)],
            calme: [xScale(1), yScale(-1)],
            desir: [xScale(1), yScale(1)],
            degout: [xScale(-1), yScale(-1)]
        };

        const pathDefinitions = [
            [targetPoints.center, targetPoints.joie, targetPoints.colere, targetPoints.center],
            [targetPoints.center, targetPoints.joie, targetPoints.desir, targetPoints.center],
            [targetPoints.center, targetPoints.tristesse, targetPoints.degout, targetPoints.center],
            [targetPoints.center, targetPoints.tristesse, targetPoints.calme, targetPoints.center],
            [targetPoints.center, targetPoints.peur, targetPoints.colere, targetPoints.center],
            [targetPoints.center, targetPoints.peur, targetPoints.degout, targetPoints.center],
            [targetPoints.center, targetPoints.courage, targetPoints.desir, targetPoints.center],
            [targetPoints.center, targetPoints.courage, targetPoints.calme, targetPoints.center]
        ];

        const lineGenerator = d3.line();

        function animateTrace(pathData, index) {
            const pathD = lineGenerator(pathData);
            const tracePath = svg.append("path")
                .attr("d", pathD)
                .attr("fill", "none")
                .attr("stroke", "url(#rainbow-gradient)") // Use the rainbow gradient
                .attr("stroke-width", 2.5)
                .style("filter", "url(#glow)");

            const length = tracePath.node().getTotalLength();
            const drawDuration = 2000;
            const fadeDuration = 1000;
            const delay = 1000;

            tracePath
                .attr("stroke-dasharray", length + " " + length)
                .attr("stroke-dashoffset", length)
                .transition()
                .duration(drawDuration)
                .ease(d3.easeSinInOut)
                .attr("stroke-dashoffset", 0)
                .on("end", () => {
                    if (index === 0) {
                        launchWaveLoop();
                    }
                })
                .transition()
                .duration(fadeDuration)
                .style("opacity", 0)
                .remove()
                .on("end", () => {
                    // The delay is now inside the recursive call to ensure loops don't overlap too fast
                    setTimeout(() => animateTrace(pathData, index), delay);
                });
        }

        pathDefinitions.forEach((pathData, i) => {
            // No stagger, all start at the same time
            animateTrace(pathData, i);
        });

        function launchWaveLoop() {
            if (document.hidden) return;

            // Snapshot the resultant point's current screen position
            const resultantCx = resultantPoint.attr('cx');
            const resultantCy = resultantPoint.attr('cy');

            if (!resultantCx || !resultantCy) return; // Don't launch if point not ready

            // Convert screen coords back to domain coords for the path
            const targetX_domain = xScale.invert(resultantCx);
            const targetY_domain = yScale.invert(resultantCy);
            const tempTarget = { x: targetX_domain, y: targetY_domain, name: "" };

            const startPoint = pointsData.find(p => p.id === 0);
            const path = findRandomWavePath(startPoint, tempTarget, adjacencyList);
            animateWave(path);
        };
    }

    function transitionToMainContent() {
        titleScreen.classList.add('hidden');

        mainContent.classList.remove('hidden');
        mainContent.classList.add('flex');

        // Use requestAnimationFrame to ensure 'display' is applied before adding 'visible' for the transition
        requestAnimationFrame(() => {
            mainContent.classList.add('visible');
        });

        // Run the animation after a delay that allows the layout to be computed.
        setTimeout(runCartograffectLogoAnimation, 400);

        // Remove the title screen from the DOM after its own transition is complete.
        setTimeout(() => {
            titleScreen.remove();
        }, 1000); // Matches the CSS transition duration for #title-screen
    }

    runTitleAnimation(transitionToMainContent);
});
