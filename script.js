/**
 * CARTOGRAFFECT • Système de modélisation géométrique des affects
 * Dr Manuel Cabelguen, Ph. D. en psychologie, psychologue clinicien • OPIC n° 1233199
 */
const d3 = window.d3;

document.addEventListener("DOMContentLoaded", () => {
    const titleScreen = document.getElementById('title-screen');
    const mainContent = document.getElementById('main-content');
    let hasTransitioned = false;
    let safetyTimeout = null;

    function runTitleAnimation(callback) {
        const svg = d3.select("#title-animation");
        if (!svg.node()) {
            callback();
            return;
        }

        // Clean previous elements if replaying
        svg.selectAll("*").remove();

        const width = window.innerWidth;
        const height = window.innerHeight;
        svg.attr("width", width).attr("height", height);

        const textString = "CARTOGRAFFECT";
        const fontSize = Math.min(width / 11, 100);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.font = `bold ${fontSize}px "DM Sans", "Inter", sans-serif`;
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(textString, width / 2, height / 2);

        const imageData = context.getImageData(0, 0, width, height);
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

        if (points.length === 0) {
            callback();
            return;
        }

        const sampleSize = Math.min(points.length, 2500);
        const sampledPoints = d3.shuffle(points.slice()).slice(0, sampleSize);

        // Clear any existing safety timeout
        if (safetyTimeout) clearTimeout(safetyTimeout);
        // Safety fallback timeout: max 4.5s so screen never freezes
        safetyTimeout = setTimeout(() => {
            callback();
        }, 4500);

        svg.selectAll("circle")
            .data(sampledPoints)
            .enter().append("circle")
            .attr("cx", () => Math.random() * width)
            .attr("cy", () => Math.random() * height)
            .attr("r", 1.2)
            .style("fill", "#f0abfc")
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .transition()
            .duration(1000)
            .delay((d, i) => i * 0.75)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .on("end", (d, i) => {
                if (i === sampledPoints.length - 1) {
                    if (safetyTimeout) clearTimeout(safetyTimeout);
                    setTimeout(callback, 750); // Wait 0.75s after particles assemble
                }
            });
    }

    function runCartograffectLogoAnimation() {
        if (window.CartograffectVisualizer) {
            window.CartograffectVisualizer.init();
        }
    }

    function transitionToMainContent(immediate = false) {
        if (hasTransitioned) return;
        hasTransitioned = true;
        if (safetyTimeout) clearTimeout(safetyTimeout);

        if (titleScreen) {
            if (immediate) {
                titleScreen.style.display = 'none';
                titleScreen.classList.add('intro-hidden');
            } else {
                titleScreen.classList.add('intro-hidden');
                setTimeout(() => {
                    if (titleScreen) {
                        titleScreen.style.display = 'none';
                    }
                }, 800);
            }
        }

        if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.classList.add('flex');
            
            if (immediate) {
                mainContent.classList.add('visible');
            } else {
                requestAnimationFrame(() => {
                    mainContent.classList.add('visible');
                });
            }
        }

        setTimeout(runCartograffectLogoAnimation, immediate ? 50 : 300);
    }

    // Keyboard shortcut to skip intro
    window.addEventListener('keydown', (e) => {
        if (!hasTransitioned && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            transitionToMainContent();
        }
    });

    if (titleScreen) {
        titleScreen.addEventListener('click', () => {
            transitionToMainContent();
        });
    }

    // Function to replay intro animation anytime
    window.replayIntroAnimation = function() {
        if (!titleScreen) return;
        hasTransitioned = false;
        titleScreen.style.display = 'flex';
        requestAnimationFrame(() => {
            titleScreen.classList.remove('intro-hidden');
            titleScreen.classList.remove('hidden');
        });
        runTitleAnimation(transitionToMainContent);
    };

    // Clean up any old sessionStorage flag that was blocking the animation on reload
    try {
        sessionStorage.removeItem('cartograffect_intro_seen');
    } catch(e) {}

    // Check if URL has hash (deep link) or skipIntro param
    const urlParams = new URLSearchParams(window.location.search);
    const hasHash = window.location.hash && window.location.hash.length > 1;
    const shouldSkip = urlParams.has('skipIntro') || hasHash;

    if (shouldSkip) {
        transitionToMainContent(true);
    } else {
        // Wait for fonts to be ready if possible, then start intro animation
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                runTitleAnimation(transitionToMainContent);
            }).catch(() => {
                runTitleAnimation(transitionToMainContent);
            });
        } else {
            runTitleAnimation(transitionToMainContent);
        }
    }

    // ============================================================
    // Universal Sticky Tabs Navigation & Section Scrollspy
    // ============================================================
    function initStickyTabsAndScrollspy() {
        const tabs = document.querySelectorAll('.sticky-tab-btn');
        let sections = document.querySelectorAll('.page-section');
        const dots = document.querySelectorAll('.floating-dot');
        const tabsTrack = document.querySelector('.sticky-tabs-track');

        if (!sections.length && (dots.length || tabs.length)) {
            const targets = [];
            dots.forEach(d => {
                const t = d.getAttribute('data-target');
                if (t && t.startsWith('#') && !targets.includes(t)) targets.push(t);
            });
            tabs.forEach(tab => {
                const t = tab.getAttribute('href');
                if (t && t.startsWith('#') && !targets.includes(t)) targets.push(t);
            });
            if (targets.length) {
                try {
                    sections = document.querySelectorAll(targets.join(','));
                } catch(e) {}
            }
        }

        if (!sections.length || (!tabs.length && !dots.length)) return;

        // Smooth click handler on tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetId = tab.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        const headerOffset = 135;
                        const elementPosition = targetEl.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });

        // Smooth click on floating dots
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetId = dot.getAttribute('data-target');
                if (targetId) {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        const headerOffset = 135;
                        const elementPosition = targetEl.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });

        // Scrollspy with IntersectionObserver
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -40% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = '#' + entry.target.id;
                    
                    // Update tabs
                    tabs.forEach(tab => {
                        const href = tab.getAttribute('href');
                        if (href === id) {
                            tab.classList.add('active');
                            // Scroll tab into view horizontally inside container
                            if (tabsTrack) {
                                const tabLeft = tab.offsetLeft;
                                const tabWidth = tab.offsetWidth;
                                const trackWidth = tabsTrack.offsetWidth;
                                tabsTrack.scrollTo({
                                    left: tabLeft - (trackWidth / 2) + (tabWidth / 2),
                                    behavior: 'smooth'
                                });
                            }
                        } else {
                            tab.classList.remove('active');
                        }
                    });

                    // Update dots
                    dots.forEach(dot => {
                        const target = dot.getAttribute('data-target');
                        if (target === id) {
                            dot.classList.add('active');
                        } else {
                            dot.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(sec => observer.observe(sec));
    }

    // Initialize once DOM is ready or after main content reveals
    initStickyTabsAndScrollspy();
    window.initStickyTabsAndScrollspy = initStickyTabsAndScrollspy;
});
