/**
 * CARTOGRAFFECT — Le Voyage affectif
 * Manuel Cabelguen, Ph. D. en psychologie, psychologue clinicien • OPIC n° 1233199
 *
 * Le visiteur traverse lui-même le circuit d'une émotion :
 *   Z=0 Veille (0,0,0) → Z=1 Surprise (0,0,1) → Z=2 Anticipation (0,0,2)
 *   → résolution sur la première couronne (|X|+|Y| = 2) → ouverture Z=3 → carte complète.
 *
 * Deux grandeurs distinctes, comme dans le modèle :
 *   - la POSITION (X, Y) vient des choix du visiteur (leviers Agir / Ajuster) ;
 *   - l'ACTIVATION vient de son temps de réaction à la surprise
 *     (paramètre de vitesse transversal, non une coordonnée).
 *
 * Aucune donnée n'est envoyée : tout reste dans le navigateur.
 * Dépend de cartograffect_model.js (window.CartograffectModel).
 */
(function () {
    'use strict';

    var M = window.CartograffectModel;
    if (!M) {
        console.error('[Voyage] cartograffect_model.js introuvable.');
        // Message visible plutôt qu'un bouton inerte
        var loadErr = document.getElementById('load-error');
        if (loadErr) loadErr.hidden = false;
        var startBtn = document.getElementById('btn-start');
        if (startBtn) startBtn.disabled = true;
        return;
    }

    var SVGNS = 'http://www.w3.org/2000/svg';
    var DIA = 50;   // 1 unité du modèle = 50 px dans le losange Z=2
    var MAP = 20;   // 1 unité du modèle = 20 px dans la carte complète
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var $ = function (sel) { return document.querySelector(sel); };
    var now = function () { return (window.performance && performance.now) ? performance.now() : Date.now(); };

    var state = {
        t0: 0, tSurprise: 0, tAnticip: 0, tResol: 0,
        words: 0, readSec: 0, wpm: 0,
        reaction: null,
        y: null, x: null,
        result: null
    };

    /* ------------------------------------------------------------------
       Libellés et récits (premier jet à relire par l'auteur)
       ------------------------------------------------------------------ */
    var CHOICE_LABELS = {
        y: { '1': 'Je prends la main : je veux savoir où ça mène.', '0': "J'attends de voir.", '-1': "Je laisse faire : ce n'est pas moi qui décide ici." },
        x: { '1': 'Je suis prêt·e à le revoir.', '0': 'Je ne sais pas encore.', '-1': "Je m'en tiens à ce que j'attendais." }
    };

    var STORIES = {
        'Désir': {
            levers: "Vous avez jugé que vous pouviez agir sur la suite, et vous avez accepté de revoir ce que vous attendiez de cette page.",
            vecu: "Votre attention s'est partagée à parts égales entre l'action et la révision. C'est la configuration du Désir : un élan vers quelque chose qui n'est pas encore là, avec assez de souplesse pour se laisser surprendre en chemin. On le ressent souvent comme une légère inclinaison vers l'avant, une envie de voir la suite."
        },
        'Colère': {
            levers: "Vous avez voulu reprendre la main, tout en gardant intacte l'idée que vous vous faisiez de ce site.",
            vecu: "Quand l'attente ne bouge pas et que l'on cherche à agir, l'écart devient un effort pour faire plier la situation. C'est la configuration de la Colère, ici sans doute très douce : un agacement, un « bon, et alors ? », l'envie de reprendre le contrôle de la page. La colère n'est pas un défaut : elle signale qu'une attente compte pour vous."
        },
        'Calme': {
            levers: "Vous avez laissé la page mener la danse, et vous avez accepté de revoir ce que vous attendiez.",
            vecu: "Ni lutte, ni rigidité : vous avez ajusté votre modèle intérieur à une situation que vous ne cherchiez pas à contrôler. C'est la configuration du Calme. On le reconnaît souvent à une respiration qui se pose, à une disponibilité tranquille pour la suite."
        },
        'Dégoût': {
            levers: "Vous avez jugé que vous ne pouviez pas agir sur la page, et vous avez maintenu ce que vous attendiez.",
            vecu: "Une attente ferme face à une situation qu'on ne peut pas changer : l'écart ne trouve d'issue ni dans l'action, ni dans la révision. Reste la mise à distance. C'est la configuration du Dégoût, ici peut-être un simple « ce n'est pas pour moi », une envie de fermer l'onglet. C'est une protection : elle trie ce que nous laissons entrer."
        },
        'Joie': {
            levers: "Vous avez voulu agir sur la suite, sans encore vous prononcer sur ce que vous attendiez.",
            vecu: "Tout le budget de votre attention est allé vers l'action : la situation vous a paru ouverte, à portée de main. C'est l'orientation de la Joie, une décharge : l'impression que les choses peuvent aller dans votre sens. Elle est instable par nature, elle appelle la suite."
        },
        'Tristesse': {
            levers: "Vous avez estimé que la suite ne dépendait pas de vous, sans trancher sur vos attentes.",
            vecu: "Tout le budget s'est porté sur un constat : ici, je ne peux pas agir. C'est l'orientation de la Tristesse, dans une version minuscule : une légère retombée, un « ah, d'accord ». La tristesse sert à cela : prendre acte de ce qui échappe à notre prise, pour économiser nos forces."
        },
        'Courage': {
            levers: "Vous avez accepté de revoir ce que vous attendiez, sans encore décider d'agir ou non.",
            vecu: "Tout le budget est allé vers la révision de votre modèle intérieur : vous vous êtes ouvert·e à l'inconnu sans exiger d'en avoir le contrôle. Cartograffect appelle cette orientation le Courage : non pas foncer, mais accepter de ne pas savoir et se laisser transformer par ce qui arrive."
        },
        'Peur': {
            levers: "Vous avez maintenu ce que vous attendiez, sans savoir encore si vous pouviez agir.",
            vecu: "Tout le budget s'est porté sur la préservation de vos repères : quand l'inattendu surgit et qu'on ne veut pas lâcher ce que l'on croyait, le système se met en garde. C'est l'orientation de la Peur, ici sans doute une simple vigilance : « qu'est-ce que c'est que ce site ? ». La peur protège ce à quoi nous tenons."
        },
        'Anticipation': {
            levers: "Vous n'avez tranché sur aucun des deux leviers.",
            vecu: "Vous êtes resté·e au centre, dans l'Anticipation : l'opérateur qui précède tout choix. Rien n'est encore engagé, le budget de l'attention n'a pas été dépensé. C'est une suspension légitime, l'attente d'une information de plus avant de s'engager. Elle dure rarement : la prochaine information fera basculer le point d'un côté ou de l'autre."
        }
    };

    /* ------------------------------------------------------------------
       Utilitaires
       ------------------------------------------------------------------ */
    function svgEl(tag, attrs, parent) {
        var e = document.createElementNS(SVGNS, tag);
        if (attrs) { for (var k in attrs) { if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]); } }
        if (parent) parent.appendChild(e);
        return e;
    }
    function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
    function fmtClock(ms) {
        var s = Math.max(0, Math.round(ms / 1000));
        return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }
    function fmtSec(sec) { return sec.toFixed(1).replace('.', ',') + ' s'; }
    function fmtCoord(x, y, z) {
        var f = function (n) { return n > 0 ? '+' + n : String(n); };
        return '(' + f(x) + ', ' + f(y) + ', ' + z + ')';
    }
    function announce(msg) {
        var live = $('#sr-live');
        if (!live) return;
        live.textContent = '';
        setTimeout(function () { live.textContent = msg; }, 60);
    }
    function colorOf(e) {
        return (M.groupColors && M.groupColors[e.group]) || '#a855f7';
    }
    function countWords(text) {
        var m = text.replace(/\u00a0/g, ' ').trim().match(/[^\s]+/g);
        return m ? m.length : 0;
    }
    function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
    /** Typographie française : espace insécable avant : ; ? ! » et après «. */
    function typo(s) {
        return String(s).replace(/ ([:;?!»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
    }

    /* ------------------------------------------------------------------
       Scènes & jauge Z
       ------------------------------------------------------------------ */
    var SCENES = ['scene-seuil', 'scene-veille', 'scene-anticipation', 'scene-resolution', 'scene-ouverture'];

    function showScene(id, opts) {
        opts = opts || {};
        SCENES.forEach(function (sid) {
            var s = document.getElementById(sid);
            if (s) s.hidden = (sid !== id);
        });
        var scene = document.getElementById(id);
        scene.classList.remove('is-entering');
        void scene.offsetWidth; // relance l'animation
        scene.classList.add('is-entering');
        if (!opts.keepScroll) window.scrollTo(0, 0);
        var heading = scene.querySelector('h1, h2');
        if (heading) { try { heading.focus({ preventScroll: true }); } catch (e) { heading.focus(); } }
    }

    function setStage(z) {
        var gauge = $('#z-gauge');
        if (!gauge) return;
        gauge.setAttribute('data-z', String(z));
        Array.prototype.forEach.call(gauge.querySelectorAll('[data-stop]'), function (li) {
            var isCur = Number(li.getAttribute('data-stop')) === z;
            li.classList.toggle('is-current', isCur);
            if (isCur) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
        });
    }

    /* ------------------------------------------------------------------
       Z=0 · VEILLE
       Les paragraphes apparaissent un par un, à la demande du lecteur :
       le temps passé sur chacun donne un rythme de lecture réellement
       mesuré, quelle que soit la taille de l'écran. Le dernier paragraphe
       est coupé au moment où ce rythme indique que la phrase clé est lue.
       ------------------------------------------------------------------ */
    var READ = { idx: 0, paraStart: 0, sampleWords: 0, sampleMs: 0, cutTimer: null };

    function paraEl(i) { return document.querySelector('#veille-text p[data-para="' + i + '"]'); }

    function lastWordsBeforeCut() {
        var last = $('#veille-last');
        return countWords(last.firstElementChild.textContent + ' ' + $('#veille-cut-before').textContent);
    }

    function startVeille() {
        document.body.classList.add('journey-started', 'is-breathing');
        showScene('scene-veille');
        setStage(0);
        state.t0 = now();
        READ.idx = 0;
        READ.paraStart = state.t0;
        READ.sampleWords = 0;
        READ.sampleMs = 0;
        paraEl(0).classList.add('is-revealed');
        $('#btn-next-para').hidden = false;
        announce('Veille. Lisez le texte à votre rythme, puis passez à la suite.');
    }

    function nextParagraph() {
        var t = now();
        var cur = paraEl(READ.idx);
        READ.sampleWords += countWords(cur.textContent);
        READ.sampleMs += t - READ.paraStart;
        READ.idx += 1;
        READ.paraStart = t;

        var p = paraEl(READ.idx);
        if (!p) return;
        p.hidden = false;
        p.classList.add('is-revealed');

        // Amène le nouveau paragraphe vers le haut de l'écran, sans le couper
        var top = p.getBoundingClientRect().top + window.pageYOffset - window.innerHeight * 0.28;
        window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });

        if (p.id === 'veille-last') {
            $('#btn-next-para').hidden = true;
            // Le bouton vient d'être masqué : garder le focus dans la lecture
            p.setAttribute('tabindex', '-1');
            try { p.focus({ preventScroll: true }); } catch (e) { p.focus(); }
            scheduleCut();
        } else {
            announce(p.textContent);
        }
    }

    function scheduleCut() {
        // Rythme mesuré sur les paragraphes précédents, borné à des valeurs plausibles
        var wpm = READ.sampleMs > 0 ? READ.sampleWords / (READ.sampleMs / 60000) : 250;
        wpm = clamp(wpm, 90, 900);
        var wait = clamp(lastWordsBeforeCut() / wpm * 60000, 2500, 30000);
        READ.cutTimer = setTimeout(triggerSurprise, wait);
    }

    function wordsBeforeCut() {
        var paras = document.querySelectorAll('#veille-text p');
        var txt = '';
        Array.prototype.forEach.call(paras, function (p) {
            if (p.id !== 'veille-last') txt += ' ' + p.textContent;
        });
        return countWords(txt) + lastWordsBeforeCut();
    }

    /* ------------------------------------------------------------------
       Z=1 · SURPRISE
       ------------------------------------------------------------------ */
    function triggerSurprise() {
        state.tSurprise = now();
        state.readSec = (state.tSurprise - state.t0) / 1000;
        state.words = wordsBeforeCut();
        state.wpm = Math.round(state.words / (Math.max(1, state.readSec) / 60));

        // Interruption au milieu du mot
        var after = $('#veille-cut-after');
        if (after) after.remove();
        var caret = document.createElement('span');
        caret.className = 'caret';
        caret.setAttribute('aria-hidden', 'true');
        $('#veille-cut-before').after(caret);

        document.body.classList.remove('is-breathing');
        document.body.classList.add('is-ruptured');
        var last = $('#veille-last');
        if (!reduceMotion) last.classList.add('glitch');
        setStage(1);

        setTimeout(function () {
            $('#surprise-words').textContent = state.words;
            $('#surprise-seconds').textContent = Math.round(state.readSec);
            var box = $('#surprise-box');
            box.hidden = false;
            box.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
            announce('Vous venez de lire environ ' + state.words + ' mots en ' + Math.round(state.readSec) +
                ' secondes. Vous ne vous attendiez pas à ce que cette page vous regarde lire.');
            // La 2e phrase apparaît à +1,3 s : on mesure la réaction à partir de là.
            setTimeout(armReaction, reduceMotion ? 300 : 1500);
        }, 750);
    }

    // Touches qui ne traduisent pas une réaction (navigation, modificateurs)
    var IGNORED_KEYS = /^(Tab|Shift|Control|Alt|AltGraph|Meta|CapsLock|Fn|OS)$/;
    var MIN_REACTION_MS = 250; // en deçà : geste en cours, pas une réaction
    var TAP_SLOP_PX = 12;      // au-delà : glissement/défilement, pas un tap

    function armReaction() {
        var tStart = now();
        var done = false;
        var downPos = null;
        // Consigne affichée d'emblée : on mesure la réaction, pas le temps de deviner quoi faire
        $('#surprise-hint').hidden = false;

        function cleanup() {
            window.removeEventListener('pointerdown', onDown, true);
            window.removeEventListener('pointerup', onUp, true);
            window.removeEventListener('pointercancel', onCancel, true);
            window.removeEventListener('click', onClick, true);
            window.removeEventListener('keydown', onKey, true);
        }

        function onDown(ev) {
            if (ev.isPrimary === false) return;
            if (ev.target && ev.target.closest && ev.target.closest('.v-topbar')) return;
            downPos = { x: ev.clientX, y: ev.clientY };
        }
        function onCancel() { downPos = null; }
        function onUp(ev) {
            if (!downPos || ev.isPrimary === false) return;
            var dx = ev.clientX - downPos.x;
            var dy = ev.clientY - downPos.y;
            downPos = null;
            if (Math.hypot(dx, dy) > TAP_SLOP_PX) return;
            completeReaction('pointer');
        }
        function onClick(ev) {
            // Repli pour lecteurs d'écran / navigation sans pointeur (évite d'ignorer un tap iOS)
            if (ev.target && ev.target.closest && ev.target.closest('.v-topbar')) return;
            completeReaction('click');
        }
        function onKey(ev) {
            if (IGNORED_KEYS.test(ev.key || '')) return;
            completeReaction('keydown');
        }

        function completeReaction(kind) {
            if (done) return;
            if (now() - tStart < MIN_REACTION_MS) return;
            done = true;
            cleanup();
            state.reaction = (now() - tStart) / 1000;
            $('#surprise-hint').hidden = true;
            $('#reaction-time').textContent = fmtSec(state.reaction);
            var afterBox = $('#surprise-after');
            afterBox.hidden = false;
            function revealNext() {
                afterBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
                $('#btn-to-anticipation').focus({ preventScroll: true });
            }
            // Si la réaction est une touche (Espace, Entrée…), attendre qu'elle soit relâchée
            // avant de donner le focus au bouton, sinon le relâchement l'activerait aussitôt.
            if (kind === 'keydown') {
                window.addEventListener('keyup', function onUpKey() {
                    window.removeEventListener('keyup', onUpKey, true);
                    setTimeout(revealNext, 50);
                }, true);
            } else {
                setTimeout(revealNext, 50);
            }
            announce('Il vous a fallu ' + fmtSec(state.reaction) + ' pour réagir. C\'était la Surprise.');
        }

        window.addEventListener('pointerdown', onDown, true);
        window.addEventListener('pointerup', onUp, true);
        window.addEventListener('pointercancel', onCancel, true);
        window.addEventListener('click', onClick, true);
        window.addEventListener('keydown', onKey, true);
    }

    function activationOf(sec) {
        if (sec == null) return { label: 'non mesurée', text: '' };
        if (sec < 1.5) return { label: 'vive', text: 'une activation vive : votre système s\'est mobilisé presque immédiatement.' };
        if (sec < 3.5) return { label: 'modérée', text: 'une activation modérée : le temps de saisir ce qui se passait.' };
        return { label: 'posée', text: 'une activation posée : vous avez pris le temps de laisser l\'écart se déposer.' };
    }

    function readingOf(wpm) {
        if (wpm > 600) return 'Vous parcouriez le texte en diagonale (≈ ' + wpm + ' mots/min) : rien ne semblait mériter une lecture attentive.';
        if (wpm > 350) return 'Vous lisiez à un rythme rapide (≈ ' + wpm + ' mots/min).';
        if (wpm >= 120) return 'Vous lisiez à un rythme tranquille (≈ ' + wpm + ' mots/min).';
        return 'Vous lisiez à un rythme lent et posé (≈ ' + wpm + ' mots/min).';
    }

    /* ------------------------------------------------------------------
       Losange Z=2
       ------------------------------------------------------------------ */
    function ringZ2() {
        return M.emotions.filter(function (e) { return e.z === 2 && e.type !== 'operator'; });
    }

    /**
     * Dessine la première couronne.
     * opts.labels    : afficher les noms
     * opts.focus     : émotion du visiteur (met les autres en retrait)
     * opts.opposite  : émotion opposée (inversion centrale)
     */
    function drawDiamond(svg, opts) {
        opts = opts || {};
        clear(svg);
        var R = 2 * DIA;

        svgEl('line', { x1: -150, y1: 0, x2: 150, y2: 0, 'class': 'dia-axis' }, svg);
        svgEl('line', { x1: 0, y1: -150, x2: 0, y2: 150, 'class': 'dia-axis' }, svg);
        svgEl('polygon', { points: '0,' + (-R) + ' ' + R + ',0 0,' + R + ' ' + (-R) + ',0', 'class': 'dia-ring' }, svg);

        // Libellés des leviers
        var t;
        t = svgEl('text', { x: 0, y: -158, 'text-anchor': 'middle', 'class': 'dia-axis-label dia-axis-label--y' }, svg); t.textContent = 'AGIR ↑';
        t = svgEl('text', { x: 0, y: 166, 'text-anchor': 'middle', 'class': 'dia-axis-label dia-axis-label--y' }, svg); t.textContent = 'LAISSER ↓';
        t = svgEl('text', { x: 166, y: -8, 'text-anchor': 'end', 'class': 'dia-axis-label dia-axis-label--x' }, svg); t.textContent = 'AJUSTER →';
        t = svgEl('text', { x: -166, y: -8, 'text-anchor': 'start', 'class': 'dia-axis-label dia-axis-label--x' }, svg); t.textContent = '← TENIR';

        // Ligne d'inversion centrale
        if (opts.focus && opts.opposite) {
            svgEl('line', {
                x1: opts.focus.x * DIA, y1: -opts.focus.y * DIA,
                x2: opts.opposite.x * DIA, y2: -opts.opposite.y * DIA,
                'class': 'dia-opposite-line'
            }, svg);
        }

        // Opérateur central
        svgEl('circle', { cx: 0, cy: 0, r: 9, fill: '#7c3aed', stroke: '#c4b5fd', 'stroke-width': 1.5, 'class': 'dia-dot' }, svg);
        if (opts.labels) {
            t = svgEl('text', { x: 0, y: 24, 'class': 'dia-center-label' }, svg);
            t.textContent = 'Anticipation';
        }

        // Huit prototypes
        ringZ2().forEach(function (e) {
            var cx = e.x * DIA, cy = -e.y * DIA;
            var cls = 'dia-dot';
            if (opts.focus && opts.focus.name !== 'Anticipation') {
                if (opts.opposite && e.name === opts.opposite.name) cls += ' is-opposite';
                else if (e.name !== opts.focus.name) cls += ' is-dim';
            } else if (!opts.labels) {
                cls += ' is-mute';
            }
            svgEl('circle', { cx: cx, cy: cy, r: 8.5, fill: colorOf(e), 'class': cls }, svg);

            if (opts.labels) {
                var ly = e.y >= 0 ? cy - 17 : cy + 27;
                var lcls = 'dia-label';
                if (opts.focus && opts.focus.name !== 'Anticipation' && e.name !== opts.focus.name &&
                    !(opts.opposite && e.name === opts.opposite.name)) lcls += ' is-dim';
                if (opts.focus && e.name === opts.focus.name) lcls += ' dia-label--you';
                var lab = svgEl('text', { x: cx, y: ly, 'class': lcls }, svg);
                lab.textContent = e.name.toUpperCase();
            }
        });

        // Point du visiteur
        var you = svgEl('g', { 'class': 'you', id: svg.id + '-you' }, svg);
        svgEl('circle', { cx: 0, cy: 0, r: 15, 'class': 'you__halo' }, you);
        svgEl('circle', { cx: 0, cy: 0, r: 7.5, 'class': 'you__core' }, you);
        return you;
    }

    function moveYou(g, x, y) {
        g.style.transform = 'translate(' + (x * DIA) + 'px, ' + (-y * DIA) + 'px)';
    }

    /** Règle de résolution : |X| + |Y| = 2 sur la première couronne. */
    function resolvePosition(x, y) {
        if (x !== 0 && y !== 0) return { x: x, y: y };      // diagonale : budget partagé
        if (y !== 0) return { x: 0, y: 2 * y };             // axe Agir : tout le budget
        if (x !== 0) return { x: 2 * x, y: 0 };             // axe Ajuster : tout le budget
        return { x: 0, y: 0 };                              // suspension : Anticipation
    }

    /* ------------------------------------------------------------------
       Z=2 · ANTICIPATION
       ------------------------------------------------------------------ */
    var youAnticip = null;
    var ANTICIP_CAPTION = null; // légende initiale, restaurée à chaque nouveau passage

    function resetChoices() {
        state.x = null;
        state.y = null;
        state.result = null;
        Array.prototype.forEach.call(document.querySelectorAll('.choice'), function (label) {
            label.classList.remove('is-selected');
            var input = label.querySelector('input');
            if (input) input.checked = false;
        });
        $('#q-x').hidden = true;
        $('#btn-resolve').disabled = true;
        if (ANTICIP_CAPTION !== null) $('#anticip-caption').innerHTML = ANTICIP_CAPTION;
    }

    function startAnticipation(opts) {
        opts = opts || {};
        cancelMapAnim();
        state.tAnticip = now();
        resetChoices();
        document.body.classList.remove('is-ruptured');
        document.body.classList.add('is-later');
        showScene('scene-anticipation');
        setStage(2);
        youAnticip = drawDiamond($('#dia-anticip'), { labels: false });
        announce(opts.replay
            ? 'Nouveau passage par l\'Anticipation. Répondez autrement pour voir où cela mène.'
            : 'Anticipation. Votre cerveau cherche la suite. Deux questions.');
    }

    function onChoice(input) {
        var label = input.closest('.choice');
        var axis = label.getAttribute('data-axis');
        var val = Number(input.value);
        state[axis] = val;

        Array.prototype.forEach.call(document.querySelectorAll('.choice[data-axis="' + axis + '"]'), function (l) {
            l.classList.toggle('is-selected', l === label);
        });

        if (axis === 'y') {
            var qx = $('#q-x');
            if (qx.hidden) {
                qx.hidden = false;
                setTimeout(function () {
                    qx.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
                }, 80);
            }
        }

        var p = resolvePosition(state.x == null ? 0 : state.x, state.y == null ? 0 : state.y);
        if (youAnticip) moveYou(youAnticip, p.x, p.y);

        var cap = $('#anticip-caption');
        if (p.x === 0 && p.y === 0) {
            cap.innerHTML = 'Votre point reste au centre&nbsp;: l\'Anticipation <span class="coord">(0, 0, 2)</span>.';
        } else {
            cap.textContent = typo('Votre point se déplace : votre attention se répartit entre les deux leviers, sans jamais sortir de la couronne.');
        }

        $('#btn-resolve').disabled = !(state.x != null && state.y != null);
    }

    /* ------------------------------------------------------------------
       RÉSOLUTION + RÉCIT
       ------------------------------------------------------------------ */
    function resolve() {
        state.tResol = now();
        var p = resolvePosition(state.x, state.y);
        var res = (p.x === 0 && p.y === 0)
            ? M.getById(2)
            : M.emotions.filter(function (e) { return e.z === 2 && e.x === p.x && e.y === p.y; })[0];
        state.result = res;
        var isCenter = res.name === 'Anticipation';
        var opp = isCenter ? null : M.getOpposite(res.name);
        var story = STORIES[res.name] || STORIES.Anticipation;

        try {
            localStorage.setItem('cartograffect_voyage', JSON.stringify({ name: res.name, x: res.x, y: res.y, z: res.z, date: new Date().toISOString() }));
        } catch (e) { /* stockage indisponible : sans conséquence */ }

        showScene('scene-resolution');

        // En-tête
        var color = colorOf(res);
        var title = $('#resol-title');
        title.innerHTML = '';
        var sw = document.createElement('span');
        sw.className = 'result-swatch';
        sw.style.background = color;
        sw.style.color = color;
        sw.setAttribute('aria-hidden', 'true');
        title.appendChild(sw);
        title.appendChild(document.createTextNode(isCenter ? typo('Anticipation : en suspens') : res.name));
        $('#resol-coord').textContent = codeLine(res);
        $('#resol-lead').textContent = typo(story.levers);

        // Losange : départ du centre puis glissement vers la position
        var svg = $('#dia-resol');
        var you = drawDiamond(svg, { labels: true, focus: res, opposite: opp });
        moveYou(you, 0, 0);
        setTimeout(function () { moveYou(you, res.x, res.y); }, reduceMotion ? 0 : 450);
        $('#resol-caption').textContent = typo(isCenter
            ? 'Votre point est resté au centre de la première couronne.'
            : 'Votre point ' + fmtCoord(res.x, res.y, 2) + ' et, en pointillé, son opposé par inversion centrale' + (opp ? ' : ' + opp.name + '.' : '.'));

        // Récit horodaté
        var act = activationOf(state.reaction);
        var tl = $('#story-timeline');
        clear(tl);
        addStep(tl, 'stage-veille', 0, 'Veille', readingOf(state.wpm) +
            ' Votre système prédictif n\'avait rien à signaler : tout ce qui arrivait correspondait à ce qu\'il attendait.');
        addStep(tl, 'stage-surprise', state.tSurprise - state.t0, 'Surprise',
            'La page s\'est interrompue au milieu d\'un mot et s\'est adressée à vous. Il vous a fallu ' +
            (state.reaction != null ? fmtSec(state.reaction) : 'un instant') + ' pour réagir : ' + act.text +
            ' Un écart venait de s\'ouvrir entre ce que vous prévoyiez et ce qui arrivait.');
        addStep(tl, 'stage-anticip', state.tAnticip - state.t0, 'Anticipation',
            'Deux questions se sont posées : pouvez-vous agir sur ce qui arrive ? Êtes-vous prêt·e à revoir ce que vous attendiez ? ' +
            'Vous avez répondu « ' + CHOICE_LABELS.y[String(state.y)] + ' », puis « ' + CHOICE_LABELS.x[String(state.x)] + ' ».');
        addStep(tl, 'stage-result', state.tResol - state.t0, (isCenter ? 'Anticipation' : res.name) + ' ' + fmtCoord(res.x, res.y, res.z),
            story.vecu);

        // Encadrés complémentaires
        var extra = $('#story-extra');
        clear(extra);
        if (opp) {
            addCard(extra, 'story__card story__card--opp',
                '<strong>Son opposé : ' + opp.name + ' ' + fmtCoord(opp.x, opp.y, opp.z) + '.</strong> ' +
                'Si vous aviez répondu à l\'inverse sur les deux leviers, c\'est lui que vous auriez traversé. ' +
                'Dans Cartograffect, chaque émotion a son antagoniste, symétrique par rapport au centre.');
        } else {
            addCard(extra, 'story__card story__card--opp',
                '<strong>Au centre, pas d\'opposé.</strong> C\'est le point d\'équilibre d\'où partent les huit directions de la première couronne.');
        }
        addCard(extra, 'story__card',
            '<strong>Position et activation sont deux choses distinctes.</strong> Votre position vient de vos choix ; ' +
            'votre activation (' + act.label + ') vient de votre temps de réaction. Dans le modèle, l\'activation n\'est pas un lieu de la carte : ' +
            'c\'est la vitesse à laquelle on la parcourt.');
        addCard(extra, 'story__card story__card--norm',
            '<strong>Aucune de ces neuf issues n\'est meilleure qu\'une autre.</strong> Chacune est une stratégie de votre cerveau ' +
            'pour réduire l\'écart entre ce qu\'il attendait et ce qui est arrivé.');

        announce('Résolution : ' + (isCenter ? 'Anticipation, en suspens.' : res.name + '.') + ' ' + story.levers);
    }

    /** Leviers d'abord (langage du visiteur), coordonnées ensuite. */
    function codeLine(e) {
        var f = function (n) { return n > 0 ? '+' + n : String(n); };
        return 'Agir ' + f(e.y) + ' · Ajuster ' + f(e.x) + '   —   ' + fmtCoord(e.x, e.y, e.z);
    }

    function addStep(list, cls, ms, title, text) {
        var li = document.createElement('li');
        li.className = cls;
        li.style.animationDelay = (list.children.length * 0.18) + 's';
        var time = document.createElement('time');
        time.textContent = fmtClock(ms);
        var body = document.createElement('div');
        var h = document.createElement('h4');
        h.textContent = typo(title);
        var p = document.createElement('p');
        p.textContent = typo(text);
        body.appendChild(h);
        body.appendChild(p);
        li.appendChild(time);
        li.appendChild(body);
        list.appendChild(li);
    }

    function addCard(parent, cls, html) {
        var d = document.createElement('div');
        d.className = cls;
        d.innerHTML = typo(html);
        parent.appendChild(d);
    }

    /* ------------------------------------------------------------------
       OUVERTURE Z=3 + CARTE
       ------------------------------------------------------------------ */
    function startOuverture() {
        var res = state.result;
        var isCenter = res.name === 'Anticipation';
        showScene('scene-ouverture');

        // Prolongement dans le même groupe à Z=3 : (X, Y) → (2X, 2Y)
        var next = M.emotions.filter(function (e) { return e.z === 3 && e.x === 2 * res.x && e.y === 2 * res.y; })[0];

        $('#ouv-lead').textContent = typo(isCenter
            ? 'La suspension peut se prolonger d\'un niveau. À la strate suivante (Z = 3), le centre porte un autre nom :'
            : 'Votre point a pu glisser d\'un cran plus loin. Dans le groupe ' + res.group +
              ', la strate suivante (Z = 3) porte un nom :');

        var card = $('#prolong-card');
        clear(card);
        if (next) {
            var n = document.createElement('p'); n.className = 'prolong-card__name'; n.textContent = next.name;
            var c = document.createElement('p'); c.className = 'prolong-card__code'; c.textContent = next.code;
            var d = document.createElement('p'); d.textContent = typo(next.desc);
            card.appendChild(n); card.appendChild(c); card.appendChild(d);
        }

        var nuances = $('#ouv-nuances');
        if (!isCenter) {
            var others = M.emotions.filter(function (e) {
                return e.z === 3 && e.group === res.group && (!next || e.id !== next.id);
            }).map(function (e) { return e.name; });
            nuances.innerHTML = others.length
                ? 'Autres nuances voisines du même groupe&nbsp;: <strong>' + others.join('</strong>, <strong>') + '</strong>.'
                : '';
        } else {
            nuances.textContent = typo('Le prochain élément d\'information fera basculer le point vers l\'une des seize émotions réactives de ce niveau.');
        }

        // Sortie vers la carte depuis la position du visiteur
        $('#exit-map').href = 'emotions.html?id=' + encodeURIComponent(res.name);

        drawMap(res, next);
        announce('Ouverture. ' + (next ? 'Prolongement possible : ' + next.name + '.' : ''));
    }

    var mapRevealTimer = null;
    var mapRafId = null;

    function cancelMapAnim() {
        if (mapRevealTimer) { clearTimeout(mapRevealTimer); mapRevealTimer = null; }
        if (mapRafId) { cancelAnimationFrame(mapRafId); mapRafId = null; }
    }

    function drawMap(res, next) {
        cancelMapAnim();
        var svg = $('#map-full');
        clear(svg);
        svg.classList.remove('is-revealed', 'is-labelled');

        for (var z = 2; z <= 7; z++) {
            var r = (2 * z - 2) * MAP;
            svgEl('polygon', {
                points: '0,' + (-r) + ' ' + r + ',0 0,' + r + ' ' + (-r) + ',0',
                'class': 'map-ring' + (z === 2 ? ' map-ring--you' : '')
            }, svg);
        }
        svgEl('circle', { cx: 0, cy: 0, r: 5, 'class': 'map-dot map-dot--op' }, svg);

        M.emotions.forEach(function (e) {
            if (e.z < 2 || e.type === 'operator') return;
            var dot = svgEl('circle', { cx: e.x * MAP, cy: -e.y * MAP, r: 4.2, fill: colorOf(e), 'class': 'map-dot' }, svg);
            dot.style.transitionDelay = reduceMotion ? '0s' : ((e.z - 2) * 0.32 + 0.4) + 's';
            var title = svgEl('title', null, dot);
            title.textContent = e.name + ' ' + e.code;
        });

        if (next) {
            svgEl('line', { x1: res.x * MAP, y1: -res.y * MAP, x2: next.x * MAP, y2: -next.y * MAP, 'class': 'map-link' }, svg);
        }

        // Visiteur et prolongement
        var you = svgEl('g', { 'class': 'you' }, svg);
        you.style.transform = 'translate(' + (res.x * MAP) + 'px, ' + (-res.y * MAP) + 'px)';
        svgEl('circle', { cx: 0, cy: 0, r: 12, 'class': 'you__halo' }, you);
        svgEl('circle', { cx: 0, cy: 0, r: 6.5, 'class': 'you__core' }, you);

        var lab = svgEl('text', { x: res.x * MAP, y: -res.y * MAP + (res.y < 0 ? 30 : -18), 'class': 'map-label' }, svg);
        lab.textContent = 'Vous : ' + res.name;
        if (next && next.type !== 'operator') {
            var nl = svgEl('text', { x: next.x * MAP, y: -next.y * MAP + (next.y < 0 ? 30 : -16), 'class': 'map-label' }, svg);
            nl.textContent = next.name;
        }

        $('#map-caption').textContent = typo('Votre point ' + fmtCoord(res.x, res.y, res.z) +
            ' sur la carte complète : 168 émotions réparties sur six couronnes (Z = 2 à 7), ' +
            'autour de l\'axe des 8 opérateurs centraux, soit 176 positions en tout. ' +
            'Chaque losange est un niveau plus profond : plus l\'horizon s\'élargit, plus les nuances se multiplient.');

        var from = 68, to = 272;
        if (reduceMotion) {
            setViewBox(svg, to);
            svg.classList.add('is-revealed', 'is-labelled');
            return;
        }
        setViewBox(svg, from);
        mapRevealTimer = setTimeout(function () {
            mapRevealTimer = null;
            svg.classList.add('is-revealed');
            animate(2600, function (k) { setViewBox(svg, from + (to - from) * k); }, function () {
                svg.classList.add('is-labelled');
            });
        }, 500);
    }

    function setViewBox(svg, half) {
        svg.setAttribute('viewBox', (-half) + ' ' + (-half) + ' ' + (2 * half) + ' ' + (2 * half));
    }

    function animate(duration, step, done) {
        var start = null;
        var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
        function frame(ts) {
            if (start === null) start = ts;
            var t = Math.min(1, (ts - start) / duration);
            step(ease(t));
            if (t < 1) mapRafId = requestAnimationFrame(frame);
            else { mapRafId = null; if (done) done(); }
        }
        mapRafId = requestAnimationFrame(frame);
    }

    function renderLastPassage() {
        var el = $('#seuil-recall');
        if (!el) return;
        try {
            var raw = localStorage.getItem('cartograffect_voyage');
            if (!raw) return;
            var saved = JSON.parse(raw);
            var em = saved && saved.name ? M.getByName(saved.name) : null;
            if (!em) return;
            el.textContent = typo('Dernier passage enregistré sur cet appareil : ' + em.name + ' ' + fmtCoord(em.x, em.y, em.z) + ' — ');
            var a = document.createElement('a');
            a.href = 'emotions.html?id=' + encodeURIComponent(em.name);
            a.textContent = 'retrouver cette position sur la carte';
            el.appendChild(a);
            el.appendChild(document.createTextNode('.'));
            el.hidden = false;
        } catch (e) { /* stockage indisponible : sans conséquence */ }
    }

    /* ------------------------------------------------------------------
       Liaisons
       ------------------------------------------------------------------ */
    function init() {
        ANTICIP_CAPTION = $('#anticip-caption').innerHTML;
        renderLastPassage();
        $('#btn-start').addEventListener('click', startVeille);
        $('#btn-next-para').addEventListener('click', nextParagraph);
        $('#btn-to-anticipation').addEventListener('click', function () { startAnticipation(); });
        Array.prototype.forEach.call(document.querySelectorAll('.choice input[type="radio"]'), function (input) {
            input.addEventListener('change', function () { onChoice(input); });
        });
        $('#btn-resolve').addEventListener('click', resolve);
        $('#btn-to-ouverture').addEventListener('click', startOuverture);
        // Refaire le voyage autrement : retour direct aux deux leviers. Relire le texte
        // n'aurait plus de sens, la surprise étant désormais connue.
        $('#btn-replay').addEventListener('click', function () { startAnticipation({ replay: true }); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
