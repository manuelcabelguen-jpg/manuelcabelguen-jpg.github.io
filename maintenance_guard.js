/**
 * CARTOGRAFFECT - Système de Mode Maintenance & Verrouillage Temporaire
 * 
 * Permet de basculer le site en mode "En construction" tant qu'il n'est pas déverrouillé :
 * - Accessible à Manuel Cabelguen via la clé d'accès ou le lien direct ?preview=cartograffect2026
 * - Verrouillé par défaut pour tout visiteur public sur www.cartograffect.com
 * 
 * Pour réouvrir définitivement le site au grand public :
 * Régler `active: false` ci-dessous et publier.
 */

(function () {
    'use strict';

    // URL absolue de maintenance.html, résolue par rapport à ce script
    // (robuste même lorsque 404.html est servi sur un chemin imbriqué).
    var MAINTENANCE_URL = (function () {
        try {
            var src = document.currentScript && document.currentScript.src;
            return src ? new URL('maintenance.html', src).href : 'maintenance.html';
        } catch (e) {
            return 'maintenance.html';
        }
    })();

    window.CARTOGRAFFECT_MAINTENANCE = {
        // === INTERRUPTEUR GÉNÉRAL ===
        // true  = Site en construction (verrouillé par défaut)
        // false = Site 100% public et ouvert pour tout le monde
        active: true,

        // Clé / Mot de passe d'accès réservé (insensible à la casse)
        passphrase: "cartograffect2026",

        // Paramètre d'URL pour déverrouiller en 1 clic (ex: ?preview=cartograffect2026)
        previewParam: "preview",

        // Clé de stockage local
        storageKey: "cartograffect_preview_unlocked",

        // Vérifier si l'accès réservé est déverrouillé pour ce navigateur
        isUnlocked: function () {
            try {
                return localStorage.getItem(this.storageKey) === 'true';
            } catch (e) {
                return false;
            }
        },

        // Déverrouiller l'accès
        unlock: function (key) {
            if (!key) return false;
            const cleanKey = key.trim().toLowerCase();
            const valid = cleanKey === this.passphrase.toLowerCase() ||
                          cleanKey === 'cartograffect' ||
                          cleanKey === 'dev' ||
                          cleanKey === 'manuel';
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
            window.location.replace(MAINTENANCE_URL);
        },

        // Afficher le badge discret dans le footer indiquant que l'aperçu privé est actif
        injectPreviewBanner: function () {
            if (document.getElementById('cartograffect-preview-banner')) return;

            const footer = document.querySelector('footer');
            if (!footer) return;

            // Injection des styles de la pastille dans le footer (aucun chevauchement avec le Hero)
            if (!document.getElementById('ctg-preview-banner-style')) {
                const style = document.createElement('style');
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

            const wrap = document.createElement('div');
            wrap.id = 'cartograffect-preview-banner-wrap';

            const banner = document.createElement('div');
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

            const btnRelock = document.getElementById('ctg-btn-relock');
            if (btnRelock) {
                btnRelock.addEventListener('click', function (e) {
                    e.stopPropagation();
                    window.CARTOGRAFFECT_MAINTENANCE.lock();
                });
            }
        },

        // Exécution du garde-fou
        check: function () {
            // Si la maintenance est désactivée globalement, tout le site est public
            if (!this.active) {
                return;
            }

            // Détection automatique du paramètre URL ?preview=...
            const urlParams = new URLSearchParams(window.location.search);
            const paramVal = urlParams.get(this.previewParam);
            if (paramVal) {
                if (this.unlock(paramVal)) {
                    // Nettoyer l'URL
                    const cleanUrl = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, document.title, cleanUrl);
                }
            }

            const isPageMaintenance = window.location.pathname.endsWith('maintenance.html');
            const unlocked = this.isUnlocked();

            // CAS 1 : Non déverrouillé -> Rediriger vers la page maintenance
            if (!unlocked) {
                if (!isPageMaintenance) {
                    window.location.replace(MAINTENANCE_URL);
                    return;
                }
            }

            // CAS 2 : Déverrouillé naviguant sur le site complet -> Afficher le badge témoin
            if (unlocked && !isPageMaintenance) {
                if (document.readyState === 'loading') {
                    window.addEventListener('DOMContentLoaded', () => {
                        this.injectPreviewBanner();
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
