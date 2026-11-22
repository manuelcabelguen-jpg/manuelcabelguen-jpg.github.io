/**
 * CARTOGRAFFECT - Système de Mode Maintenance & Verrouillage Temporaire
 *
 * Permet de basculer le site entre mode "En construction" et mode public :
 * - active: false = Site 100% public et ouvert sur www.cartograffect.com
 * - active: true  = Redirection vers maintenance.html tant que non déverrouillé
 */

(function () {
    'use strict';

    // URLs absolues résolues par rapport à ce script
    // (robuste même lorsque 404.html est servi sur un chemin imbriqué).
    var MAINTENANCE_URL = (function () {
        try {
            var src = document.currentScript && document.currentScript.src;
            return src ? new URL('maintenance.html', src).href : 'maintenance.html';
        } catch (e) {
            return 'maintenance.html';
        }
    })();

    var INDEX_URL = (function () {
        try {
            var src = document.currentScript && document.currentScript.src;
            return src ? new URL('index.html', src).href : 'index.html';
        } catch (e) {
            return 'index.html';
        }
    })();

    window.CARTOGRAFFECT_MAINTENANCE = {
        // === INTERRUPTEUR GÉNÉRAL ===
        // true  = Site en construction (verrouillé par défaut)
        // false = Site 100% public et ouvert pour tout le monde
        active: false,

        // Clé d'accès désactivée en production (à renseigner temporairement uniquement si active === true)
        passphrase: null,

        // Paramètre d'URL éventuel lorsque le mode maintenance est actif
        previewParam: "preview",

        // Clé de stockage local
        storageKey: "cartograffect_preview_unlocked",

        // Détecter un environnement local de prévisualisation
        isLocal: function () {
            try {
                var host = window.location.hostname;
                return window.location.protocol === 'file:' ||
                       host === 'localhost' ||
                       host === '127.0.0.1' ||
                       host === '[::1]';
            } catch (e) {
                return false;
            }
        },

        // Vérifier si l'accès réservé est déverrouillé pour ce navigateur
        isUnlocked: function () {
            try {
                return localStorage.getItem(this.storageKey) === 'true';
            } catch (e) {
                return false;
            }
        },

        // Déverrouiller l'accès (uniquement lorsque la maintenance et une clé sont configurées)
        unlock: function (key) {
            if (!this.active || !this.passphrase || !key) return false;
            var cleanKey = key.trim().toLowerCase();
            var valid = cleanKey === String(this.passphrase).trim().toLowerCase();
            if (valid) {
                try {
                    localStorage.setItem(this.storageKey, 'true');
                } catch (e) { }
                return true;
            }
            return false;
        },

        // Reverrouiller l'accès
        lock: function () {
            try {
                localStorage.removeItem(this.storageKey);
            } catch (e) { }
            window.location.replace(this.active ? MAINTENANCE_URL : INDEX_URL);
        },

        // Afficher le badge discret dans le footer indiquant que l'aperçu privé est actif
        injectPreviewBanner: function () {
            if (document.getElementById('cartograffect-preview-banner')) return;

            var footer = document.querySelector('footer');
            if (!footer) return;

            if (!document.getElementById('ctg-preview-banner-style')) {
                var style = document.createElement('style');
                style.id = 'ctg-preview-banner-style';
                style.textContent = `
                    #cartograffect-preview-banner-wrap {
                        display: flex;
                        justify-content: center;
                        margin-top: 16px;
                    }
                    #cartograffect-preview-banner {
                        background: rgba(14, 23, 38, 0.88);
                        border: 1px solid rgba(168, 85, 247, 0.45);
                        color: #e2e8f0;
                        padding: 5px 12px;
                        border-radius: 9999px;
                        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                        font-size: 11px;
                        font-weight: 500;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        cursor: pointer;
                        opacity: 0.85;
                        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                        user-select: none;
                        max-width: fit-content;
                    }
                    #cartograffect-preview-banner:hover,
                    #cartograffect-preview-banner:focus-within {
                        opacity: 1;
                        background: rgba(11, 17, 32, 0.98);
                        border-color: rgba(168, 85, 247, 0.7);
                        box-shadow: 0 8px 20px -5px rgba(0, 0, 0, 0.6), 0 0 14px rgba(168, 85, 247, 0.25);
                    }
                    #cartograffect-preview-banner .ctg-banner-details {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                    }
                `;
                document.head.appendChild(style);
            }

            var wrap = document.createElement('div');
            wrap.id = 'cartograffect-preview-banner-wrap';

            var banner = document.createElement('div');
            banner.id = 'cartograffect-preview-banner';
            banner.setAttribute('title', 'Aperçu Privé Actif');

            banner.innerHTML = `
                <span style="display:inline-flex; align-items:center; gap:6px;">
                    <span style="width:7px; height:7px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981; display:inline-block;"></span>
                    <strong style="color:#a78bfa; font-size:11px;">Aperçu Privé</strong>
                </span>
                <span class="ctg-banner-details">
                    <span style="color:#94a3b8; font-size:10px;">(Public = En construction)</span>
                    <button id="ctg-btn-relock" title="Reverrouiller pour tester l'affichage en construction" style="
                        background: rgba(239, 68, 68, 0.2);
                        border: 1px solid rgba(239, 68, 68, 0.4);
                        color: #fca5a5;
                        padding: 2px 7px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 10px;
                        font-weight: 600;
                        transition: all 0.2s;
                    ">Verrouiller</button>
                </span>
            `;

            wrap.appendChild(banner);
            footer.appendChild(wrap);

            var btnRelock = document.getElementById('ctg-btn-relock');
            if (btnRelock) {
                btnRelock.addEventListener('click', function (e) {
                    e.stopPropagation();
                    window.CARTOGRAFFECT_MAINTENANCE.lock();
                });
            }
        },

        // Exécution du garde-fou
        check: function () {
            var isPageMaintenance = false;
            try {
                isPageMaintenance = window.location.pathname.endsWith('maintenance.html');
            } catch (e) { }

            // Si la maintenance est désactivée globalement, tout le site est public
            if (!this.active) {
                try {
                    localStorage.removeItem(this.storageKey);
                } catch (e) { }
                if (isPageMaintenance) {
                    window.location.replace(INDEX_URL);
                }
                return;
            }

            // Détection automatique du paramètre URL ?preview=...
            var urlParams = new URLSearchParams(window.location.search);
            var paramVal = urlParams.get(this.previewParam);
            if (paramVal) {
                if (this.unlock(paramVal)) {
                    var cleanUrl = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, document.title, cleanUrl);
                }
            }

            var unlocked = this.isUnlocked();

            // CAS 1 : Non déverrouillé -> Rediriger vers la page maintenance
            if (!unlocked) {
                if (!isPageMaintenance) {
                    window.location.replace(MAINTENANCE_URL);
                    return;
                }
            }

            // CAS 2 : Déverrouillé naviguant sur le site complet -> Afficher le badge témoin
            if (unlocked && !isPageMaintenance) {
                var self = this;
                if (document.readyState === 'loading') {
                    window.addEventListener('DOMContentLoaded', function () {
                        self.injectPreviewBanner();
                    });
                } else {
                    this.injectPreviewBanner();
                }
            }
        }
    };

    // Exécuter immédiatement
    window.CARTOGRAFFECT_MAINTENANCE.check();

})();
